import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
  ],
  mpa: {
    entry: {
      docs: 'src/pages/docs.tsx',
      index: 'src/pages/index.tsx'
    },
  },
  npmClient: 'npm',
});
