import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom domain (itayshechter.com) serves the site at the root, so base is '/'.
// The Pages settings UI is what binds the custom domain on this Actions-based
// deploy; no source-tree CNAME is needed. See HANDOFF.md.
export default defineConfig({
  plugins: [react()],
  base: '/',
});
