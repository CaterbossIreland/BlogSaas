import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@blog-saas/domain", "@blog-saas/prompt-library", "@blog-saas/db"],
};

export default nextConfig;
