import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import { defineConfig } from "astro/config";
import markdoc from "@astrojs/markdoc";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// https://astro.build/config
export default defineConfig( /** @type {import('astro').AstroUserConfig} */{
  // root: '.',     // Where to resolve all URLs relative to. Useful if you have a monorepo project.
  // outDir: './dist',       // When running `astro build`, path to final static output
  // publicDir: './public',   // A folder of static files Astro will copy to the root. Useful for favicons, images, and other files that don’t need processing.
  output: 'static',
  site: 'https://stock.955.life',
  // GitHub Pages 项目页部署时需要 base（如 /shit-a-stock），自定义域名根路径时用 '/'
  base: process.env.ASTRO_BASE || '/',
  server: {
    // port: 3000,         // The port to run the dev server on.
  },
  integrations: [
    mdx(),
    markdoc(), // disabled now due to an issue with Vercel builds
    svelte(), 
    tailwind({
      config: {
        applyBaseStyles: false
      }
    })
  ],
  vite: {
    plugins: [],
    resolve: {
      alias: {
        '$': path.resolve(__dirname, './src')
      }
    },
    optimizeDeps: {
      allowNodeBuiltins: true
    }
  }
});
