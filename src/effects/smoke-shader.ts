// The gold smoke fragment shader (GLSL ES 1.0), run by smoke.ts on a full-screen
// triangle. Tuning constants for the spotlight are inside main().
export const SMOKE_FRAG = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
/* Gold smoke in a studio spotlight.
   Soft smoke drifts up; a beam of warm light from the top corner and the
   visitor's cursor make it visible. Everything is computed as one light value
   L, then toned from umber to gold to champagne, so the colour stays warm
   instead of turning olive. Grain + dither keep the darks clean. */
uniform vec2 u_res;      /* canvas size in px */
uniform float u_t;       /* seconds */
uniform vec2 u_mouse;    /* light position in canvas px (smoothed) */
uniform float u_mon;     /* pointer light strength, 0..1.6 */
uniform float u_scroll;  /* page progress, 0..1 */
uniform float u_flow;    /* smoothed scroll speed, 0..1 */

/* "Hash without sine" (Dave Hoskins). The older fract(p * 123.34) hash broke
   into flat triangular shards on some GPUs (Intel via ANGLE/Metal), turning the
   smoke into broken glass; this one stays smooth everywhere. */
float hash(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = r * p * 2.03; a *= 0.5; }
  return v / 0.875;
}
/* Interleaved gradient noise (Jimenez): cheap per-pixel noise for dithering. */
float ign(vec2 p){ return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }

/* Soft smoke: one gentle domain warp (noise bending noise). A low warp keeps it
   flowing like smoke; a strong one would fold it into marble. It drifts up. */
float smoke(vec2 p, float t){
  /* drift up over time; the (4.3, 2.7) start keeps it away from the noise
     origin, where the field is almost empty */
  vec2 rise = vec2(4.3 + t * 0.012, 2.7 - t * 0.035 - u_scroll * 0.6);
  return fbm(p + 1.3 * fbm(p + rise) + rise);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);           /* aspect-correct, 1 unit = viewport height */
  float t = u_t;

  /* Studio spotlight: one soft beam from the top corner, swaying slowly. Smoke
     shows mostly where the beam falls on it. Tuning, wide screen vs portrait
     (phones: narrower and quieter, the text sits right on it): */
  bool wide = aspect > 1.0;
  vec2 src = vec2(aspect * (wide ? 0.97 : 0.80), wide ? 1.30 : 1.28); /* where the light comes from */
  float slant = wide ? -0.55 : -0.28;            /* how far the beam leans */
  float edge = wide ? 0.90 : 0.93;               /* beam width: higher = narrower */
  float gain = wide ? 1.45 : 0.45;               /* beam brightness */

  float sway = 0.10 * sin(t * 0.07) + 0.12 * u_scroll;
  vec2 dir = normalize(vec2(slant - sway, -1.0));
  vec2 v = p - src;
  float along = dot(v, dir);
  float spread = dot(normalize(v), dir);         /* 1 on the beam's axis */
  float beam = gain * pow(smoothstep(edge, 0.999, spread), 1.6) * exp(-along * 0.5) * step(0.0, along);

  vec2 m = u_mouse / u_res.y;
  float dm = distance(p, m);
  float ptrL = exp(-dm * dm * 5.0) * u_mon;

  float d = smoke(p * 1.7, t);
  float puff = smoothstep(0.30, 0.85, d);

  float L = 0.0;
  L += beam * (0.025 + 0.05 * puff + 0.13 * puff * puff); /* the beam, made visible by the smoke */
  L += ptrL * (0.015 + 0.14 * puff);             /* the cursor is a second, smaller light */
  L += 0.012 * puff;                             /* a faint haze everywhere else */
  L *= 1.0 + 0.4 * u_flow;                       /* scrolling stirs it a little */

  /* Tone: soft-shoulder exposure, then umber -> gold -> champagne by intensity. */
  float e = 1.0 - exp(-L * 2.4);
  vec3 umber = vec3(0.46, 0.29, 0.12);
  vec3 gold = vec3(0.79, 0.66, 0.42);
  vec3 champ = vec3(0.98, 0.91, 0.74);
  vec3 amber = vec3(0.74, 0.53, 0.24);
  vec3 tint = mix(umber, amber, smoothstep(0.03, 0.22, e));
  tint = mix(tint, gold, smoothstep(0.22, 0.45, e));
  tint = mix(tint, champ, smoothstep(0.45, 0.85, e));
  vec3 col = vec3(0.043) + tint * e;

  float vig = smoothstep(1.35, 0.35, distance(uv, vec2(0.5)));
  col *= 0.80 + 0.20 * vig;

  /* Film grain (moving, a touch stronger in the light) + triangular dither. */
  col += (hash(gl_FragCoord.xy + fract(t * 7.13) * 91.7) - 0.5) * (0.010 + 0.05 * e);
  col += (ign(gl_FragCoord.xy) + ign(gl_FragCoord.xy + 17.0) - 1.0) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
`;
