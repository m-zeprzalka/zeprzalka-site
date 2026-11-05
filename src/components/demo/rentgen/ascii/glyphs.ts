"use client"

import { Mesh, Program, Renderer, Texture, Triangle } from "ogl"
import { buildAtlas } from "./atlas"

/**
 * Silnik znaków: JEDEN kontekst WebGL (ogl) na całą stronę. Shader kompiluje
 * się raz, tekstury obrazów wgrywają się raz (wideo — co klatkę), a każdy
 * widok rysuje tylko swój wycinek (pod soczewką albo cały w trybie „Kod”)
 * do wspólnego płótna poza dokumentem i kopiuje go `drawImage` do własnego
 * płótna 2D — żadnego tworzenia i gubienia kontekstów przy przesuwaniu soczewki.
 *
 * Na płótnie widoku leży kolejno: obraz w kolorze, klisza ok. 50% i cyfry —
 * obraz widać pod kodem, soczewka nie robi czarnej plamy.
 *
 * Obraz z cyfr 0/1: krycie cyfry = jasność komórki (zrzuty interfejsów —
 * `negative`: krawędzie i ciemne elementy, czyli szkielet UI). Każda cyfra
 * zmienia się we własnym, spokojnym tempie (0,5–1,7 razy na sekundę), więc
 * naraz przełącza się tylko część komórek — obraz żyje, ale nie miga nerwowo.
 */

export type GlyphSource = HTMLImageElement | HTMLVideoElement

export interface ViewSpec {
  /** Szerokość komórki w px CSS (wysokość = 1,7 × szerokość). */
  cell: number
  tone?: number
  negative?: boolean
}

const VERTEX = /* glsl */ `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAGMENT = /* glsl */ `
precision highp float;
uniform sampler2D tSource;
uniform sampler2D tAtlas;
uniform vec2 uRes;
uniform vec2 uOrigin;
uniform vec2 uClip;
uniform vec2 uCell;
uniform vec4 uFit;
uniform float uTime;
uniform float uInvert;
uniform vec3 uInk;
uniform float uTone;
uniform float uNeg;

float lumAt(vec2 uv) {
  vec4 s = texture2D(tSource, vec2(uv.x, 1.0 - uv.y));
  return dot(s.rgb, vec3(0.2126, 0.7152, 0.0722));
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  // Piksel widoku (lewy górny róg = 0,0) z wycinka narysowanego w viewporcie.
  vec2 px = vec2(uOrigin.x + gl_FragCoord.x, uOrigin.y + uClip.y - gl_FragCoord.y);
  vec2 cell = floor(px / uCell);
  vec2 center = (cell + 0.5) * uCell / uRes;
  vec2 suv = center * uFit.xy + uFit.zw;
  if (suv.x < 0.0 || suv.y < 0.0 || suv.x > 1.0 || suv.y > 1.0) {
    gl_FragColor = vec4(0.0);
    return;
  }
  vec4 src = texture2D(tSource, vec2(suv.x, 1.0 - suv.y));
  float raw = dot(src.rgb, vec3(0.2126, 0.7152, 0.0722));
  float lum = clamp((raw - 0.1) / 0.78, 0.0, 1.0);
  float level = mix(lum, 1.0 - lum, uInvert);
  if (uNeg > 0.5) {
    vec2 step = uCell / uRes * uFit.xy;
    float grad = abs(raw - lumAt(suv + vec2(step.x, 0.0))) + abs(raw - lumAt(suv + vec2(0.0, step.y)));
    level = clamp(grad * 3.2 + (1.0 - raw) * 0.7, 0.0, 1.0);
  }

  float rate = 0.5 + hash(cell) * 1.2;
  float glyph = hash(cell + floor(uTime * rate + hash(cell.yx) * 7.0) * 1.37) > 0.5 ? 1.0 : 0.0;
  float alpha = smoothstep(0.06, 0.92, level) * src.a;

  vec2 inCell = fract(px / uCell);
  float g = texture2D(tAtlas, vec2((glyph + inCell.x) / 2.0, 1.0 - inCell.y)).a;
  // Pod znakami — słaby ton obrazu: kadr czyta się także z daleka.
  float a = clamp(g * alpha + uTone * level * src.a, 0.0, 1.0);
  gl_FragColor = vec4(uInk * a, a);
}
`

function sizeOf(source: GlyphSource): [number, number] {
  if (source instanceof HTMLVideoElement) return [source.videoWidth, source.videoHeight]
  return [source.naturalWidth, source.naturalHeight]
}

function sourceReady(source: GlyphSource): boolean {
  if (source instanceof HTMLVideoElement) return source.readyState >= 2 && source.videoWidth > 0
  return source.complete && source.naturalWidth > 0
}

interface Engine {
  canvas: HTMLCanvasElement
  renderer: Renderer
  program: Program
  mesh: Mesh
  sources: WeakMap<GlyphSource, Texture>
  atlases: Map<string, Texture>
  empty: Texture
}

let engine: Engine | null = null

function getEngine(): Engine | null {
  if (engine) return engine
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  let renderer: Renderer
  try {
    renderer = new Renderer({
      canvas,
      alpha: true,
      premultipliedAlpha: true,
      depth: false,
      antialias: false,
      powerPreference: "low-power",
    })
  } catch {
    return null
  }
  const gl = renderer.gl
  if (!gl) return null
  const empty = new Texture(gl, { generateMipmaps: false })
  const program = new Program(gl, {
    vertex: VERTEX,
    fragment: FRAGMENT,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      tSource: { value: empty },
      tAtlas: { value: empty },
      uRes: { value: [1, 1] },
      uOrigin: { value: [0, 0] },
      uClip: { value: [1, 1] },
      uCell: { value: [8, 14] },
      uFit: { value: [1, 1, 0, 0] },
      uTime: { value: 0 },
      uInvert: { value: 0 },
      uInk: { value: [0.9, 0.9, 0.9] },
      uTone: { value: 0 },
      uNeg: { value: 0 },
    },
  })
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
  engine = {
    canvas,
    renderer,
    program,
    mesh,
    sources: new WeakMap(),
    atlases: new Map(),
    empty,
  }
  return engine
}

function texture(gl: Renderer["gl"], image?: Texture["image"], nearest = false) {
  const filter = nearest ? gl.NEAREST : gl.LINEAR
  return new Texture(gl, {
    image,
    generateMipmaps: false,
    minFilter: filter,
    magFilter: filter,
    wrapS: gl.CLAMP_TO_EDGE,
    wrapT: gl.CLAMP_TO_EDGE,
  })
}

export interface DrawTarget {
  ctx: CanvasRenderingContext2D
  /** Rozmiar widoku w px urządzenia. */
  width: number
  height: number
  dpr: number
}

export interface DrawOptions {
  source: GlyphSource
  /** Klisza nad obrazem (np. `rgba(…, 0.5)`): obraz widać pod cyframi. */
  veil: string
  ink: [number, number, number]
  invert: boolean
  time: number
  /** Wycinek do narysowania w px CSS widoku; `null` — cały widok. */
  clip: { x: number; y: number; w: number; h: number } | null
}

/** Rysuje widok (albo jego wycinek). Zwraca `false`, gdy nie ma czego rysować. */
export function drawView(spec: ViewSpec, target: DrawTarget, options: DrawOptions): boolean {
  const current = getEngine()
  if (!current || !sourceReady(options.source)) return false
  const { renderer, program, mesh, canvas } = current
  const gl = renderer.gl
  const { dpr, width, height } = target

  // Wycinek w px urządzenia, przycięty do widoku.
  const clip = options.clip
  const x0 = Math.max(0, Math.floor((clip ? clip.x : 0) * dpr))
  const y0 = Math.max(0, Math.floor((clip ? clip.y : 0) * dpr))
  const x1 = Math.min(width, Math.ceil((clip ? clip.x + clip.w : width / dpr) * dpr))
  const y1 = Math.min(height, Math.ceil((clip ? clip.y + clip.h : height / dpr) * dpr))
  const cw = x1 - x0
  const ch = y1 - y0
  if (cw <= 0 || ch <= 0) return false

  // Wspólne płótno rośnie do największego wycinka (nigdy nie maleje — bez realokacji co klatkę).
  if (canvas.width < cw || canvas.height < ch) {
    canvas.width = Math.max(canvas.width, cw)
    canvas.height = Math.max(canvas.height, ch)
  }

  // Tekstury: źródło (wideo — świeża klatka) i atlas dwóch cyfr dla rozmiaru komórki.
  let sourceTexture = current.sources.get(options.source)
  if (!sourceTexture) {
    sourceTexture = texture(gl, options.source)
    current.sources.set(options.source, sourceTexture)
  } else if (options.source instanceof HTMLVideoElement) {
    sourceTexture.image = options.source
    sourceTexture.needsUpdate = true
  }
  const cellW = Math.max(2, Math.round(spec.cell * dpr))
  const cellH = Math.max(3, Math.round(spec.cell * 1.7 * dpr))
  const atlasKey = `${cellW}|${cellH}`
  let atlas = current.atlases.get(atlasKey)
  if (!atlas) {
    atlas = texture(gl, buildAtlas(["0", "1"], cellW, cellH).canvas, true)
    current.atlases.set(atlasKey, atlas)
  }

  // Kadr „cover” — mapowanie uv widoku na uv źródła.
  const [sw, sh] = sizeOf(options.source)
  const viewAspect = width / height
  const sourceAspect = sw && sh ? sw / sh : viewAspect
  const sx = Math.min(1, viewAspect / sourceAspect)
  const sy = Math.min(1, sourceAspect / viewAspect)

  const u = program.uniforms
  const set = (name: string, value: unknown) => {
    const uniform = u[name]
    if (uniform) uniform.value = value
  }
  set("tSource", sourceTexture)
  set("tAtlas", atlas)
  set("uRes", [width, height])
  set("uOrigin", [x0, y0])
  set("uClip", [cw, ch])
  set("uCell", [cellW, cellH])
  set("uFit", [sx, sy, (1 - sx) / 2, (1 - sy) / 2])
  set("uTime", options.time)
  set("uInvert", options.invert ? 1 : 0)
  set("uInk", options.ink)
  set("uTone", spec.tone ?? 0)
  set("uNeg", spec.negative ? 1 : 0)

  // Rysunek w lewym dolnym rogu wspólnego płótna, kopia do płótna widoku.
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.viewport(0, 0, cw, ch)
  gl.enable(gl.SCISSOR_TEST)
  gl.scissor(0, 0, cw, ch)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  mesh.draw()
  gl.disable(gl.SCISSOR_TEST)
  // Kompozycja wycinka: obraz w kolorze (cover), półprzezroczysta klisza, cyfry.
  const { ctx } = target
  ctx.save()
  ctx.beginPath()
  ctx.rect(x0, y0, cw, ch)
  ctx.clip()
  ctx.clearRect(x0, y0, cw, ch)
  if (sw && sh) {
    const scale = Math.max(width / sw, height / sh)
    const dw = sw * scale
    const dh = sh * scale
    ctx.drawImage(options.source, (width - dw) / 2, (height - dh) / 2, dw, dh)
  }
  ctx.fillStyle = options.veil
  ctx.fillRect(x0, y0, cw, ch)
  ctx.drawImage(canvas, 0, canvas.height - ch, cw, ch, x0, y0, cw, ch)
  ctx.restore()
  return true
}

/** Oddaje kontekst WebGL (ostatni widok znaków odmontowany — np. przejście do innego dema). */
export function disposeGlyphs() {
  if (!engine) return
  engine.renderer.gl.getExtension("WEBGL_lose_context")?.loseContext()
  engine = null
}
