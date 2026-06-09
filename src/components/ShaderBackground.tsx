import { useEffect, useRef } from 'react';

// רקע WebGL חי מאחורי כל העמוד: אובך זהב עולה + גחליליות מנצנצות,
// והסמן (או האצבע) הוא זרקור חם. כשאף אחד לא מצביע, האור משוטט לבד.
// יעילות: רזולוציה מוגבלת (DPR ≤ 0.66, ≤ 1.2MP), משולש אחד, low-power,
// עוצר כשהטאב מוסתר; reduced-motion / אין-WebGL → נשאר הרקע הסטטי.

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_t;
uniform vec2 u_mouse;
uniform float u_mon;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.,0.)), u.x),
             mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = r * p * 2.07;
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = uv * vec2(aspect, 1.0) * 2.0;

  // זרימה מופשטת: עיוות-תחום כפול — נימי זהב מתאבכים, בלי חלקיקים
  float t = u_t * 0.05;
  vec2 drift = vec2(0.1 * sin(u_t * 0.05), -u_t * 0.028);
  vec2 q = vec2(fbm(p + drift), fbm(p + vec2(3.1, 1.7) - drift * 0.8));
  vec2 w = vec2(fbm(p + 2.3 * q + vec2(1.3, 9.1) + t * 0.7),
                fbm(p + 2.3 * q + vec2(8.2, 2.4) - t * 0.5));
  float flow = fbm(p + 2.5 * w);

  // בסיס כהה תואם לאתר (#0B0B0B); הזרימה מרימה אותו בשכבות זהב
  vec3 gold = vec3(0.789, 0.659, 0.416);   // --gold #C9A86A
  vec3 champagne = vec3(0.886, 0.788, 0.549); // --gold-2 #E2C98C
  vec3 col = vec3(0.043, 0.043, 0.043);
  col += gold * 0.075 * smoothstep(0.3, 0.9, flow);
  col += champagne * 0.06 * pow(smoothstep(0.5, 1.0, flow * flow * 1.5), 2.0);
  // רכסים דקים — קווי אור חמקמקים בתוך הזרימה
  float ridge = 1.0 - abs(flow * 2.0 - 1.0);
  col += champagne * 0.035 * pow(ridge, 6.0) * smoothstep(0.2, 0.7, q.x);

  // זרקור חם שעוקב אחרי הסמן
  vec2 m = u_mouse / u_res;
  m.x *= aspect;
  vec2 pa = uv * vec2(aspect, 1.0);
  float d = distance(pa, m);
  col += gold * 0.16 * exp(-d * d * 7.0) * u_mon * (0.4 + 0.6 * haze);
  col += gold * 0.05 * exp(-d * d * 1.4) * u_mon;

  // ויניטה עדינה + דיתר נגד פסים בשחורים
  float vig = smoothstep(1.3, 0.35, distance(uv, vec2(0.5)));
  col *= 0.78 + 0.22 * vig;
  col += (hash(gl_FragCoord.xy + u_t) - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}`;

export function ShaderBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const gl = canvas.getContext('webgl', {
      antialias: false, alpha: false, powerPreference: 'low-power',
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(s)); return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}');
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uT = gl.getUniformLocation(prog, 'u_t');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uMon = gl.getUniformLocation(prog, 'u_mon');

    let scale = 1;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1) * 0.66;
      let w = Math.round(innerWidth * dpr), h = Math.round(innerHeight * dpr);
      const mp = w * h;
      if (mp > 1_200_000) { const k = Math.sqrt(1_200_000 / mp); w = Math.round(w * k); h = Math.round(h * k); }
      canvas.width = w; canvas.height = h;
      scale = w / innerWidth;
      gl.viewport(0, 0, w, h);
    };
    resize();

    const touch = matchMedia('(hover: none)').matches;
    let mx = -1e4, my = -1e4, lastTouch = -1e9;
    const t0 = performance.now();
    const onMouse = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onLeave = () => { if (!touch) { mx = -1e4; my = -1e4; } };
    const onTouch = (e: TouchEvent) => {
      const p = e.touches[0];
      if (p) { mx = p.clientX; my = p.clientY; lastTouch = performance.now(); }
    };
    const pointerActive = () =>
      touch ? performance.now() - lastTouch < 2500 && mx !== -1e4 : mx !== -1e4;

    let smx = innerWidth / 2, smy = innerHeight / 3, monT = 0;
    let running = true, raf = 0;
    const frame = () => {
      if (!running) return;
      const t = (performance.now() - t0) / 1000;
      const active = pointerActive();
      let tx: number, ty: number;
      if (active) { tx = mx; ty = my; }
      else {
        tx = innerWidth * (0.5 + 0.36 * Math.sin(t * 0.19));
        ty = innerHeight * (0.4 + 0.27 * Math.sin(t * 0.131 + 1.7));
      }
      monT += ((active ? 1 : 0.5) - monT) * 0.04;
      smx += (tx - smx) * (active ? 0.07 : 0.016);
      smy += (ty - smy) * (active ? 0.07 : 0.016);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.uniform2f(uMouse, smx * scale, canvas.height - smy * scale);
      gl.uniform1f(uMon, monT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(frame);
    };

    addEventListener('mousemove', onMouse, { passive: true });
    addEventListener('mouseleave', onLeave);
    addEventListener('touchstart', onTouch, { passive: true });
    addEventListener('touchmove', onTouch, { passive: true });
    addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(frame);
    canvas.classList.add('on');

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('mousemove', onMouse);
      removeEventListener('mouseleave', onLeave);
      removeEventListener('touchstart', onTouch);
      removeEventListener('touchmove', onTouch);
      removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas id="bg-shader" ref={ref} aria-hidden="true" />;
}
