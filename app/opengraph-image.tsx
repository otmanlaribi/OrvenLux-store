import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ background: "#000", color: "#fff", display: "flex", height: "100%", width: "100%", alignItems: "center", justifyContent: "center", fontSize: 96, fontWeight: 700 }}>ORVEN LUX</div>, { ...size });
}
