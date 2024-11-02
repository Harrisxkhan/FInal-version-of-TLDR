import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Allows you to access the page from your other devices
  server: {
    host: "0.0.0.0",
  },
});
