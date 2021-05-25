import { defineConfig } from 'vite';
import svelte from '@sveltejs/vite-plugin-svelte';
import preact from '@preact/preset-vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [svelte(), preact(), vue()],
});
