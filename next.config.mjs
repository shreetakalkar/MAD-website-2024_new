/** @type {import('next').NextConfig} */
import path from "path";
const nextConfig = {
  webpack: (config) => {
    // Resolve aliases
    config.resolve.alias["@"] = "/src"; // Adjust the path as needed

    return config;
  },
}

export default nextConfig;
