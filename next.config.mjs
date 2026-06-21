/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.208.1"],
  reactStrictMode: true,
  images: {
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;
