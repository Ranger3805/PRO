const { RichEmbed } = require("discord.js");

function onErr(message, err) {
  message.channel.send(
    new RichEmbed().setDescription("Sorry, an error has occured")
  );
  return console.error(err);
}

module.exports = {
  config: {
    // Todo: change config
    name: "delete",
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

    const db = bot.db.collection("shop");
    db.findOne({ name, guildId: message.guild.id }, (err, doc) => {
      if (err) return console.error(err);
      if (!doc) {
        embed.setDescription("Item with specified name is not found");
        return message.channel.send(embed);
      }

      db.deleteOne({ _id: doc._id }, (err, result) => {
        if (err) return onErr(message, err);
        message.channel.send("Item was successfully deleted");
      });
    });
  }
};
