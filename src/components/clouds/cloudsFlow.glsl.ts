/** GLSL ES 1.00 shaders for CloudsFlow (WebGL1). */

export const VERT = /* glsl */ `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

/** Advect velocity, inject pointer force, add curl noise, dissipate. */
export const SIM_FRAG = /* glsl */ `
precision highp float;

varying vec2 v_uv;

uniform sampler2D u_velocity;
uniform float u_dt;
uniform float u_time;
uniform vec2 u_pointer;
uniform vec2 u_pointerPrev;
uniform vec2 u_pointerVel;
uniform float u_pointerActive;
uniform float u_forceStrength;
uniform float u_injectRadius;
uniform float u_dissipation;
uniform float u_curlStrength;
uniform float u_drift;
uniform float u_velMax;
uniform float u_useFloat;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec2 encodeVel(vec2 v) {
  return v / u_velMax * 0.5 + 0.5;
}

vec2 decodeVel(vec4 texel) {
  if (u_useFloat > 0.5) {
    return texel.xy;
  }
  return (texel.xy - 0.5) * 2.0 * u_velMax;
}

vec2 sampleVel(vec2 uv) {
  return decodeVel(texture2D(u_velocity, clamp(uv, 0.0, 1.0)));
}

float strokeFalloff(vec2 uv, vec2 a, vec2 b, float radius) {
  vec2 pa = uv - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  float d = length(pa - ba * h);
  float t = d / max(radius, 1e-4);
  return exp(-t * t * 3.5);
}

// Finite-difference curl without /e so values stay ~[-1,1] (stable forcing).
vec2 curlNoise(vec2 p, float t) {
  float e = 0.035;
  float n1 = noise(p + vec2(0.0, e) + t);
  float n2 = noise(p - vec2(0.0, e) + t);
  float n3 = noise(p + vec2(e, 0.0) + t * 1.13);
  float n4 = noise(p - vec2(e, 0.0) + t * 1.13);
  return vec2(n1 - n2, n4 - n3);
}

void main() {
  vec2 vel = sampleVel(v_uv);

  vec2 coord = v_uv - vel * u_dt;
  vel = sampleVel(coord);

  vec2 curl = curlNoise(v_uv * 3.2, u_time * 0.07);
  vel += curl * u_curlStrength * u_dt;
  vel.x += u_drift * u_dt;

  if (u_pointerActive > 0.5) {
    float fall = strokeFalloff(v_uv, u_pointerPrev, u_pointer, u_injectRadius);
    vec2 shove = u_pointerVel;
    float speed = length(shove);
    if (speed > 1e-5) {
      shove = shove / speed * min(speed, u_velMax * 0.85);
    }
    vec2 mid = mix(u_pointerPrev, u_pointer, 0.5);
    vec2 outward = v_uv - mid;
    float ol = length(outward);
    if (ol > 1e-5) {
      outward /= ol;
    }
    vec2 force = shove * 1.15 + outward * 0.35 * min(speed, 1.0);
    vel += force * fall * u_forceStrength * u_dt;
  }

  vel *= pow(u_dissipation, u_dt * 60.0);

  float mag = length(vel);
  if (mag > u_velMax) {
    vel *= u_velMax / mag;
  }

  if (u_useFloat > 0.5) {
    gl_FragColor = vec4(vel, 0.0, 1.0);
  } else {
    gl_FragColor = vec4(encodeVel(vel), 0.5, 1.0);
  }
}
`;

/**
 * Cloud pigment only — the page gradient is the sky.
 * Open sky → vec4(0). Dense corner cloud → pale rgb, alpha ≤ PEAK_ALPHA.
 */
export const RENDER_FRAG = /* glsl */ `
precision highp float;

varying vec2 v_uv;

uniform sampler2D u_velocity;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_velMax;
uniform float u_useFloat;
uniform float u_flowScaleNear;
uniform float u_flowScaleFar;
uniform float u_maskCenterY;
uniform float u_maskSoftness;
uniform float u_maskMin;
uniform float u_maskEdgeBoost;
uniform float u_peakAlpha;
uniform float u_simActive;

vec2 decodeVel(vec4 texel) {
  if (u_useFloat > 0.5) {
    return texel.xy;
  }
  return (texel.xy - 0.5) * 2.0 * u_velMax;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p * 2.02;
    a *= 0.5;
  }
  return v;
}

float cloudDensity(vec2 p, float t, float detail) {
  float n1 = fbm(p * 1.1 + vec2(t * 0.02, t * 0.008));
  float n2 = fbm(p * 2.4 - vec2(t * 0.015, -t * 0.01) + 17.3);
  float ridge = 1.0 - abs(n1 * 2.0 - 1.0);
  float dens = n1 * 0.58 + n2 * 0.30 + ridge * 0.16 * detail;
  // Wide soft range → high coverage with lobe contrast (narrow range was a flat wash).
  dens = smoothstep(0.20, 0.62, dens);
  return mix(dens * dens, dens, 0.42);
}

// Softer threshold for broad side/bottom fills (main lobes stay punchier).
float softCloudDensity(vec2 p, float t) {
  float n1 = fbm(p * 1.05 + vec2(t * 0.018, t * 0.007));
  float n2 = fbm(p * 2.1 - vec2(t * 0.012, -t * 0.009) + 11.0);
  float dens = n1 * 0.65 + n2 * 0.35;
  return smoothstep(0.10, 0.55, dens);
}

// Soft sky/ground envelope (Volumetric-style); never a hard void, corners/bottom strongest.
float layoutWeight(vec2 uv) {
  float sky = smoothstep(0.18, 0.92, uv.y);
  float ground = 1.0 - smoothstep(0.0, 0.46, uv.y);
  // Higher floor so mid-frame isn't empty white sky.
  float envelope = 0.66 + 0.34 * max(sky, ground);

  float left = 1.0 - smoothstep(0.0, 0.60, uv.x);
  float right = smoothstep(0.40, 1.0, uv.x);
  float side = max(left, right);
  // Keep mid-height side lobes (Volumetric mid-side was the biggest gap).
  float sideWash = side * (0.76 + 0.24 * (1.0 - abs(uv.y - 0.52) * 1.4));
  float corners = side * mix(0.72, 1.0, sky);
  float bottomBand = ground * mix(0.84, 1.0, side);

  float cx = abs(uv.x - 0.5) * 1.10;
  float cy = abs(uv.y - 0.58) * 0.98;
  float centreEase = smoothstep(0.12, 0.58, length(vec2(cx, cy)));

  float w = max(max(max(envelope, corners), bottomBand), sideWash);
  // Headline band quieter via mask; layout still leaves mid-frame some mass.
  w *= mix(0.55, 1.0, centreEase);
  return clamp(w, 0.0, 1.0);
}

float textLegibilityMask(vec2 uv) {
  float dx = (uv.x - 0.5) / 0.46;
  float dy = (uv.y - u_maskCenterY) / max(u_maskSoftness, 1e-3);
  float d = dx * dx + dy * dy;
  float outside = smoothstep(0.15, 1.15, d);
  float edgeX = max(
    1.0 - smoothstep(0.0, 0.16, uv.x),
    smoothstep(0.84, 1.0, uv.x)
  );
  float m = mix(u_maskMin, 1.0, outside);
  m = max(m, edgeX * u_maskEdgeBoost);
  return clamp(m, 0.0, 1.0);
}

void main() {
  vec2 uv = v_uv;
  vec2 vel = vec2(0.0);
  if (u_simActive > 0.5) {
    vel = decodeVel(texture2D(u_velocity, uv));
  }

  float t = u_time;
  vec2 ambient = vec2(t * 0.018, t * 0.0045);

  vec2 nearUv = uv * vec2(1.35, 1.0) + ambient + vel * u_flowScaleNear;
  vec2 farUv =
    uv * vec2(0.85, 0.75) * 0.7 + ambient * 0.35 + vel * u_flowScaleFar +
    vec2(40.0, 12.0);

  // Larger domains → soft daytime lobes (fine 2.8× grain read as haze, not clouds).
  float nearD = cloudDensity(nearUv * 1.50, t, 1.0);
  float farD = cloudDensity(farUv * 1.00, t * 0.7, 0.55);
  // Broad side/bottom lobe so mid-height edges don't drop to open white.
  float sideD = softCloudDensity(
    uv * vec2(0.88, 0.68) + ambient * 0.22 + vel * 0.12 + vec2(9.0, 3.5),
    t * 0.55
  );

  float flowMag = min(length(vel) / max(u_velMax, 1e-4), 1.0);
  float filament = mix(1.0, 0.88 + 0.40 * flowMag, nearD * 0.5);
  float side = max(1.0 - smoothstep(0.0, 0.60, uv.x), smoothstep(0.40, 1.0, uv.x));
  float dens = clamp(farD * 0.55 + nearD * 1.12, 0.0, 1.0) * filament;
  dens *= layoutWeight(uv);
  // Side fill after layout so the centre ease can't erase mid-height edges.
  dens = max(dens, sideD * side * 0.95);
  // Lift mass without crushing every pixel to PEAK_ALPHA (need lobe min/max for shove).
  dens = clamp(pow(dens, 0.88) * 1.42, 0.0, 1.0);

  // Alpha = density × legibility, capped. No sky layer — open sky is transparent.
  float alpha = min(dens * textLegibilityMask(uv), u_peakAlpha);
  if (alpha < 0.008) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // Soft Flow blues: lit crowns + mid/crease folds so silhouettes read on pale sky.
  vec3 cloudLit = vec3(0.97, 0.99, 1.0);
  vec3 cloudMid = vec3(0.74, 0.84, 0.93);
  vec3 cloudCrease = vec3(0.58, 0.72, 0.88);
  float topLit = clamp(0.08 + (nearD - farD) * 0.95 + nearD * 0.12 + (uv.y - 0.40) * 0.16, 0.0, 1.0);
  topLit = mix(topLit, 0.65, flowMag * 0.12);
  // Density drives shade so lobe cores/edges diverge (was flattening to one crease).
  float shadeAmt = clamp((1.0 - topLit) * 1.05 + dens * 0.35 + 0.12, 0.0, 1.0);
  shadeAmt = max(shadeAmt, side * 0.28 * dens);
  shadeAmt = pow(shadeAmt, 0.85);
  vec3 rgb = mix(cloudLit, cloudMid, shadeAmt);
  rgb = mix(rgb, cloudCrease, shadeAmt * shadeAmt * 0.85);
  float edge = dens * (1.0 - dens) * 4.0;
  rgb = mix(rgb, cloudCrease, edge * (1.0 - topLit) * 0.55);

  float grain = (hash(uv * u_resolution + fract(t) * 100.0) - 0.5) * 0.006;
  rgb = clamp(rgb + grain, 0.0, 1.0);

  gl_FragColor = vec4(rgb * alpha, alpha);
}
`;

export const FALLBACK_FRAG = /* glsl */ `
precision highp float;

varying vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_pointerActive;
uniform float u_injectRadius;
uniform float u_forceStrength;
uniform float u_maskCenterY;
uniform float u_maskSoftness;
uniform float u_maskMin;
uniform float u_maskEdgeBoost;
uniform float u_peakAlpha;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p * 2.02;
    a *= 0.5;
  }
  return v;
}

float cloudDensity(vec2 p, float t, float detail) {
  float n1 = fbm(p * 1.1 + vec2(t * 0.02, t * 0.008));
  float n2 = fbm(p * 2.4 - vec2(t * 0.015, -t * 0.01) + 17.3);
  float ridge = 1.0 - abs(n1 * 2.0 - 1.0);
  float dens = n1 * 0.58 + n2 * 0.30 + ridge * 0.16 * detail;
  dens = smoothstep(0.20, 0.62, dens);
  return mix(dens * dens, dens, 0.42);
}

float softCloudDensity(vec2 p, float t) {
  float n1 = fbm(p * 1.05 + vec2(t * 0.018, t * 0.007));
  float n2 = fbm(p * 2.1 - vec2(t * 0.012, -t * 0.009) + 11.0);
  float dens = n1 * 0.65 + n2 * 0.35;
  return smoothstep(0.10, 0.55, dens);
}

float layoutWeight(vec2 uv) {
  float sky = smoothstep(0.18, 0.92, uv.y);
  float ground = 1.0 - smoothstep(0.0, 0.46, uv.y);
  float envelope = 0.66 + 0.34 * max(sky, ground);
  float left = 1.0 - smoothstep(0.0, 0.60, uv.x);
  float right = smoothstep(0.40, 1.0, uv.x);
  float side = max(left, right);
  float sideWash = side * (0.76 + 0.24 * (1.0 - abs(uv.y - 0.52) * 1.4));
  float corners = side * mix(0.72, 1.0, sky);
  float bottomBand = ground * mix(0.84, 1.0, side);
  float cx = abs(uv.x - 0.5) * 1.10;
  float cy = abs(uv.y - 0.58) * 0.98;
  float centreEase = smoothstep(0.12, 0.58, length(vec2(cx, cy)));
  float w = max(max(max(envelope, corners), bottomBand), sideWash);
  w *= mix(0.55, 1.0, centreEase);
  return clamp(w, 0.0, 1.0);
}

float textLegibilityMask(vec2 uv) {
  float dx = (uv.x - 0.5) / 0.46;
  float dy = (uv.y - u_maskCenterY) / max(u_maskSoftness, 1e-3);
  float d = dx * dx + dy * dy;
  float outside = smoothstep(0.15, 1.15, d);
  float edgeX = max(
    1.0 - smoothstep(0.0, 0.16, uv.x),
    smoothstep(0.84, 1.0, uv.x)
  );
  float m = mix(u_maskMin, 1.0, outside);
  m = max(m, edgeX * u_maskEdgeBoost);
  return clamp(m, 0.0, 1.0);
}

void main() {
  vec2 uv = v_uv;
  float t = u_time;
  vec2 ambient = vec2(t * 0.018, t * 0.0045);

  vec2 shove = vec2(0.0);
  if (u_pointerActive > 0.5) {
    vec2 d = uv - u_pointer;
    float r = length(d) / max(u_injectRadius, 1e-4);
    float fall = exp(-r * r * 3.5);
    if (length(d) > 1e-5) {
      shove = normalize(d) * fall * u_forceStrength * 0.08;
    }
  }

  vec2 nearUv = uv * vec2(1.35, 1.0) + ambient + shove;
  vec2 farUv =
    uv * vec2(0.85, 0.75) * 0.7 + ambient * 0.35 + shove * 0.2 + vec2(40.0, 12.0);

  float nearD = cloudDensity(nearUv * 1.50, t, 1.0);
  float farD = cloudDensity(farUv * 1.00, t * 0.7, 0.55);
  float sideD = softCloudDensity(
    uv * vec2(0.88, 0.68) + ambient * 0.22 + shove * 0.14 + vec2(9.0, 3.5),
    t * 0.55
  );
  float side = max(1.0 - smoothstep(0.0, 0.60, uv.x), smoothstep(0.40, 1.0, uv.x));
  float dens = clamp(farD * 0.55 + nearD * 1.12, 0.0, 1.0);
  dens *= layoutWeight(uv);
  dens = max(dens, sideD * side * 0.95);
  dens = clamp(pow(dens, 0.88) * 1.42, 0.0, 1.0);

  float alpha = min(dens * textLegibilityMask(uv), u_peakAlpha);
  if (alpha < 0.008) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec3 cloudLit = vec3(0.97, 0.99, 1.0);
  vec3 cloudMid = vec3(0.74, 0.84, 0.93);
  vec3 cloudCrease = vec3(0.58, 0.72, 0.88);
  float topLit = clamp(0.08 + (nearD - farD) * 0.95 + nearD * 0.12 + (uv.y - 0.40) * 0.16, 0.0, 1.0);
  float shadeAmt = clamp((1.0 - topLit) * 1.05 + dens * 0.35 + 0.12, 0.0, 1.0);
  shadeAmt = max(shadeAmt, side * 0.28 * dens);
  shadeAmt = pow(shadeAmt, 0.85);
  vec3 rgb = mix(cloudLit, cloudMid, shadeAmt);
  rgb = mix(rgb, cloudCrease, shadeAmt * shadeAmt * 0.85);
  float edge = dens * (1.0 - dens) * 4.0;
  rgb = mix(rgb, cloudCrease, edge * (1.0 - topLit) * 0.55);

  float grain = (hash(uv * u_resolution + fract(t) * 100.0) - 0.5) * 0.006;
  rgb = clamp(rgb + grain, 0.0, 1.0);

  gl_FragColor = vec4(rgb * alpha, alpha);
}
`;
