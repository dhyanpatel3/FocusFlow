import dotenv from "dotenv";
import { app, ensureDb } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

ensureDb()
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connection error", err);
    process.exit(1);
  });
