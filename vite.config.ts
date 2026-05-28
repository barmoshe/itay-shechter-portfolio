import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base must match the GitHub Pages repo path so asset URLs resolve under
// https://<user>.github.io/itay-shekter-portfolio/.
export default defineConfig({
  plugins: [react()],
  base: '/itay-shekter-portfolio/',
});
