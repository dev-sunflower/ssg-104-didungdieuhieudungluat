import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: false, // Strict Mode double-mounts cause WebGL context loss with R3F
};

export default nextConfig;
