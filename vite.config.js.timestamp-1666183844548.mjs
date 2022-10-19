// vite.config.js
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [sveltekit()],
  manifest: false,
  server: {
    fs: {
      allow: ["."]
    }
  },
  resolve: {
    alias: {
      "@lib": path.resolve("./src/lib"),
      "@config": path.resolve("./src/config"),
      "@components": path.resolve("./src/components"),
      "@stores": path.resolve("./src/stores"),
      "@features": path.resolve("./src/features")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYW5kcmVhL0RvY3VtZW50cy9HaXRIdWIvd2Vic2l0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FuZHJlYS9Eb2N1bWVudHMvR2l0SHViL3dlYnNpdGUvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FuZHJlYS9Eb2N1bWVudHMvR2l0SHViL3dlYnNpdGUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgc3ZlbHRla2l0IH0gZnJvbSAnQHN2ZWx0ZWpzL2tpdC92aXRlJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW3N2ZWx0ZWtpdCgpXSxcblx0bWFuaWZlc3Q6IGZhbHNlLFxuXHQvLyBhbGxvd3Mgdml0ZSBhY2Nlc3MgdG8gLi9wb3N0c1xuXHRzZXJ2ZXI6IHtcblx0XHRmczoge1xuXHRcdFx0YWxsb3c6IFtcIi5cIl1cblx0XHR9XG5cdH0sXG5cdHJlc29sdmU6IHtcblx0XHRhbGlhczoge1xuXHRcdFx0J0BsaWInOiBwYXRoLnJlc29sdmUoJy4vc3JjL2xpYicpLFxuXHRcdFx0J0Bjb25maWcnOiBwYXRoLnJlc29sdmUoJy4vc3JjL2NvbmZpZycpLFxuXHRcdFx0J0Bjb21wb25lbnRzJzogcGF0aC5yZXNvbHZlKCcuL3NyYy9jb21wb25lbnRzJyksXG5cdFx0XHQnQHN0b3Jlcyc6IHBhdGgucmVzb2x2ZSgnLi9zcmMvc3RvcmVzJyksXG5cdFx0XHQnQGZlYXR1cmVzJzogcGF0aC5yZXNvbHZlKCcuL3NyYy9mZWF0dXJlcycpLFxuXHRcdH1cblx0fSxcblxuXHRcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9TLFNBQVMsb0JBQW9CO0FBQ2pVLFNBQVMsaUJBQWlCO0FBQzFCLE9BQU8sVUFBVTtBQUVqQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTLENBQUMsVUFBVSxDQUFDO0FBQUEsRUFDckIsVUFBVTtBQUFBLEVBRVYsUUFBUTtBQUFBLElBQ1AsSUFBSTtBQUFBLE1BQ0gsT0FBTyxDQUFDLEdBQUc7QUFBQSxJQUNaO0FBQUEsRUFDRDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1IsT0FBTztBQUFBLE1BQ04sUUFBUSxLQUFLLFFBQVEsV0FBVztBQUFBLE1BQ2hDLFdBQVcsS0FBSyxRQUFRLGNBQWM7QUFBQSxNQUN0QyxlQUFlLEtBQUssUUFBUSxrQkFBa0I7QUFBQSxNQUM5QyxXQUFXLEtBQUssUUFBUSxjQUFjO0FBQUEsTUFDdEMsYUFBYSxLQUFLLFFBQVEsZ0JBQWdCO0FBQUEsSUFDM0M7QUFBQSxFQUNEO0FBR0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
