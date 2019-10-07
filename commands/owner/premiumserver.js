const { Discord, RichEmbed, WebhookClient } = require("discord.js");
const mongo = require("mongodb");

const { cyan } = require("../../colours.json");

const Constants = require("../../util/Constants");

function onErr(message, err) {
  message.channel.send(
    new RichEmbed().setDescription("Sorry, an error has occured")
  );
  return console.error(err);
}

function success(message) {
  message.channel.send("Congratulations! This server has been upgraded to premium status!");
}

module.exports = {
  config: {
    name: "premiumserver",
    aliases: [],
    usage: "",
    category: "owner",
    setup: "",
    description: "A link for the Series Premium Pass.",
    accessableby: "Bot Owner"
  },

  run: async (bot, message, args) => {
    if (!message.guild) return;
    if (message.author.id !== "459414913505558549") return;
    
    const embed = new RichEmbed();
    
    const db = bot.db.collection("guildConfig");
    db.findOne({ guildId: message.guild.id }, (err, doc) => {
      if (err) return onErr(message, err);
      const newDoc = {
        ...Constants.DefaultOptions.guildConfig,
        ...(doc || {}),
        guildId: message.guild.id
      };
      if (newDoc.premium) {
        embed.setDescription("This server already has premium status");
        return message.channel.send(embed);
      }
      newDoc.premium = true;
      if (!doc) {
        return db.insertOne({ ...newDoc, _id: new mongo.ObjectId() }, (err, result) => {
          if (err) return onErr(message, err);
          success(message);
        });
      }
      db.updateOne({ _id: newDoc._id }, { $set: newDoc }, (err, result) => {
        if (err) return onErr(message, err);
        success(message);
      });
    });
  }
};
