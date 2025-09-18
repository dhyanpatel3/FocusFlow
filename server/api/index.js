import app, { ensureDb } from "../app.js";

export default async function handler(req, res) {
  try {
    // Function-level CORS so preflight succeeds even if app/DB fails
    const originHeader = req.headers?.origin || "";
    const origins = (process.env.CORS_ORIGIN || "*")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const allowOrigin = origins.includes("*")
      ? "*"
      : origins.includes(originHeader)
      ? originHeader
      : origins[0] || "*";
    res.setHeader("Access-Control-Allow-Origin", allowOrigin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    if (allowOrigin !== "*") {
      res.setHeader("Vary", "Origin");
    }
    res.setHeader("Access-Control-Max-Age", "86400");

    // Quickly answer preflight
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      return res.end();
    }

    const url = req.url || "";
    // Allow health checks without DB to avoid crashes when env/DB is not ready
    if (!url.startsWith("/api/health")) {
      await ensureDb();
    }
    return app(req, res);
  } catch (err) {
    console.error("Serverless handler error:", err);
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}
