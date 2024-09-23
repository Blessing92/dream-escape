import react from "@vitejs/plugin-react"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig, loadEnv } from "vite"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // expose .env as process.env instead of process.env
  // Reference: https://github.com/vitejs/vite/issues/1149#issuecomment-857686209
  const env = loadEnv(mode, process.cwd(), "VITE_APP")

  // Optional: Populate NODE_ENV with the current mode (development/production)
  env.NODE_ENV = mode

  const envWithProcessPrefix = {
    "process.env": `${JSON.stringify(env)}`,
    __APP_ENV__: JSON.stringify(env.APP_ENV),
  }

  return {
    build: {
      // Relative to the root
      outDir: "./dist",
      sourcemap: true, // Source map generation must be turned on
      target: "es2022",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("@supabase") || id.includes("@chakra-ui")) {
                const libraryPath = id.split("node_modules/")[1]
                return `${libraryPath.split("/")[0]}/${libraryPath.split("/")[1]}`
              }
              return id.split("node_modules/")[1].split("/")[0]
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
      deps: {
        optimizer: {
          ssr: {
            include: ["@epicbrief/shared"],
          },
        },
      },
    },
    plugins: [
      visualizer(),
      // …
      react({
        // Use React plugin in all *.jsx and *.tsx files
        include: "**/*.{js,jsx,tsx}",
      }),
    ],
    define: envWithProcessPrefix,
  }
})
