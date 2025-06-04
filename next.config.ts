import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  // Add metadata for the application
  env: {
    APP_NAME: 'ChromaDB Viewer',
    APP_DESCRIPTION: 'A beautiful and intuitive web interface for exploring and visualizing ChromaDB vector databases',
    APP_VERSION: '0.1.0',
  },
};

export default nextConfig;
