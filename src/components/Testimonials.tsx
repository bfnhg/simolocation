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
  testimonial?: {
    name: string;
    role?: string;
    text: string;
    rating?: number;
    date?: string;
    vehicle?: string;
  };
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
// Premium Testimonial Popup
// ============================================================================

interface TestimonialPopupProps {
  marker: GlobeMarker;
  onClose: () => void;
  position: { x: number; y: number };
}

function TestimonialPopup({ marker, onClose, position }: TestimonialPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const testimonial = marker.testimonial || {
    name: marker.label || "Client",
    role: "Client satisfait",
    text: "Service exceptionnel, je recommande vivement !",
    rating: 5,
    date: new Date().toLocaleDateString(),
    vehicle: "Véhicule premium"
  };

  const ratingStars = Array(5).fill(0).map((_, i) => (
    <svg
      key={i}
      style={{ width: '16px', height: '16px', display: 'inline-block' }}
      fill={i < (testimonial.rating || 5) ? "#fbbf24" : "#4b5563"}
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ));

  return (
    <div
      style={{
        position: 'fixed',
        top: position.y - 20,
        left: position.x,
        transform: `translate(-50%, -100%) scale(${isVisible ? 1 : 0.9})`,
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
    >
      <div
        ref={popupRef}
        style={{
          width: '320px',
          background: 'linear-gradient(135deg, rgba(15, 25, 45, 0.98), rgba(8, 15, 28, 0.98))',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(77, 166, 255, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(77, 166, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #4da6ff, #a78bfa, #4da6ff)',
          }}
        />
        
        <div style={{ padding: '20px 20px 12px', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #4da6ff',
                background: 'linear-gradient(135deg, #1e40af, #7c3aed)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <img
                src={marker.src}
                alt={testimonial.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const div = document.createElement('div');
                    div.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:600;color:white';
                    div.textContent = testimonial.name[0];
                    parent.appendChild(div);
                  }
                }}
              />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>
                {testimonial.name}
              </h3>
              {testimonial.role && (
                <p style={{ fontSize: '12px', color: '#4da6ff', margin: '4px 0 0' }}>
                  {testimonial.role}
                </p>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            {ratingStars}
          </div>
        </div>
        
        <div style={{ padding: '0 20px 20px' }}>
          {testimonial.vehicle && (
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(77, 166, 255, 0.15)',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '11px',
                color: '#4da6ff',
                marginBottom: '12px',
              }}
            >
              🚗 {testimonial.vehicle}
            </div>
          )}
          
          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.85)',
              margin: '0 0 12px',
              fontStyle: 'italic',
            }}
          >
            "{testimonial.text}"
          </p>
          
          {testimonial.date && (
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              {testimonial.date}
            </p>
          )}
        </div>
        
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid rgba(77, 166, 255, 0.1)',
            background: 'rgba(0,0,0,0.2)',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Lat: {marker.lat.toFixed(2)}° · Lng: {marker.lng.toFixed(2)}°</span>
        </div>
      </div>
      
      <div
        style={{
          position: 'absolute',
          bottom: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid rgba(15, 25, 45, 0.98)',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
        }}
      />
    </div>
  );
}

// ============================================================================
// Marker
// ============================================================================

interface MarkerProps {
  marker: GlobeMarker;
  radius: number;
  defaultSize: number;
  onClick?: (marker: GlobeMarker, event: React.MouseEvent) => void;
  onHover?: (marker: GlobeMarker | null) => void;
}

function Marker({ marker, radius, defaultSize, onClick, onHover }: MarkerProps) {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [imgError, setImgError] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const imageGroupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const glowRef = useRef<THREE.Mesh>(null);

  const surfacePosition = useMemo(
    () => latLngToVector3(marker.lat, marker.lng, radius * 1.001),
    [marker.lat, marker.lng, radius],
  );

  const topPosition = useMemo(
    () => latLngToVector3(marker.lat, marker.lng, radius * 1.22),
    [marker.lat, marker.lng, radius],
  );

  const lineHeight = topPosition.distanceTo(surfacePosition);

  useFrame((state) => {
    if (!imageGroupRef.current) return;
    const worldPos = new THREE.Vector3();
    imageGroupRef.current.getWorldPosition(worldPos);
    const dot = worldPos.clone().normalize().dot(camera.position.clone().normalize());
    setIsVisible(dot > 0.1);
    
    if (glowRef.current && hovered) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.05;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  const { lineCenter, lineQuaternion } = useMemo(() => {
    const center = surfacePosition.clone().lerp(topPosition, 0.5);
    const direction = topPosition.clone().sub(surfacePosition).normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    return { lineCenter: center, lineQuaternion: q };
  }, [surfacePosition, topPosition]);

  const initials = useMemo(() => {
    if (!marker.label) return "?";
    return marker.label.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }, [marker.label]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(marker, e);
  };

  return (
    <group ref={groupRef} visible={isVisible}>
      {/* Stem */}
      <mesh position={lineCenter} quaternion={lineQuaternion}>
        <cylinderGeometry args={[0.003, 0.003, lineHeight, 8]} />
        <meshStandardMaterial
          color={hovered ? "#ffffff" : "#4da6ff"}
          emissive={hovered ? "#4da6ff" : "#1e3a8a"}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          transparent
          opacity={hovered ? 0.95 : 0.65}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Base with glow effect */}
      <mesh position={surfacePosition}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? "#f97316" : "#ef4444"}
          emissive={hovered ? "#f97316" : "#ef4444"}
          emissiveIntensity={hovered ? 0.4 : 0.1}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      
      {/* Glow ring */}
      <mesh position={surfacePosition} ref={glowRef}>
        <ringGeometry args={[0.028, 0.042, 32]} />
        <meshBasicMaterial
          color={hovered ? "#f97316" : "#ef4444"}
          transparent
          opacity={hovered ? 0.6 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Avatar at top */}
      <group ref={imageGroupRef} position={topPosition}>
        <Html
          transform
          center
          sprite
          distanceFactor={12}
          style={{
            pointerEvents: isVisible ? "auto" : "none",
            opacity: isVisible ? 1 : 0,
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div
            style={{
              position: 'relative',
              cursor: "pointer",
              transform: hovered ? "scale(1.15)" : "scale(1)",
              transition: "all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)",
            }}
            onMouseEnter={() => { setHovered(true); onHover?.(marker); }}
            onMouseLeave={() => { setHovered(false); onHover?.(null); }}
            onClick={handleClick}
          >
            {/* Outer ring with gradient */}
            <div
              style={{
                position: 'absolute',
                inset: '-3px',
                borderRadius: '50%',
                background: `conic-gradient(from ${Date.now() % 360}deg, #4da6ff, #a78bfa, #4da6ff)`,
                opacity: hovered ? 0.8 : 0.4,
                transition: 'opacity 0.3s ease',
                animation: hovered ? 'rotateGradient 3s linear infinite' : 'none',
              }}
            />
            
            {/* Avatar container */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                overflow: "hidden",
                position: 'relative',
                background: "linear-gradient(135deg, #1e293b, #0f172a)",
                border: hovered ? "2.5px solid rgba(255,255,255,0.9)" : "2px solid rgba(77,166,255,0.6)",
                boxShadow: hovered
                  ? "0 0 0 4px rgba(77,166,255,0.3), 0 12px 28px rgba(0,0,0,0.5)"
                  : "0 6px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(77,166,255,0.2)",
                transition: "all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)",
              }}
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
                    fontSize: "20px", fontWeight: 700,
                    background: "linear-gradient(135deg, #4da6ff, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {initials}
                </div>
              )}
            </div>
            
            {/* Premium badge for verified */}
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '18px',
                height: '18px',
                background: 'linear-gradient(135deg, #4da6ff, #a78bfa)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #0f172a',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
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
  onMarkerClick?: (m: GlobeMarker, e: React.MouseEvent) => void;
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

  const geometry = useMemo(() => new THREE.SphereGeometry(config.radius, 128, 128), [config.radius]);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={(config.bumpScale) * 0.05}
          roughness={0.55}
          metalness={0.1}
          emissive="#112233"
          emissiveIntensity={0.1}
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
    <mesh scale={[1.15, 1.15, 1.15]}>
      <sphereGeometry args={[radius, 96, 48]} />
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
  onMarkerClick?: (m: GlobeMarker, e: React.MouseEvent) => void;
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
        intensity={config.pointLightIntensity * 0.4}
        color="#88ccff"
      />
      <pointLight position={[0, config.radius * 1.5, 0]} intensity={0.5} color="#4da6ff" />

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
        rotateSpeed={0.5}
        autoRotate={(config.autoRotateSpeed) > 0}
        autoRotateSpeed={config.autoRotateSpeed}
        enableDamping
        dampingFactor={0.05}
        zoomSpeed={1.0}
        target={[0, 0, 0]}
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            width: 48, height: 48,
            borderRadius: "50%",
            border: "3px solid rgba(77,166,255,0.2)",
            borderTop: "3px solid #4da6ff",
            borderRight: "3px solid #a78bfa",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", fontWeight: 500 }}>
          Chargement de l'expérience...
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
  atmosphereIntensity:  0.65,
  atmosphereBlur:       2.5,
  bumpScale:            1,
  autoRotateSpeed:      0.35,
  enableZoom:           true,
  enablePan:            true,
  minDistance:          3,
  maxDistance:          12,
  markerSize:           0.06,
  showWireframe:        false,
  wireframeColor:       "#4a9eff",
  ambientIntensity:     0.7,
  pointLightIntensity:  1.8,
  backgroundColor:      null,
};

// ============================================================================
// Animated title words
// ============================================================================

const TITLE_LINE1 = "Expérience";
const TITLE_LINE2 = "Clients";
const SUBTITLE    = "Découvrez ce que nos clients du monde entier pensent de leur expérience de location à Marrakech.";

// ============================================================================
// TestimonialGlobe avec ID testimonials
// ============================================================================

export function TestimonialGlobe({
  markers = [],
  config = {},
  className,
  onMarkerClick,
  onMarkerHover,
}: Globe3DProps) {
  const mergedConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);
  const [selectedMarker, setSelectedMarker] = useState<GlobeMarker | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

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

  const handleMarkerClick = useCallback((marker: GlobeMarker, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setPopupPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    setSelectedMarker(marker);
    onMarkerClick?.(marker);
  }, [onMarkerClick]);

  const handleClosePopup = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  return (
    <section
      id="testimonials"
      className={cn("relative w-full overflow-hidden scroll-mt-20", className)}
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
            Expérience Client
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
              onMarkerClick={handleMarkerClick}
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

      {/* Testimonial Popup */}
      {selectedMarker && (
        <TestimonialPopup
          marker={selectedMarker}
          onClose={handleClosePopup}
          position={popupPosition}
        />
      )}

      {/* CSS animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes gradientShift {
          0%   { background-position: 0%   50% }
          50%  { background-position: 100% 50% }
          100% { background-position: 0%   50% }
        }
        @keyframes rotateGradient {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

// Named alias kept for backward compat
export { TestimonialGlobe as Globe3D };
export default TestimonialGlobe;