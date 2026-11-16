import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
export default [
  { ignores: ['dist/**', '.vercel/**'] },
  { files: ['**/*.{js,ts,tsx}'], languageOptions: { globals: globals.browser } },
  { files: ['scripts/**/*.mjs'], languageOptions: { globals: globals.node } },
  js.configs.recommended,
  ...tseslint.configs.recommended,
]

