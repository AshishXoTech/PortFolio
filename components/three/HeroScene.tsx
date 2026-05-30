"use client";

import dynamic from "next/dynamic";

const Inner = dynamic(() => import("./HeroSceneInner"), {
  ssr: false,
  loading: () => null,
});

export default function HeroScene(): JSX.Element {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <Inner />
    </div>
  );
}
