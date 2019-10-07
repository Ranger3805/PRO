const { RichEmbed } = require("discord.js");

const Constants = require("../../util/Constants");

module.exports = {
  config: {
    name: "warninfo",
    description: "Check information about the user's warns.(credits to zargovv)",
    usage: " <user>",
    category: "moderation",
    accessableby: "Members",
    setup: "Permissions Required: Kick Members.",
    aliases: []
  },
  
  run(bot, message, args) {
    if (!message.guild) return;
    if (!message.member) return;
    
    const user = message.mentions.users.first() || bot.users.get(args[0]);
    
    const embed = new RichEmbed();
    
    if (!user) {
      embed.setDescription("Please specify the user.");
      return message.channel.send(embed);
    }
    
    const db = bot.db.collection("warns");
    db.findOne({ userId: user.id, guildId: message.guild.id }, (err, doc) => {
      if (err) {
        embed.setDescription("An error has occured");
        message.channel.send(embed);
        return console.error(err);
      }
      
      if (!doc) doc = Constants.DefaultOptions.warns;
      
      if (doc.info.length < 1) {
        embed.setDescription("This user wasn't warned in this server");
      } else {
        embed
          .setDescription(`${user}'s warns`)
          .addField("Last 10 warns", doc.info.map((e, i) => `${i + 1}. ${e.reason} | By: <@!${e.warnerId}>`).join("\n") || '\u200B');  
      }
      
      message.channel.send(embed);
    });
  }
};
