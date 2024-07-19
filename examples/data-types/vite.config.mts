import { defineConfig, Plugin } from 'vite'
import { makeTypedLangPlugin } from '@typed-lang/vite-plugin'
import tsconfigPaths from 'vite-plugin-tsconfig-paths'

export default defineConfig({
  build: {
    rollupOptions: {
      input: "./src/main.ts"
    },
    sourcemap: true,
  },
  plugins: [
    (tsconfigPaths as unknown as () => Plugin)(),
    makeTypedLangPlugin()
  ]
})