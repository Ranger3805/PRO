const { RichEmbed } = require('discord.js')
const { gold } = require("../../colours.json");
module.exports = {
    config: {
        name: "fotd",
        description: "Fact of the day command",
        usage: " <text>",
        category: "fun",
        setup: "Channel Required: `\❕》fotd\` premission Required: `Administrator or FOTD Access role.`",
        accessableby: "Staff",
        aliases: ["fact"]
    },
    run: async (bot, message, args) => {
      if(!message.member.hasPermission("ADMINISTRATOR")) return;
      const sayMessage = args.join(" ");
      message.delete().catch();

      let botEmbed = new RichEmbed()
      .setTitle(" ❕ | Fact of the day!")
      .setDescription(`By <@${message.author.id}>`)
      .setColor(gold)
      .addField("Message:", `${sayMessage}`);

          const db = bot.db
      .collection("guildConfig")
      .findOne({ guildId: message.guild.id }, (err, doc) => {
        if (err) console.error(err);
        if (!doc) doc = Constants.DefaultOptions.guildConfig;
        
        const chId = doc.fotdChannelId;
        if (!chId) return;
        const ch = bot.channels.get(chId);
        if (!ch) return;


      ch.send(botEmbed);
   })
          }
 }
