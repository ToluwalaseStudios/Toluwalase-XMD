
import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";

import config from "../config/bot.config.js";
import theme from "../config/theme.config.js";
import { loadCommands } from "../handlers/command-loader.js";
import { buildMenu } from "../lib/menu.js";

test("all selected public commands are loaded without collisions", async () => {
  const { commands, lookup } = await loadCommands(path.resolve("commands"));

  const count = category =>
    commands.filter(command => command.category === category).length;

  assert.equal(count("General"), 11);
  assert.equal(count("AI & Chat"), 11);
  assert.equal(count("AI Media"), 7);
  assert.equal(count("News"), 11);
  assert.equal(count("Group"), 23);
  assert.equal(count("Downloads"), 9);
  assert.equal(count("Games"), 9);
  assert.equal(count("Fun"), 17);
  assert.equal(count("Anime Info"), 16);
  assert.equal(count("Anime Rankings"), 11);
  assert.equal(count("Anime Random"), 4);
  assert.equal(count("Anime Tools"), 1);
  assert.equal(count("Anime Images"), 4);
  assert.equal(count("Anime GIFs"), 52);
  assert.equal(count("Canvas"), 2);
  assert.equal(count("Media & Tools"), 3);
  assert.equal(count("Chat & Privacy"), 2);
  assert.equal(count("Status"), 8);
  assert.equal(count("Owner"), 2);

  assert.equal(commands.length, 203);

  for (const name of [
    "menu", "help", "ping", "alive", "owner", "support", "time", "date", "version", "jid", "whoami",
    "ai", "ask", "gpt", "chatgpt", "mathgpt", "deepseek", "translate", "summarize", "fable5", "qwen", "deepseek2",
    "flux", "pollination", "tts", "tts2", "tts3", "tts4", "tts5",
    "news", "aljazeera", "cnn", "bbc", "guardian", "npr", "nytimes", "foxnews", "skynews", "dw", "punchnews",
    "welcome", "goodbye", "groupinfo", "groupjid", "getgcpp", "groupcount", "groupstats", "admins", "tagall", "link", "groupname", "groupdesc", "close", "open", "revoke", "resetlink", "kick", "remove", "add", "promote", "demote", "leave", "antilink", "warn", "warnlist", "gcstatus", "groupstatus", "gcstatusdm", "dmgcstatus", "autostatus", "autoview", "statusreact", "statusreactmode", "statusreactkeys", "antidelete", "antidel", "vv", "vv2",
    "aio", "fb", "twitter", "instagram", "ytmp4", "tiktok", "play2", "ytsearch", "video",
    "calc", "poll", "coinflip", "dice", "8ball", "choose", "trivia", "riddle", "activity", "pokemon",
    "joke", "dadjoke", "progjoke", "chuck", "fact2", "catfact", "dog", "cat", "fox", "advice", "quote2", "meme", "numfact", "history", "wiki", "nasa",
    "animemenu", "anime", "manga", "character", "charpic", "staff", "studio", "recommend", "episodes", "animechars", "trailer", "pictures", "streaming", "review", "genres", "genre",
    "topanime", "topmanga", "popular", "favorite", "airing", "upcoming", "trending", "season", "topchars", "schedule", "nextep",
    "randomanime", "randommanga", "randomchar", "animequote", "whatanime", "waifu2", "husbando", "neko", "kitsune",
    "angry", "baka", "bleh", "blowkiss", "blush", "bored", "carry", "clap", "confused", "cry", "cuddle", "dance", "facepalm", "feed", "handhold", "handshake", "happy", "highfive",
    "hug", "kabedon", "kiss", "lappillow", "laugh", "lurk", "nod", "nom", "nope", "nya", "pat", "peck", "poke", "pout", "run", "salute", "shake",
    "shocked", "shrug", "sip", "sleep", "smile", "smug", "spin", "stare", "teehee", "think", "thumbsup", "tickle", "wag", "wave", "wink", "yawn", "yeet",
    "wndwqute", "canvasquote", "lyrics", "privacy", "statusdraft", "statusideas", "runtime", "setprefix"
  ]) {
    assert.ok(lookup.has(name), "missing command " + name);
  }
});

test("sensitive, invasive and channel-specific commands are not registered", async () => {
  const { lookup } = await loadCommands(path.resolve("commands"));

  for (const name of [
    "channel", "onlineusers", "addmeta", "removemeta", "fakemsg",
    "antiedit", "readreceipt", "sendvv", "vvinfo", "tiktokstalk",
    "fakettc", "meme2", "fakeff", "fakeffduo", "ffgirl", "unsend", "edit",
    "block", "unblock", "disappear", "kick2", "bite", "bonk", "shoot", "slap", "tableflip"
  ]) {
    assert.equal(lookup.has(name), false, "excluded command was registered: " + name);
  }

  assert.equal(lookup.get("punch")?.category, "News");
  assert.equal(theme.sections.some(section => section.key === "Channel"), false);
});

test("all 18 menu sections appear in their configured order", async () => {
  const { commands } = await loadCommands(path.resolve("commands"));
  const menu = buildMenu({ commands, config, theme });

  const expectedTitles = theme.sections.map(section => section.title);
  const positions = expectedTitles.map(title => menu.indexOf(title));

  assert.equal(theme.sections.length, 18);
  assert.ok(positions.every(position => position >= 0));
  assert.ok(
    positions.every((position, index) =>
      index === 0 || positions[index - 1] < position
    )
  );

  assert.equal(menu.includes("📢 CHANNEL"), false);

  for (const command of [
    "news", "groupinfo", "aio", "trivia", "joke",
    "anime", "waifu2", "wave", "wndwqute",
    "lyrics", "privacy", "statusdraft", "runtime", "setprefix"
  ]) {
    assert.ok(menu.includes(config.prefix + command),
      "menu does not display " + command);
  }
});

test("uses Toluwalase XMD branding and one configured owner", () => {
  assert.equal(config.name, "Toluwalase XMD");
  assert.equal(config.ownerName, "Toluwalase Studios");

  assert.equal(config.ownerNumbers.length, 1);
  assert.equal(config.ownerNumbers[0], config.ownerNumber);

  assert.equal(config.channel.name, "TOLUWALASE STUDIOS");
  assert.equal(typeof config.imageUrl, "string");
  assert.equal(typeof config.botUrl, "string");
});

test("the menu sends the complete text menu", async () => {
  const { commands } = await loadCommands(path.resolve("commands"));
  const menuCommand = commands.find(command => command.name === "menu");

  assert.ok(menuCommand, "menu command is missing");

  const sent = [];

  const ctx = {
    config,
    theme,
    commands,
    send: async payload => sent.push({ type: "media", payload }),
    reply: async payload => sent.push({ type: "text", payload })
  };

  await menuCommand.run(ctx);

  assert.ok(sent.length > 0, "menu did not send anything");

  const textMessage = sent.find(item => item.type === "text");

  assert.ok(textMessage, "menu did not send its text content");

  for (const section of theme.sections) {
    assert.ok(
      textMessage.payload.includes(section.title),
      "menu is missing section: " + section.title
    );
  }

  assert.equal(textMessage.payload.includes("📢 CHANNEL"), false);
});
    
