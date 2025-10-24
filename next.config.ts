import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // تجاهل ESLint أثناء البناء
    ignoreDuringBuilds: true,
  },
  typescript: {
    // عدم تجاهل أخطاء TypeScript
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
