export const VERT_SRC = /* glsl */ `
attribute vec2 a_pos;
varying vec2 v_uv;

void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

export const FRAG_SRC = /* glsl */ `
precision highp float;

varying vec2 v_uv;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_cursor;
uniform vec2 u_cursorVel;
uniform float u_pointerStrength;
uniform vec2 u_wake[12];
uniform float u_wakeAge[12];

// --- Tuning -----------------------------------------------------------------
// Visibility = silhouette alpha (cover-driven; open sky = vec4(0)) + luminance
// (composited belly ~#a9c4e2–#b8d4f0, lit tops white). Never floor alpha into
// a sky wash — the page already is the bright daytime sky.
// POINTER_*: shove disc; SHEEN_AMP: glassy ring (0.0 to disable).

const float POINTER_RADIUS = 0.30;
const float POINTER_BASE = 0.16;
const float WAKE_DECAY = 0.90;
const float WAKE_RADIUS = 0.19;
const float SWIRL_AMP = 0.05;
const float SHEEN_AMP = 0.014;

const float PEAK_ALPHA = 0.76;

// Soft elliptical text calm (measured column y0.56–0.97 x0.30–0.70)
const float TEXT_Y0 = 0.56;
const float TEXT_Y1 = 0.97;
const float TEXT_X0 = 0.30;
const float TEXT_X1 = 0.70;
const float TEXT_MASK_MIN = 0.22;

// Bright daytime cloud tones (sRGB 0–1). Pigments are chroma-boosted so after
// premultiplied alpha over page #fafcff the belly reads ~#a9c4e2 / #b8d4f0.
const vec3 CLOUD_CREASE = vec3(0.431, 0.651, 0.863); // #6ea6dc — blue underside
const vec3 CLOUD_SHADOW = vec3(0.557, 0.737, 0.925); // #8ebcec — soft blue belly
const vec3 CLOUD_LIT    = vec3(1.000, 1.000, 1.000); // #ffffff — sunlit tops

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

// Narrow loft → crisp billow edges; open sky where n < cut.
float billow(float n, float loft, float cut) {
  float d = smoothstep(cut, cut + loft, n);
  return d * d * (3.0 - 2.0 * d);
}

vec2 pointerOffset(vec2 uv, float layerScale, float aspect) {
  float strength = u_pointerStrength * POINTER_BASE * layerScale;
  if (strength < 1e-5) {
    return vec2(0.0);
  }

  vec2 cur = u_cursor;
  vec2 q = uv * vec2(aspect, 1.0);
  cur.x *= aspect;

  vec2 delta = q - cur;
  float dist = length(delta);
  float fall = smoothstep(POINTER_RADIUS, 0.0, dist);
  fall *= fall;

  vec2 dir = dist > 1e-4 ? delta / dist : vec2(0.0, 1.0);
  vec2 radial = dir * fall * strength;

  float speed = length(u_cursorVel);
  vec2 travelDir = normalize(u_cursorVel * vec2(aspect, 1.0) + vec2(1e-5, 0.0));
  vec2 travel = travelDir * fall * strength * min(speed * 2.4, 1.35);

  float ang = SWIRL_AMP * fall * layerScale * u_pointerStrength;
  float ca = cos(ang);
  float sa = sin(ang);
  vec2 swirled = mat2(ca, -sa, sa, ca) * delta - delta;

  vec2 wakePush = vec2(0.0);
  for (int i = 0; i < 12; i++) {
    float age = u_wakeAge[i];
    if (age < 0.0) continue;
    float fade = exp(-age * WAKE_DECAY * 2.4);
    vec2 wp = u_wake[i];
    wp.x *= aspect;
    vec2 wd = q - wp;
    float wdLen = length(wd);
    float wf = smoothstep(WAKE_RADIUS, 0.0, wdLen);
    wf *= wf;
    vec2 wdir = wdLen > 1e-4 ? wd / wdLen : vec2(0.0, 1.0);
    wakePush += wdir * wf * strength * 0.55 * fade;
  }

  vec2 offset = radial + travel * 0.7 + swirled * 0.6 + wakePush;
  offset.x /= aspect;
  return offset;
}

/**
 * Soft vertical envelope — noise decides silhouettes. Biases toward open sky and
 * lower band but never zeros the field (hard gaps read as geometry, not weather).
 * Video sits opaque on top; no rectangular hole needed.
 */
float compositionCover(vec2 uv) {
  float sky = smoothstep(0.24, 0.86, uv.y);
  float ground = 1.0 - smoothstep(0.03, 0.32, uv.y);
  float env = clamp(0.52 + 0.48 * max(sky, ground), 0.0, 1.0);
  env *= smoothstep(0.0, 0.04, uv.y) * smoothstep(1.0, 0.94, uv.y);
  return env;
}

/**
 * Soft elliptical dip over the text column. Wide radial falloff — never a
 * rectangular panel floating in the sky.
 */
float textLegibilityMask(vec2 uv) {
  vec2 center = vec2(0.5, (TEXT_Y0 + TEXT_Y1) * 0.5);
  vec2 radius = vec2((TEXT_X1 - TEXT_X0) * 0.5 + 0.17, (TEXT_Y1 - TEXT_Y0) * 0.5 + 0.14);
  float d = length((uv - center) / radius);
  return mix(TEXT_MASK_MIN, 1.0, smoothstep(0.32, 1.08, d));
}

vec3 cloudAlbedo(float lit) {
  float tone = clamp(lit, 0.0, 1.0);
  // Blue shade carries form; tops ramp hard into bright white (summer day)
  vec3 belly = mix(CLOUD_CREASE, CLOUD_SHADOW, smoothstep(0.0, 0.50, tone * tone));
  float top = smoothstep(0.18, 0.72, tone);
  top = top * top * (3.0 - 2.0 * top);
  return mix(belly, CLOUD_LIT, top);
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_res.x / max(u_res.y, 1.0);
  float t = u_time;

  float presence = compositionCover(uv);
  float nWarp = fbm(uv * vec2(3.2, 1.9) + vec2(t * 0.01, 0.25));
  presence = clamp(presence * (0.70 + 0.42 * nWarp), 0.0, 1.0);

  if (presence < 0.02) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float legibility = textLegibilityMask(uv);

  float cover = 0.0;
  vec3 cloudCol = vec3(0.0);

  // Soft height bias only — never corner rectangles. Noise owns silhouettes.
  float heightWin = smoothstep(0.02, 0.20, uv.y) * smoothstep(0.995, 0.48, uv.y);
  float heightLow = smoothstep(0.40, 0.04, uv.y);

  // Layer 0 — distant haze (sparse)
  {
    float ls = 0.25;
    vec2 sampleUv = uv + pointerOffset(uv, ls, aspect);
    vec2 p = sampleUv * vec2(2.2, 1.05) + vec2(0.15, 0.32);
    p.x += t * 0.014;
    p += 0.045 * vec2(fbm(p * 0.85 + t * 0.012));
    float n = fbm(p * 3.3 + vec2(t * 0.01, 0.0));
    float cut = mix(0.48, 0.42, presence);
    float dens = billow(n, 0.10, cut);
    dens *= dens; // concentrate into cores — open sky between
    dens *= heightWin;
    dens *= 1.05 * presence;
    float lit = clamp(0.48 + (n - 0.50) * 1.30, 0.0, 0.98);
    vec3 c = cloudAlbedo(lit);
    cloudCol += c * dens * (1.0 - cover);
    cover = cover + dens * (1.0 - cover);
  }

  // Layer 1 — mid banks
  {
    float ls = 0.55;
    vec2 sampleUv = uv + pointerOffset(uv, ls, aspect);
    vec2 p = sampleUv * vec2(1.50, 0.80) + vec2(1.85, 0.08);
    p.x += t * 0.032;
    p += 0.065 * vec2(fbm(p * 0.95 + t * 0.018));
    float n = fbm(p * 2.05 + vec2(t * 0.014, 0.4));
    n = n * 0.68 + fbm(p * 4.2) * 0.32;
    float cut = mix(0.49, 0.42, presence);
    float dens = billow(n, 0.095, cut);
    dens *= dens;
    dens *= heightWin;
    dens *= 1.35 * presence;
    float nUp = fbm((p + vec2(0.0, 0.045)) * 2.05 + vec2(t * 0.014, 0.4));
    float slope = clamp((n - nUp) * 6.0, -1.0, 1.0);
    float lit = clamp(0.34 + slope * 0.55 + (n - 0.5) * 0.55, 0.0, 1.0);
    vec3 c = cloudAlbedo(lit);
    cloudCol += c * dens * (1.0 - cover);
    cover = cover + dens * (1.0 - cover);
  }

  // Layer 2 — large near cumulus (main form)
  {
    float ls = 0.9;
    vec2 sampleUv = uv + pointerOffset(uv, ls, aspect);
    vec2 p = sampleUv * vec2(0.98, 0.66) + vec2(-1.35, 0.04);
    p.x += t * 0.052;
    p += 0.095 * vec2(fbm(p * 0.68 + t * 0.02) - 0.5);
    float n = fbm(p * 1.28 + vec2(t * 0.016, -0.2));
    n = pow(clamp(n, 0.0, 1.0), 1.08);
    float cut = mix(0.47, 0.40, presence);
    float dens = billow(n, 0.09, cut);
    dens *= dens;
    dens *= heightWin;
    dens *= 1.55 * presence;
    float nUp = fbm((p + vec2(0.0, 0.05)) * 1.28 + vec2(t * 0.016, -0.2));
    float nDn = fbm((p - vec2(0.0, 0.035)) * 1.28 + vec2(t * 0.016, -0.2));
    float slope = clamp((n - nUp) * 5.5 + (nDn - n) * 1.7, -1.0, 1.0);
    float core = smoothstep(0.42, 0.72, n);
    float lit = clamp(0.26 + max(slope, 0.0) * 0.72 + (1.0 - core) * 0.42, 0.0, 1.0);
    // Undersides stay in blue crease (keep high enough to avoid ash)
    lit *= mix(0.62, 1.0, clamp(slope * 0.5 + 0.5, 0.0, 1.0));
    vec3 c = cloudAlbedo(lit);
    cloudCol += c * dens * (1.0 - cover);
    cover = cover + dens * (1.0 - cover);
  }

  // Layer 3 — lower band wisps
  {
    float ls = 1.2;
    vec2 sampleUv = uv + pointerOffset(uv, ls, aspect);
    vec2 p = sampleUv * vec2(1.40, 0.90) + vec2(0.55, -0.32);
    p.x += t * 0.078;
    p += 0.13 * vec2(fbm(p * 0.78 + t * 0.028) - 0.5);
    float n = fbm(p * 1.48 + vec2(t * 0.02, 1.2));
    n = n * 0.60 + fbm(p * 3.0) * 0.40;
    float cut = mix(0.48, 0.41, presence);
    float dens = billow(n, 0.095, cut);
    dens *= dens;
    dens *= heightLow;
    dens *= 1.40 * mix(0.75, 1.0, presence);
    float nUp = fbm((p + vec2(0.0, 0.035)) * 1.48 + vec2(t * 0.02, 1.2));
    float lit = clamp(0.30 + (n - nUp) * 4.8 + n * 0.32, 0.0, 1.0);
    vec3 c = cloudAlbedo(lit);
    cloudCol += c * dens * (1.0 - cover);
    cover = cover + dens * (1.0 - cover);
  }

  cover = clamp(cover, 0.0, 1.0);
  if (cover < 0.02) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // Page supplies the bright sky — emit cloud pigment only
  vec3 rgb = cloudCol / max(cover, 1e-3);

  // Edge crease for silhouette hold (blue, not ash)
  float edge = cover * (1.0 - cover) * 4.0;
  float toLit = smoothstep(0.0, 0.15, length(rgb - CLOUD_LIT));
  rgb = mix(rgb, CLOUD_CREASE, edge * toLit * 0.14);

  if (SHEEN_AMP > 0.0 && u_pointerStrength > 0.01) {
    vec2 cur = u_cursor;
    vec2 d = (uv - cur) * vec2(aspect, 1.0);
    float r = length(d);
    float ring = exp(-pow((r - 0.09) / 0.055, 2.0)) * exp(-r * 1.4);
    float gloss = ring * SHEEN_AMP * u_pointerStrength * (0.35 + cover * 0.65);
    rgb += vec3(0.018, 0.032, 0.055) * gloss;
  }

  float grain = (hash21(uv * u_res + fract(t * 17.0)) - 0.5) * 0.005;
  rgb = clamp(rgb + grain, 0.0, 1.0);

  // Alpha from cover only — empty sky transparent (no 0.42 wash floor).
  // Slight soft knee so solid cores land ~0.55–0.72 after compositing.
  float alpha = (1.0 - exp(-cover * 3.2)) * PEAK_ALPHA * legibility;
  alpha = clamp(alpha, 0.0, PEAK_ALPHA);

  gl_FragColor = vec4(rgb * alpha, alpha);
}
`;
