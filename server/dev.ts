import { readFileSync } from "node:fs";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { app } from "./app.js";

// Dev saja: layani file statis dari public/ (di Vercel dilayani langsung oleh CDN)
// dan terapkan header yang sama dengan vercel.json supaya CSP bisa diuji lokal.
const cfg = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8")) as {
  headers: { source: string; headers: { key: string; value: string }[] }[];
};
const global = cfg.headers.find((h) => h.source === "/(.*)")?.headers ?? [];
app.use("/*", async (c, next) => {
  await next();
  for (const h of global) c.res.headers.set(h.key, h.value);
  // Dev: jangan biarkan browser menyimpan file statis lama (JS/HTML) dari cache heuristik.
  if (!c.req.path.startsWith("/api/")) c.res.headers.set("Cache-Control", "no-cache");
});
app.use("/*", serveStatic({ root: "./public" }));
app.get("/", serveStatic({ path: "./public/index.html" }));

const port = Number(process.env.PORT ?? 3000);
serve({ fetch: app.fetch, port }, () => console.log(`Dev server di http://localhost:${port}`));
