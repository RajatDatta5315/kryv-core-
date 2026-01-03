/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",  // Cloudflare Pages ke liye zaruri hai
  images: {
    unoptimized: true, // Static Export mein Next/Image optimization nahi chalta
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // Allow ALL image domains (Dicebear, Supabase, etc.)
    ],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
};

export default nextConfig;

