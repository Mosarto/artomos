import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer, request as createProxyRequest } from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";

const host = process.env.HOSTNAME || "0.0.0.0";
const port = Number.parseInt(process.env.PORT || "3000", 10);
const internalPort = Number.parseInt(
  process.env.VINEXT_INTERNAL_PORT || String(port + 1),
  10,
);
const clientRoot = path.resolve(process.cwd(), "dist/client");
const contentTypes = new Map([
  [".avif", "image/avif"],
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

const vinext = spawn(
  process.execPath,
  ["node_modules/vinext/dist/cli.js", "start"],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      HOSTNAME: "127.0.0.1",
      PORT: String(internalPort),
    },
    stdio: "inherit",
  },
);

async function resolveStaticFile(pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const relativePath = decodedPath.replace(/^\/+/, "");
  if (!relativePath) return null;

  const filePath = path.resolve(clientRoot, relativePath);
  if (!filePath.startsWith(`${clientRoot}${path.sep}`)) return null;

  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile() ? { filePath, fileStat, relativePath } : null;
  } catch {
    return null;
  }
}

function proxyRequest(incoming, outgoing) {
  const upstream = createProxyRequest(
    {
      hostname: "127.0.0.1",
      port: internalPort,
      method: incoming.method,
      path: incoming.url,
      headers: {
        ...incoming.headers,
        host: incoming.headers.host,
        "x-forwarded-host": incoming.headers.host,
        "x-forwarded-proto": incoming.headers["x-forwarded-proto"] || "http",
      },
    },
    (response) => {
      outgoing.writeHead(response.statusCode || 502, response.headers);
      response.pipe(outgoing);
    },
  );

  upstream.on("error", () => {
    if (!outgoing.headersSent) {
      outgoing.writeHead(503, { "Content-Type": "text/plain; charset=utf-8" });
    }
    outgoing.end("Serviço temporariamente indisponível");
  });
  incoming.pipe(upstream);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const staticFile =
    request.method === "GET" || request.method === "HEAD"
      ? await resolveStaticFile(url.pathname)
      : null;

  if (!staticFile) {
    proxyRequest(request, response);
    return;
  }

  const extension = path.extname(staticFile.filePath).toLowerCase();
  const immutable = staticFile.relativePath.startsWith("assets/");
  response.writeHead(200, {
    "Cache-Control": immutable
      ? "public, max-age=31536000, immutable"
      : "public, max-age=3600",
    "Content-Length": staticFile.fileStat.size,
    "Content-Type": contentTypes.get(extension) || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  createReadStream(staticFile.filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`[artomos] Production server running at http://${host}:${port}`);
});

function shutdown(signal) {
  server.close(() => process.exit(0));
  vinext.kill(signal);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
vinext.on("exit", (code) => {
  if (code && code !== 0) process.exit(code);
});
