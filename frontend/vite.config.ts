import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react-swc"
import tailwindcss from "@tailwindcss/vite"

const backendUrl = process.env.VITE_BACKEND_URL || "http://localhost:8080"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    include: ["src/test/**/*.test.ts", "src/test/**/*.test.tsx"],
    coverage: {
      // you can include other reporters, but 'json-summary' is required, json is recommended
      reporter: ["text", "json-summary", "json"],
      // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
      reportOnFailure: true,
    },
  },
  server: {
    port: 5173,
    strictPort: true, // Si el 5173 está ocupado, no arranca en otro puerto
    host: true, // Escucha en 0.0.0.0 para que Docker pueda exponer el puerto

    proxy: {
      "/api": { target: backendUrl, changeOrigin: true },
      "/usuarios": { target: backendUrl, changeOrigin: true },
    },
  },
})
