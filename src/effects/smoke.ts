// Gold smoke WebGL background on <canvas id="bg-shader">.
// Soft smoke drifts up through a warm spotlight from the top corner; the cursor
// is a second light (on phones the light follows the scroll and a tap sends a
// pulse). Scrolling stirs the smoke a little.
// Cost guards: the canvas renders at 0.66 of CSS pixels (DPR capped at 1) and at
// most 1.2 megapixels; when nothing moves it draws every other frame; it pauses
// in a hidden tab and while a popup (<dialog>) is open. With no WebGL or with
// reduced motion the static CSS background stays; a lost WebGL context recovers.
import { isTouch, pointer, pointerActive, prefersReducedMotion, scrollProgress } from './core';
import { SMOKE_FRAG } from './smoke-shader';

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const UNIFORMS = ['u_res', 'u_t', 'u_mouse', 'u_mon', 'u_scroll', 'u_flow'] as const;
const MAX_PIXELS = 1_200_000;

const dialogOpen = () => document.querySelector('dialog[open]') !== null;

export function smoke(signal: AbortSignal) {
  const reduced = prefersReducedMotion();
  const canvas = document.getElementById('bg-shader');
  if (reduced.matches || !(canvas instanceof HTMLCanvasElement)) return;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return;
  const touch = isTouch();
  const U = {} as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (gl.getShaderParameter(s, gl.COMPILE_STATUS)) return s;
    console.warn(gl.getShaderInfoLog(s));
    return null;
  };
  const setup = () => {
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, SMOKE_FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return false;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); // one triangle covers the screen
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const n of UNIFORMS) U[n] = gl.getUniformLocation(prog, n);
    return true;
  };
  if (!setup()) return;

  let scale = 1; // canvas px per CSS px
  const resize = (force = false) => {
    const dpr = Math.min(devicePixelRatio || 1, 1) * 0.66;
    let w = Math.round(innerWidth * dpr);
    let h = Math.round(innerHeight * dpr);
    if (w * h > MAX_PIXELS) {
      const k = Math.sqrt(MAX_PIXELS / (w * h));
      w = Math.round(w * k);
      h = Math.round(h * k);
    }
    scale = w / innerWidth;
    if (!force && w === canvas.width && h === canvas.height) return; // resizing the canvas clears it
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.u_res, w, h);
  };
  resize(true);

  const t0 = performance.now();
  let pulse = 0;
  let lastY = scrollY;
  let flow = 0; // smoothed scroll speed
  let frameN = 0;
  let lx = innerWidth / 2; // smoothed light position
  let ly = innerHeight / 3;
  let strength = 0;
  let visible = !document.hidden;
  let lost = false;
  let looping = false;

  const frame = () => {
    if (signal.aborted || !visible || lost || dialogOpen()) {
      looping = false;
      return;
    }
    requestAnimationFrame(frame);
    const now = performance.now();
    const t = (now - t0) / 1000;
    const active = pointerActive(2500);
    const sy = scrollProgress();
    flow += (Math.min(1, Math.abs(scrollY - lastY) / 40) - flow) * 0.08;
    lastY = scrollY;
    // Idle (no pointer movement for 2s, no scrolling): draw every other frame.
    const idle = now - pointer.lastMove > 2000 && flow < 0.01 && pulse < 0.01;
    if (idle && frameN++ & 1) return;

    let tx: number;
    let ty: number;
    if (active) {
      tx = pointer.x;
      ty = pointer.y;
    } else if (touch) {
      tx = innerWidth * (0.5 + 0.3 * Math.sin(sy * 9.42 + t * 0.12));
      ty = innerHeight * (0.18 + 0.64 * sy + 0.06 * Math.sin(t * 0.2));
    } else {
      tx = innerWidth * (0.5 + 0.36 * Math.sin(t * 0.19));
      ty = innerHeight * (0.4 + 0.27 * Math.sin(t * 0.131 + 1.7));
    }
    pulse *= 0.965;
    strength += ((active ? 1 : touch ? 0.62 : 0.5) - strength) * 0.04;
    const ease = active ? 0.07 : 0.022;
    lx += (tx - lx) * ease;
    ly += (ty - ly) * ease;

    gl.uniform1f(U.u_t, t);
    gl.uniform2f(U.u_mouse, lx * scale, canvas.height - ly * scale);
    gl.uniform1f(U.u_mon, Math.min(1.6, strength + pulse * 0.9));
    gl.uniform1f(U.u_scroll, sy);
    gl.uniform1f(U.u_flow, flow);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const start = () => {
    if (looping) return;
    looping = true;
    requestAnimationFrame(frame);
  };

  const opts = { signal };
  addEventListener('touchstart', () => (pulse = 1), { passive: true, signal }); // a tap sends a pulse of light
  addEventListener('resize', () => resize(), opts);
  document.addEventListener('close', start, { capture: true, signal }); // a popup closed (close doesn't bubble)
  document.addEventListener(
    'visibilitychange',
    () => {
      visible = !document.hidden;
      if (visible) start();
    },
    opts,
  );
  canvas.addEventListener(
    'webglcontextlost',
    (e) => {
      e.preventDefault();
      lost = true;
      canvas.classList.remove('on');
    },
    opts,
  );
  canvas.addEventListener(
    'webglcontextrestored',
    () => {
      lost = false;
      if (!setup()) return;
      resize(true);
      canvas.classList.add('on');
      start();
    },
    opts,
  );
  // Reduced motion switched on mid-visit: stop and fade back to the static background.
  const stop = () => {
    lost = true;
    canvas.classList.remove('on');
  };
  reduced.addEventListener('change', () => reduced.matches && stop(), opts);
  signal.addEventListener('abort', stop);

  start();
  canvas.classList.add('on');
}
