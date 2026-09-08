import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/generated/**",
    ],
  },
  {
    rules: {
      // coding-standards.md §14: importing a module's repository from client
      // code pulls Prisma into the browser bundle. No module repositories
      // exist yet in this phase, so this rule has nothing to catch today —
      // it exists so the first one that's added is already covered.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/*/repository", "@/modules/*/repository.ts"],
              message:
                "Do not import a module's repository directly. Repositories are Prisma-only and importing one from client code pulls Prisma into the browser bundle. Import from the module's domain/ or schema.ts instead.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
