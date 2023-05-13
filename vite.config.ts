import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { resolve } from "path";

export default defineConfig({
    base: "/Recipe-Finder/",
    plugins: [reactRefresh()],
    build: {
        outDir: "dist",
        assetsDir: "assets",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
            },
        },
    },
});