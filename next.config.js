/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Supabase's realtime client triggers a dynamic-require warning we do not use.
    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      /Critical dependency: the request of a dependency is an expression/,
    ];
    return config;
  },
};

module.exports = nextConfig;
