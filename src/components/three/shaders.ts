// GLSL sources for the hero scene. Kept as plain strings so they can be
// shared between the background plane and the postprocessing pass.

export const forgeVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;

  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;

  // cheap 3D-ish ripple so the plane is never perfectly flat
  void main() {
    vUv = uv;
    vec3 pos = position;

    float d = distance(uv, uPointer * 0.5 + 0.5);
    float ripple = sin(d * 14.0 - uTime * 1.6) * exp(-d * 3.5);
    pos.z += ripple * 0.22;
    pos.z += sin(uv.x * 3.0 + uTime * 0.35) * cos(uv.y * 2.4 - uTime * 0.22) * 0.12;
    pos.z -= uScroll * 0.35;

    vPos = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const forgeFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  varying vec3 vPos;

  uniform float uTime;
  uniform float uScroll;
  uniform float uIntensity;   // audio / interaction energy, 0..1
  uniform vec2  uPointer;
  uniform vec3  uMolten;
  uniform vec3  uSteel;
  uniform vec3  uDeep;

  // --- value noise + fbm ------------------------------------------------
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * 3.2;
    p.y -= uTime * 0.045;
    p.x += uScroll * 0.4;

    // domain-warped noise reads as brushed / poured metal
    float warp = fbm(p + fbm(p * 1.7 + uTime * 0.05));
    float grain = fbm(uv * 90.0) * 0.06;

    // heat seam that sweeps across like a torch cut
    float seam = smoothstep(0.42, 0.5, abs(sin(uv.x * 2.0 + uTime * 0.18 + warp * 1.4)));
    float heat = pow(1.0 - seam, 3.0);

    float pointerGlow = exp(-distance(uv, uPointer * 0.5 + 0.5) * 5.0);

    // steel dominates; molten is a thin seam, not a wash
    vec3 col = mix(uDeep, uSteel, smoothstep(-0.35, 0.65, warp));
    col = mix(col, uMolten, pow(heat, 2.2) * (0.22 + uIntensity * 0.28));
    col += uMolten * pointerGlow * (0.12 + uIntensity * 0.22);
    col += grain * 0.6;

    // vignette keeps the type readable over the plane
    float vig = smoothstep(1.15, 0.25, length(uv - 0.5) * 1.6);
    col *= vig;

    float alpha = clamp(0.42 + heat * 0.22 + pointerGlow * 0.18, 0.0, 0.92);
    gl_FragColor = vec4(col, alpha);
  }
`;

/**
 * Postprocessing pass: barrel-wave distortion + chromatic split, both scaled
 * by scroll velocity so fast scrolling smears the frame like hot metal.
 */
export const distortionFragmentShader = /* glsl */ `
  uniform float uVelocity;
  uniform float uTime;
  uniform float uStrength;

  void mainUv(inout vec2 uv) {
    vec2 c = uv - 0.5;
    float r2 = dot(c, c);
    float wave = sin(uv.y * 12.0 + uTime * 0.8) * 0.0022;
    uv += c * r2 * uVelocity * uStrength * 0.9;
    uv.x += wave * uVelocity * 8.0;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float amt = clamp(abs(uVelocity), 0.0, 1.0) * 0.004 * uStrength;
    vec2 dir = normalize(uv - 0.5 + 1e-6);
    float r = texture2D(inputBuffer, uv + dir * amt).r;
    float g = inputColor.g;
    float b = texture2D(inputBuffer, uv - dir * amt).b;
    outputColor = vec4(r, g, b, inputColor.a);
  }
`;
