"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { FRAG, VERT } from "./cloudsVolumetric.glsl";

type CloudsProps = {
  className?: string;
  /** "full" for hero/portfolio; "subtle" for soft card washes. */
  variant?: "full" | "subtle";
  /** Offsets noise/drift so multiple cards don't look identical. */
  seed?: number;
};

const WAKE_LEN = 10;
const WAKE_DECAY = 1.15;
const WAKE_SAMPLE_INTERVAL = 0.045;
const POINTER_SMOOTH = 10;
const VELOCITY_SMOOTH = 8;
const PRESENCE_IN = 5;
const PRESENCE_OUT = 3.2;
const DRIFT_TIME_SCALE = 1;
// Soft cloud field upscales cleanly; ~0.65 CSS px cuts fragment cost ~2.4× vs 1×.
const INTERNAL_DPR_CAP_FULL = 0.65;
const INTERNAL_DPR_CAP_SUBTLE = 0.4;
/** Full rate while the pointer is interacting; ambient drift can run cheaper. */
const IDLE_FRAME_MS_FULL = 1000 / 30;
const IDLE_FRAME_MS_SUBTLE = 1000 / 20;
const POINTER_ACTIVE_MS = 220;
const INTENSITY_FULL = 1;
const INTENSITY_SUBTLE = 0.22;
/** Soft bloom when the pointer is over a card text area. */
const INTENSITY_SUBTLE_HOVER = 0.48;
const SUBTLE_POINTER_STRENGTH = 0.85;

const CANVAS_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  display: "block",
  pointerEvents: "none",
  // Soft bilinear upscale from the lower internal resolution.
  imageRendering: "auto",
};

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
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

function createProgram(
  gl: WebGLRenderingContext,
  vertSrc: string,
  fragSrc: string,
): WebGLProgram | null {
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

type GlResources = {
  program: WebGLProgram;
  buffer: WebGLBuffer;
  locs: {
    aPos: number;
    uTime: WebGLUniformLocation | null;
    uResolution: WebGLUniformLocation | null;
    uPointer: WebGLUniformLocation | null;
    uPointerVel: WebGLUniformLocation | null;
    uPointerStrength: WebGLUniformLocation | null;
    uWake: Array<WebGLUniformLocation | null>;
    uIntensity: WebGLUniformLocation | null;
    uSeed: WebGLUniformLocation | null;
    uCardMode: WebGLUniformLocation | null;
  };
};

function buildResources(gl: WebGLRenderingContext): GlResources | null {
  const program = createProgram(gl, VERT, FRAG);
  if (!program) return null;

  const buffer = gl.createBuffer();
  if (!buffer) {
    gl.deleteProgram(program);
    return null;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );

  const aPos = gl.getAttribLocation(program, "aPos");
  if (aPos < 0) {
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    return null;
  }

  const uWake: Array<WebGLUniformLocation | null> = [];
  for (let i = 0; i < WAKE_LEN; i++) {
    uWake.push(gl.getUniformLocation(program, `uWake[${i}]`));
  }

  return {
    program,
    buffer,
    locs: {
      aPos,
      uTime: gl.getUniformLocation(program, "uTime"),
      uResolution: gl.getUniformLocation(program, "uResolution"),
      uPointer: gl.getUniformLocation(program, "uPointer"),
      uPointerVel: gl.getUniformLocation(program, "uPointerVel"),
      uPointerStrength: gl.getUniformLocation(program, "uPointerStrength"),
      uWake,
      uIntensity: gl.getUniformLocation(program, "uIntensity"),
      uSeed: gl.getUniformLocation(program, "uSeed"),
      uCardMode: gl.getUniformLocation(program, "uCardMode"),
    },
  };
}

function disposeResources(gl: WebGLRenderingContext, res: GlResources | null) {
  if (!res) return;
  gl.deleteBuffer(res.buffer);
  gl.deleteProgram(res.program);
}

export function CloudsVolumetric({
  className,
  variant = "full",
  seed = 0,
}: CloudsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const subtle = variant === "subtle";
  const intensity = subtle ? INTENSITY_SUBTLE : INTENSITY_FULL;
  const dprCap = subtle ? INTERNAL_DPR_CAP_SUBTLE : INTERNAL_DPR_CAP_FULL;
  const idleFrameMs = subtle ? IDLE_FRAME_MS_SUBTLE : IDLE_FRAME_MS_FULL;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: subtle ? "low-power" : "high-performance",
    });
    if (!gl) return;

    let resources = buildResources(gl);
    if (!resources) return;

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    let raf = 0;
    let lastTs = performance.now();
    let lastDrawTs = 0;
    let lastPointerActivity = 0;
    let elapsed = 0;
    let contextLost = false;
    let onScreen = true;
    let pageVisible = document.visibilityState !== "hidden";
    let reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const pointerTarget = { x: 0.5, y: 0.5 };
    const pointerSmooth = { x: 0.5, y: 0.5 };
    const velocitySmooth = { x: 0, y: 0 };
    let pointerInside = false;
    let presence = 0;

    const wake = new Float32Array(WAKE_LEN * 3);
    let wakeWrite = 0;
    let sampleAccumulator = 0;

    const hasActiveWake = () => {
      for (let i = 0; i < WAKE_LEN; i++) {
        if (wake[i * 3 + 2] > 0.02) return true;
      }
      return false;
    };

    const isPointerActive = (now: number) =>
      now - lastPointerActivity < POINTER_ACTIVE_MS ||
      hasActiveWake() ||
      (subtle && (pointerInside || presence > 0.02));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w < 1 || h < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const bw = Math.max(1, Math.floor(w * dpr));
      const bh = Math.max(1, Math.floor(h * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      gl.viewport(0, 0, bw, bh);
    };

    const clientToUv = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) {
        return { x: 0.5, y: 0.5, inside: false };
      }
      const x = (clientX - rect.left) / rect.width;
      const y = 1 - (clientY - rect.top) / rect.height;
      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;
      return { x, y, inside };
    };

    const draw = (dt: number) => {
      if (!resources || contextLost) return;
      resize();
      if (canvas.width < 1 || canvas.height < 1) return;

      elapsed += dt * DRIFT_TIME_SCALE;

      const presenceRate = pointerInside ? PRESENCE_IN : PRESENCE_OUT;
      const presenceTarget = pointerInside ? 1 : 0;
      presence +=
        (presenceTarget - presence) * (1 - Math.exp(-presenceRate * dt));
      if (!pointerInside && presence < 0.001) presence = 0;

      const smoothK = 1 - Math.exp(-POINTER_SMOOTH * dt);
      const prevX = pointerSmooth.x;
      const prevY = pointerSmooth.y;
      pointerSmooth.x += (pointerTarget.x - pointerSmooth.x) * smoothK;
      pointerSmooth.y += (pointerTarget.y - pointerSmooth.y) * smoothK;

      const instVelX = dt > 0 ? (pointerSmooth.x - prevX) / dt : 0;
      const instVelY = dt > 0 ? (pointerSmooth.y - prevY) / dt : 0;
      const velK = 1 - Math.exp(-VELOCITY_SMOOTH * dt);
      velocitySmooth.x += (instVelX - velocitySmooth.x) * velK;
      velocitySmooth.y += (instVelY - velocitySmooth.y) * velK;

      for (let i = 0; i < WAKE_LEN; i++) {
        const zi = i * 3 + 2;
        if (wake[zi] > 0) {
          wake[zi] = Math.max(0, wake[zi] - dt / WAKE_DECAY);
        }
      }

      const speed = Math.hypot(velocitySmooth.x, velocitySmooth.y);
      if (pointerInside && presence > 0.05 && speed > 0.08) {
        sampleAccumulator += dt;
        if (sampleAccumulator >= WAKE_SAMPLE_INTERVAL) {
          sampleAccumulator = 0;
          const i = wakeWrite * 3;
          wake[i] = pointerSmooth.x;
          wake[i + 1] = pointerSmooth.y;
          wake[i + 2] = 1;
          wakeWrite = (wakeWrite + 1) % WAKE_LEN;
        }
      } else {
        sampleAccumulator = 0;
      }

      const { program, buffer, locs } = resources;
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(locs.aPos);
      gl.vertexAttribPointer(locs.aPos, 2, gl.FLOAT, false, 0, 0);

      if (locs.uTime) gl.uniform1f(locs.uTime, elapsed);
      if (locs.uResolution) {
        gl.uniform2f(locs.uResolution, canvas.width, canvas.height);
      }
      if (locs.uPointer) {
        gl.uniform2f(locs.uPointer, pointerSmooth.x, pointerSmooth.y);
      }
      if (locs.uPointerVel) {
        gl.uniform2f(locs.uPointerVel, velocitySmooth.x, velocitySmooth.y);
      }
      if (locs.uPointerStrength) {
        gl.uniform1f(
          locs.uPointerStrength,
          subtle ? presence * SUBTLE_POINTER_STRENGTH : presence,
        );
      }
      const liveIntensity = subtle
        ? intensity + (INTENSITY_SUBTLE_HOVER - intensity) * presence
        : intensity;
      if (locs.uIntensity) gl.uniform1f(locs.uIntensity, liveIntensity);
      if (locs.uSeed) gl.uniform1f(locs.uSeed, seed);
      if (locs.uCardMode) gl.uniform1f(locs.uCardMode, subtle ? 1 : 0);
      for (let i = 0; i < WAKE_LEN; i++) {
        const loc = locs.uWake[i];
        if (loc) {
          const base = i * 3;
          gl.uniform3f(loc, wake[base], wake[base + 1], wake[base + 2]);
        }
      }

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const shouldAnimate = () =>
      !contextLost &&
      !reducedMotion &&
      onScreen &&
      pageVisible &&
      resources !== null;

    const stopLoop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!shouldAnimate()) return;

      // Idle drift does not need 60fps — throttle when the pointer is quiet.
      if (!isPointerActive(now) && now - lastDrawTs < idleFrameMs) {
        raf = requestAnimationFrame(frame);
        return;
      }

      const dt = Math.min((now - lastTs) / 1000, 1 / 20);
      lastTs = now;
      lastDrawTs = now;
      draw(dt);
      raf = requestAnimationFrame(frame);
    };

    const ensureLoop = () => {
      if (shouldAnimate() && raf === 0) {
        lastTs = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const renderStatic = () => {
      stopLoop();
      draw(0);
    };

    const syncMotionMode = () => {
      if (reducedMotion) {
        renderStatic();
      } else {
        ensureLoop();
      }
    };

    resize();
    syncMotionMode();

    const ro = new ResizeObserver(() => {
      if (reducedMotion || !shouldAnimate()) {
        renderStatic();
      } else {
        resize();
      }
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        onScreen = entry ? entry.isIntersecting : true;
        if (onScreen) ensureLoop();
        else stopLoop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      pageVisible = document.visibilityState !== "hidden";
      if (pageVisible) ensureLoop();
      else stopLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      reducedMotion = motionMq.matches;
      syncMotionMode();
    };
    if (typeof motionMq.addEventListener === "function") {
      motionMq.addEventListener("change", onMotionChange);
    } else {
      motionMq.addListener(onMotionChange);
    }

    const onPointerMove = (e: PointerEvent) => {
      const uv = clientToUv(e.clientX, e.clientY);
      pointerTarget.x = uv.x;
      pointerTarget.y = uv.y;
      pointerInside = uv.inside;
      if (uv.inside) lastPointerActivity = performance.now();
    };

    const onPointerOut = (e: PointerEvent) => {
      if (e.relatedTarget === null) {
        pointerInside = false;
      }
    };

    const onDocumentLeave = () => {
      pointerInside = false;
    };

    const host = subtle ? canvas.parentElement : null;

    const onHostPointerEnter = (e: PointerEvent) => {
      const uv = clientToUv(e.clientX, e.clientY);
      pointerTarget.x = uv.x;
      pointerTarget.y = uv.y;
      pointerInside = true;
      lastPointerActivity = performance.now();
      ensureLoop();
    };

    const onHostPointerMove = (e: PointerEvent) => {
      const uv = clientToUv(e.clientX, e.clientY);
      pointerTarget.x = uv.x;
      pointerTarget.y = uv.y;
      pointerInside = true;
      lastPointerActivity = performance.now();
    };

    const onHostPointerLeave = () => {
      pointerInside = false;
    };

    if (subtle && host) {
      host.addEventListener("pointerenter", onHostPointerEnter, {
        passive: true,
      });
      host.addEventListener("pointermove", onHostPointerMove, {
        passive: true,
      });
      host.addEventListener("pointerleave", onHostPointerLeave, {
        passive: true,
      });
    } else if (!subtle) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerout", onPointerOut, { passive: true });
      document.documentElement.addEventListener(
        "mouseleave",
        onDocumentLeave,
        { passive: true },
      );
    }

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      stopLoop();
    };

    const onContextRestored = () => {
      contextLost = false;
      disposeResources(gl, resources);
      resources = buildResources(gl);
      if (!resources) return;
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      syncMotionMode();
    };

    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (typeof motionMq.removeEventListener === "function") {
        motionMq.removeEventListener("change", onMotionChange);
      } else {
        motionMq.removeListener(onMotionChange);
      }
      if (subtle && host) {
        host.removeEventListener("pointerenter", onHostPointerEnter);
        host.removeEventListener("pointermove", onHostPointerMove);
        host.removeEventListener("pointerleave", onHostPointerLeave);
      } else if (!subtle) {
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerout", onPointerOut);
        document.documentElement.removeEventListener(
          "mouseleave",
          onDocumentLeave,
        );
      }
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      disposeResources(gl, resources);
      resources = null;
      // Deliberately not calling WEBGL_lose_context here: getContext() hands back
      // the same context object for a given canvas, so forcing the loss would
      // leave a permanently dead context behind on any remount (Strict Mode).
    };
  }, [subtle, intensity, dprCap, idleFrameMs, seed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={CANVAS_STYLE}
      aria-hidden
    />
  );
}
