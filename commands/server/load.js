
const { RichEmbed } = require("discord.js");
const mongo = require("mongodb");

const Constants = require("../../util/Constants");

function success(message) {
  const embed = new RichEmbed().setDescription("Command successfully loaded");
  message.channel.send(embed);
}

function onErr(message, err = "") {
  const embed = new RichEmbed().setDescription("Sorry, an error has occured");
  message.channel.send(embed);
  return console.error(err);
}

module.exports = {
  config: {
    name: "load",
    description: "",
    usage: "",
    category: "server",
    accessableby: "Administrators",
    setup: "",
    aliases: []
  },

  run(bot, message, args) {
    if (!message.guild) return;
    if (!message.member) return;
    if (!message.member.permissions.has("ADMINISTRATOR")) return;
    
    const embed = new RichEmbed();

    const commandName = args[0];
    if (!commandName) {
      embed.setDescription("Please specify a command");
      return message.channel.send(embed);
    }

    const command = bot.commands.get(bot.aliases.get(args[0]) || args[0]);
    if (!command) {
      embed.setDescription("Command not found.");
      return message.channel.send(embed);
    }

    const db = bot.db.collection("guildConfig");
    db.findOne({ guildId: message.guild.id }, (err, doc) => {
      if (err) return onErr(message, err);
      const newDoc = {
        ...Constants.DefaultOptions.guildConfig,
        ...(doc || {}),
        guildId: message.guild.id
      };
      if (!newDoc.disabledCommands.includes(command.config.name)) {
        embed.setDescription("Specified command is not disabled.");
        return message.channel.send(embed);
      }
      if (!doc) {
        return db.insertOne({ _id: new mongo.ObjectId() }, (err, result) => {
        if (err) return onErr(message, err);
          success(message);
        });
      }
      newDoc.disabledCommands = newDoc.disabledCommands.filter(
        e => e !== command.config.name
      );
      db.updateOne({ _id: newDoc._id }, { $set: newDoc }, (err, result) => {
        if (err) return onErr(message, err);
        success(message);
      });
    });
  }
};
