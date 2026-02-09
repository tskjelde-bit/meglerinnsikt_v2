/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: isProd ? 'export' : undefined,
  basePath: isProd ? '/meglerinnsikt_v2' : '',
  assetPrefix: isProd ? '/meglerinnsikt_v2/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? '/meglerinnsikt_v2' : '',
  },
};

export default nextConfig;
