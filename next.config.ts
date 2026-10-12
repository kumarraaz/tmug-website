import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Admin uploads are stored in Vercel Blob (public URLs)
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
