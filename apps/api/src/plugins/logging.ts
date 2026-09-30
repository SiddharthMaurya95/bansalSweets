import pino from 'pino';

export const REDACTED_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["x-csrf-token"]',
  '*.password',
  '*.passwordHash',
  '*.token',
  '*.refreshToken',
  '*.accessToken',
  '*.secret',
  '*.otp',
  '*.code',
  '*.cardNumber',
  '*.cvv',
  '*.signature',
  'password',
  'newPassword',
  'currentPassword',
  'token',
  'otp',
];

export function createLogger(logLevel = 'info') {
  return pino({
    level: logLevel,
    redact: {
      paths: REDACTED_PATHS,
      censor: '[REDACTED]',
    },
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}
