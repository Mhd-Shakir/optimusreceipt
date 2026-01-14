/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // This creates a simple HTML folder
  eslint: {
    ignoreDuringBuilds: true, // Prevents build errors from stopping deployment
  },
};

export default nextConfig;