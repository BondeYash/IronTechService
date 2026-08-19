"use client";

import { forwardRef, useMemo, useImperativeHandle, useRef } from "react";
import { Effect } from "postprocessing";
import { Uniform } from "three";
import { distortionFragmentShader } from "./shaders";

/** postprocessing Effect wrapping the custom GLSL distortion pass. */
class ScrollDistortionEffect extends Effect {
  constructor({ strength = 1 }: { strength?: number } = {}) {
    super("ScrollDistortionEffect", distortionFragmentShader, {
      uniforms: new Map<string, Uniform>([
        ["uVelocity", new Uniform(0)],
        ["uTime", new Uniform(0)],
        ["uStrength", new Uniform(strength)],
      ]),
    });
  }

  update(_renderer: unknown, _inputBuffer: unknown, deltaTime: number) {
    const t = this.uniforms.get("uTime");
    if (t) t.value += deltaTime;
  }

  set velocity(v: number) {
    const u = this.uniforms.get("uVelocity");
    if (u) u.value = v;
  }
}

export type ScrollDistortionHandle = { setVelocity: (v: number) => void };

export const ScrollDistortion = forwardRef<ScrollDistortionHandle, { strength?: number }>(
  function ScrollDistortion({ strength = 1 }, ref) {
    const effect = useMemo(() => new ScrollDistortionEffect({ strength }), [strength]);
    const inner = useRef(effect);
    inner.current = effect;

    useImperativeHandle(ref, () => ({
      setVelocity: (v: number) => {
        inner.current.velocity = v;
      },
    }));

    return <primitive object={effect} dispose={null} />;
  },
);
