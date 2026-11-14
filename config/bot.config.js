
const digits = value => String(value || "").replace(/\D/g, "");

const ownerNumber = digits(process.env.OWNER_NUMBER);

const channel = Object.freeze({
  name: "TOLUWALASE STUDIOS",
  jid: String(process.env.CHANNEL_JID || "")
});

export default Object.freeze({
  name: String(process.env.BOT_NAME || "Toluwalase XMD").trim(),
  version: String(process.env.BOT_VERSION || "1.0.0").trim(),
  prefix: String(process.env.PREFIX || "!"),
  ownerName: String(process.env.OWNER_NAME || "Toluwalase Studios").trim(),
  ownerNumber,
  ownerNumbers: Object.freeze(ownerNumber ? [ownerNumber] : []),
  defaultMode: String(process.env.BOT_MODE || "public").toLowerCase() === "private" ? "private" : "public",
  sessionDirectory: String(process.env.FEI_SESSION_DIR || "./auth_info_baileys").trim(),
  dataDirectory: String(process.env.FEI_DATA_DIR || "./data").trim(),
  logLevel: String(process.env.LOG_LEVEL || "info").trim().toLowerCase(),
  browser: "Chrome",
  channel,
  imageUrl: String(process.env.BOT_IMAGE_URL || "").trim(),
  botUrl: String(process.env.BOT_URL || "").trim()
});

