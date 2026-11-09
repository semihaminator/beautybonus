/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.public.blob.vercel-storage.com" }],
  },
  // Old Beauty Bonus addresses keep working after the move to /beauty-bonus.
  async redirects() {
    return [
      { source: "/rules", destination: "/beauty-bonus/rules", permanent: true },
      { source: "/results", destination: "/beauty-bonus/results", permanent: true },
      { source: "/apply", destination: "/beauty-bonus", permanent: true },
    ];
  },
};

export default nextConfig;
