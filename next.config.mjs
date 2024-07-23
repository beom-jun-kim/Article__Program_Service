/** @type {import('next').NextConfig} */

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  output: "standalone",
  experimental: {
    proxyTimeout: 1000 * 60 * 10,
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: `${baseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
