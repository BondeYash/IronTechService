"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { forgeFragmentShader, forgeVertexShader } from "./shaders";

/**
 * Full-bleed background plane running the domain-warped "molten steel"
 * fragment shader. Uniforms are driven from refs so React never re-renders.
 */
export function ForgePlane({
  pointer,
  scroll,
  intensity,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  scroll: React.RefObject<number>;
  intensity: React.RefObject<number>;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uIntensity: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uMolten: { value: new THREE.Color("#c2570f") },
      uSteel: { value: new THREE.Color("#2a3340") },
      uDeep: { value: new THREE.Color("#0a0d12") },
    }),
    [],
  );

  useFrame((_, delta) => {
    const m = mat.current;
    if (!m) return;
    const u = m.uniforms;
    u.uTime.value += delta;
    u.uScroll.value += ((scroll.current ?? 0) - u.uScroll.value) * 0.08;
    u.uIntensity.value += ((intensity.current ?? 0) - u.uIntensity.value) * 0.12;
    const p = pointer.current ?? { x: 0, y: 0 };
    u.uPointer.value.x += (p.x - u.uPointer.value.x) * 0.06;
    u.uPointer.value.y += (p.y - u.uPointer.value.y) * 0.06;
  });

  return (
    <mesh position={[0, 0, -4]}>
      <planeGeometry args={[viewport.width * 2.4, viewport.height * 2.4, 96, 96]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={forgeVertexShader}
        fragmentShader={forgeFragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
