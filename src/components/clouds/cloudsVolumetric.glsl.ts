export const VERT = /* glsl */ `
attribute vec2 aPos;
varying vec2 vUv;

void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const FRAG = /* glsl */ `
precision mediump float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec2 uPointerVel;
uniform float uPointerStrength;
uniform vec3 uWake[10];

const float POINTER_RADIUS = 0.30;
const float POINTER_STRENGTH = 0.085;
const float POINTER_PLOW = 0.42;
const float POINTER_SWIRL = 0.20;
const float WAKE_RADIUS = 0.22;
const float NEAR_POINTER_MUL = 1.0;
const float FAR_POINTER_MUL = 0.3;

const float DRIFT_SPEED = 0.014;

// Text column quiet zone (measured): y 0.56–0.97, x 0.30–0.70
const float TEXT_Y0 = 0.56;
const float TEXT_Y1 = 0.97;
const float TEXT_X0 = 0.30;
const float TEXT_X1 = 0.70;
const float TEXT_MASK_MIN = 0.28;

const float PEAK_ALPHA = 0.90;
const float NEAR_STEP = 0.16;
const float FAR_STEP = 0.24;

// Pale daytime: white crowns, blue-grey undersides.
const vec3 COL_LIT = vec3(1.0, 1.0, 1.0);
const vec3 COL_SHADE = vec3(0.68, 0.80, 0.92);
const vec3 COL_CREASE = vec3(0.52, 0.67, 0.85);
const vec3 COL_RIM = vec3(0.96, 0.98, 1.0);

float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

vec2 hash22(vec2 p) {
  float n = hash13(vec3(p, 19.7));
  return vec2(n, fract(n * 47.13));
}

float valueNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);

  float n000 = hash13(i + vec3(0.0, 0.0, 0.0));
  float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash13(i + vec3(1.0, 1.0, 1.0));

  return mix(
    mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
    mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y),
    u.z
  );
}

float fbm2(vec3 p) {
  float sum = 0.0;
  float amp = 0.55;
  for (int i = 0; i < 2; i++) {
    sum += amp * valueNoise(p);
    p = p * 2.08 + vec3(1.7, 9.2, 3.1);
    amp *= 0.5;
  }
  return sum;
}

/**
 * Cumulus Worley: flatter bottoms, lumpy tops, edge-warped X.
 * Returns min anisotropic distance — silhouette reads as cotton banks,
 * not round mercury droplets.
 */
float worleyCumulus(vec2 p, float lumpAmp) {
  vec2 id = floor(p);
  vec2 f = fract(p);
  float d = 8.0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = hash22(id + g);
      // Bias feature points upward so mass sits on a flatter floor.
      o.y = o.y * 0.55 + 0.35;
      vec2 r = g + o - f;

      // Flat underside (below feature): compress Y.
      float below = 1.0 - smoothstep(-0.05, 0.12, r.y);
      r.y *= mix(1.0, 0.38, below);

      // Lumpy cauliflower crown — displace X harder so bumps read at low DPR.
      float above = smoothstep(-0.02, 0.40, r.y);
      float lump = hash13(vec3(id + g, 7.3)) * 2.0 - 1.0;
      float lump2 = hash13(vec3(id + g, 13.9)) * 2.0 - 1.0;
      r.x += (lump * 0.7 + lump2 * 0.3) * lumpAmp * above;
      r.y *= mix(1.0, 0.75, above * 0.55);

      d = min(d, dot(r, r));
    }
  }
  return sqrt(d);
}

vec2 pointerField(vec2 uv, float layerMul) {
  float strength = uPointerStrength * POINTER_STRENGTH * layerMul;
  vec2 disp = vec2(0.0);

  vec2 d = uv - uPointer;
  float len = length(d);
  vec2 dir = len > 1e-4 ? d / len : vec2(0.0, 1.0);

  float fall = (1.0 - smoothstep(0.0, POINTER_RADIUS, len))
    * smoothstep(0.0, POINTER_RADIUS * 0.35, len);

  disp += dir * fall * strength;
  disp += uPointerVel * fall * strength * POINTER_PLOW;
  disp += vec2(-dir.y, dir.x) * fall * strength * POINTER_SWIRL
    * (1.0 + 2.0 * length(uPointerVel));

  for (int i = 0; i < 10; i++) {
    vec3 w = uWake[i];
    if (w.z > 0.001) {
      vec2 wd = uv - w.xy;
      float wlen = length(wd);
      vec2 wdir = wlen > 1e-4 ? wd / wlen : vec2(0.0, 1.0);
      float wfall = (1.0 - smoothstep(0.0, WAKE_RADIUS, wlen))
        * smoothstep(0.0, WAKE_RADIUS * 0.35, wlen) * w.z;
      disp += wdir * wfall * strength * 0.32;
      disp += vec2(-wdir.y, wdir.x) * wfall * strength * 0.10;
    }
  }

  return disp;
}

float compositionCover(vec2 uv) {
  float sky = smoothstep(0.28, 0.90, uv.y);
  float ground = 1.0 - smoothstep(0.03, 0.30, uv.y);
  return clamp(0.52 + 0.48 * max(sky, ground), 0.0, 1.0);
}

float textLegibilityMask(vec2 uv) {
  vec2 center = vec2(0.5, (TEXT_Y0 + TEXT_Y1) * 0.5);
  vec2 radius = vec2((TEXT_X1 - TEXT_X0) * 0.5 + 0.16, (TEXT_Y1 - TEXT_Y0) * 0.5 + 0.13);
  float d = length((uv - center) / radius);
  return mix(TEXT_MASK_MIN, 1.0, smoothstep(0.35, 1.05, d));
}

/**
 * Screen-stable cumulus banks. No soft-disc metaballs.
 * Horizontal stretch + flat-bottom Worley + noisy iso-threshold + max()
 * satellite puffs = cotton cauliflower with sky breaks.
 */
float cloudShape(vec2 cloudUv, float cover, bool nearLayer) {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  // Stretch X so banks read wider than tall (cloud-like, not cells).
  vec2 map = vec2((cloudUv.x - 0.5) * aspect * 1.15, (cloudUv.y - 0.5) * 1.55);
  map.x += uTime * DRIFT_SPEED * 0.55;

  // Edge warp for organic outline — keep moderate so we don’t smear into goo.
  float w1x = valueNoise(vec3(map * 3.6, uTime * 0.02));
  float w1y = valueNoise(vec3(map * 3.6 + 8.0, uTime * 0.02));
  vec2 warped = map + vec2(w1x - 0.5, w1y - 0.5) * (nearLayer ? 0.14 : 0.10);

  float w2x = valueNoise(vec3(warped * 10.0, 1.7));
  float w2y = valueNoise(vec3(warped * 10.0 + 5.0, 1.7));
  warped += vec2(w2x - 0.5, w2y - 0.5) * (nearLayer ? 0.11 : 0.07);

  float sLarge = nearLayer ? 2.7 : 1.9;
  float sMed = nearLayer ? 5.8 : 4.0;

  float dLarge = worleyCumulus(warped * sLarge + vec2(0.0, 0.6), nearLayer ? 0.34 : 0.24);
  float dMed = worleyCumulus(warped * sMed + vec2(2.4, -0.5), nearLayer ? 0.28 : 0.18);

  // LARGE-amplitude iso bumps (low freq) so scallops survive 0.65 DPR upscale.
  float edgeN = valueNoise(vec3(warped * 5.5, 4.1));
  float edgeN2 = valueNoise(vec3(warped * 11.0, 9.2));
  float thresh = (nearLayer ? 0.36 : 0.40) + 0.26 * edgeN + 0.12 * edgeN2;

  // Hard boundary — soft milk-spill falloff is what reads as a droplet.
  float mass = smoothstep(thresh, thresh - 0.09, dLarge);

  // Satellite puffs via hard max union (never additive metaballs).
  float sats = smoothstep(0.32, 0.14, dMed);
  float body = max(mass, sats * 0.75);

  // Deep rim bites = cauliflower scallops.
  float bite = valueNoise(vec3(warped * 8.5, 9.0));
  float rim = smoothstep(0.12, 0.50, body) * (1.0 - smoothstep(0.50, 0.92, body));
  body = max(0.0, body - rim * (0.70 * (1.0 - bite)));

  // Internal folds so fills aren’t flat blue discs.
  float folds = valueNoise(vec3(warped * 4.2, 1.5));
  body *= 0.72 + 0.28 * folds;

  // Sky breaks between banks.
  float banks = fbm2(vec3(map * 1.1 + vec2(uTime * DRIFT_SPEED * 0.65, 0.0), 2.0));
  float banksBig = valueNoise(vec3(map * 0.50 + vec2(1.5, -0.8), uTime * 0.007));
  float gate = smoothstep(0.30, 0.58, banks * 0.48 + banksBig * 0.52);

  float n = body * (0.05 + 0.95 * gate);

  float lo = nearLayer ? mix(0.20, 0.08, cover) : mix(0.22, 0.10, cover);
  float shape = smoothstep(lo, lo + 0.04, n);
  shape = shape * shape * (3.0 - 2.0 * shape);

  return shape * mix(0.28, 1.0, cover);
}

float densityFromShape(float shape, vec3 p) {
  float h = smoothstep(0.04, 0.14, p.y) * smoothstep(0.88, 0.50, p.y);
  return shape * h;
}

vec3 shadeCloud(float dens, float shape, float topness, vec3 pos, vec3 rd, vec3 sunDir) {
  float above = densityFromShape(shape, pos + sunDir * 0.11);
  // Strong topness → bright white crowns; low topness → blue-grey belly.
  float lit = clamp(0.20 + topness * 1.25 + (dens - above) * 1.8, 0.0, 1.0);
  float lt = exp(-above * 1.9);

  float shadeAmt = clamp((1.0 - lit) * 1.05 + (1.0 - lt) * 0.28, 0.0, 1.0);
  shadeAmt = pow(shadeAmt, 0.78);
  shadeAmt *= 1.0 - dens * 0.75;

  vec3 base = mix(COL_LIT, COL_SHADE, shadeAmt);
  base = mix(base, COL_CREASE, shadeAmt * shadeAmt * 0.60 * (1.0 - dens));

  float powder = 1.0 - exp(-dens * 2.8);
  float silver = powder * lit * 0.20;
  base = mix(base, COL_RIM, silver);

  float edge = dens * (1.0 - dens) * 4.0;
  base = mix(base, COL_CREASE, edge * (1.0 - lit) * 0.32);

  return base;
}

vec4 marchNear(vec2 uv, vec3 sunDir, float cover) {
  vec2 suv = uv + pointerField(uv, NEAR_POINTER_MUL);
  float aspect = uResolution.x / max(uResolution.y, 1.0);

  vec2 cloudUv = suv;
  cloudUv.x += uTime * DRIFT_SPEED * 0.25;

  float shape = cloudShape(cloudUv, cover, true);
  if (shape < 0.01) return vec4(0.0);

  float shapeDn = cloudShape(cloudUv - vec2(0.0, 0.016), cover, true);
  float topness = clamp((shape - shapeDn) * 8.0, 0.0, 1.0);

  vec3 ro = vec3((suv.x - 0.5) * aspect * 1.7, 0.10, 0.2);
  vec3 rd = normalize(vec3((suv.x - 0.5) * 0.05 * aspect, 0.16, 1.0));

  vec3 col = vec3(0.0);
  float alpha = 0.0;
  float t = 0.0;

  for (int i = 0; i < 8; i++) {
    if (alpha > 0.96) break;
    vec3 pos = ro + rd * t;
    float dens = densityFromShape(shape, pos);
    if (dens > 0.02) {
      vec3 rgb = shadeCloud(dens, shape, topness, pos, rd, sunDir);
      float a = clamp(dens * NEAR_STEP * 9.5, 0.0, 1.0);
      float w = a * (1.0 - alpha);
      col += rgb * w;
      alpha += w;
    }
    t += NEAR_STEP;
  }

  return vec4(col, alpha);
}

vec4 marchFar(vec2 uv, vec3 sunDir, float cover) {
  vec2 suv = uv + pointerField(uv, FAR_POINTER_MUL);
  float aspect = uResolution.x / max(uResolution.y, 1.0);

  vec2 cloudUv = suv;
  cloudUv.x += uTime * DRIFT_SPEED * 0.12;

  float shape = cloudShape(cloudUv, cover, false);
  if (shape < 0.01) return vec4(0.0);

  float shapeDn = cloudShape(cloudUv - vec2(0.0, 0.02), cover, false);
  float topness = clamp((shape - shapeDn) * 6.0, 0.0, 1.0);

  vec3 ro = vec3((suv.x - 0.5) * aspect * 2.0, 0.16, 0.9);
  vec3 rd = normalize(vec3((suv.x - 0.5) * 0.04 * aspect, 0.12, 1.0));

  vec3 col = vec3(0.0);
  float alpha = 0.0;
  float t = 0.0;

  for (int i = 0; i < 4; i++) {
    if (alpha > 0.94) break;
    vec3 pos = ro + rd * t;
    float dens = densityFromShape(shape, pos);
    if (dens > 0.02) {
      vec3 rgb = shadeCloud(dens, shape, topness, pos, rd, sunDir);
      float a = clamp(dens * FAR_STEP * 5.6, 0.0, 1.0);
      float w = a * (1.0 - alpha);
      col += rgb * w;
      alpha += w;
    }
    t += FAR_STEP;
  }

  return vec4(col, alpha);
}

void main() {
  vec2 uv = vUv;

  float cover = compositionCover(uv);

  float nFine = valueNoise(vec3(uv * 4.4 + vec2(uTime * DRIFT_SPEED * 0.35, 0.0), uTime * 0.016));
  float nBank = valueNoise(vec3(uv * 1.8 + vec2(1.7, -0.9), uTime * 0.008));
  float islands = smoothstep(0.16, 0.48, nBank * 0.70 + nFine * 0.30);
  cover = clamp(cover * (0.20 + 0.90 * islands), 0.0, 1.0);

  cover *= smoothstep(0.0, 0.05, uv.y) * smoothstep(1.0, 0.93, uv.y);

  if (cover < 0.02) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float legibility = textLegibilityMask(uv);
  vec3 sunDir = normalize(vec3(-0.26, 0.92, 0.36));

  vec4 farL = marchFar(uv, sunDir, cover);
  vec4 nearL = marchNear(uv, sunDir, cover);

  float aFar = farL.a * 0.48 * legibility;
  float aNear = nearL.a * legibility;
  float alpha = 1.0 - (1.0 - aFar) * (1.0 - aNear);
  alpha = min(alpha, PEAK_ALPHA);

  vec3 rgb = COL_LIT;
  if (farL.a > 0.001) {
    rgb = farL.rgb / max(farL.a, 1e-3);
  }
  if (nearL.a > 0.001) {
    vec3 nearRgb = nearL.rgb / max(nearL.a, 1e-3);
    rgb = mix(rgb, nearRgb, clamp(aNear / max(alpha, 1e-3), 0.0, 1.0));
  }

  float grain = (hash13(vec3(gl_FragCoord.xy, fract(uTime * 17.0))) - 0.5) * 0.006;
  rgb = clamp(rgb + grain, 0.0, 1.0);

  gl_FragColor = vec4(rgb * alpha, alpha);
}
`;
