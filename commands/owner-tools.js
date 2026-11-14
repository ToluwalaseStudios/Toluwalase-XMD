import { setBotPrefix } from "../lib/bot-settings.js";

export default {
  name: "setprefix",
  category: "Owner",
  description: "Change the bot command prefix.",
  run: async ctx => {
    if (!ctx.owner) {
      return ctx.reply("⛔ Only the bot owner can change the prefix.");
    }

    const newPrefix = String(ctx.args || "").trim();

    if (!newPrefix) {
      const current = ctx.config.prefix || "!";
      return ctx.reply(
        "Current prefix: " + current +
        "\nUsage: " + current + "setprefix <new prefix>"
      );
    }

    try {
      const prefix = await setBotPrefix(newPrefix);
      await ctx.reply(
        "✅ *PREFIX UPDATED*\n\n" +
        "New prefix: " + prefix +
        "\nExample: " + prefix + "menu"
      );
    } catch (error) {
      await ctx.reply("❌ " + error.message);
    }
  }
};
        
