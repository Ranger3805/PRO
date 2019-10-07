var express = require("express");
var app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);

const { Client, Collection } = require("discord.js");
const { discord } = require("discord.js");
const { RichEmbed } = require("discord.js");
const { token } = require("./botconfig.json");
const bot = new Client();
const moment = require("moment");
const fs = require("fs");
const { EventEmitter } = require("events");

const { prefix, mongoUrl } = require("./botconfig.json");
const { bannedServers } = require("./settings.json");

const db = require("./util/db");
const Constants = require("./util/Constants");

const { giveawayEnd, set } = require("./util/helpers");

const lastMessages = {};

const dbEmitter = new EventEmitter();

db(mongoUrl).then(db => {
  bot.db = db;
  console.log("DB connection opened."); // Todo: Edit if needed.
  dbEmitter.emit("open", db);
});

["aliases", "commands"].forEach(x => (bot[x] = new Collection()));
["console", "command", "event"].forEach(x => require(`./handlers/${x}`)(bot));

function giveaway() {
  const db = bot.db.collection("giveaways");
  db.find({}, (err, result) => {
    if (err) return console.error(err);
    result.toArray().then(docs => {
      docs.forEach(async doc => {
        const channel = bot.channels.get(doc.channelId);
        if (!channel)
          return db.deleteOne({ _id: doc._id }, (err, result) => {});
        const message = await channel.fetchMessage(doc.messageId);
        if (!message)
          return db.deleteOne({ _id: doc._id }, (err, result) => {});
        giveawayEnd(bot, message, doc.end, {
          reward: doc.reward,
          winnerCount: doc.winnerCount
        });
      });
    });
  });
}

// Set commands
set(bot);

// Spam prot
bot.on("message", message => {
  if (!message.guild) return;
  if (message.author.id === bot.user.id) return;

  if (!bot.db) return;

 const db = bot.db.collection("guildConfig");
  db.findOne({ guildId: message.guild.id }, (err, doc) => {
    if (err) console.error(err);
    if (!doc) doc = Constants.DefaultOptions.guildConfig;
    if (!doc.spamProtection) return;
    if (!message.content) return;
    
    const id = `${message.guild.id}${message.channel.id}${message.author.id}`;
    if (!lastMessages[id]) {
      lastMessages[id] = { timestamp: Date.now(), count: 0 };
    }
    lastMessages[id].count += 1;
    
    if (lastMessages[id].timestamp < Date.now() - 5 * 1000) delete lastMessages[id];
    else if (lastMessages[id].count >= 7) {
      message.delete();
      message.channel.send("WOAH! Calm down with the spamming!");
    }
    
    if (lastMessages[id]) {
      lastMessages[id].timestamp = Date.now();
    }
  });
});

// Caps protection
bot.on("message", message => {
  if (!message.guild) return;
  if (message.author.id === bot.user.id) return;

  if (!bot.db) return;

  const db = bot.db.collection("guildConfig");
  db.findOne({ guildId: message.guild.id }, (err, doc) => {
    if (err) console.error(err);
    if (!doc) doc = Constants.DefaultOptions.guildConfig;
    if (!doc.capsProtection) return;
    if (!message.content) return;
    if (message.content.length < 7) return;
    const len = message.content.length;
    const capsLen = message.content.split("").filter(e => e !== e.toLowerCase())
      .length;
    if ((capsLen / len) * 100 < 70) return;

    message.delete();
    message.channel.send("WOAH! Too much caps!");
  });
});

// Giveaway
bot.on("ready", () => {
  if (!bot.db) dbEmitter.on("open", () => giveaway());
  else giveaway();
});

bot.on("ready", () => {
  bot.guilds.map(guild =>
    console.log(
      `Name: ${guild.name} (ID: ${guild.id}) (Owner: ${guild.owner}) (Member Count: ${guild.memberCount})`
    )
  );
});
bot.on("guildCreate", guild => {
  if (!bannedServers) {
    let channel = bot.channels.get(
      guild.channels
        .filter(
          c =>
            c.permissionsFor(bot.user).has("SEND_MESSAGES") && c.type === "text"
        )
        .map(r => r.id)[0]
    );

    channel.send(
      `Thank you for inviting Series! We are happy to serve your server with all our will and possiblities! Commands list: \`!help\` \n Need help with the bot? Join our server: https://discord.gg/wen9SQC `
    );
  }
  if (bannedServers) {
    let channel = bot.channels.get(
      guild.channels
        .filter(
          c =>
            c.permissionsFor(bot.user).has("SEND_MESSAGES") && c.type === "text"
        )
        .map(r => r.id)[0]
    );
    channel.send(
      "Sorry, Our services were temporary suspended in your server. Please contact Series Service Provider"
    );
    guild.leave();
  }
});

bot.on("guildMemberAdd", member => {
  let userLogs = member.guild.channels.find(c => c.name === "📜》servergates");

  if (userLogs) {
    // anthony#8577
    userLogs.send(
      `<:memberjoin:623491001662832641> User joined! \n **${member.user.tag}** (\`${member.user.id}\`) has joined!`
    );
  }
});

bot.on("guildMemberRemove", member => {
  let userLogs = member.guild.channels.find(c => c.name === "📜》servergates");

  if (userLogs) {
    // anthony#8577
    userLogs.send(
      `<:memberleave:623491013859606558> User left! \n  **${member.user.tag}** (\`${member.user.id}\`)has left!`
    );
  }
});
const serverStats = {
  guildID: "614904662575022083",
  totalUserID: "621922381937508381",
  memberCountID: "621922465773256741",
  botCountID: "621922556743647242"
};
bot.on("guildMemberAdd", member => {
  if (member.guild.id !== serverStats.guildID) return;
  bot.channels
    .get(serverStats.totalUserID)
    .setName(`Total Users: ${member.guild.memberCount}`);
  bot.channels
    .get(serverStats.memberCountID)
    .setName(
      `Member Count: ${member.guild.members.filter(m => !m.user.bot).size}`
    );
  bot.channels
    .get(serverStats.botCountID)
    .setName(`Bot Count: ${member.guild.members.filter(m => m.user.bot).size}`);
});
bot.on("guildMemberRemove", member => {
  if (member.guild.id !== serverStats.guildID) return;
  bot.channels
    .get(serverStats.totalUserID)
    .setName(`Total Users : ${member.guild.memberCount}`);
  bot.channels
    .get(serverStats.memberCountID)
    .setName(
      `Member Count : ${member.guild.members.filter(m => !m.user.bot).size}`
    );
  bot.channels
    .get(serverStats.botCountID)
    .setName(
      `Bot Count : ${member.guild.members.filter(m => m.user.bot).size}`
    );
});

bot.login(token);
