import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FRTP - Travaux publics",
    short_name: "FRTP",
    description: "Terrassement, VRD, assainissement, voirie et aménagements extérieurs.",
    start_url: "/",
    display: "standalone",
    background_color: "#111419",
    theme_color: "#111419",
    lang: "fr",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
