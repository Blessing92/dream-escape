import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_APP")

  env.NODE_ENV = mode

  return {
    build: {
      // Relative to the root
      outDir: "./build",
      sourcemap: true, // Source map generation must be turned on
      target: "es2022",
    },
    esbuild: {
      target: "es2022",
      legalComments: "eof",
    },
    css: {
      devSourcemap: true,
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2022",
      },
    },
    plugins: [react({ include: "**/*.{js,jsx,tsx}" })],
    define: {
      "process.env": `${JSON.stringify(env)}`,
      __APP_ENV__: env.APP_ENV,
    },
  }
})
