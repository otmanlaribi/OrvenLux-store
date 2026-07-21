import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "ORVEN LUX", short_name: "ORVEN LUX", description: "ORVEN LUX online store", start_url: "/", display: "standalone", background_color: "#ffffff", theme_color: "#000000", icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }] };
}
