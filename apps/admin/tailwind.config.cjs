const path = require('node:path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../../packages/config/tailwind.preset.cjs')],
  content: [
    path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'),
  ],
  plugins: [],
};
