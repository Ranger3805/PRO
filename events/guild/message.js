const mongo = require("mongodb");

const { prefix: defaultPrefix } = require("../../botconfig.json");

const Constants = require("../../util/Constants");
const { nextLvlXp: getNextLvLXp } = require("../../util/helpers");

function onLvlUp(bot, message, doc) {
  return message.channel.send(`Congrats! You leveled up to ${doc.lvl}`)
  .then(msg => msg.delete(10 * 1000));
}

function addXp(bot, message) {
  if (!message.guild) return;
  //Hello!
  if (message.guild.members.has("627888659357761536")) return;

  const cooldowns = bot.db.collection("cooldowns");
  const xp = bot.db.collection("xp");

  cooldowns.findOne(
    { userId: message.author.id, guildId: message.guild.id },
    (err, doc) => {
      if (err) return console.error(err);
      const cdDoc = { ...Constants.DefaultOptions.cooldowns, ...(doc || {}) };
      if (cdDoc.xp + Constants.Cooldowns.xp > Date.now()) return;
      cdDoc.xp = Date.now();
      if (!doc) {
        cooldowns.insertOne({ ...cdDoc, _id: new mongo.ObjectId() }, (err, result) => {
          if (err) console.error(err);
        });
      } else {
        cooldowns.updateOne({ _id: cdDoc._id }, { $set: cdDoc }, (err, result) => {
          if (err) console.error(err);
        });
      }
      if (!doc) doc = Constants.DefaultOptions.cooldowns;

      xp.findOne(
        { userId: message.author.id, guildId: message.guild.id },
        (err, doc) => {
          if (err) return console.error(err);
          const newDoc = {
            ...Constants.DefaultOptions.xp,
            ...(doc || {}),
            userId: message.author.id,
            guildId: message.guild.id
          };

          const { minXp, maxXp } = Constants;

          const nextLvlXp = getNextLvLXp(newDoc.lvl);
          const gainedXp =
            Math.floor(Math.random() * (maxXp - minXp + 1)) + minXp;
          
          newDoc.xp += gainedXp;
          newDoc.lvlXp += gainedXp;
          
          if (newDoc.lvlXp >= nextLvlXp) {
            newDoc.lvlXp -= nextLvlXp;
            newDoc.lvl += 1;
            onLvlUp(bot, message, newDoc);
          }
          
          if (!doc) {
            return xp.insertOne({ ...newDoc, _id: new mongo.ObjectId() }, (err, result) => {
              if (err) return console.error(err);
            });
          }
          xp.updateOne({ _id: newDoc._id }, { $set: newDoc }, (err, result) => {
            if (err) return console.error(err);
          });
        }
      );
    }
  );
}

module.exports = async (bot, message) => {
  if (message.author.bot || message.channel.type === "dm") return;

  const db = bot.db.collection("guildConfig");
  db.findOne({ guildId: message.guild.id }, (err, doc) => {
    let prefix = defaultPrefix;

    if (err) console.error(err);
    // Not returning to avoid problems with bot's work capacity
    else if (doc && typeof doc.prefix === "string") prefix = doc.prefix;

    if (!message.content.startsWith(prefix)) prefix = `<@!${bot.user.id}>`;
    if (!message.content.startsWith(prefix)) prefix = `<@${bot.user.id}>`;

    if (!message.content.startsWith(prefix)) return addXp(bot, message);
    
    let args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let commandfile =
      bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd));
    if (commandfile && commandfile.config && commandfile.config.name) {
      bot.db
        .collection("guildConfig")
        .findOne({ guildId: message.guild.id }, (err, doc) => {
          if (err) console.error(err);
          if (!doc) doc = Constants.DefaultOptions.guildConfig;
          if (doc.disabledCommands.includes(commandfile.config.name)) {
            return addXp(bot, message);
          }
          commandfile.run(bot, message, args);
        });
    } else addXp(bot, message);
  });
};
