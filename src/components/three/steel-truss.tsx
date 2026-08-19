"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Extruded wide-flange (I-beam) profile — the literal unit of the trade. */
function useBeamGeometry(length: number) {
  return useMemo(() => {
    const w = 0.5; // flange width
    const h = 0.62; // section depth
    const tf = 0.09; // flange thickness
    const tw = 0.09; // web thickness

    const s = new THREE.Shape();
    s.moveTo(-w / 2, -h / 2);
    s.lineTo(w / 2, -h / 2);
    s.lineTo(w / 2, -h / 2 + tf);
    s.lineTo(tw / 2, -h / 2 + tf);
    s.lineTo(tw / 2, h / 2 - tf);
    s.lineTo(w / 2, h / 2 - tf);
    s.lineTo(w / 2, h / 2);
    s.lineTo(-w / 2, h / 2);
    s.lineTo(-w / 2, h / 2 - tf);
    s.lineTo(-tw / 2, h / 2 - tf);
    s.lineTo(-tw / 2, -h / 2 + tf);
    s.lineTo(-w / 2, -h / 2 + tf);
    s.closePath();

    const geo = new THREE.ExtrudeGeometry(s, {
      depth: length,
      bevelEnabled: true,
      bevelSize: 0.012,
      bevelThickness: 0.012,
      bevelSegments: 1,
      curveSegments: 1,
    });
    geo.translate(0, 0, -length / 2);
    geo.computeVertexNormals();
    return geo;
  }, [length]);
}

type BeamDef = {
  position: [number, number, number];
  rotation: [number, number, number];
  length: number;
};

/**
 * A Warren-truss silhouette: two chords, alternating diagonal webs, and
 * vertical posts. Slowly rotates and reacts to pointer + scroll.
 */
export function SteelTruss({
  pointer,
  scroll,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  scroll: React.RefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const chordGeo = useBeamGeometry(11);
  const webGeo = useBeamGeometry(2.35);
  const postGeo = useBeamGeometry(2.05);

  const { chords, webs, posts } = useMemo(() => {
    const span = 11;
    const bays = 6;
    const step = span / bays;
    const depth = 2.05;

    const chords: BeamDef[] = [
      { position: [0, depth / 2, 0], rotation: [0, Math.PI / 2, 0], length: span },
      { position: [0, -depth / 2, 0], rotation: [0, Math.PI / 2, 0], length: span },
    ];

    const webs: BeamDef[] = [];
    const posts: BeamDef[] = [];
    for (let i = 0; i < bays; i++) {
      const x = -span / 2 + step * (i + 0.5);
      const dir = i % 2 === 0 ? 1 : -1;
      webs.push({
        position: [x, 0, 0],
        rotation: [0, Math.PI / 2, (dir * Math.PI) / 3.4],
        length: 2.35,
      });
      posts.push({
        position: [-span / 2 + step * i, 0, 0],
        rotation: [0, Math.PI / 2, Math.PI / 2],
        length: depth,
      });
    }
    posts.push({
      position: [span / 2, 0, 0],
      rotation: [0, Math.PI / 2, Math.PI / 2],
      length: depth,
    });

    return { chords, webs, posts };
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#8d949e"),
        metalness: 0.96,
        roughness: 0.32,
        envMapIntensity: 1.2,
      }),
    [],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = pointer.current ?? { x: 0, y: 0 };
    const s = scroll.current ?? 0;

    const targetY = Math.PI * 0.08 + p.x * 0.34 + s * 1.15;
    const targetX = -0.12 + p.y * -0.22 + s * 0.35;

    g.rotation.y += (targetY - g.rotation.y) * Math.min(1, delta * 2.4);
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, delta * 2.4);
    g.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.09 - s * 1.5;
    g.rotation.z = Math.sin(state.clock.elapsedTime * 0.24) * 0.03;
  });

  const render = (defs: BeamDef[], geo: THREE.BufferGeometry, key: string) =>
    defs.map((b, i) => (
      <mesh
        key={`${key}-${i}`}
        geometry={geo}
        material={material}
        position={b.position}
        rotation={b.rotation}
        castShadow
        receiveShadow
      />
    ));

  return (
    <group ref={group} scale={0.92}>
      {render(chords, chordGeo, "chord")}
      {render(webs, webGeo, "web")}
      {render(posts, postGeo, "post")}
    </group>
  );
}
