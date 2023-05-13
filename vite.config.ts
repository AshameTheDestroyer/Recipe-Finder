import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/Recipe-Finder/",
    plugins: [react()],
});