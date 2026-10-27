import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ਰਾਮਗੜ੍ਹ ਸੈਣੀਆਂ | Ramgarh Sainian",
    short_name: "Ramgarh Sainian",
    description: "Village and Gurudwara Sahib website",
    start_url: "/pa",
    display: "standalone",
    background_color: "#FFF8E6",
    theme_color: "#1D2951",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}