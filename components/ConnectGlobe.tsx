"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function ConnectGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let phi = 0;
    let width = canvas.offsetWidth;
    const onResize = () => {
      if (canvas) width = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.15, 0.17, 0.2],
      markerColor: [0.96, 0.51, 0.12],
      glowColor: [0.55, 0.32, 0.1],
      markers: [
        { location: [30.0444, 31.2357], size: 0.09 },
        { location: [51.5072, -0.1276], size: 0.05 },
        { location: [40.7128, -74.006], size: 0.05 },
        { location: [25.2048, 55.2708], size: 0.06 },
        { location: [1.3521, 103.8198], size: 0.04 },
      ],
    });

    let frame = 0;
    const animate = () => {
      phi += 0.0032;
      globe.update({ phi, width: width * 2, height: width * 2 });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 -right-[38%] hidden aspect-square w-[42rem] max-w-none -translate-y-1/2 opacity-80 sm:-right-[28%] md:block xl:-right-[14%] xl:w-[46rem] 2xl:-right-[4%] 2xl:w-[50rem]"
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", contain: "layout paint size" }}
      />
    </div>
  );
}
