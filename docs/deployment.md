# Deployment

The default build is a static `dist/` folder. No server process is required unless you opt into Supabase or the model proxy.

```bash
git clone https://github.com/piaattufts/llmodyssey.git
cd llmodyssey
npm install
npm run build
```

## GitHub Pages

The site for this repository is served from `/llmodyssey/`.

```bash
VITE_BASE_PATH=/llmodyssey/ npm run build
```

The Vite build copies `dist/index.html` to `dist/404.html` so a refresh on `/play/token-forge` still loads the app. Publish the `dist` directory with GitHub Pages. Do not set a Supabase key unless you intend to collect events.

## Vercel

Import <https://github.com/piaattufts/llmodyssey>. The framework preset can be Vite. Build command `npm run build`, output `dist`. `vercel.json` rewrites every path to `index.html`. Leave the optional environment variables empty.

## Netlify

Build command `npm run build`, publish directory `dist`. `public/_redirects` is copied into `dist` and sends unknown paths to `index.html` with status 200.

## Docker

```bash
docker compose up --build
```

Open `http://127.0.0.1:8088`. The image builds the static files and serves them with nginx. `nginx.conf` falls back to `index.html`.

## Institutional static server

Copy `dist/` to the web root. Configure the server so unknown paths return `index.html`. The nginx file in the repository is a working example. No database port needs to be opened.
