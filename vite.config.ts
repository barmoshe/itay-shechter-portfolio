import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base must match the GitHub Pages repo path so asset URLs resolve under
// https://<user>.github.io/itay-shechter-portfolio/.
export default defineConfig({
  plugins: [react()],
  base: '/itay-shechter-portfolio/',
});
