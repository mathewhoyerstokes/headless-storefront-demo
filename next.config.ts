import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev server is bound on all interfaces. Allow the loopback host the
  // browser actually uses, or Next blocks the dev runtime and clicks do nothing.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
