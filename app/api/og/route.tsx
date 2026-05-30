import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: "bold",
            color: "#00ff41",
            marginBottom: 16,
          }}
        >
          AshishOS
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#e0e0e0",
            marginBottom: 8,
          }}
        >
          Ashish Kumar Jha
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#888888",
          }}
        >
          Full Stack Developer · MERN · Next.js · TypeScript
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
