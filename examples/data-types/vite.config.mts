import { defineConfig, Plugin } from 'vite'
import { makeTypedLangPlugin } from './node_modules/@typed-lang/vite-plugin/dist/index.js'
import tsconfigPaths from 'vite-plugin-tsconfig-paths'

export default defineConfig({
  build: {
    rollupOptions: {
      input: "./src/main.ts"
    }
  },
  plugins: [
    (tsconfigPaths as unknown as () => Plugin)(),
    makeTypedLangPlugin()
  ]
})