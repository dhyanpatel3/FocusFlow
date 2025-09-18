import app, { ensureDb } from "../app.js";

export default async function handler(req, res) {
  try {
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
