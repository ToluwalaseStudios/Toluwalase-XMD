
import path from "node:path";
import { createJsonStateStore } from "./state-store.js";

const dataDirectory = path.resolve(
  process.env.FEI_DATA_DIR || "./data"
);

const store = createJsonStateStore({
  filePath: path.join(dataDirectory, "bot-settings.json"),
  defaults: { prefix: "!" }
});

export async function getBotPrefix(fallback = "!") {
  const state = await store.load();

  return typeof state.prefix === "string" && state.prefix.trim()
    ? state.prefix.trim()
    : fallback;
}

export async function setBotPrefix(value) {
  const prefix = String(value || "").trim();

  if (!prefix || prefix.length > 3 || /\s/.test(prefix)) {
    throw new Error("Prefix must contain 1–3 non-space characters.");
  }

  await store.set("prefix", prefix);
  return prefix;
  }
