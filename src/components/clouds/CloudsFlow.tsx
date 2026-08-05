"use client";

import { useEffect, useRef } from "react";
import {
  FALLBACK_FRAG,
  RENDER_FRAG,
  SIM_FRAG,
  VERT,
} from "./cloudsFlow.glsl";

export type CloudsProps = { className?: string };

// --- Internal tuning (reviewer knobs) ---------------------------------------
const SIM_SCALE = 0.25;
const DRIFT_SPEED = 0.012;
const INJECT_RADIUS = 0.14;
const FORCE_STRENGTH = 2.8;
const DISSIPATION = 0.965;
const CURL_STRENGTH = 0.12;
const VEL_MAX = 1.35;
const FLOW_SCALE_NEAR = 0.72;
const FLOW_SCALE_FAR = 0.12;
/** Peak cloud opacity in corners / bottom band (headline band is lower via mask). */
const PEAK_ALPHA = 0.78;
/** Headline + CTA band centre in UV (y=0 bottom). */
const TEXT_MASK_CENTER_Y = 0.64;
const TEXT_MASK_SOFTNESS = 0.2;
/** Multiplier on density inside the headline oval (match Volumetric quiet zone). */
const TEXT_MASK_MIN = 0.28;
const TEXT_MASK_EDGE_BOOST = 0.95;
const POINTER_SMOOTH = 0.28;
const MAX_DT = 1 / 30;
const MIN_SIM_DIM = 32;
const MAX_SIM_DIM = 480;

type GL = WebGLRenderingContext;

type TexFormat = {
  internalFormat: number;
  format: number;
  type: number;
  filter: number;
  useFloat: boolean;
};

type Target = { tex: WebGLTexture; fbo: WebGLFramebuffer };

type PingPong = {
  read: Target;
  write: Target;
  width: number;
  height: number;
};

type SimLocs = {
  velocity: WebGLUniformLocation | null;
  dt: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
  pointer: WebGLUniformLocation | null;
  pointerPrev: WebGLUniformLocation | null;
  pointerVel: WebGLUniformLocation | null;
  pointerActive: WebGLUniformLocation | null;
  forceStrength: WebGLUniformLocation | null;
  injectRadius: WebGLUniformLocation | null;
  dissipation: WebGLUniformLocation | null;
  curlStrength: WebGLUniformLocation | null;
  drift: WebGLUniformLocation | null;
  velMax: WebGLUniformLocation | null;
  useFloat: WebGLUniformLocation | null;
  aPos: number;
};

type RenderLocs = {
  velocity: WebGLUniformLocation | null;
  resolution: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
  velMax: WebGLUniformLocation | null;
  useFloat: WebGLUniformLocation | null;
  flowScaleNear: WebGLUniformLocation | null;
  flowScaleFar: WebGLUniformLocation | null;
  maskCenterY: WebGLUniformLocation | null;
  maskSoftness: WebGLUniformLocation | null;
  maskMin: WebGLUniformLocation | null;
  maskEdgeBoost: WebGLUniformLocation | null;
  peakAlpha: WebGLUniformLocation | null;
  simActive: WebGLUniformLocation | null;
  aPos: number;
};

type FallbackLocs = {
  resolution: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
  pointer: WebGLUniformLocation | null;
  pointerActive: WebGLUniformLocation | null;
  injectRadius: WebGLUniformLocation | null;
  forceStrength: WebGLUniformLocation | null;
  maskCenterY: WebGLUniformLocation | null;
  maskSoftness: WebGLUniformLocation | null;
  maskMin: WebGLUniformLocation | null;
  maskEdgeBoost: WebGLUniformLocation | null;
  peakAlpha: WebGLUniformLocation | null;
  aPos: number;
};

function compileShader(gl: GL, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function linkProgram(gl: GL, vertSrc: string, fragSrc: string): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    return null;
  }
  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function createTexture(
  gl: GL,
  w: number,
  h: number,
  format: TexFormat,
): WebGLTexture | null {
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, format.filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, format.filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    format.internalFormat,
    w,
    h,
    0,
    format.format,
    format.type,
    null,
  );
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
}

function createTarget(gl: GL, w: number, h: number, format: TexFormat): Target | null {
  const tex = createTexture(gl, w, h, format);
  if (!tex) return null;
  const fbo = gl.createFramebuffer();
  if (!fbo) {
    gl.deleteTexture(tex);
    return null;
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    gl.deleteFramebuffer(fbo);
    gl.deleteTexture(tex);
    return null;
  }
  return { tex, fbo };
}

function clearTarget(gl: GL, target: Target, format: TexFormat): void {
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
  if (format.useFloat) {
    gl.clearColor(0, 0, 0, 1);
  } else {
    gl.clearColor(0.5, 0.5, 0.5, 1);
  }
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  // Critical: restore transparent clear — a leftover opaque clearColor makes the
  // canvas clear to black, and premul blend then forces every pixel to alpha 1.
  gl.clearColor(0, 0, 0, 0);
}

function destroyTarget(gl: GL, target: Target): void {
  gl.deleteFramebuffer(target.fbo);
  gl.deleteTexture(target.tex);
}

function destroyPingPong(gl: GL, pp: PingPong | null): void {
  if (!pp) return;
  destroyTarget(gl, pp.read);
  destroyTarget(gl, pp.write);
}

function pickTexFormat(gl: GL): TexFormat {
  const byteFormat: TexFormat = {
    internalFormat: gl.RGBA,
    format: gl.RGBA,
    type: gl.UNSIGNED_BYTE,
    filter: gl.LINEAR,
    useFloat: false,
  };

  const halfExt = gl.getExtension("OES_texture_half_float");
  const halfLinear = gl.getExtension("OES_texture_half_float_linear");
  gl.getExtension("EXT_color_buffer_half_float");

  if (halfExt && "HALF_FLOAT_OES" in halfExt) {
    const halfType = (halfExt as { HALF_FLOAT_OES: number }).HALF_FLOAT_OES;
    const candidate: TexFormat = {
      internalFormat: gl.RGBA,
      format: gl.RGBA,
      type: halfType,
      filter: halfLinear ? gl.LINEAR : gl.NEAREST,
      useFloat: true,
    };
    const probe = createTarget(gl, 4, 4, candidate);
    if (probe) {
      destroyTarget(gl, probe);
      return candidate;
    }
  }

  const floatExt = gl.getExtension("OES_texture_float");
  const floatLinear = gl.getExtension("OES_texture_float_linear");
  gl.getExtension("WEBGL_color_buffer_float");

  if (floatExt) {
    const candidate: TexFormat = {
      internalFormat: gl.RGBA,
      format: gl.RGBA,
      type: gl.FLOAT,
      filter: floatLinear ? gl.LINEAR : gl.NEAREST,
      useFloat: true,
    };
    const probe = createTarget(gl, 4, 4, candidate);
    if (probe) {
      destroyTarget(gl, probe);
      return candidate;
    }
  }

  return byteFormat;
}

function createPingPong(
  gl: GL,
  w: number,
  h: number,
  format: TexFormat,
): PingPong | null {
  const read = createTarget(gl, w, h, format);
  const write = createTarget(gl, w, h, format);
  if (!read || !write) {
    if (read) destroyTarget(gl, read);
    if (write) destroyTarget(gl, write);
    return null;
  }
  clearTarget(gl, read, format);
  clearTarget(gl, write, format);
  return { read, write, width: w, height: h };
}

function swapPingPong(pp: PingPong): void {
  const tmp = pp.read;
  pp.read = pp.write;
  pp.write = tmp;
}

function byteFormat(gl: GL): TexFormat {
  return {
    internalFormat: gl.RGBA,
    format: gl.RGBA,
    type: gl.UNSIGNED_BYTE,
    filter: gl.LINEAR,
    useFloat: false,
  };
}

export function CloudsFlow({ className }: CloudsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    let quadBuf: WebGLBuffer | null = null;
    let simProgram: WebGLProgram | null = null;
    let renderProgram: WebGLProgram | null = null;
    let fallbackProgram: WebGLProgram | null = null;
    let simLocs: SimLocs | null = null;
    let renderLocs: RenderLocs | null = null;
    let fallbackLocs: FallbackLocs | null = null;
    let texFormat: TexFormat = byteFormat(gl);
    let pingPong: PingPong | null = null;
    let simActive = false;

    let bufW = 0;
    let bufH = 0;
    let raf = 0;
    let lastTs = 0;
    let timeSec = 0;
    let running = false;
    let visible = true;
    let pageVisible = document.visibilityState !== "hidden";
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let contextLost = false;

    const pointer = {
      x: 0.5,
      y: 0.5,
      velX: 0,
      velY: 0,
      smoothX: 0.5,
      smoothY: 0.5,
      active: 0,
      hasSample: false,
    };

    const releaseGpu = () => {
      destroyPingPong(gl, pingPong);
      pingPong = null;
      simActive = false;
      if (simProgram) {
        gl.deleteProgram(simProgram);
        simProgram = null;
      }
      if (renderProgram) {
        gl.deleteProgram(renderProgram);
        renderProgram = null;
      }
      if (fallbackProgram) {
        gl.deleteProgram(fallbackProgram);
        fallbackProgram = null;
      }
      if (quadBuf) {
        gl.deleteBuffer(quadBuf);
        quadBuf = null;
      }
      simLocs = null;
      renderLocs = null;
      fallbackLocs = null;
    };

    const initGpu = (): boolean => {
      releaseGpu();

      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      gl.disable(gl.BLEND);
      gl.clearColor(0, 0, 0, 0);

      const buf = gl.createBuffer();
      if (!buf) return false;
      quadBuf = buf;
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );

      simProgram = linkProgram(gl, VERT, SIM_FRAG);
      renderProgram = linkProgram(gl, VERT, RENDER_FRAG);
      fallbackProgram = linkProgram(gl, VERT, FALLBACK_FRAG);
      if (!renderProgram || !fallbackProgram) {
        releaseGpu();
        return false;
      }

      texFormat = pickTexFormat(gl);

      if (simProgram) {
        simLocs = {
          velocity: gl.getUniformLocation(simProgram, "u_velocity"),
          dt: gl.getUniformLocation(simProgram, "u_dt"),
          time: gl.getUniformLocation(simProgram, "u_time"),
          pointer: gl.getUniformLocation(simProgram, "u_pointer"),
          pointerPrev: gl.getUniformLocation(simProgram, "u_pointerPrev"),
          pointerVel: gl.getUniformLocation(simProgram, "u_pointerVel"),
          pointerActive: gl.getUniformLocation(simProgram, "u_pointerActive"),
          forceStrength: gl.getUniformLocation(simProgram, "u_forceStrength"),
          injectRadius: gl.getUniformLocation(simProgram, "u_injectRadius"),
          dissipation: gl.getUniformLocation(simProgram, "u_dissipation"),
          curlStrength: gl.getUniformLocation(simProgram, "u_curlStrength"),
          drift: gl.getUniformLocation(simProgram, "u_drift"),
          velMax: gl.getUniformLocation(simProgram, "u_velMax"),
          useFloat: gl.getUniformLocation(simProgram, "u_useFloat"),
          aPos: gl.getAttribLocation(simProgram, "a_pos"),
        };
      }

      renderLocs = {
        velocity: gl.getUniformLocation(renderProgram, "u_velocity"),
        resolution: gl.getUniformLocation(renderProgram, "u_resolution"),
        time: gl.getUniformLocation(renderProgram, "u_time"),
        velMax: gl.getUniformLocation(renderProgram, "u_velMax"),
        useFloat: gl.getUniformLocation(renderProgram, "u_useFloat"),
        flowScaleNear: gl.getUniformLocation(renderProgram, "u_flowScaleNear"),
        flowScaleFar: gl.getUniformLocation(renderProgram, "u_flowScaleFar"),
        maskCenterY: gl.getUniformLocation(renderProgram, "u_maskCenterY"),
        maskSoftness: gl.getUniformLocation(renderProgram, "u_maskSoftness"),
        maskMin: gl.getUniformLocation(renderProgram, "u_maskMin"),
        maskEdgeBoost: gl.getUniformLocation(renderProgram, "u_maskEdgeBoost"),
        peakAlpha: gl.getUniformLocation(renderProgram, "u_peakAlpha"),
        simActive: gl.getUniformLocation(renderProgram, "u_simActive"),
        aPos: gl.getAttribLocation(renderProgram, "a_pos"),
      };

      fallbackLocs = {
        resolution: gl.getUniformLocation(fallbackProgram, "u_resolution"),
        time: gl.getUniformLocation(fallbackProgram, "u_time"),
        pointer: gl.getUniformLocation(fallbackProgram, "u_pointer"),
        pointerActive: gl.getUniformLocation(fallbackProgram, "u_pointerActive"),
        injectRadius: gl.getUniformLocation(fallbackProgram, "u_injectRadius"),
        forceStrength: gl.getUniformLocation(fallbackProgram, "u_forceStrength"),
        maskCenterY: gl.getUniformLocation(fallbackProgram, "u_maskCenterY"),
        maskSoftness: gl.getUniformLocation(fallbackProgram, "u_maskSoftness"),
        maskMin: gl.getUniformLocation(fallbackProgram, "u_maskMin"),
        maskEdgeBoost: gl.getUniformLocation(fallbackProgram, "u_maskEdgeBoost"),
        peakAlpha: gl.getUniformLocation(fallbackProgram, "u_peakAlpha"),
        aPos: gl.getAttribLocation(fallbackProgram, "a_pos"),
      };

      bufW = 0;
      bufH = 0;
      return true;
    };

    const bindQuad = (aPos: number) => {
      if (!quadBuf) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      if (aPos >= 0) {
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      }
    };

    const ensureSimSize = (displayW: number, displayH: number) => {
      if (!simProgram) {
        simActive = false;
        return;
      }
      const sw = Math.max(
        MIN_SIM_DIM,
        Math.min(MAX_SIM_DIM, Math.round(displayW * SIM_SCALE)),
      );
      const sh = Math.max(
        MIN_SIM_DIM,
        Math.min(MAX_SIM_DIM, Math.round(displayH * SIM_SCALE)),
      );
      if (pingPong && pingPong.width === sw && pingPong.height === sh) {
        simActive = true;
        return;
      }

      let next = createPingPong(gl, sw, sh, texFormat);
      if (!next && texFormat.useFloat) {
        texFormat = byteFormat(gl);
        next = createPingPong(gl, sw, sh, texFormat);
      }
      destroyPingPong(gl, pingPong);
      pingPong = next;
      simActive = next !== null;
    };

    const resize = () => {
      if (disposed || contextLost) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextBufW = Math.max(1, Math.round(rect.width * dpr));
      const nextBufH = Math.max(1, Math.round(rect.height * dpr));

      if (nextBufW !== bufW || nextBufH !== bufH) {
        canvas.width = nextBufW;
        canvas.height = nextBufH;
        bufW = nextBufW;
        bufH = nextBufH;
      }
      gl.viewport(0, 0, bufW, bufH);
      ensureSimSize(bufW, bufH);
    };

    const clientToUv = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) {
        return { x: 0.5, y: 0.5 };
      }
      return {
        x: (clientX - rect.left) / rect.width,
        y: 1 - (clientY - rect.top) / rect.height,
      };
    };

    const drawFallback = (t: number) => {
      if (!fallbackProgram || !fallbackLocs) return;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, bufW, bufH);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.BLEND);
      gl.useProgram(fallbackProgram);
      bindQuad(fallbackLocs.aPos);
      gl.uniform2f(fallbackLocs.resolution, bufW, bufH);
      gl.uniform1f(fallbackLocs.time, t);
      gl.uniform2f(fallbackLocs.pointer, pointer.smoothX, pointer.smoothY);
      gl.uniform1f(fallbackLocs.pointerActive, pointer.active);
      gl.uniform1f(fallbackLocs.injectRadius, INJECT_RADIUS);
      gl.uniform1f(fallbackLocs.forceStrength, FORCE_STRENGTH);
      gl.uniform1f(fallbackLocs.maskCenterY, TEXT_MASK_CENTER_Y);
      gl.uniform1f(fallbackLocs.maskSoftness, TEXT_MASK_SOFTNESS);
      gl.uniform1f(fallbackLocs.maskMin, TEXT_MASK_MIN);
      gl.uniform1f(fallbackLocs.maskEdgeBoost, TEXT_MASK_EDGE_BOOST);
      gl.uniform1f(fallbackLocs.peakAlpha, PEAK_ALPHA);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const smoothPointer = (dt: number) => {
      const targetX = pointer.hasSample ? pointer.x : pointer.smoothX;
      const targetY = pointer.hasSample ? pointer.y : pointer.smoothY;
      const prevSmoothX = pointer.smoothX;
      const prevSmoothY = pointer.smoothY;
      const alpha = 1 - Math.pow(1 - POINTER_SMOOTH, dt * 60);
      pointer.smoothX += (targetX - pointer.smoothX) * alpha;
      pointer.smoothY += (targetY - pointer.smoothY) * alpha;
      pointer.velX = (pointer.smoothX - prevSmoothX) / Math.max(dt, 1e-4);
      pointer.velY = (pointer.smoothY - prevSmoothY) / Math.max(dt, 1e-4);
      const pSpeed = Math.hypot(pointer.velX, pointer.velY);
      const maxPVel = VEL_MAX * 2.5;
      if (pSpeed > maxPVel) {
        pointer.velX *= maxPVel / pSpeed;
        pointer.velY *= maxPVel / pSpeed;
      }
      return { prevSmoothX, prevSmoothY };
    };

    const drawSim = (dt: number, t: number) => {
      if (!simProgram || !simLocs || !renderProgram || !renderLocs || !pingPong) {
        drawFallback(t);
        return;
      }

      const { prevSmoothX, prevSmoothY } = smoothPointer(dt);

      gl.bindFramebuffer(gl.FRAMEBUFFER, pingPong.write.fbo);
      gl.viewport(0, 0, pingPong.width, pingPong.height);
      gl.disable(gl.BLEND);
      gl.useProgram(simProgram);
      bindQuad(simLocs.aPos);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, pingPong.read.tex);
      gl.uniform1i(simLocs.velocity, 0);
      gl.uniform1f(simLocs.dt, dt);
      gl.uniform1f(simLocs.time, t);
      gl.uniform2f(simLocs.pointer, pointer.smoothX, pointer.smoothY);
      gl.uniform2f(simLocs.pointerPrev, prevSmoothX, prevSmoothY);
      gl.uniform2f(simLocs.pointerVel, pointer.velX, pointer.velY);
      gl.uniform1f(simLocs.pointerActive, pointer.active);
      gl.uniform1f(simLocs.forceStrength, FORCE_STRENGTH);
      gl.uniform1f(simLocs.injectRadius, INJECT_RADIUS);
      gl.uniform1f(simLocs.dissipation, DISSIPATION);
      gl.uniform1f(simLocs.curlStrength, CURL_STRENGTH);
      gl.uniform1f(simLocs.drift, DRIFT_SPEED);
      gl.uniform1f(simLocs.velMax, VEL_MAX);
      gl.uniform1f(simLocs.useFloat, texFormat.useFloat ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      swapPingPong(pingPong);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, bufW, bufH);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      // Fullscreen replace over transparent clear — no blend needed.
      gl.disable(gl.BLEND);
      gl.useProgram(renderProgram);
      bindQuad(renderLocs.aPos);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, pingPong.read.tex);
      gl.uniform1i(renderLocs.velocity, 0);
      gl.uniform2f(renderLocs.resolution, bufW, bufH);
      gl.uniform1f(renderLocs.time, t);
      gl.uniform1f(renderLocs.velMax, VEL_MAX);
      gl.uniform1f(renderLocs.useFloat, texFormat.useFloat ? 1 : 0);
      gl.uniform1f(renderLocs.flowScaleNear, FLOW_SCALE_NEAR);
      gl.uniform1f(renderLocs.flowScaleFar, FLOW_SCALE_FAR);
      gl.uniform1f(renderLocs.maskCenterY, TEXT_MASK_CENTER_Y);
      gl.uniform1f(renderLocs.maskSoftness, TEXT_MASK_SOFTNESS);
      gl.uniform1f(renderLocs.maskMin, TEXT_MASK_MIN);
      gl.uniform1f(renderLocs.maskEdgeBoost, TEXT_MASK_EDGE_BOOST);
      gl.uniform1f(renderLocs.peakAlpha, PEAK_ALPHA);
      gl.uniform1f(renderLocs.simActive, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const drawFrame = (dt: number, advanceSim = true) => {
      if (disposed || contextLost || bufW < 1 || bufH < 1) return;
      if (advanceSim) {
        timeSec += dt;
      }
      if (simActive && advanceSim && dt > 0) {
        drawSim(dt, timeSec);
      } else if (simActive && renderProgram && renderLocs && pingPong) {
        // Static / zero-dt: sample current field without integrating.
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, bufW, bufH);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.disable(gl.BLEND);
        gl.useProgram(renderProgram);
        bindQuad(renderLocs.aPos);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pingPong.read.tex);
        gl.uniform1i(renderLocs.velocity, 0);
        gl.uniform2f(renderLocs.resolution, bufW, bufH);
        gl.uniform1f(renderLocs.time, timeSec);
        gl.uniform1f(renderLocs.velMax, VEL_MAX);
        gl.uniform1f(renderLocs.useFloat, texFormat.useFloat ? 1 : 0);
        gl.uniform1f(renderLocs.flowScaleNear, FLOW_SCALE_NEAR);
        gl.uniform1f(renderLocs.flowScaleFar, FLOW_SCALE_FAR);
        gl.uniform1f(renderLocs.maskCenterY, TEXT_MASK_CENTER_Y);
        gl.uniform1f(renderLocs.maskSoftness, TEXT_MASK_SOFTNESS);
        gl.uniform1f(renderLocs.maskMin, TEXT_MASK_MIN);
        gl.uniform1f(renderLocs.maskEdgeBoost, TEXT_MASK_EDGE_BOOST);
        gl.uniform1f(renderLocs.peakAlpha, PEAK_ALPHA);
        gl.uniform1f(renderLocs.simActive, 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      } else {
        if (advanceSim && dt > 0) {
          smoothPointer(dt);
        }
        drawFallback(timeSec);
      }
    };

    const stopLoop = () => {
      running = false;
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      lastTs = 0;
    };

    const tick = (ts: number) => {
      if (!running || disposed || contextLost) return;
      if (lastTs === 0) lastTs = ts;
      const dt = Math.min(Math.max((ts - lastTs) / 1000, 0), MAX_DT);
      lastTs = ts;
      drawFrame(dt);
      raf = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (disposed || contextLost || reducedMotion) return;
      if (!visible || !pageVisible) return;
      if (running) return;
      running = true;
      lastTs = 0;
      raf = requestAnimationFrame(tick);
    };

    const syncPlayback = () => {
      if (disposed || contextLost) return;
      if (reducedMotion) {
        stopLoop();
        resize();
        // One settled frame: run a few quiet sim steps off-screen then present.
        if (simActive) {
          for (let i = 0; i < 8; i++) {
            drawSim(1 / 60, timeSec + i / 60);
          }
          timeSec += 8 / 60;
        }
        drawFrame(0, false);
        return;
      }
      if (visible && pageVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const uv = clientToUv(e.clientX, e.clientY);
      if (!pointer.hasSample) {
        pointer.smoothX = uv.x;
        pointer.smoothY = uv.y;
        pointer.hasSample = true;
      }
      pointer.x = uv.x;
      pointer.y = uv.y;
      pointer.active = 1;
    };

    // Only clear when the pointer leaves the document (relatedTarget null),
    // not when bubbling across child elements.
    const onPointerLeaveDoc = (e: PointerEvent) => {
      if (e.relatedTarget === null) {
        pointer.active = 0;
        pointer.velX = 0;
        pointer.velY = 0;
      }
    };

    const onVisibility = () => {
      pageVisible = document.visibilityState !== "hidden";
      syncPlayback();
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      reducedMotion = motionQuery.matches;
      syncPlayback();
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      stopLoop();
    };

    const onContextRestored = () => {
      contextLost = false;
      if (!initGpu()) return;
      resize();
      syncPlayback();
    };

    if (!initGpu()) return;

    const ro = new ResizeObserver(() => {
      resize();
      if (reducedMotion) {
        drawFrame(0, false);
      }
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        visible = entry ? entry.isIntersecting : false;
        syncPlayback();
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeaveDoc);
    document.documentElement.addEventListener("pointerout", onPointerLeaveDoc);
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", onMotionChange);
    } else {
      motionQuery.addListener(onMotionChange);
    }

    resize();
    syncPlayback();

    return () => {
      disposed = true;
      stopLoop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeaveDoc);
      document.documentElement.removeEventListener("pointerout", onPointerLeaveDoc);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      if (typeof motionQuery.removeEventListener === "function") {
        motionQuery.removeEventListener("change", onMotionChange);
      } else {
        motionQuery.removeListener(onMotionChange);
      }

      releaseGpu();
      // Deliberately not calling WEBGL_lose_context here: getContext() hands back
      // the same context object for a given canvas, so forcing the loss would
      // leave a permanently dead context behind on any remount (Strict Mode).
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
