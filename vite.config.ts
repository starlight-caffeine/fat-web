import { defineConfig } from "vite";
import lezer from "unplugin-lezer/vite";
import wasmPack from "vite-plugin-wasm-pack";
import fs from "fs";
import path from "path";
import type { ViteDevServer } from "vite";
import type { IncomingMessage, ServerResponse } from "http";
import basicSsl from "@vitejs/plugin-basic-ssl";
// Custom middleware to serve wasm files with the correct MIME type
const wasmMiddleware = () => {
  return {
    name: "wasm-middleware",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(
        (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.url && req.url.endsWith("fat_bg.wasm")) {
            const wasmPath = path.join(
              __dirname,
              "fat/pkg/",
              path.basename(req.url),
            );
            const wasmFile = fs.readFileSync(wasmPath);
            res.setHeader("Content-Type", "application/wasm");
            res.end(wasmFile);
            return;
          }
          next();
        },
      );
    },
  };
};
export default defineConfig({
  // pass your local crate path to the plugin
  plugins: [wasmMiddleware(), wasmPack("./fat/"), lezer(), basicSsl()],
  server: {
    allowedHosts: ["localhost", "ideapad.local", "0.0.0.0"],
    https: true,
  },
  base: "https://spacewagdev.github.io/fat-web/",
});
