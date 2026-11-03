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
              group: ["@/components/demo/*", "@/app/demo/*"],
              message: "Piaskownica /demo nie może być importowana przez serwis (src/components/demo/README.md).",
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
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
]

export default eslintConfig
