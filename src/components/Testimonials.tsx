"use client";
import React, {
  useRef,
  useMemo,
  useState,
  useCallback,
  Suspense,
  useEffect,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface GlobeMarker<T = any> {
  lat: number;
  lng: number;
  src: string;
  label?: string;
  size?: number;
  data?: T;
}

export interface GlobeConfig {
  radius?: number;
  textureUrl?: string;
  bumpMapUrl?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  atmosphereBlur?: number;
  bumpScale?: number;
  autoRotateSpeed?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  minDistance?: number;
  maxDistance?: number;
  markerSize?: number;
  showWireframe?: boolean;
  wireframeColor?: string;
  ambientIntensity?: number;
  pointLightIntensity?: number;
  backgroundColor?: string | null;
}

interface Globe3DProps {
  markers?: GlobeMarker[];
  config?: GlobeConfig;
  className?: string;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_EARTH_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg";
const DEFAULT_BUMP_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png";

// ============================================================================
// Utility
// ============================================================================

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta),
  );
}

// ============================================================================
// Animated title hook (letter-by-letter reveal)
// ============================================================================

function useAnimatedTitle(text: string, delay = 0) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setVisibleCount(i);
        if (i >= text.length) clearInterval(interval);
      }, 45);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return visibleCount;
}

// ============================================================================
// Marker
// ============================================================================

interface MarkerProps {
  marker: GlobeMarker;
  radius: number;
  defaultSize: number;
  onClick?: (marker: GlobeMarker) => void;
  onHover?: (marker: GlobeMarker | null) => void;
}

function Marker({ marker, radius, defaultSize, onClick, onHover }: MarkerProps) {
  const [hovered, setHovered]     = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [imgError, setImgError]   = useState(false);
  const groupRef      = useRef<THREE.Group>(null);
  const imageGroupRef = useRef<THREE.Group>(null);
  const { camera }    = useThree();

  const surfacePosition = useMemo(
    () => latLngToVector3(marker.lat, marker.lng, radius * 1.001),
    [marker.lat, marker.lng, radius],
  );

  const topPosition = useMemo(
    () => latLngToVector3(marker.lat, marker.lng, radius * 1.22),
    [marker.lat, marker.lng, radius],
  );

  const lineHeight = topPosition.distanceTo(surfacePosition);

  useFrame(() => {
    if (!imageGroupRef.current) return;
    const worldPos = new THREE.Vector3();
    imageGroupRef.current.getWorldPosition(worldPos);
    const dot = worldPos.clone().normalize().dot(camera.position.clone().normalize());
    setIsVisible(dot > 0.1);
  });

  const { lineCenter, lineQuaternion } = useMemo(() => {
    const center    = surfacePosition.clone().lerp(topPosition, 0.5);
    const direction = topPosition.clone().sub(surfacePosition).normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    return { lineCenter: center, lineQuaternion: q };
  }, [surfacePosition, topPosition]);

  const initials = useMemo(() => {
    if (!marker.label) return "?";
    return marker.label.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }, [marker.label]);

  return (
    <group ref={groupRef} visible={isVisible}>
      {/* Stem */}
      <mesh position={lineCenter} quaternion={lineQuaternion}>
        <cylinderGeometry args={[0.003, 0.003, lineHeight, 8]} />
        <meshBasicMaterial
          color={hovered ? "#ffffff" : "#94a3b8"}
          transparent
          opacity={hovered ? 0.95 : 0.55}
        />
      </mesh>

      {/* Dot at surface */}
      <mesh position={surfacePosition}>
        <coneGeometry args={[0.015, 0.04, 8]} />
        <meshBasicMaterial color={hovered ? "#f97316" : "#ef4444"} />
      </mesh>

      {/* Avatar at top */}
      <group ref={imageGroupRef} position={topPosition}>
        <Html
          transform
          center
          sprite
          distanceFactor={10}
          style={{
            pointerEvents: isVisible ? "auto" : "none",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.15s ease-out",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              overflow: "hidden",
              cursor: "pointer",
              border: hovered ? "2.5px solid #ffffff" : "2px solid rgba(255,255,255,0.55)",
              boxShadow: hovered
                ? "0 0 0 3px rgba(249,115,22,0.5), 0 8px 24px rgba(0,0,0,0.5)"
                : "0 4px 12px rgba(0,0,0,0.45)",
              transform: hovered ? "scale(1.3)" : "scale(1)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease",
              background: "linear-gradient(135deg, #1e40af, #7c3aed)",
            }}
            onMouseEnter={() => { setHovered(true);  onHover?.(marker); }}
            onMouseLeave={() => { setHovered(false); onHover?.(null);   }}
            onClick={() => onClick?.(marker)}
          >
            {!imgError ? (
              <img
                src={marker.src}
                alt={marker.label ?? "marker"}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={() => setImgError(true)}
                draggable={false}
                crossOrigin="anonymous"
              />
            ) : (
              <div
                style={{
                  width: "100%", height: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: 700, color: "#fff",
                  background: "linear-gradient(135deg, #1e40af, #7c3aed)",
                }}
              >
                {initials}
              </div>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}

// ============================================================================
// Rotating Globe
// ============================================================================

function RotatingGlobe({
  config,
  markers,
  onMarkerClick,
  onMarkerHover,
}: {
  config: Required<GlobeConfig>;
  markers: GlobeMarker[];
  onMarkerClick?: (m: GlobeMarker) => void;
  onMarkerHover?: (m: GlobeMarker | null) => void;
}) {
  const [earthTexture, bumpTexture] = useTexture([
    config.textureUrl || DEFAULT_EARTH_TEXTURE,
    config.bumpMapUrl  || DEFAULT_BUMP_TEXTURE,
  ]);

  useMemo(() => {
    if (earthTexture) { earthTexture.colorSpace = THREE.SRGBColorSpace; earthTexture.anisotropy = 16; }
    if (bumpTexture)  { bumpTexture.anisotropy = 8; }
  }, [earthTexture, bumpTexture]);

  const geometry = useMemo(() => new THREE.SphereGeometry(config.radius, 64, 64), [config.radius]);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={(config.bumpScale) * 0.05}
          roughness={0.65}
          metalness={0.0}
        />
      </mesh>

      {config.showWireframe && (
        <mesh>
          <sphereGeometry args={[config.radius * 1.002, 32, 16]} />
          <meshBasicMaterial color={config.wireframeColor} wireframe transparent opacity={0.07} />
        </mesh>
      )}

      {markers.map((m, i) => (
        <Marker
          key={`m-${i}-${m.lat}-${m.lng}`}
          marker={m}
          radius={config.radius}
          defaultSize={config.markerSize}
          onClick={onMarkerClick}
          onHover={onMarkerHover}
        />
      ))}
    </group>
  );
}

// ============================================================================
// Atmosphere
// ============================================================================

function Atmosphere({ radius, color, intensity, blur }: {
  radius: number; color: string; intensity: number; blur: number;
}) {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      atmosphereColor: { value: new THREE.Color(color) },
      intensity:       { value: intensity },
      fresnelPower:    { value: Math.max(0.5, 5 - blur) },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal   = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3  atmosphereColor;
      uniform float intensity;
      uniform float fresnelPower;
      varying vec3  vNormal;
      varying vec3  vPosition;
      void main() {
        float fresnel = pow(1.0 - abs(dot(vNormal, normalize(-vPosition))), fresnelPower);
        gl_FragColor  = vec4(atmosphereColor, fresnel * intensity);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  }), [color, intensity, blur]);

  return (
    <mesh scale={[1.13, 1.13, 1.13]}>
      <sphereGeometry args={[radius, 64, 32]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

// ============================================================================
// Scene
// ============================================================================

function Scene({ markers, config, onMarkerClick, onMarkerHover }: {
  markers: GlobeMarker[];
  config: Required<GlobeConfig>;
  onMarkerClick?: (m: GlobeMarker) => void;
  onMarkerHover?: (m: GlobeMarker | null) => void;
}) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, config.radius * 3.2);
    camera.lookAt(0, 0, 0);
  }, [camera, config.radius]);

  return (
    <>
      <ambientLight intensity={config.ambientIntensity} />
      <directionalLight
        position={[config.radius * 5, config.radius * 2, config.radius * 5]}
        intensity={config.pointLightIntensity}
        color="#ffffff"
      />
      <directionalLight
        position={[-config.radius * 3, config.radius, -config.radius * 2]}
        intensity={config.pointLightIntensity * 0.3}
        color="#88ccff"
      />

      <RotatingGlobe
        config={config}
        markers={markers}
        onMarkerClick={onMarkerClick}
        onMarkerHover={onMarkerHover}
      />

      {config.showAtmosphere && (
        <Atmosphere
          radius={config.radius}
          color={config.atmosphereColor}
          intensity={config.atmosphereIntensity}
          blur={config.atmosphereBlur}
        />
      )}

      <OrbitControls
        makeDefault
        enablePan={config.enablePan}
        enableZoom={config.enableZoom}
        minDistance={config.minDistance}
        maxDistance={config.maxDistance}
        rotateSpeed={0.4}
        autoRotate={(config.autoRotateSpeed) > 0}
        autoRotateSpeed={config.autoRotateSpeed}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  );
}

// ============================================================================
// Loading fallback
// ============================================================================

function LoadingFallback() {
  return (
    <Html center>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: 36, height: 36,
            borderRadius: "50%",
            border: "2px solid rgba(77,166,255,0.3)",
            borderTop: "2px solid #4da6ff",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>
          Loading globe…
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </Html>
  );
}

// ============================================================================
// Default config
// ============================================================================

const defaultConfig: Required<GlobeConfig> = {
  radius:               2,
  textureUrl:           DEFAULT_EARTH_TEXTURE,
  bumpMapUrl:           DEFAULT_BUMP_TEXTURE,
  showAtmosphere:       true,
  atmosphereColor:      "#4da6ff",
  atmosphereIntensity:  0.55,
  atmosphereBlur:       2,
  bumpScale:            1,
  autoRotateSpeed:      0.35,
  enableZoom:           true,
  enablePan:            false,
  minDistance:          4,
  maxDistance:          14,
  markerSize:           0.06,
  showWireframe:        false,
  wireframeColor:       "#4a9eff",
  ambientIntensity:     0.65,
  pointLightIntensity:  1.6,
  backgroundColor:      null,
};

// ============================================================================
// Animated title words
// ============================================================================

const TITLE_LINE1 = "Ils nous font";
const TITLE_LINE2 = "confiance";
const SUBTITLE    = "Des clients du monde entier nous choisissent pour louer leur véhicule à Marrakech.";

// ============================================================================
// TestimonialGlobe  ← export nommé principal
// ============================================================================

export function TestimonialGlobe({
  markers = [],
  config = {},
  className,
  onMarkerClick,
  onMarkerHover,
}: Globe3DProps) {
  const mergedConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);

  // Letter-reveal animation
  const full1  = TITLE_LINE1;
  const full2  = TITLE_LINE2;
  const count1 = useAnimatedTitle(full1, 200);
  const count2 = useAnimatedTitle(full2, 200 + full1.length * 45 + 120);

  // Subtitle fade-in
  const [subVisible, setSubVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSubVisible(true), 200 + (full1.length + full2.length) * 45 + 400);
    return () => clearTimeout(t);
  }, [full1.length, full2.length]);

  // Stat counter
  const [statVisible, setStatVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStatVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className={cn("relative w-full overflow-hidden", className)}
      style={{
        minHeight: "780px",
        background: "linear-gradient(160deg, #04060f 0%, #080e22 50%, #04060f 100%)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* ── Background grid ── */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(77,166,255,0.04) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(77,166,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* ── Ambient glow ── */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: "-10%", left: "50%",
          transform: "translateX(-50%)",
          width: "900px", height: "500px",
          background: "radial-gradient(ellipse, rgba(77,166,255,0.07) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }}
      />

      {/* ── Header ── */}
      <div
        style={{
          position: "relative", zIndex: 10,
          textAlign: "center",
          padding: "72px 24px 0",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            marginBottom: "20px",
            opacity: subVisible ? 1 : 0,
            transform: subVisible ? "translateY(0)" : "translateY(-8px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <span style={{ width: 28, height: 1, background: "linear-gradient(90deg, transparent, #4da6ff)" }} />
          <span
            style={{
              fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
              color: "#4da6ff", fontWeight: 500,
            }}
          >
            Témoignages clients
          </span>
          <span style={{ width: 28, height: 1, background: "linear-gradient(90deg, #4da6ff, transparent)" }} />
        </div>

        {/* Main title — letter reveal */}
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
            fontWeight: 700,
            color: "#f0f4ff",
            lineHeight: 1.08,
            margin: "0 auto 8px",
            letterSpacing: "-0.01em",
          }}
        >
          {/* Line 1 */}
          <span style={{ display: "block" }}>
            {full1.split("").map((ch, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: i < count1 ? 1 : 0,
                  transform: i < count1 ? "translateY(0)" : "translateY(14px)",
                  transition: "opacity 0.25s ease, transform 0.3s ease",
                  whiteSpace: ch === " " ? "pre" : "normal",
                }}
              >
                {ch}
              </span>
            ))}
          </span>

          {/* Line 2 — gold gradient */}
          <span
            style={{
              display: "block",
              background: "linear-gradient(90deg, #4da6ff 0%, #a78bfa 50%, #4da6ff 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradientShift 4s ease infinite",
            }}
          >
            {full2.split("").map((ch, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: i < count2 ? 1 : 0,
                  transform: i < count2 ? "translateY(0)" : "translateY(14px)",
                  transition: "opacity 0.25s ease, transform 0.3s ease",
                  whiteSpace: ch === " " ? "pre" : "normal",
                }}
              >
                {ch}
              </span>
            ))}
          </span>
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "clamp(0.85rem, 2vw, 1rem)",
            color: "rgba(200,220,255,0.5)",
            maxWidth: 520,
            margin: "16px auto 0",
            lineHeight: 1.65,
            fontWeight: 300,
            opacity: subVisible ? 1 : 0,
            transform: subVisible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
          }}
        >
          {SUBTITLE}
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex", justifyContent: "center", gap: "40px",
            marginTop: "32px",
            opacity: statVisible ? 1 : 0,
            transform: statVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          {[
            { value: "1 200+", label: "Clients satisfaits" },
            { value: "5 ★",    label: "Note moyenne" },
            { value: "6",      label: "Continents" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 700,
                  color: "#f0f4ff",
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: "rgba(200,220,255,0.45)", letterSpacing: "0.08em", marginTop: 2 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Globe ── */}
      <div
        style={{
          position: "relative", zIndex: 5,
          width: "100%",
          height: "clamp(420px, 55vw, 600px)",
          marginTop: "-20px",
        }}
      >
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 2]}
          camera={{ fov: 45, near: 0.1, far: 1000, position: [0, 0, mergedConfig.radius * 3.2] }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Scene
              markers={markers}
              config={mergedConfig}
              onMarkerClick={onMarkerClick}
              onMarkerHover={onMarkerHover}
            />
          </Suspense>
        </Canvas>

        {/* Bottom fade */}
        <div
          aria-hidden
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "120px",
            background: "linear-gradient(to top, #04060f, transparent)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── Bottom hint ── */}
      <div
        style={{
          position: "relative", zIndex: 10,
          textAlign: "center",
          paddingBottom: "40px",
          opacity: statVisible ? 1 : 0,
          transition: "opacity 0.6s ease 0.3s",
        }}
      >
        <span
          style={{
            fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(77,166,255,0.4)",
          }}
        >
          Faites glisser pour explorer · Cliquez sur un avatar
        </span>
      </div>

      {/* CSS animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes gradientShift {
          0%   { background-position: 0%   50% }
          50%  { background-position: 100% 50% }
          100% { background-position: 0%   50% }
        }
      `}</style>
    </section>
  );
}

// Named alias kept for backward compat
export { TestimonialGlobe as Globe3D };
export default TestimonialGlobe;