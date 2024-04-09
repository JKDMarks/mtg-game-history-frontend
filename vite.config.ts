import { defineConfig, loadEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const config: UserConfig = {
    plugins: [react()],
    server: {
      port: 3000,
    },
  };

  if (process.env.VITE_USE_HTTPS === "true") {
    config.server.https = {
      key: readFileSync(process.env.HOME + "/certs/key.pem"),
      cert: readFileSync(process.env.HOME + "/certs/cert.pem"),
    };
  }

  return config;
});
