const { RichEmbed } = require("discord.js");

module.exports = {
  config: {
    name: "clearwarns",
    description:
      "Clear the user's warns information history(credits to zargovv)",
    usage: " <user>",
    category: "moderation",
    setup: "Permissions Required: Kick Members.",
    accessableby: "Moderators",
    aliases: []
  },

  run(bot, message, args) {
    if (!message.guild) return;
    if (!message.member) return;
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    const user = message.mentions.users.first() || bot.users.get(args[0]);

    const embed = new RichEmbed();

    if (!user) {
      embed.setDescription("Please specify the user.");
      return message.channel.send(embed);
    }

    const db = bot.db.collection("warns");
    db.findOne({ userId: user.id, guildId: message.guild.id }, (err, doc) => {
      if (!doc) {
        embed.setDescription("Cannot find specified user's warns");
        return message.channel.send(embed);
      }

      db.deleteOne({ _id: doc._id }, (err, result) => {
        if (err) {
          embed.setDescription("An error has occured");
          message.channel.send(embed);
          return console.error(err);
        }
        
        embed.setDescription(`${user}'s warns were successfully cleared`);
        message.channel.send(embed);
      });
    });
  }
};
