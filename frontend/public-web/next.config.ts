import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  outputFileTracingRoot: path.resolve(__dirname, '../..'),
};

export default nextConfig;
