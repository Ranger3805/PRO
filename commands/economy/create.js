const { RichEmbed } = require("discord.js");
const mongo = require("mongodb");

function onErr(message, err) {
  message.channel.send(
    new RichEmbed().setDescription("Sorry, an error has occured")
  );
  return console.error(err);
}

module.exports = {
  config: {
    // Todo: change config
    name: "create",
    description: "",
    usage: "",
    category: "economy", // Todo: change category
    accessableby: "",
    setup: "",
    aliases: []
  },

  run(bot, message, args) {
    if (!message.guild) return;
    if (!message.member) return;
    if (!message.member.permissions.has("ADMINISTRATOR")) return;

    const embed = new RichEmbed();

    const name = args[0] ? args[0].toLowerCase() : null;
    if (!name) {
      embed.setDescription("Please specify item name");
      return message.channel.send(embed);
    }

    const price = args[1] ? Number(args[1].replace(/\D/g, "")) : null;
    if (!price) {
      embed.setDescription("Please specify valid price");
      return message.channel.send(embed);
    }

    const db = bot.db.collection("shop");
    db.findOne({ guildId: message.guild.id, name }, (err, doc) => {
      if (err) return console.error(err);
      if (doc) {
        embed.setDescription("Item with specified name already exists");
        return message.channel.send(embed);
      }

      db.insertOne(
        { name, price, guildId: message.guild.id, _id: new mongo.ObjectId() },
        (err, result) => {
          if (err) return onErr(message, err);
          message.channel.send("Item was successfully created");
        }
      );
    });
  }
};
