/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**", // allow all Firebase paths
      },
    ],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

export default nextConfig;
