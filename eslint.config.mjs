import coreWebVitals from "eslint-config-next/core-web-vitals"
import typescript from "eslint-config-next/typescript"

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // Typy importowane jako typy — spójne z `verbatimModuleSyntax` w tsconfig.
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
      // Granica piaskownicy: serwis nigdy nie importuje z /demo.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // Zależności wyłącznie piaskownicy (devDependencies) razem z podścieżkami.
              // Wyrażenie, nie `group`: wzorce w stylu .gitignore łapały też segment „Motion” w ścieżkach serwisu.
              regex: "^((framer-)?motion|@number-flow/[^/]+|gsap|ogl)(/.*)?$",
              message: "Ta zależność jest tylko w piaskownicy /demo.",
            },
            {
              group: ["@/components/demo/*", "@/app/demo/*", "**/demo/**"],
              message:
                "Piaskownica /demo nie może być importowana przez serwis (src/components/demo/README.md).",
            },
          ],
        },
      ],
    },
  },
  {
    // Moduły wspólne dla serwera i klienta: bez modułów treści (`server-only`) — inaczej
    // pierwszy komponent kliencki, który je zaimportuje, wywraca build.
    files: [
      "src/i18n/format.ts",
      "src/i18n/config.ts",
      "src/lib/utils.ts",
      "src/lib/slug.ts",
      // Logika widoku importowana przez wyspy klienckie.
      "src/lib/anchors.ts",
      "src/lib/clipboard.ts",
      "src/lib/contact-fields.ts",
      "src/lib/focus.ts",
      "src/lib/glyph-reveal.ts",
      "src/lib/glyphs.ts",
      "src/lib/hooks.ts",
      "src/lib/keep-in-view.ts",
      "src/lib/media.ts",
      "src/lib/morph.ts",
      "src/lib/motion.ts",
      "src/lib/routes.ts",
      "src/lib/search-match.ts",
      "src/lib/text.ts",
      "src/lib/theme.ts",
      "src/lib/video.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/i18n/content/*", "@/lib/posts", "@/lib/portfolio", "@/lib/services"],
              message:
                "Moduł wspólny dla serwera i klienta nie może importować modułów `server-only`.",
            },
          ],
        },
      ],
    },
  },
  {
    // Piaskownica importuje sama z siebie i z serwisu — odwrotnie nie wolno.
    files: ["src/components/demo/**", "src/app/demo/**"],
    rules: { "no-restricted-imports": "off" },
  },
  {
    // `docs/` — dokumentacja i lokalne archiwum (kopia offline starej strony z paczkami JS).
    ignores: [
      "node_modules/**",
      ".next/**",
      ".claude/**",
      "docs/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
]

export default eslintConfig
