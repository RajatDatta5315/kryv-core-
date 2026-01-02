/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 👈 Ye Cloudflare ke liye zaroori hai
  images: {
    unoptimized: true, // 👈 Static build mein images aise hi chalti hain
    domains: ['drypaperhq.com', 'supabase.co', 'oliyqgimiqrqolfbxmlm.supabase.co'], // Tera purana domain + Supabase storage
  },
};

export default nextConfig;

