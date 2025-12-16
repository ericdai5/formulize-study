import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { formulizePlugin } from "formulize-math/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [formulizePlugin(), react()],
});
