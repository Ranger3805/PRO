const { RichEmbed } = require("discord.js");

const Constants = require("../../util/Constants");

function onErr(message, err) {
  message.channel.send(
    new RichEmbed().setDescription("Sorry, an error has occured")
  );
  return console.error(err);
}

module.exports = {
  config: {
    // Todo: change config
    name: "inventory",
    description: "",
    usage: "",
    category: "economy", // Todo: change category
    accessableby: "",
    setup: "",
    aliases: []
  },

  run(bot, message, args) {
    if (!message.guild) return;

    const embed = new RichEmbed().setTitle("Inventory");

    const db = bot.db.collection("inventory");
    db.findOne(
      { userId: message.author.id, guildId: message.guild.id },
      (err, doc) => {
        if (err) return onErr(message, err);
        if (!doc) doc = Constants.DefaultOptions.inventory;
        embed.setDescription(
          doc.items
            .map(e => `${e[0].toUpperCase()}${e.slice(1)}`)
            .join("\n")
        );
        if (doc.items.length < 1) embed.setDescription("0 items found");
        message.channel.send(embed);
      }
    );
  }
};
