import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  outputFileTracingRoot: path.resolve(__dirname, '../..'),
};

export default nextConfig;
