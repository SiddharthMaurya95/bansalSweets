/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@bansal/shared', '@bansal/ui'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
