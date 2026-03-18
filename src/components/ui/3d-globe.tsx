"use client";
import { useEffect, useRef, useState } from "react";

export interface GlobeMarker {
  lat: number;
  lng: number;
  src: string;
  label: string;
  data?: any;
}

export interface GlobeConfig {
  autoRotateSpeed?: number;
  markerSize?: number;
  atmosphereColor?: string;
  atmosphereIntensity?: number;
}

interface Globe3DProps {
  markers: GlobeMarker[];
  config?: GlobeConfig;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
  className?: string;
}

function latLngTo3D(lat: number, lng: number, r: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const th  = (lng * Math.PI) / 180;
  return {
    x: r * Math.sin(phi) * Math.cos(th),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(th),
  };
}

export function Globe3D({
  markers,
  config = {},
  onMarkerClick,
  onMarkerHover,
  className = "",
}: Globe3DProps) {
  const rootRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef({
    rotation: 0,
    rotSpeed: 0.002,
    W: 0, H: 0, cx: 0, cy: 0, globeR: 0,
    markerData: [] as any[],
    starPts: [] as any[],
    avatarCache: {} as Record<string, HTMLImageElement>,
    rafId: 0,
  });

  const { autoRotateSpeed = 0.3, markerSize = 1 } = config;

  // helpers
  function loadAvatar(src: string) {
    const s = stateRef.current;
    if (s.avatarCache[src]) return s.avatarCache[src];
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    s.avatarCache[src] = img;
    return img;
  }

  function buildStars() {
    stateRef.current.starPts = Array.from({ length: 250 }, () => ({
      x: Math.random() * 2000 - 1000,
      y: Math.random() * 1400 - 700,
      r: Math.random() * 1.3 + 0.3,
      a: Math.random(),
    }));
  }

  function buildMarkers() {
    const s = stateRef.current;
    s.markerData = markers.map((m, i) => ({
      ...m,
      pos3d: latLngTo3D(m.lat, m.lng, s.globeR),
      img: loadAvatar(m.src),
      idx: i,
    }));
  }

  function project(p3: { x: number; y: number; z: number }, rot: number) {
    const s = stateRef.current;
    const cos = Math.cos(rot), sin = Math.sin(rot);
    const x = p3.x * cos - p3.z * sin;
    const z = p3.x * sin + p3.z * cos;
    return { x: s.cx + x, y: s.cy - p3.y, z };
  }

  function resize() {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const s = stateRef.current;
    const dpr = window.devicePixelRatio || 1;
    s.W = root.clientWidth;
    s.H = Math.max(480, s.W * 0.62);
    root.style.height = s.H + "px";
    canvas.width  = s.W * dpr;
    canvas.height = s.H * dpr;
    canvas.style.width  = s.W + "px";
    canvas.style.height = s.H + "px";
    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    s.cx = s.W / 2;
    s.cy = s.H / 2 + 30;
    s.globeR = Math.min(s.W, s.H) * 0.35;
    buildMarkers();
  }

  useEffect(() => {
    buildStars();
    resize();
    window.addEventListener("resize", resize);

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;
    const baseSize = 22 * markerSize;

    function drawStars() {
      s.starPts.forEach((pt: any) => {
        ctx.beginPath();
        ctx.arc(s.cx + pt.x, s.cy + pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${pt.a})`;
        ctx.fill();
      });
    }

    function drawGlobe(rot: number) {
      const { cx, cy, globeR } = s;

      // atmosphere
      const ga = ctx.createRadialGradient(cx - globeR * 0.3, cy - globeR * 0.3, globeR * 0.1, cx, cy, globeR * 1.15);
      ga.addColorStop(0, "rgba(80,140,255,0.08)");
      ga.addColorStop(0.7, "rgba(40,80,200,0.13)");
      ga.addColorStop(1, "rgba(10,20,80,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, globeR * 1.15, 0, Math.PI * 2);
      ctx.fillStyle = ga;
      ctx.fill();

      // base
      const gb = ctx.createRadialGradient(cx - globeR * 0.25, cy - globeR * 0.25, globeR * 0.05, cx, cy, globeR);
      gb.addColorStop(0, "#1a3a6e");
      gb.addColorStop(0.4, "#0d2548");
      gb.addColorStop(0.8, "#091932");
      gb.addColorStop(1, "#050f1e");
      ctx.beginPath();
      ctx.arc(cx, cy, globeR, 0, Math.PI * 2);
      ctx.fillStyle = gb;
      ctx.fill();

      // grid
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, globeR, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = "rgba(100,160,255,0.07)";
      ctx.lineWidth = 0.5;
      for (let lat = -75; lat <= 75; lat += 15) {
        const yy = cy - globeR * Math.cos(((90 - lat) * Math.PI) / 180);
        const rr = globeR * Math.sin(((90 - lat) * Math.PI) / 180);
        if (rr > 0) { ctx.beginPath(); ctx.ellipse(cx, yy, rr, rr * 0.2, 0, 0, Math.PI * 2); ctx.stroke(); }
      }
      for (let lng = 0; lng < 180; lng += 15) {
        const a = (lng * Math.PI) / 180 + rot;
        ctx.beginPath();
        ctx.ellipse(cx, cy, globeR * Math.abs(Math.cos(a)), globeR, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      // specular
      const gs = ctx.createRadialGradient(cx - globeR * 0.3, cy - globeR * 0.35, 0, cx - globeR * 0.15, cy - globeR * 0.2, globeR * 0.55);
      gs.addColorStop(0, "rgba(200,220,255,0.12)");
      gs.addColorStop(1, "rgba(200,220,255,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, globeR, 0, Math.PI * 2);
      ctx.fillStyle = gs;
      ctx.fill();
      ctx.restore();

      // ring
      ctx.beginPath();
      ctx.arc(cx, cy, globeR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(100,160,255,0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function drawMarker(m: any, rot: number, now: number) {
      const p = project(m.pos3d, rot);
      const visible = p.z >= -s.globeR * 0.25;
      const depth = (p.z + s.globeR) / (2 * s.globeR);
      const size = baseSize + depth * 14;
      const alpha = visible ? 0.4 + depth * 0.6 : 0;
      if (!visible) return { visible: false, screenX: p.x, screenY: p.y, depth, alpha };

      const { x, y } = p;

      // pulse
      const pulse = 0.5 + 0.5 * Math.sin(now * 0.002 + m.idx * 1.2);
      ctx.beginPath();
      ctx.arc(x, y, size * (1.1 + pulse * 0.5), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(228,184,106,${alpha * 0.3 * pulse})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // gold ring
      ctx.beginPath();
      ctx.arc(x, y, size + 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(228,184,106,${alpha * 0.85})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = "#0d2548";
      ctx.fill();
      ctx.clip();
      ctx.globalAlpha = alpha;
      if (m.img.complete && m.img.naturalWidth > 0) {
        ctx.drawImage(m.img, x - size, y - size, size * 2, size * 2);
      } else {
        ctx.fillStyle = "#e4b86a";
        ctx.font = `bold ${size * 0.6}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(m.label[0], x, y);
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      // dot
      ctx.beginPath();
      ctx.arc(x, y + size + 4, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(228,184,106,${alpha})`;
      ctx.fill();

      return { visible: true, screenX: x, screenY: y, depth, alpha, size };
    }

    function frame() {
      const now = performance.now();
      ctx.clearRect(0, 0, s.W, s.H);
      drawStars();
      drawGlobe(s.rotation);

      const infos: any[] = s.markerData.map(m => drawMarker(m, s.rotation, now));

      // raycasting for hover
      if (onMarkerHover) {
        // handled by mouse event below
      }

      s.rotation += s.rotSpeed;
      s.rafId = requestAnimationFrame(frame);
    }

    frame();

    // interaction
    const handleMouse = (e: MouseEvent) => {
      if (!rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let hit: GlobeMarker | null = null;
      const baseS = baseSize;
      s.markerData.forEach((m) => {
        const p = project(m.pos3d, s.rotation);
        if (p.z < -s.globeR * 0.25) return;
        const depth = (p.z + s.globeR) / (2 * s.globeR);
        const sz = baseS + depth * 14;
        const dx = p.x - mx, dy = p.y - my;
        if (Math.sqrt(dx*dx + dy*dy) < sz) hit = m;
      });
      onMarkerHover?.(hit);
      canvas.style.cursor = hit ? "pointer" : "default";
    };

    const handleClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      s.markerData.forEach((m) => {
        const p = project(m.pos3d, s.rotation);
        if (p.z < -s.globeR * 0.25) return;
        const depth = (p.z + s.globeR) / (2 * s.globeR);
        const sz = baseSize + depth * 14;
        const dx = p.x - mx, dy = p.y - my;
        if (Math.sqrt(dx*dx + dy*dy) < sz) onMarkerClick?.(m);
      });
    };

    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("click", handleClick);
    const root = rootRef.current!;
    const slowDown = () => { s.rotSpeed = 0.0004; };
    const speedUp  = () => { s.rotSpeed = autoRotateSpeed * 0.007; };
    root.addEventListener("mouseenter", slowDown);
    root.addEventListener("mouseleave", speedUp);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("click", handleClick);
      root.removeEventListener("mouseenter", slowDown);
      root.removeEventListener("mouseleave", speedUp);
      cancelAnimationFrame(s.rafId);
    };
  }, [markers, markerSize, autoRotateSpeed]);

  return (
    <div
      ref={rootRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(135deg, #070714 0%, #0a0a1e 100%)",
        borderRadius: 20,
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}