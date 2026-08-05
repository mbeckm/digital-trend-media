"use client";

import { useEffect, useRef } from "react";
import { FRAG_SRC, VERT_SRC } from "./cloudsParallax.glsl";

export type CloudsProps = { className?: string };

const WAKE_LEN = 12;
const POINTER_EASE_IN = 3.2;
const POINTER_EASE_OUT = 2.4;
const CURSOR_SMOOTH = 10;
const VEL_SMOOTH = 8;
const WAKE_SPAWN_DIST = 0.035;
const WAKE_MAX_AGE = 1.4;

type GlResources = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  buffer: WebGLBuffer;
  uniforms: {
    res: WebGLUniformLocation | null;
    time: WebGLUniformLocation | null;
    cursor: WebGLUniformLocation | null;
    cursorVel: WebGLUniformLocation | null;
    pointerStrength: WebGLUniformLocation | null;
    wake: WebGLUniformLocation | null;
    wakeAge: WebGLUniformLocation | null;
  };
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

function destroyResources(res: GlResources | null) {
  if (!res) return;
  const { gl, program, buffer } = res;
  gl.deleteBuffer(buffer);
  gl.deleteProgram(program);
  // Deliberately not calling WEBGL_lose_context here: getContext() hands back
  // the same context object for a given canvas, so forcing the loss would
  // leave a permanently dead context behind on any remount (Strict Mode).
}

function buildResources(canvas: HTMLCanvasElement): GlResources | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });
  if (!gl) return null;

  const program = createProgram(gl, VERT_SRC, FRAG_SRC);
  if (!program) return null;

  const buffer = gl.createBuffer();
  if (!buffer) {
    gl.deleteProgram(program);
    return null;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const aPos = gl.getAttribLocation(program, "a_pos");
  if (aPos < 0) {
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    return null;
  }
  gl.useProgram(program);
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  return {
    gl,
    program,
    buffer,
    uniforms: {
      res: gl.getUniformLocation(program, "u_res"),
      time: gl.getUniformLocation(program, "u_time"),
      cursor: gl.getUniformLocation(program, "u_cursor"),
      cursorVel: gl.getUniformLocation(program, "u_cursorVel"),
      pointerStrength: gl.getUniformLocation(program, "u_pointerStrength"),
      wake: gl.getUniformLocation(program, "u_wake[0]"),
      wakeAge: gl.getUniformLocation(program, "u_wakeAge[0]"),
    },
  };
}

function mergeClassName(base: string, extra?: string) {
  return extra ? `${base} ${extra}` : base;
}

export function CloudsParallax({ className }: CloudsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasNode = canvasRef.current;
    if (canvasNode === null) return;

    let resources: GlResources | null = null;
    let raf = 0;
    let running = false;
    let visible = true;
    let pageVisible = document.visibilityState !== "hidden";
    let reducedMotion = false;
    let disposed = false;

    let width = 0;
    let height = 0;
    let dpr = 1;

    let time = 0;
    let lastTs = 0;

    let cursorTargetX = 0.5;
    let cursorTargetY = 0.5;
    let cursorX = 0.5;
    let cursorY = 0.5;
    let velX = 0;
    let velY = 0;
    let pointerInside = false;
    let pointerStrength = 0;

    const wakeX = new Float32Array(WAKE_LEN);
    const wakeY = new Float32Array(WAKE_LEN);
    const wakeAge = new Float32Array(WAKE_LEN);
    for (let i = 0; i < WAKE_LEN; i++) wakeAge[i] = -1;
    let lastWakeX = 0.5;
    let lastWakeY = 0.5;

    const wakeFlat = new Float32Array(WAKE_LEN * 2);

    const prefersMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function resize() {
      if (!resources || disposed) return;
      const el = canvasRef.current;
      if (el === null) return;
      const rect = el.getBoundingClientRect();
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(0, Math.floor(rect.width * nextDpr));
      const h = Math.max(0, Math.floor(rect.height * nextDpr));
      if (w === 0 || h === 0) return;
      if (w === width && h === height && nextDpr === dpr) return;
      width = w;
      height = h;
      dpr = nextDpr;
      el.width = w;
      el.height = h;
      resources.gl.viewport(0, 0, w, h);
    }

    function pushWake(x: number, y: number) {
      const dx = x - lastWakeX;
      const dy = y - lastWakeY;
      if (dx * dx + dy * dy < WAKE_SPAWN_DIST * WAKE_SPAWN_DIST) return;
      lastWakeX = x;
      lastWakeY = y;
      for (let i = WAKE_LEN - 1; i > 0; i--) {
        wakeX[i] = wakeX[i - 1];
        wakeY[i] = wakeY[i - 1];
        wakeAge[i] = wakeAge[i - 1];
      }
      wakeX[0] = x;
      wakeY[0] = y;
      wakeAge[0] = 0;
    }

    function ageWake(dt: number) {
      for (let i = 0; i < WAKE_LEN; i++) {
        if (wakeAge[i] < 0) continue;
        wakeAge[i] += dt;
        if (wakeAge[i] > WAKE_MAX_AGE) wakeAge[i] = -1;
      }
    }

    function draw() {
      if (!resources || disposed) return;
      if (width === 0 || height === 0) return;
      const { gl, uniforms } = resources;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(resources.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, resources.buffer);

      gl.uniform2f(uniforms.res, width, height);
      gl.uniform1f(uniforms.time, time);
      gl.uniform2f(uniforms.cursor, cursorX, cursorY);
      gl.uniform2f(uniforms.cursorVel, velX, velY);
      gl.uniform1f(uniforms.pointerStrength, pointerStrength);

      for (let i = 0; i < WAKE_LEN; i++) {
        wakeFlat[i * 2] = wakeX[i];
        wakeFlat[i * 2 + 1] = wakeY[i];
      }
      if (uniforms.wake) gl.uniform2fv(uniforms.wake, wakeFlat);
      if (uniforms.wakeAge) gl.uniform1fv(uniforms.wakeAge, wakeAge);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function stopLoop() {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    function frame(ts: number) {
      if (!running || disposed) return;
      raf = requestAnimationFrame(frame);

      if (!lastTs) lastTs = ts;
      const dt = Math.min((ts - lastTs) / 1000, 1 / 30);
      lastTs = ts;
      time += dt;

      const ease = 1 - Math.exp(-CURSOR_SMOOTH * dt);
      const prevX = cursorX;
      const prevY = cursorY;
      cursorX += (cursorTargetX - cursorX) * ease;
      cursorY += (cursorTargetY - cursorY) * ease;

      const instVelX = dt > 0 ? (cursorX - prevX) / dt : 0;
      const instVelY = dt > 0 ? (cursorY - prevY) / dt : 0;
      const velEase = 1 - Math.exp(-VEL_SMOOTH * dt);
      velX += (instVelX - velX) * velEase;
      velY += (instVelY - velY) * velEase;

      const targetStrength = pointerInside ? 1 : 0;
      const strengthRate = pointerInside ? POINTER_EASE_IN : POINTER_EASE_OUT;
      pointerStrength +=
        (targetStrength - pointerStrength) *
        (1 - Math.exp(-strengthRate * dt));
      if (!pointerInside && pointerStrength < 0.001) {
        pointerStrength = 0;
        velX *= Math.exp(-4 * dt);
        velY *= Math.exp(-4 * dt);
      }

      if (pointerInside && pointerStrength > 0.05) {
        pushWake(cursorX, cursorY);
      }
      ageWake(dt);

      draw();
    }

    function startLoop() {
      if (disposed || reducedMotion || !resources) return;
      if (!visible || !pageVisible) return;
      if (running) return;
      running = true;
      lastTs = 0;
      raf = requestAnimationFrame(frame);
    }

    function syncMotionPreference() {
      reducedMotion = prefersMotion.matches;
      if (reducedMotion) {
        stopLoop();
        pointerStrength = 0;
        velX = 0;
        velY = 0;
        draw();
      } else {
        startLoop();
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (disposed) return;
      const el = canvasRef.current;
      if (el === null) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      pointerInside = inside;
      if (inside) {
        cursorTargetX = x;
        cursorTargetY = y;
      }
    }

    function onPointerLeave() {
      pointerInside = false;
    }

    function onVisibility() {
      pageVisible = document.visibilityState !== "hidden";
      if (pageVisible) startLoop();
      else stopLoop();
    }

    function onContextLost(e: Event) {
      e.preventDefault();
      stopLoop();
      resources = null;
    }

    function onContextRestored() {
      if (disposed) return;
      const el = canvasRef.current;
      if (el === null) return;
      resources = buildResources(el);
      if (!resources) return;
      width = 0;
      height = 0;
      resize();
      syncMotionPreference();
    }

    resources = buildResources(canvasNode);
    if (!resources) return;

    resize();

    const ro = new ResizeObserver(() => {
      resize();
      if (reducedMotion) draw();
    });
    ro.observe(canvasNode);

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        visible = entry ? entry.isIntersecting : false;
        if (visible) startLoop();
        else stopLoop();
      },
      { threshold: 0.01 },
    );
    io.observe(canvasNode);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    // Leaves the document; leaving the hero is handled by the rect test in onPointerMove.
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    canvasNode.addEventListener("webglcontextlost", onContextLost);
    canvasNode.addEventListener("webglcontextrestored", onContextRestored);

    const onMotionChange = () => syncMotionPreference();
    if (typeof prefersMotion.addEventListener === "function") {
      prefersMotion.addEventListener("change", onMotionChange);
    } else {
      prefersMotion.addListener(onMotionChange);
    }

    syncMotionPreference();
    if (reducedMotion) draw();
    else startLoop();

    return () => {
      disposed = true;
      stopLoop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      canvasNode.removeEventListener("webglcontextlost", onContextLost);
      canvasNode.removeEventListener("webglcontextrestored", onContextRestored);
      if (typeof prefersMotion.removeEventListener === "function") {
        prefersMotion.removeEventListener("change", onMotionChange);
      } else {
        prefersMotion.removeListener(onMotionChange);
      }
      destroyResources(resources);
      resources = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={mergeClassName(
        "absolute inset-0 block h-full w-full pointer-events-none",
        className,
      )}
      aria-hidden
    />
  );
}
