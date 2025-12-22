import express from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";

const app = express();

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err, _req, res, _next) => {
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";

    log(`error ${status} :: ${message}`);
    if (app.get("env") === "development" && err?.stack) {
      log(err.stack);
    }

    res.status(status).json({ message });
  });

  // Setup Vite in development, static serving in production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const host = "0.0.0.0";
  const basePort = parseInt(process.env.PORT || "8000", 10);

  function listenOn(port, attemptsLeft = 10) {
    server.listen({ port, host }, () => {
      log(`serving on port ${port}`);
    }).on("error", (err) => {
      if (err && err.code === "EADDRINUSE" && attemptsLeft > 0) {
        const nextPort = port + 1;
        log(`port ${port} in use, retrying on ${nextPort}…`);
        listenOn(nextPort, attemptsLeft - 1);
        return;
      }
      throw err;
    });
  }

  listenOn(basePort);
})();
