const { RichEmbed } = require("discord.js");
const mongo = require("mongodb");

const Constants = require("../../util/Constants");

function onErr(message, err) {
  const embed = new RichEmbed().setDescription("Sorry, an error has occured");
  message.channel.send(embed);
  return console.error(err);
}

function success(message) {
  const embed = new RichEmbed().setDescription(
    "Command was successfully disabled."
  );
  message.channel.send(embed);
}

module.exports = {
  config: {
    name: "disable",
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

    if (
      ["help", "disable", "load"].includes(command.config.name) ||
      ["owner", "bot"].includes(command.config.category)
    ) {
      embed.setDescription("You cannot disable this command");
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
      if (newDoc.disabledCommands.includes(command.config.name)) {
        embed.setDescription("Command is already disabled.");
        return message.channel.send(embed);
      }
      newDoc.disabledCommands = [
        command.config.name,
        ...newDoc.disabledCommands
      ];
      if (!doc) {
        return db.insertOne(
          { ...newDoc, _id: new mongo.ObjectId() },
          (err, result) => {
            if (err) return onErr(message, err);
            success(message);
          }
        );
      }
      db.updateOne({ _id: newDoc._id }, { $set: newDoc }, (err, result) => {
        if (err) return onErr(message, err);
        success(message);
      });
    });
  }
};
