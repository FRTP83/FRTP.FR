/** @type {import('next').NextConfig} */
const localPreview = process.env.NODE_ENV !== "production" && process.env.FRTP_LOCAL_PREVIEW === "true";
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/zones-intervention", destination: "/activites#zones-intervention", permanent: true }];
  },
  turbopack: {
    root: process.cwd()
  },
  images: {
    ...(localPreview ? { dangerouslyAllowLocalIP: true } : {}),
    // Optimisation Next réactivée (WebP/AVIF + redimensionnement).
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      ...(localPreview ? [{ protocol: "http", hostname: "localhost", port: "3000", pathname: "/api/local-db/storage/v1/object/public/**" }] : []),
      {
        // Images servies depuis Supabase Storage (chantiers, actualités, studio).
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**"
      }
    ]
  },
  async headers() {
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV !== "production" ? "'unsafe-eval' " : ""}https://www.googletagmanager.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
      "upgrade-insecure-requests"
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          ...(localPreview ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" }
        ]
      }
    ];
  }
};

export default nextConfig;
