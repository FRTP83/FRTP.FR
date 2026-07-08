/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd()
  },
  images: {
    // Optimisation Next réactivée (WebP/AVIF + redimensionnement).
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        // Images servies depuis Supabase Storage (chantiers, actualités, studio).
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**"
      }
    ]
  }
};

export default nextConfig;
