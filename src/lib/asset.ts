// Resolve a path under public/ to a URL that respects the Vite base path
// (so images work both on localhost and under the GitHub Pages subpath).
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path;
}
