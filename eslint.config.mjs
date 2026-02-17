import nextVitals from 'eslint-config-next/core-web-vitals'
import prettierConfig from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactPlugin from 'eslint-plugin-react'

const config = [
  ...nextVitals,
  prettierConfig,
  {
    plugins: {
      'react-hooks': reactHooks,
      react: reactPlugin,
    },
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react/no-unescaped-entities': ['warn', { forbid: ['>', '}'] }],
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
  {
    files: ['app/api/**/route.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  {
    files: ['lib/pdf/**/*.tsx'],
    rules: {
      'jsx-a11y/alt-text': 'off',
    },
  },
  {
    files: ['**/*.test.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  {
    ignores: [
      '.DS_Store',
      '.next/**',
      '.firebase/**',
      'build/**',
      '.svelte-kit/**',
      'package/**',
      '.env',
      '.env.*',
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock',
      '*.cjs',
      '**/*.old.tsx',
      'types/contentlayer-generated.d.ts',
    ],
  },
]

export default config
