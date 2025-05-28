import { defineConfig } from 'eslint'
import vue from '@vue/eslint-config-typescript'

export default defineConfig({
  root: true,
  extends: vue,
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'vue/multi-word-component-names': 'off'
      }
    }
  ]
})
