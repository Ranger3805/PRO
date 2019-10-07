const { RichEmbed } = require("discord.js");

module.exports = {
  config: {
    // Todo: change config
    name: "shop",
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

    const embed = new RichEmbed().setTitle("Shop");

    const db = bot.db.collection("shop");
    db.find({ guildId: message.guild.id }, (err, result) => {
      result.toArray().then(docs => {
        embed.setDescription(
          docs
            .map(
              e => `${e.name[0].toUpperCase()}${e.name.slice(1)} | ${e.price}$`
            )
            .join("\n")
        );
        if (docs.length < 1) embed.setDescription("0 items found");
        message.channel.send(embed);
      });
    });
  }
};
