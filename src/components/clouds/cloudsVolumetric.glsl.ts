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

const float PEAK_ALPHA = 0.76;

// Text column quiet zone (measured): y 0.56–0.97, x 0.30–0.70
const float TEXT_Y0 = 0.56;
const float TEXT_Y1 = 0.97;
const float TEXT_X0 = 0.30;
const float TEXT_X1 = 0.70;
const float TEXT_MASK_MIN = 0.24;

// Soft daytime cotton — matched to Parallax’s pigment language.
const vec3 CLOUD_CREASE = vec3(0.431, 0.651, 0.863);
const vec3 CLOUD_SHADOW = vec3(0.557, 0.737, 0.925);
const vec3 CLOUD_LIT    = vec3(1.000, 1.000, 1.000);

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// 4 octaves — soft enough for cotton, cheap enough for hero.
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = m * p * 2.02;
    a *= 0.5;
  }
  return v;
}

/**
 * Soft billow loft (from Parallax). Gentle density falloff = feathered cotton
 * edges, not hard iso-contours or glossy cutouts.
 */
float billow(float n, float loft, float cut) {
  float d = smoothstep(cut, cut + loft, n);
  return d * d * (3.0 - 2.0 * d);
}

vec2 pointerField(vec2 uv, float layerMul) {
  float strength = uPointerStrength * POINTER_STRENGTH * layerMul;
  vec2 disp = vec2(0.0);

  vec2 d = uv - uPointer;
  float len = length(d);
  vec2 dir = len > 1e-4 ? d / len : vec2(0.0, 1.0);

  // Soft shove — taper at center avoids starburst.
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
  float sky = smoothstep(0.24, 0.86, uv.y);
  float ground = 1.0 - smoothstep(0.03, 0.32, uv.y);
  float env = clamp(0.52 + 0.48 * max(sky, ground), 0.0, 1.0);
  env *= smoothstep(0.0, 0.04, uv.y) * smoothstep(1.0, 0.94, uv.y);
  return env;
}

float textLegibilityMask(vec2 uv) {
  vec2 center = vec2(0.5, (TEXT_Y0 + TEXT_Y1) * 0.5);
  vec2 radius = vec2((TEXT_X1 - TEXT_X0) * 0.5 + 0.17, (TEXT_Y1 - TEXT_Y0) * 0.5 + 0.14);
  float d = length((uv - center) / radius);
  return mix(TEXT_MASK_MIN, 1.0, smoothstep(0.32, 1.08, d));
}

/** Soft pigment: blue belly → white tops. No specular / silver rim. */
vec3 cloudAlbedo(float lit) {
  float tone = clamp(lit, 0.0, 1.0);
  vec3 belly = mix(CLOUD_CREASE, CLOUD_SHADOW, smoothstep(0.0, 0.50, tone * tone));
  float top = smoothstep(0.18, 0.72, tone);
  top = top * top * (3.0 - 2.0 * top);
  return mix(belly, CLOUD_LIT, top);
}

/**
 * One soft cloud layer. Parallax depth = different UV scale + drift speed.
 * Density from soft fbm billow; lighting from noise slope (diffuse, matte).
 */
void accumulateLayer(
  vec2 uv,
  float presence,
  float layerScale,
  vec2 uvScale,
  vec2 origin,
  float drift,
  float warpAmp,
  float noiseScale,
  float loft,
  float densMul,
  float heightMask,
  inout float cover,
  inout vec3 cloudCol
) {
  vec2 sampleUv = uv + pointerField(uv, layerScale);
  vec2 p = sampleUv * uvScale + origin;
  p.x += uTime * drift;
  // Mild domain warp — organic, not liquid streaks.
  p += warpAmp * (vec2(fbm(p * 0.85 + uTime * 0.012), fbm(p * 0.85 + 3.1)) - 0.5);

  float n = fbm(p * noiseScale + vec2(uTime * drift * 0.35, 0.2));
  // Soft secondary octave for cotton texture (kept gentle).
  n = n * 0.72 + fbm(p * noiseScale * 2.05 + 1.7) * 0.28;

  float cut = mix(0.46, 0.39, presence);
  float dens = billow(n, loft, cut);
  // Mild core bias — keep feathered edges (full dens² reads too hard).
  dens = mix(dens, dens * dens, 0.55);
  dens *= heightMask;
  dens *= densMul * presence;

  // Diffuse form from slope — lit tops / shaded undersides, no gloss.
  float nUp = fbm((p + vec2(0.0, 0.04)) * noiseScale + vec2(uTime * drift * 0.35, 0.2));
  float slope = clamp((n - nUp) * 4.2, -1.0, 1.0);
  float lit = clamp(0.36 + max(slope, 0.0) * 0.55 + (n - 0.5) * 0.35, 0.0, 1.0);
  lit *= mix(0.75, 1.0, clamp(slope * 0.5 + 0.5, 0.0, 1.0));

  vec3 c = cloudAlbedo(lit);
  cloudCol += c * dens * (1.0 - cover);
  cover = cover + dens * (1.0 - cover);
}

void main() {
  vec2 uv = vUv;
  float t = uTime;

  float presence = compositionCover(uv);
  // Soft cover warp — sky breaks without hard cutouts.
  float nWarp = fbm(uv * vec2(3.0, 1.8) + vec2(t * 0.01, 0.25));
  presence = clamp(presence * (0.72 + 0.40 * nWarp), 0.0, 1.0);

  if (presence < 0.02) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float legibility = textLegibilityMask(uv);
  float heightWin = smoothstep(0.02, 0.20, uv.y) * smoothstep(0.995, 0.48, uv.y);
  float heightLow = smoothstep(0.40, 0.04, uv.y);

  float cover = 0.0;
  vec3 cloudCol = vec3(0.0);

  // Far haze — slow, sparse (depth cue). Wider loft = softer cotton.
  accumulateLayer(
    uv, presence, 0.28,
    vec2(2.1, 1.0), vec2(0.2, 0.3),
    0.012, 0.04, 3.1, 0.14, 0.95, heightWin,
    cover, cloudCol
  );

  // Mid banks.
  accumulateLayer(
    uv, presence, 0.55,
    vec2(1.45, 0.78), vec2(1.7, 0.1),
    0.028, 0.055, 2.0, 0.13, 1.25, heightWin,
    cover, cloudCol
  );

  // Near cumulus — main soft cotton masses (faster parallax).
  accumulateLayer(
    uv, presence, 0.95,
    vec2(0.95, 0.64), vec2(-1.2, 0.05),
    0.048, 0.075, 1.25, 0.12, 1.50, heightWin,
    cover, cloudCol
  );

  // Lower wisps.
  accumulateLayer(
    uv, presence, 1.15,
    vec2(1.35, 0.88), vec2(0.5, -0.3),
    0.070, 0.09, 1.45, 0.13, 1.25, heightLow,
    cover, cloudCol
  );

  cover = clamp(cover, 0.0, 1.0);
  if (cover < 0.02) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // Page is the bright sky — emit soft cloud pigment only.
  vec3 rgb = cloudCol / max(cover, 1e-3);

  // Tiny matte crease only — never a glossy rim.
  float edge = cover * (1.0 - cover) * 4.0;
  float toLit = smoothstep(0.0, 0.15, length(rgb - CLOUD_LIT));
  rgb = mix(rgb, CLOUD_CREASE, edge * toLit * 0.06);

  float grain = (hash21(uv * uResolution + fract(t * 17.0)) - 0.5) * 0.004;
  rgb = clamp(rgb + grain, 0.0, 1.0);

  // Soft alpha knee — feathered cotton.
  float alpha = (1.0 - exp(-cover * 2.6)) * PEAK_ALPHA * legibility;
  alpha = clamp(alpha, 0.0, PEAK_ALPHA);

  gl_FragColor = vec4(rgb * alpha, alpha);
}
`;
