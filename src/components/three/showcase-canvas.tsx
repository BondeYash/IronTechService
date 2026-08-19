"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

const vertex = /* glsl */ `
  varying vec2 vUv;
  uniform float uHover;
  uniform float uTime;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(uv.x * 6.0 + uTime * 1.2) * cos(uv.y * 5.0 - uTime * 0.8);
    pos.z += wave * 0.06 * uHover;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uCurrent;
  uniform sampler2D uPrevious;
  uniform vec2  uCurrentSize;
  uniform vec2  uPreviousSize;
  uniform vec2  uPlaneSize;
  uniform float uProgress;   // 0..1 crossfade between previous and current
  uniform float uHover;
  uniform float uTime;
  uniform vec2  uMouse;

  // cover-fit so photos never stretch
  vec2 coverUv(vec2 uv, vec2 texSize, vec2 planeSize) {
    vec2 ratio = vec2(
      min((planeSize.x / planeSize.y) / (texSize.x / texSize.y), 1.0),
      min((planeSize.y / planeSize.x) / (texSize.y / texSize.x), 1.0)
    );
    return uv * ratio + (1.0 - ratio) * 0.5;
  }

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    // molten displacement: stronger mid-transition, plus a pointer lens
    float d = distance(vUv, uMouse);
    float lens = exp(-d * 5.0) * uHover;
    float burn = sin(uProgress * 3.14159);

    vec2 disp = vec2(
      sin(vUv.y * 18.0 + uTime * 0.9),
      cos(vUv.x * 15.0 - uTime * 0.7)
    ) * (0.035 * burn + 0.012 * lens);

    vec2 uvC = coverUv(vUv + disp, uCurrentSize, uPlaneSize);
    vec2 uvP = coverUv(vUv - disp, uPreviousSize, uPlaneSize);

    vec3 cur = texture2D(uCurrent, uvC).rgb;
    vec3 prev = texture2D(uPrevious, uvP).rgb;

    // dissolve edge driven by noise, reading like a cutting torch
    float n = noise(floor(vUv * 220.0));
    float edge = smoothstep(uProgress - 0.18, uProgress + 0.18, n);
    vec3 col = mix(cur, prev, edge);

    // heat glow on the dissolve seam and under the cursor
    float seam = smoothstep(0.18, 0.0, abs(n - uProgress));
    col += vec3(1.0, 0.42, 0.08) * seam * 0.9 * burn;
    col += vec3(1.0, 0.5, 0.15) * lens * 0.25;

    // subtle chromatic split on hover
    col.r = mix(col.r, texture2D(uCurrent, uvC + vec2(0.0035 * uHover, 0.0)).r, uHover);
    col.b = mix(col.b, texture2D(uCurrent, uvC - vec2(0.0035 * uHover, 0.0)).b, uHover);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Plane({
  sources,
  index,
  hoverRef,
  mouseRef,
}: {
  sources: string[];
  index: number;
  hoverRef: React.RefObject<number>;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}) {
  const textures = useLoader(THREE.TextureLoader, sources);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const shownIndex = useRef(index);
  const progress = useRef(1);

  const imageSize = (t: THREE.Texture) => {
    const img = t.image as { width?: number; height?: number } | undefined;
    return { w: img?.width ?? 1, h: img?.height ?? 1 };
  };

  // Uniforms are GPU state: created once, then mutated per frame. A lazy
  // initialiser keeps them stable without React ever recreating the object.
  const [uniforms] = useState<Record<string, THREE.IUniform>>(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
    });
    const first = imageSize(textures[0]);
    return {
      uCurrent: { value: textures[0] },
      uPrevious: { value: textures[0] },
      uCurrentSize: { value: new THREE.Vector2(first.w, first.h) },
      uPreviousSize: { value: new THREE.Vector2(first.w, first.h) },
      uPlaneSize: { value: new THREE.Vector2(16, 9) },
      uProgress: { value: 1 },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };
  });

  useFrame((_, delta) => {
    const m = mat.current;
    if (!m) return;
    const u = m.uniforms;

    // Texture swap is detected here rather than in an effect, so the
    // transition always starts on a frame boundary.
    if (index !== shownIndex.current) {
      const prev = textures[shownIndex.current];
      const next = textures[index];
      const prevSize = imageSize(prev);
      const nextSize = imageSize(next);
      u.uPrevious.value = prev;
      u.uPreviousSize.value.set(prevSize.w, prevSize.h);
      u.uCurrent.value = next;
      u.uCurrentSize.value.set(nextSize.w, nextSize.h);
      progress.current = 0;
      shownIndex.current = index;
    }

    u.uTime.value += delta;
    progress.current = Math.min(1, progress.current + delta * 1.1);
    u.uProgress.value = progress.current;
    u.uHover.value += ((hoverRef.current ?? 0) - u.uHover.value) * 0.08;
    const mouse = mouseRef.current ?? { x: 0.5, y: 0.5 };
    u.uMouse.value.x += (mouse.x - u.uMouse.value.x) * 0.08;
    u.uMouse.value.y += (mouse.y - u.uMouse.value.y) * 0.08;
  });

  return (
    <mesh>
      <planeGeometry args={[16, 9, 48, 48]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
      />
    </mesh>
  );
}

/**
 * The WebGL half of the showcase, in its own chunk. Loaded only when the panel
 * is about to enter the viewport — three.js is ~230KB gzipped and has no
 * business being in the first payload of a page whose hero is above it.
 */
export default function ShowcaseCanvas({
  sources,
  index,
  hoverRef,
  mouseRef,
  live,
}: {
  sources: string[];
  index: number;
  hoverRef: React.RefObject<number>;
  mouseRef: React.RefObject<{ x: number; y: number }>;
  live: boolean;
}) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 5], zoom: 1 }}
      frameloop={live ? "always" : "never"}
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      onCreated={({ camera, size }) => {
        const cam = camera as THREE.OrthographicCamera;
        cam.zoom = Math.max(size.width / 16, size.height / 9);
        cam.updateProjectionMatrix();
      }}
      resize={{ scroll: false }}
    >
      <Suspense fallback={null}>
        <Plane sources={sources} index={index} hoverRef={hoverRef} mouseRef={mouseRef} />
      </Suspense>
    </Canvas>
  );
}
