/*
 * Shadery silnika glifów (GLSL ES 3.00, WebGL2). Trzy przebiegi:
 *
 * TONE — tekstura w rozdzielczości pod-komórek (2 × 4 na komórkę): średnia
 *   luminancji źródła z mipmap, maska (alfa źródła) i gęstość krawędzi.
 *   Źródłem bywa obraz, klatka wideo, maska tekstu albo bryła SDF.
 * CELL — jedna próbka na komórkę siatki: pole animacji (bez stanu — czas,
 *   postęp, losowość komórki), soczewka, wybór glifu. ASCII i bloki dobierają
 *   glif do KSZTAŁTU (wektor 2 × 4 pokrycia glifu kontra ton komórki), więc
 *   ukośne krawędzie twarzy rysują „/”, a nie losową literę. Wynik: indeks
 *   glifu, krycie, kolor, papier — dwie tekstury RGBA8.
 * GLYPH — pełna rozdzielczość: piksel czyta swoją komórkę i glif z atlasu
 *   (`texelFetch`, bez filtrowania). Klatka zawsze powstaje w całości — nie ma
 *   prostokątów do czyszczenia, więc nie ma też śladów ani „dziur”.
 */

export const VERTEX = /* glsl */ `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const COMMON = /* glsl */ `
uint pcg(uvec3 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
  return v.x;
}
float rnd(ivec2 c, float salt) {
  return float(pcg(uvec3(uvec2(c + 8192), uint(salt)))) / 4294967295.0;
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  ivec2 c = ivec2(i);
  float a = rnd(c, 91.0), b = rnd(c + ivec2(1, 0), 91.0);
  float d = rnd(c + ivec2(0, 1), 91.0), e = rnd(c + ivec2(1, 1), 91.0);
  return mix(mix(a, b, u.x), mix(d, e, u.x), u.y);
}
float fbm(vec2 p) {
  return 0.55 * vnoise(p) + 0.3 * vnoise(p * 2.03 + 17.1) + 0.15 * vnoise(p * 4.01 + 3.7);
}
`

export const TONE = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
uniform sampler2D uSrc;
uniform sampler2D uEdge;
uniform int uKind;          // 0 obraz/wideo, 1 maska tekstu, 2 bryła SDF, 3 pusto
uniform vec2 uRes;          // rozmiar tekstury tonu
uniform vec4 uMap;          // uv źródła = xy + p * zw (p: 0…1 obszaru siatki, od góry)
uniform vec2 uSrcSize;      // źródło w pikselach
uniform vec2 uFade;         // wygaszenie w dół (uv.y źródła): początek, koniec
uniform vec4 uFadeX;        // wygaszenie na boki (uv.x źródła): lewo od–do, prawo od–do
uniform float uHasEdge;
uniform float uEdgeBoost;
uniform float uAutoEdge;    // krawędzie z gradientu obrazu (zrzuty interfejsów: widać układ strony)
uniform vec4 uDodge[2];     // rozjaśnienie (uv: x, y, promień x, promień y) — oczodoły
uniform float uDodgeK;
uniform float uAspect;      // szerokość / wysokość obszaru siatki (bryły)
uniform mat3 uRot;
uniform int uShape;         // 0 kostka, 1 torus, 2 kropla
uniform float uTime;
out vec4 outColor;
${COMMON}
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

float sdBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}
float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}
float scene(vec3 p) {
  p = uRot * p;
  if (uShape == 0) return sdBox(p, vec3(0.6), 0.07);
  if (uShape == 1) return sdTorus(p, vec2(0.72, 0.31));
  float wobble = 0.09 * sin(p.x * 4.0 + uTime * 1.3) * sin(p.y * 3.6 - uTime * 1.1) * sin(p.z * 4.2 + uTime * 0.9);
  return length(p) - 0.86 + wobble;
}
vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.002, 0.0);
  return normalize(vec3(
    scene(p + e.xyy) - scene(p - e.xyy),
    scene(p + e.yxy) - scene(p - e.yxy),
    scene(p + e.yyx) - scene(p - e.yyx)));
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uRes;
  if (uKind == 3) {
    outColor = vec4(1.0, 1.0, 0.0, 1.0);
    return;
  }
  if (uKind == 2) {
    vec2 q = (p - 0.5) * vec2(uAspect, 1.0) * 1.8;
    q.y = -q.y;
    vec3 ro = vec3(0.0, 0.0, 3.4);
    vec3 rd = normalize(vec3(q, -2.6));
    // Kula ograniczająca: promień, który jej nie trafia, nie jest w ogóle śledzony.
    float bq = dot(ro, rd);
    float disc = bq * bq - dot(ro, ro) + 1.3 * 1.3;
    if (disc < 0.0) { outColor = vec4(1.0, 0.0, 0.0, 1.0); return; }
    float t = max(0.0, -bq - sqrt(disc));
    float hit = 0.0;
    for (int i = 0; i < 40; i++) {
      float d = scene(ro + rd * t);
      if (d < 0.0015) { hit = 1.0; break; }
      t += d * 0.9;
      if (t > 7.0) break;
    }
    if (hit < 0.5) { outColor = vec4(1.0, 0.0, 0.0, 1.0); return; }
    vec3 pos = ro + rd * t;
    vec3 n = normalAt(pos);
    // Światło głównie z góry i z lewa: górna ściana jasna, boczne w dwóch różnych tonach.
    vec3 l = normalize(vec3(-0.45, 0.85, 0.28));
    float diff = max(dot(n, l), 0.0);
    float spec = pow(max(dot(reflect(-l, n), -rd), 0.0), 26.0);
    float rim = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
    float fill = max(dot(n, normalize(vec3(0.8, 0.1, 0.6))), 0.0);
    float light = clamp(0.02 + 0.92 * diff + (uShape == 0 ? 0.06 : 0.22) * fill + 0.3 * spec, 0.0, 1.0);
    // Najjaśniejsza ściana dalej ma lekkie glify — bryła nie traci konturu.
    // Krawędzie ścian kostki (dwie współrzędne naraz przy ścianie) — w kanale alfa.
    float faceEdge = 0.0;
    if (uShape == 0) {
      vec3 q = 0.6 - abs(uRot * pos);
      float lo = min(q.x, min(q.y, q.z));
      float hi = max(q.x, max(q.y, q.z));
      float mid = q.x + q.y + q.z - lo - hi;
      faceEdge = 1.0 - smoothstep(0.07, 0.12, mid);
    }
    outColor = vec4(mix(0.14, 0.88, light), 1.0, rim, 1.0 - faceEdge);
    return;
  }
  vec2 uv = uMap.xy + p * uMap.zw;
  vec2 span = uMap.zw * uSrcSize / uRes;
  float lod = max(0.0, log2(max(span.x, span.y)) - 0.5);
  vec4 c = textureLod(uSrc, uv, lod);
  float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  if (uKind == 1) {
    outColor = vec4(c.a * inside, 1.0, 0.0, 1.0);
    return;
  }
  float mask = c.a * inside;
  float lum = c.a > 0.002 ? luma(c.rgb / c.a) : 1.0;
  // Dół wygasa wcześniej przy bokach (miękki owal zamiast prostej krawędzi kurtki).
  float side = max(0.0, abs(uv.x - 0.5 * (uFadeX.y + uFadeX.z)) - 0.14) * step(-1.5, uFadeX.x);
  mask *= 1.0 - smoothstep(uFade.x - side, uFade.y - side * 0.6, uv.y);
  mask *= smoothstep(uFadeX.x, uFadeX.y, uv.x) * (1.0 - smoothstep(uFadeX.z, uFadeX.w, uv.x));
  float edge = 0.0;
  if (uHasEdge > 0.5) edge = clamp(textureLod(uEdge, uv, lod).a * 2.6, 0.0, 1.0) * inside;
  else if (uAutoEdge > 0.0) {
    vec2 dx = vec2(uMap.z / uRes.x, 0.0);
    vec2 dy = vec2(0.0, uMap.w / uRes.y);
    float gx = luma(textureLod(uSrc, uv + dx, lod).rgb) - luma(textureLod(uSrc, uv - dx, lod).rgb);
    float gy = luma(textureLod(uSrc, uv + dy, lod).rgb) - luma(textureLod(uSrc, uv - dy, lod).rgb);
    edge = clamp(length(vec2(gx, gy)) * uAutoEdge, 0.0, 1.0) * inside;
  }
  lum = clamp(lum - uEdgeBoost * edge, 0.0, 1.0);
  if (uDodgeK > 0.0) {
    // Retusz jak w ciemni: cień wokół oczu jaśnieje, tęczówka i biel oka zostają.
    float k = 0.0;
    for (int i = 0; i < 2; i++) {
      vec2 q = (uv - uDodge[i].xy) / uDodge[i].zw;
      k = max(k, exp(-dot(q, q) * 1.6));
    }
    lum += uDodgeK * k * smoothstep(0.08, 0.42, lum) * (1.0 - lum);
  }
  outColor = vec4(lum, mask, edge, 1.0);
}
`

export const CELL = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
uniform sampler2D uTone;
uniform sampler2D uShapes;   // wektory kształtu glifów: (glif, 0) = pod-komórki 0–3, (glif, 1) = 4–7
uniform ivec2 uGrid;
uniform vec2 uCellPx;        // komórka w px urządzenia
uniform vec2 uOrigin;
uniform int uRamp;
uniform int uLines;
uniform int uDither;         // 1 — Braille (punkty rastrowane osobno)
uniform int uMatch;          // 1 — glif dobierany do kształtu
uniform int uRandom;         // 1 — glif losowy, ton w kryciu
uniform vec2 uCurve;
uniform float uTime;
uniform float uStep;
uniform float uFps;
uniform int uMode;           // 0 fala, 1 szum, 2 deszcz, 3 przepływ, 4 rozpad, 5 skaner
uniform int uKind;           // 0 portret, 1 media, 2 soczewka, 3 znak, 4 bryła
uniform float uProgress;
uniform vec2 uFrom;          // początek fali (komórki)
uniform float uReach;        // najdalszy róg od początku fali (komórki, w osi x)
uniform float uPolarity;     // 1 — gęsto tam, gdzie ciemno (tusz na papierze)
uniform vec3 uLevels;        // czerń, biel, gamma
uniform float uCeil;
uniform float uDGamma;       // krzywa gęstości (>1 — półtony jaśnieją, wydruk lżejszy)
uniform float uSharp;
uniform float uAlphaTone;
uniform vec4 uLens;          // x, y (px urządzenia), promień, siła
uniform int uLensMode;       // 0 lupa, 1 odsłona, 2 szum
uniform vec4 uRipple;        // x, y, promień, siła (px urządzenia)
uniform int uRender;         // 0 tonalny, 1 konturowy, 2 mieszany
uniform float uFlicker;
uniform float uIntro;
uniform float uLoop;
uniform float uEdgeInk;      // media: krawędzie obrazu dokładają tuszu
uniform float uFloor;        // media: najmniejsze pokrycie (papier nigdy nie jest pusty)
layout(location = 0) out vec4 outA;
layout(location = 1) out vec4 outB;
${COMMON}

const float BAYER[16] = float[16](0.0, 8.0, 2.0, 10.0, 12.0, 4.0, 14.0, 6.0, 3.0, 11.0, 1.0, 9.0, 15.0, 7.0, 13.0, 5.0);
float bayer(ivec2 c) {
  ivec2 m = c & 3;
  return (BAYER[m.y * 4 + m.x] + 0.5) / 16.0;
}

vec3 toneRaw(vec2 g) {
  vec2 uv = g / vec2(uGrid);
  return texture(uTone, vec2(uv.x, 1.0 - uv.y)).rgb;
}
float levels(float l) {
  float t = clamp((l - uLevels.x) / max(uLevels.y - uLevels.x, 0.001), 0.0, 1.0);
  return pow(t, uLevels.z);
}
float densityAt(vec2 g) {
  vec3 s = toneRaw(g);
  float t = levels(s.r);
  float d = uPolarity > 0.5 ? 1.0 - t : t;
  return pow(d, uDGamma) * s.g * uCeil;
}

/* Osiem pod-komórek (2 kolumny × 4 rzędy) wokół punktu g, w skali komórki s. */
void subcells(vec2 g, float s, out float v[8]) {
  for (int j = 0; j < 4; j++) {
    for (int i = 0; i < 2; i++) {
      vec2 o = vec2((float(i) + 0.5) / 2.0 - 0.5, (float(j) + 0.5) / 4.0 - 0.5) * s;
      v[j * 2 + i] = densityAt(g + o);
    }
  }
}

float order(ivec2 ic, vec2 g) {
  vec2 grid = vec2(uGrid);
  if (uMode == 0) {
    vec2 d = (g - uFrom) * vec2(1.0, uCellPx.y / uCellPx.x);
    return clamp(length(d) / max(uReach, 1.0), 0.0, 1.0);
  }
  if (uMode == 1) return rnd(ic, 7.0);
  if (uMode == 2) return clamp(g.y / grid.y * 0.72 + rnd(ivec2(ic.x, 0), 3.0) * 0.28, 0.0, 1.0);
  if (uMode == 3) return clamp((fbm(g * vec2(0.075, 0.12) + 4.3) - 0.22) / 0.56, 0.0, 1.0);
  if (uMode == 4) return clamp(rnd(ic, 11.0) * 0.6 + g.y / grid.y * 0.4, 0.0, 1.0);
  return clamp(g.y / grid.y, 0.0, 1.0);
}
float band() {
  if (uMode == 0) return 0.16;
  if (uMode == 1) return 0.3;
  if (uMode == 2) return 0.22;
  if (uMode == 3) return 0.2;
  if (uMode == 4) return 0.32;
  return 0.05;
}
float revealAt(float d, float p) {
  float b = band();
  return clamp((p * (1.0 + b) - d) / b, 0.0, 1.0);
}

/* Deszcz: jasność śladu kropli w komórce i czy to głowa kropli. */
vec2 rain(ivec2 ic) {
  float speed = 7.0 + 15.0 * rnd(ivec2(ic.x, 1), 5.0);
  float trail = 7.0 + 18.0 * rnd(ivec2(ic.x, 2), 5.0);
  float span = float(uGrid.y) + trail + 10.0 * rnd(ivec2(ic.x, 3), 5.0);
  float t = uStep / max(uFps, 1.0);
  float head = floor(mod(t * speed + rnd(ivec2(ic.x, 4), 5.0) * span, span));
  float second = floor(mod(t * speed * 0.73 + rnd(ivec2(ic.x, 6), 5.0) * span + span * 0.5, span));
  float a = head - float(ic.y);
  float b = second - float(ic.y);
  float ia = a >= 0.0 && a < trail ? pow(1.0 - a / trail, 1.6) : 0.0;
  float ib = b >= 0.0 && b < trail * 0.7 ? pow(1.0 - b / (trail * 0.7), 1.6) * 0.8 : 0.0;
  float isHead = (a >= 0.0 && a < 1.0) || (b >= 0.0 && b < 1.0) ? 1.0 : 0.0;
  return vec2(max(ia, ib), isHead);
}

int rampIndex(float d, ivec2 ic) {
  float q = d * float(uRamp) + (bayer(ic) - 0.5) * 0.9;
  int level = int(clamp(floor(q + 0.5), 0.0, float(uRamp)));
  return level - 1;
}

/* Glif o kształcie najbliższym tonowi komórki (8 pod-komórek). −1 — pusta. */
int matchIndex(float v[8], float gain) {
  float mean = 0.0;
  for (int k = 0; k < 8; k++) mean += v[k];
  mean *= gain / 8.0;
  if (mean < 0.035) return -1;
  float best = 0.0;
  for (int k = 0; k < 8; k++) best += v[k] * v[k] * gain * gain;
  int index = -1;
  for (int n = 0; n < 160; n++) {
    if (n >= uRamp) break;
    vec4 a = texelFetch(uShapes, ivec2(n, 0), 0);
    vec4 b = texelFetch(uShapes, ivec2(n, 1), 0);
    float c[8] = float[8](a.x, a.y, a.z, a.w, b.x, b.y, b.z, b.w);
    float e = 0.0;
    for (int k = 0; k < 8; k++) {
      float dk = v[k] * gain - c[k];
      e += dk * dk;
    }
    if (e < best) { best = e; index = n; }
  }
  return index;
}

int brailleIndex(float v[8], ivec2 ic, float gain) {
  int bits = 0;
  const int map[8] = int[8](0, 3, 1, 4, 2, 5, 6, 7);
  for (int j = 0; j < 4; j++) {
    for (int i = 0; i < 2; i++) {
      float thr = bayer(ic * ivec2(2, 4) + ivec2(i, j)) * 0.92 + 0.04;
      if (v[j * 2 + i] * gain > thr) bits |= 1 << map[j * 2 + i];
    }
  }
  return bits == 0 ? -1 : bits;
}

/* Glif kierunkowy wzdłuż krawędzi — gradient z pod-komórek. */
int lineIndex(float v[8]) {
  float left = v[0] + v[2] + v[4] + v[6];
  float right = v[1] + v[3] + v[5] + v[7];
  float top = v[0] + v[1] + v[2] * 0.5 + v[3] * 0.5;
  float bottom = v[6] + v[7] + v[4] * 0.5 + v[5] * 0.5;
  vec2 grad = vec2((right - left) / uCellPx.x, (bottom - top) / (uCellPx.y * 0.75));
  vec2 dir = vec2(-grad.y, grad.x);
  float a = atan(dir.y, dir.x);
  if (a < 0.0) a += 3.14159265;
  if (a < 0.3927 || a >= 2.7489) return uLines;
  if (a < 1.1781) return uLines + 3;
  if (a < 1.9635) return uLines + 1;
  return uLines + 2;
}

void main() {
  ivec2 ic = ivec2(int(gl_FragCoord.x), uGrid.y - 1 - int(gl_FragCoord.y));
  vec2 g = vec2(ic) + 0.5;
  vec2 cellPx = g * uCellPx + uOrigin;
  float lensDist = length(cellPx - uLens.xy);
  float lensR = uLens.z * uLens.w;

  // Lupa: pod kursorem obraz powiększony (wypukła soczewka), glify tej samej wielkości.
  vec2 gs = g;
  float zoom = 1.0;
  if (uKind == 0 && uLensMode == 0 && uLens.w > 0.02) {
    vec2 lg = (uLens.xy - uOrigin) / uCellPx;
    float k = 1.0 - smoothstep(uLens.z * 0.45, uLens.z, lensDist);
    zoom = 1.0 + 1.1 * uLens.w * k * k;
    gs = lg + (g - lg) / zoom;
  }
  if (uMode == 3 && (uKind == 0 || uKind == 4)) {
    // Przepływ: obraz „oddycha” — próbka przesunięta polem szumu.
    float t = uTime * 0.18;
    vec2 w = vec2(fbm(g * 0.06 + vec2(t, 0.0)), fbm(g * 0.06 + vec2(0.0, t) + 9.1)) - 0.5;
    gs += w * 3.0;
  }

  float v[8];
  float d = 0.0;
  float mask = 1.0;
  float edge = 0.0;
  if (uKind != 2) {
    subcells(gs, 1.0 / zoom, v);
    vec3 s = toneRaw(gs);
    mask = s.g;
    edge = s.b;
    for (int k = 0; k < 8; k++) d += v[k];
    d /= 8.0;
    if (uSharp > 0.0) {
      float blur = 0.25 * (densityAt(gs + vec2(1.2, 0.0)) + densityAt(gs - vec2(1.2, 0.0))
        + densityAt(gs + vec2(0.0, 1.2)) + densityAt(gs - vec2(0.0, 1.2)));
      float boost = uSharp * (d - blur);
      for (int k = 0; k < 8; k++) v[k] = clamp(v[k] + boost, 0.0, 1.0);
      d = clamp(d + boost, 0.0, 1.0);
    }
  } else {
    for (int k = 0; k < 8; k++) v[k] = 0.0;
  }

  if (uKind == 1 && uEdgeInk > 0.0) d = max(d, smoothstep(0.08, 0.6, edge) * uEdgeInk);
  if (uKind == 1) d = max(d, uFloor * mask);

  float heat = 0.0;
  float gain = 1.0;
  float alphaK = 1.0;
  float headK = 0.0;
  float paperK = 1.0;
  int forced = -2;
  float drop = 0.0;
  float photo = 0.0;

  if (uKind == 1 && uLoop >= 0.0) {
    // Przebieg po widocznym obrazie: pasmo glifów przechodzi i znika, za nim znów obraz.
    float o = order(ic, g);
    float b = band() * (uMode == 5 ? 2.5 : 1.2);
    float f = uLoop * (1.0 + 2.0 * b) - b;
    float near = 1.0 - abs(o - f) / b;
    if (near <= 0.0) { paperK = 0.0; alphaK = 0.0; }
    else {
      paperK = smoothstep(0.0, 0.35, near);
      if (uMode == 5) {
        float rows = (f - o) * float(uGrid.y);
        if (rows >= 0.0 && rows < 1.0) { forced = uLines; headK = 1.0; paperK = 1.0; }
        else if (o > f) { paperK = 0.0; alphaK = 0.0; }
      } else if (near > 0.7) heat = (near - 0.7) / 0.3;
    }
  } else if (uKind == 1 || uKind == 3) {
    float o = order(ic, g);
    float r = revealAt(o, uProgress);
    float front = r > 0.0 && r < 1.0 ? 1.0 - abs(r * 2.0 - 1.0) : 0.0;
    if (uMode == 5) {
      // Skaner: ostry promień jednego rzędu; za nim od razu obraz (albo złożony znak).
      float rows = (uProgress * (1.0 + band()) - o) * float(uGrid.y);
      r = rows >= 1.0 ? 1.0 : 0.0;
      front = 0.0;
      if (rows >= 0.0 && rows < 1.0) { forced = uLines; headK = 1.0; }
      else if (rows > -2.5 && rows < 0.0) heat = 0.5;
    }
    if (uKind == 1) {
      if (r >= 1.0) { paperK = 0.0; alphaK = 0.0; }
      else {
        paperK = uMode == 4 ? 1.0 - r : 1.0 - smoothstep(0.55, 1.0, r);
        if (uMode == 4) { gain = 1.0 - r; drop = r * 0.7; }
        else if (uMode == 2) { heat = front; headK = r > 0.82 ? 1.0 : 0.0; }
        else if (uMode != 5) heat = front;
      }
    } else {
      if (r <= 0.0 && forced < -1) alphaK = 0.0;
      else {
        if (uMode == 4) { gain = r; drop = (1.0 - r) * -0.6; }
        else if (uMode != 5) { heat = front; gain = mix(0.55, 1.0, r); }
        alphaK = uMode == 5 ? 1.0 : smoothstep(0.0, 0.35, r);
      }
    }
  }

  if ((uKind == 0 || uKind == 4 || uKind == 3) && uLoop >= 0.0) {
    // Przebieg: pasmo przechodzi przez obraz (pętla, przewijanie albo jednorazowo).
    float o = order(ic, g);
    float b = band();
    float f = uLoop * (1.0 + 2.0 * b) - b;
    float near = 1.0 - abs(o - f) / b;
    if (near > 0.0) {
      if (uMode == 5) {
        // Promień: miękki gradient kilku rzędów o niskim kryciu — glify w nim gęstnieją
        // i lekko drżą; żadnej twardej linii przez twarz.
        float rows = (o - f) * float(uGrid.y);
        float k = exp(-rows * rows / 14.0);
        gain *= 1.0 + 0.7 * k;
        headK = max(headK, 0.6 * k);
        if (mask > 0.05) heat = max(heat, 0.3 * k);
      } else if (uMode == 4) {
        gain *= 1.0 - near * 0.85;
        drop = near * 0.5;
      } else if (uMode == 2) {
        headK = near > 0.8 ? 1.0 : 0.0;
        heat = max(heat, near * 0.8);
      } else {
        heat = max(heat, near);
      }
    }
    if (uMode == 2 && uKind != 3) {
      // Deszcz na twarzy: obraz stoi jasno, krople tylko go rozświetlają.
      vec2 rr = rain(ic);
      gain *= 0.82 + 0.45 * rr.x;
      if (rr.y > 0.5 && mask > 0.1) headK = 1.0;
      if (rr.x > 0.6) heat = max(heat, 0.25);
    }
  }

  if (uKind == 0 && uIntro < 1.0) {
    // Wejście: szum układa się w twarz falą od środka.
    float o = clamp(length(g - vec2(uGrid) * vec2(0.5, 0.38)) / length(vec2(uGrid) * 0.62), 0.0, 1.0);
    float r = clamp((uIntro * 1.3 - o) / 0.3, 0.0, 1.0);
    if (r <= 0.0) { gain *= 0.2; heat = 0.4; }
    else if (r < 1.0) heat = max(heat, 1.0 - r);
  }

  float field = 0.0;
  if (uKind == 2) {
    // Soczewka: kod tylko w kole (brzeg rozproszony), poza nim ledwie widoczny.
    float k = 1.0 - smoothstep(uLens.z * 0.55, uLens.z, lensDist);
    float inside = rnd(ic, 13.0) < k * uLens.w ? 1.0 : 0.0;
    float t = uTime;
    if (uMode == 2) {
      vec2 rr = rain(ic);
      field = rr.x;
      headK = rr.y;
    } else if (uMode == 3) {
      field = smoothstep(0.38, 0.78, fbm(vec2(ic) * vec2(0.09, 0.14) + vec2(0.0, -t * 0.35)));
    } else if (uMode == 1) {
      field = pow(rnd(ic, uStep), 2.0);
    } else if (uMode == 0) {
      field = smoothstep(0.2, 1.0, 0.5 + 0.5 * sin(lensDist / (uCellPx.x * 2.2) - t * 4.0));
    } else if (uMode == 5) {
      field = smoothstep(0.55, 1.0, fract(float(ic.y) / 9.0 - t * 0.6));
      if (field > 0.92) headK = 1.0;
    } else {
      field = smoothstep(0.55, 1.0, sin(rnd(ic, 21.0) * 6.283 + t * (0.8 + 2.4 * rnd(ic, 22.0))));
    }
    d = field;
    alphaK = mix(0.08, 1.0, inside);
    if (inside < 0.5) headK = 0.0;
  }

  if (uLens.w > 0.02 && uKind != 2) {
    float k = 1.0 - smoothstep(lensR * 0.35, lensR, lensDist);
    if (uLensMode == 2 || uKind == 3 || uKind == 4) heat = max(heat, k * 0.9);
    if (uLensMode == 1 && uKind == 0) photo = smoothstep(0.0, 0.6, k);
  }
  if (uRipple.w > 0.0) {
    // Fala kliknięcia: tylko miesza glify (nie wycina ani nie czyści komórek).
    float ring = abs(length(cellPx - uRipple.xy) - uRipple.z);
    float w = uCellPx.y * 2.5;
    if (ring < w) heat = max(heat, (1.0 - ring / w) * uRipple.w);
  }

  // Wybór glifu.
  float dens = clamp(d * gain, 0.0, 1.0);
  int index = -1;
  float flick = rnd(ic, uStep);
  bool hot = heat > 0.0 && flick < heat;
  if (forced > -2) {
    index = forced;
  } else if (uKind == 2) {
    float change = headK > 0.5 || uMode != 2 ? uStep : floor(uStep * 0.18 + rnd(ic, 41.0) * 31.0);
    index = dens > 0.04 ? int(rnd(ic, change + 5.0) * float(uRamp)) : -1;
  } else if (uDither == 1) {
    bool image = uKind == 0 || uKind == 4;
    // Portret i bryła: szum przesuwa raster (ton zostaje), media i znak — losowe wzory.
    ivec2 shift = hot && image ? ivec2(int(rnd(ic, uStep + 4.0) * 4.0), int(rnd(ic, uStep + 5.0) * 4.0)) : ivec2(0);
    index = brailleIndex(v, ic + shift, hot && image ? gain * 1.15 : gain);
    if (hot && !image && (mask > 0.05 || uKind == 1 || uKind == 3)) index = int(rnd(ic, uStep + 3.0) * 254.0) + 1;
  } else {
    bool sketch = uKind == 0 || uKind == 4;
    float shown = gain;
    if (sketch && uRender == 1) shown *= 0.42;
    if (sketch && uRender == 2) shown *= 0.72;
    // Bryły bez krzywej: cień i światło mają zostać widoczne w obu motywach.
    bool linear = uKind == 4 || uCurve.y - uCurve.x > 0.999;
    float dc = linear ? clamp(d * shown, 0.0, 1.0) : smoothstep(uCurve.x, uCurve.y, d * shown);
    index = uMatch == 1 ? matchIndex(v, shown) : rampIndex(dc, ic);
    if (uRandom == 1 && dc > 0.03) {
      // Glif stały w komórce, z rzadka podmieniany (co ~2 s), ton niesie krycie.
      float epoch = floor(uTime * 0.5 + rnd(ic, 43.0) * 7.0);
      index = int(rnd(ic, epoch + 44.0) * float(uRamp));
    }
    dens = dc;
    if (sketch && uRender != 0 && edge > (uRender == 1 ? 0.2 : 0.3) && mask > 0.05) index = lineIndex(v);
    // Bryła: kontur sylwetki glifami kierunkowymi — kształt czyta się jak rysunek.
    if (uKind == 4 && mask > 0.5 && edge > 0.72 && uDither == 0) index = lineIndex(v);
    if (index >= 0 && index < uRamp && flick < uFlicker) {
      index = clamp(index + (rnd(ic, uStep + 1.0) > 0.5 ? 1 : -1), 0, uRamp - 1);
    }
    if (hot && sketch) {
      // Szum na twarzy i bryle zachowuje ton: glif skacze o kilka stopni rampy, nie w czerń.
      if (index >= 0) index = clamp(index + int(floor((rnd(ic, uStep + 2.0) - 0.5) * 7.0)), 0, uRamp - 1);
      else if (mask > 0.05 && rnd(ic, uStep + 6.0) < 0.12) index = 0;
    } else if (hot) {
      float lo = uKind == 1 ? 0.25 : 0.35;
      index = int(mix(lo, 0.999, rnd(ic, uStep + 2.0)) * float(uRamp));
      if (uKind != 1 && uKind != 3 && mask < 0.05) index = -1;
    }
  }

  if (uKind == 4) {
    // Kostka: krawędzie ścian najgęstszym glifem — kształt czyta się od razu jak sześcian.
    vec2 uv = gs / vec2(uGrid);
    float faceEdge = 1.0 - texture(uTone, vec2(uv.x, 1.0 - uv.y)).a;
    if (faceEdge > 0.45 && mask > 0.5) {
      index = uDither == 1 ? 255 : uRamp - 1;
      forced = index;
    }
  }
  // Krycie niesie ton; na portrecie pełne już od średnich tonów (jasna twarz w ciemnym motywie).
  float toneTop = uKind == 0 ? 0.62 : 0.9;
  bool solid = uDither == 1 || forced > -2 || uMatch == 1 || index >= uLines;
  float tone = solid ? 1.0 : mix(1.0, smoothstep(0.0, toneTop, dens), uAlphaTone);
  if (hot) tone = max(tone, 0.85);
  float alpha = alphaK * tone;
  if (uKind == 2) alpha = alphaK * mix(0.35, 1.0, dens);
  if (index < 0) alpha = 0.0;

  int code = index + 1;
  outA = vec4(float(code & 255) / 255.0, float(code >> 8) / 255.0, alpha, headK);
  outB = vec4(paperK, drop * 0.5 + 0.5, photo, 1.0);
}
`

export const GLYPH = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
uniform sampler2D uAtlas;
uniform sampler2D uCellA;
uniform sampler2D uCellB;
uniform ivec2 uCell;
uniform int uColumns;
uniform ivec2 uGrid;
uniform vec2 uOrigin;
uniform vec2 uSize;
uniform vec3 uInk;
uniform vec3 uHead;
uniform vec4 uPaper;
uniform int uPaperOut;       // 1 — poza siatką też papier (media)
uniform int uPhoto;          // 1 — w komórkach z odsłoną rysuj zdjęcie
uniform sampler2D uSrc;
uniform vec4 uMap;
uniform vec3 uLevels;
uniform float uPolarity;
uniform float uVeil;         // media: glify w kolorze obrazu nad przygaszonym obrazem
out vec4 outColor;

void main() {
  vec2 px = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y);
  vec2 local = px - uOrigin;
  ivec2 ic = ivec2(floor(local / vec2(uCell)));
  if (local.x < 0.0 || local.y < 0.0 || ic.x >= uGrid.x || ic.y >= uGrid.y) {
    outColor = uPaperOut == 1 ? uPaper : vec4(0.0);
    return;
  }
  ivec2 ip = ivec2(floor(local)) - ic * uCell;
  ivec2 at = ivec2(ic.x, uGrid.y - 1 - ic.y);
  vec4 a = texelFetch(uCellA, at, 0);
  vec4 b = texelFetch(uCellB, at, 0);
  int index = int(a.r * 255.0 + 0.5) + int(a.g * 255.0 + 0.5) * 256 - 1;
  float drop = b.g * 2.0 - 1.0;
  ivec2 q = ip;
  if (abs(drop) > 0.01) q.y -= int(drop * float(uCell.y));
  float ga = 0.0;
  if (index >= 0 && q.y >= 0 && q.y < uCell.y) {
    ivec2 t = ivec2(index % uColumns, index / uColumns) * uCell + q;
    ga = texelFetch(uAtlas, t, 0).a;
  }
  float alpha = ga * a.b;
  vec3 col = mix(uInk, uHead, a.a);
  if (uPhoto == 1 && b.b > 0.0) {
    // Odsłona: zdjęcie w dwóch kolorach (tusz/papier), rozproszone na brzegu soczewki.
    vec2 uv = uMap.xy + (local / (vec2(uGrid) * vec2(uCell))) * uMap.zw;
    vec4 c = texture(uSrc, uv);
    float lum = c.a > 0.002 ? dot(c.rgb / c.a, vec3(0.2126, 0.7152, 0.0722)) : 1.0;
    float t = pow(clamp((lum - uLevels.x) / max(uLevels.y - uLevels.x, 0.001), 0.0, 1.0), uLevels.z);
    float inkA = (uPolarity > 0.5 ? 1.0 - t : t) * c.a;
    alpha = mix(alpha, inkA, b.b);
    col = mix(col, uInk, b.b);
  }
  vec4 bg = uPaper * b.r;
  if (uVeil > 0.0) {
    // Spoczynek „obraz”: zasłona papieru tylko przygasza obraz, glif ma kolor obrazu pod nim.
    vec2 uvc = uMap.xy + ((vec2(ic) + 0.5) / vec2(uGrid)) * uMap.zw;
    vec4 c = texture(uSrc, uvc);
    vec3 rgb = c.a > 0.002 ? c.rgb / c.a : vec3(1.0);
    col = rgb;
    bg *= 1.0 - uVeil;
  }
  outColor = vec4(col * alpha, alpha) + bg * (1.0 - alpha);
}
`
