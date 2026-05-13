import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@public": path.resolve(__dirname, "./public"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@providers": path.resolve(__dirname, "./src/app/providers"),
      "@router": path.resolve(__dirname, "./src/app/router"),
      "@store": path.resolve(__dirname, "./src/app/store"),
      "@layouts": path.resolve(__dirname, "./src/app/layouts"),
      "@modules": path.resolve(__dirname, "./src/modules"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@components": path.resolve(__dirname, "./src/shared/components"),
      "@ui": path.resolve(__dirname, "./src/shared/ui"),
      "@hooks": path.resolve(__dirname, "./src/shared/hooks"),
      "@utils": path.resolve(__dirname, "./src/shared/utils"),
      "@services": path.resolve(__dirname, "./src/shared/services"),
      "@constants": path.resolve(__dirname, "./src/shared/constants"),
      "@types": path.resolve(__dirname, "./src/shared/types"),
      "@validations": path.resolve(__dirname, "./src/shared/validations"),
      "@guards": path.resolve(__dirname, "./src/shared/guards"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@lib": path.resolve(__dirname, "./src/lib"),
    },
  },
});
