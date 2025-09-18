import app, { ensureDb } from "../app.js";

export default async function handler(req, res) {
  await ensureDb();
  return app(req, res);
}
