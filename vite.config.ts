import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_APP")

  env.NODE_ENV = mode

  return {
    build: {
      outDir: "./build",
      sourcemap: true,
      target: "es2022",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString()
            }
            return null
          },
        },
      },
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
    test: {
      environment: "jsdom",
      setupFiles: ["./src/setupTests.ts"],
      testMatch: ["./tests/*.test.ts?(x)"],
      globals: true,
    },
    plugins: [react({ include: "**/*.{js,jsx,tsx}" })],
    define: {
      "process.env": `${JSON.stringify(env)}`,
      __APP_ENV__: env.APP_ENV,
    },
  }
})
