const { RichEmbed } = require("discord.js");

const Constants = require("../../util/Constants");

module.exports = {
  config: {
    // Todo: change config
    name: "bank",
    description: "",
    usage: "",
    category: "economy", // Todo: change category
    accessableby: "",
    setup: "",
    aliases: []
  },

  run(bot, message, args) {
    if (!message.guild) return;

    const user =
      message.mentions.users.first() ||
      bot.users.get(args[0]) ||
      message.author;

    const db = bot.db.collection("balance");
    db.findOne({ userId: user.id, guildId: message.guild.id }, (err, doc) => {
      if (err) console.error(err);
      if (!doc) doc = Constants.DefaultOptions.balance;

      const embed = new RichEmbed();
      embed.setDescription(`${user}'s Bank Account`);
      if (user.id === message.author.id) {        
        embed.setDescription("Here is your Bank Account info");
      }
      embed.addField("Balance", doc.money);
      message.channel.send(embed);
    });
  }
};
