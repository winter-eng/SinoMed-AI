# Deployment

> Build configuration and deployment guide for SinoMed AI.

---

## Environment Variables

Create a `.env` file at the project root before building:

```env
# Required — backend API base URL
VITE_API_URL=https://aidiagnostikapi.sangilov.uz
```

`VITE_API_URL` is the only environment variable the application uses. If it is absent, the Axios client falls back to the hardcoded production URL:

```js
// src/shared/api/client.js
const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://aidiagnostikapi.sangilov.uz'
```

This means a production build without a `.env` file will still point at the production backend.

**Important:** `VITE_` prefixed variables are embedded into the JavaScript bundle at build time. They are not secrets. Never put API keys, signing secrets, or credentials into `VITE_*` variables.

---

## Build

```bash
npm run build
```

Vite compiles the application into `dist/`:

```
dist/
├── index.html
└── assets/
    ├── index-<hash>.js    (~837 KB minified, ~247 KB gzip)
    └── index-<hash>.css   (~50 KB minified, ~9 KB gzip)
    └── <font files>.woff2
```

The build produces a Single Page Application. All routing is client-side. The web server must serve `index.html` for every path.

---

## Serving the Build

### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/sinomed-ai/dist;
    index index.html;

    # Serve static assets with long cache
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # All routes → index.html (SPA fallback)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Apache

```apache
<VirtualHost *:80>
    DocumentRoot /var/www/sinomed-ai/dist
    <Directory /var/www/sinomed-ai/dist>
        Options -Indexes
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

`.htaccess`:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### Vercel / Netlify

No configuration required. Both platforms detect Vite automatically and configure the SPA fallback.

For Vercel, add a `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

For Netlify, add a `_redirects` file to `public/`:
```
/*    /index.html    200
```

---

## Development

```bash
npm run dev
# → Vite dev server at http://localhost:5173
# → HMR enabled
# → CORS: requests go directly to the backend (no proxy needed if backend allows all origins)
```

To proxy API requests through the dev server (avoids CORS issues in strict environments), add to `vite.config.js`:

```js
export default defineConfig({
  // ... existing config
  server: {
    proxy: {
      '/api': {
        target: 'https://aidiagnostikapi.sangilov.uz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

Then set `VITE_API_URL=/api` in your `.env.local`.

---

## Preview Production Build Locally

```bash
npm run build && npm run preview
# → http://localhost:4173
```

This serves the `dist/` folder with Vite's preview server, which correctly handles SPA routing.

---

## Scripts Reference

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start dev server with HMR |
| `build` | `vite build` | Production build → `dist/` |
| `preview` | `vite preview` | Serve production build locally |
| `lint` | `eslint .` | Lint all JS/JSX files |
| `format` | `prettier --write "src/**/*.{js,jsx,css}"` | Auto-format source files |

---

## Build Checklist

Before deploying a new build:

- [ ] `npm run lint` passes with zero errors
- [ ] `npm run build` completes with zero errors
- [ ] `VITE_API_URL` points at the correct backend environment
- [ ] All new UI strings have keys in both `uz` and `ru` translation files
- [ ] No `console.log`, `TODO`, or `FIXME` outside of dev-guarded blocks
- [ ] No hardcoded data, mock arrays, or placeholder values

---

## Performance Notes

- The current bundle is ~837 KB minified (~247 KB gzip). This is within acceptable range for an Intra-app that loads once and caches aggressively. Code-splitting by route is a planned improvement.
- Font files are the Inter typeface served by `@fontsource/inter`. They are hashed and cached for 1 year.
- TanStack Query caches API responses in memory (30s for lists, 5m for details). Subsequent navigation within the same session does not refetch.
- Framer Motion animations are hardware-accelerated (transform + opacity only).
