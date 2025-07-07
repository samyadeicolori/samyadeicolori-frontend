import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.alias['@'] = __dirname + '/src';
    config.resolve.alias['@lib'] = __dirname + '/lib';
    return config;
  },
};

export default nextConfig;
