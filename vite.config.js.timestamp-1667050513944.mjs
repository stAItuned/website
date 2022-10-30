// vite.config.js
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { imagetools } from "vite-imagetools";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [sveltekit(), imagetools({ include: ["**/*.{png,jpg,svg,webp}?*"] })],
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
      "@components": path.resolve("./src/lib/components"),
      "@stores": path.resolve("./src/stores"),
      "@assets": path.resolve("./src/assets")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYW5kcmVhL0RvY3VtZW50cy9HaXRIdWIvd2Vic2l0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FuZHJlYS9Eb2N1bWVudHMvR2l0SHViL3dlYnNpdGUvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FuZHJlYS9Eb2N1bWVudHMvR2l0SHViL3dlYnNpdGUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgc3ZlbHRla2l0IH0gZnJvbSAnQHN2ZWx0ZWpzL2tpdC92aXRlJ1xuaW1wb3J0IHsgaW1hZ2V0b29scyB9IGZyb20gJ3ZpdGUtaW1hZ2V0b29scydcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW3N2ZWx0ZWtpdCgpLCBpbWFnZXRvb2xzKHsgaW5jbHVkZTogWycqKlxcLyoue3BuZyxqcGcsc3ZnLHdlYnB9PyonXSB9KV0sXG5cdG1hbmlmZXN0OiBmYWxzZSxcblx0Ly8gYWxsb3dzIHZpdGUgYWNjZXNzIHRvIC4vcG9zdHNcblx0c2VydmVyOiB7XG5cdFx0ZnM6IHtcblx0XHRcdGFsbG93OiBbXCIuXCJdXG5cdFx0fVxuXHR9LFxuXHRyZXNvbHZlOiB7XG5cdFx0YWxpYXM6IHtcblx0XHRcdCdAbGliJzogcGF0aC5yZXNvbHZlKCcuL3NyYy9saWInKSxcblx0XHRcdCdAY29uZmlnJzogcGF0aC5yZXNvbHZlKCcuL3NyYy9jb25maWcnKSxcblx0XHRcdCdAY29tcG9uZW50cyc6IHBhdGgucmVzb2x2ZSgnLi9zcmMvbGliL2NvbXBvbmVudHMnKSxcblx0XHRcdCdAc3RvcmVzJzogcGF0aC5yZXNvbHZlKCcuL3NyYy9zdG9yZXMnKSxcblx0XHRcdCdAYXNzZXRzJzogcGF0aC5yZXNvbHZlKCcuL3NyYy9hc3NldHMnKSxcblx0XHR9XG5cdH0sXG5cblxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBb1MsU0FBUyxvQkFBb0I7QUFDalUsU0FBUyxpQkFBaUI7QUFDMUIsU0FBUyxrQkFBa0I7QUFFM0IsT0FBTyxVQUFVO0FBRWpCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLFNBQVMsQ0FBQyxVQUFVLEdBQUcsV0FBVyxFQUFFLFNBQVMsQ0FBQywyQkFBNEIsRUFBRSxDQUFDLENBQUM7QUFBQSxFQUM5RSxVQUFVO0FBQUEsRUFFVixRQUFRO0FBQUEsSUFDUCxJQUFJO0FBQUEsTUFDSCxPQUFPLENBQUMsR0FBRztBQUFBLElBQ1o7QUFBQSxFQUNEO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUixPQUFPO0FBQUEsTUFDTixRQUFRLEtBQUssUUFBUSxXQUFXO0FBQUEsTUFDaEMsV0FBVyxLQUFLLFFBQVEsY0FBYztBQUFBLE1BQ3RDLGVBQWUsS0FBSyxRQUFRLHNCQUFzQjtBQUFBLE1BQ2xELFdBQVcsS0FBSyxRQUFRLGNBQWM7QUFBQSxNQUN0QyxXQUFXLEtBQUssUUFBUSxjQUFjO0FBQUEsSUFDdkM7QUFBQSxFQUNEO0FBR0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
