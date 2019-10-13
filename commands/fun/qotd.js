const { RichEmbed } = require('discord.js')
const { gold } = require("../../colours.json");
module.exports = {
    config: {
        name: "qotd",
        description: "Question  of the day command",
        usage: " <text>",
        category: "fun",
        setup: "Channel Required: `\❓》qotd\`",
        accessableby: "Staff",
        aliases: ["question"]
    },
    run: async (bot, message, args) => {
      if(!message.member.hasPermission("ADMINISTRATOR")) return;
      const sayMessage = args.join(" ");
      message.delete().catch();

      let botEmbed = new RichEmbed()
      .setTitle(" ❓ | QOTD!")
      .setDescription(`By <@${message.author.id}>`)
      .setColor(gold)
      .addField("Message:", `${sayMessage}`);

          const db = bot.db
      .collection("guildConfig")
      .findOne({ guildId: message.guild.id }, (err, doc) => {
        if (err) console.error(err);
        if (!doc) doc = Constants.DefaultOptions.guildConfig;
        
        const chId = doc.qotdChannelId;
        if (!chId) return;
        const ch = bot.channels.get(chId);
        if (!ch) return;
      ch.send(botEmbed);
   })
          }
 }
