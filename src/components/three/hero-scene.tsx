"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { ForgePlane } from "./forge-plane";
import { SteelTruss } from "./steel-truss";
import { ScrollDistortion, type ScrollDistortionHandle } from "./scroll-distortion";
import { useAudioEnergy } from "@/components/audio/audio-engine";

function Rig({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  useFrame((state, delta) => {
    const p = pointer.current ?? { x: 0, y: 0 };
    state.camera.position.x += (p.x * 1.1 - state.camera.position.x) * Math.min(1, delta * 1.6);
    state.camera.position.y +=
      (0.3 + p.y * 0.7 - state.camera.position.y) * Math.min(1, delta * 1.6);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function VelocityBridge({
  velocity,
  target,
}: {
  velocity: React.RefObject<number>;
  target: React.RefObject<ScrollDistortionHandle | null>;
}) {
  useFrame(() => {
    target.current?.setVelocity(velocity.current ?? 0);
  });
  return null;
}

export default function HeroScene() {
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const velocity = useRef(0);
  const distortion = useRef<ScrollDistortionHandle | null>(null);
  const energy = useAudioEnergy();

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;

    const onPointer = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const vh = Math.max(window.innerHeight, 1);
      scroll.current = Math.min(y / vh, 1.4);
      const raw = (y - last) / vh;
      last = y;
      velocity.current = THREE.MathUtils.clamp(raw * 9, -1, 1);
    };

    const decay = () => {
      velocity.current *= 0.92;
      raf = requestAnimationFrame(decay);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(decay);
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0.3, 8.5], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.9;
      }}
    >
      <color attach="background" args={["#0a0d12"]} />
      <fog attach="fog" args={["#0a0d12", 9, 22]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 5]} intensity={2.1} color="#cfd8e6" />
      <pointLight position={[-5, -2, 3]} intensity={16} color="#ff8a3d" distance={16} />
      <pointLight position={[4, 3, -3]} intensity={34} color="#6cb8ff" distance={22} />
      <spotLight position={[0, 7, 4]} angle={0.6} penumbra={0.8} intensity={30} color="#ffb066" />

      <ForgePlane pointer={pointer} scroll={scroll} intensity={energy} />
      <SteelTruss pointer={pointer} scroll={scroll} />
      <Rig pointer={pointer} />
      <VelocityBridge velocity={velocity} target={distortion} />

      <EffectComposer>
        <Bloom intensity={0.85} luminanceThreshold={0.55} luminanceSmoothing={0.25} mipmapBlur />
        <ScrollDistortion ref={distortion} strength={1} />
      </EffectComposer>
    </Canvas>
  );
}
