const { RichEmbed } = require("discord.js");
const { gold } = require("../../colours.json");

const Constants = require("../../util/Constants");

module.exports = {
  config: {
    name: "announce",
    description: "Makes announcement in announcements",
    usage: "<text>",
    category: "server",
    setup:
      "Permissions Required: Manage Roles or Administrator. Channel Required: `announcements`",
    accessableby: "Administartors",
    aliases: ["ann", "h"]
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"]))
      return message.channel.send(
        "You dont have permission to perform this command!"
      );

    if (!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"]))
      return message.channel.send(
        "I don't have permission to perform this command."
      );

    const db = bot.db
      .collection("guildConfig")
      .findOne({ guildId: message.guild.id }, (err, doc) => {
        if (err) console.error(err);
        if (!doc) doc = Constants.DefaultOptions.guildConfig;
        
        const chId = doc.announcementsChannelId;
        if (!chId) return;
        const ch = bot.channels.get(chId);
        if (!ch) return;
        
        const sayMessage = args.join(" ");
        message.delete().catch();

        let botEmbed = new RichEmbed()
          .setTitle("📢| Announcement!")
          .setDescription(`Made by: <@${message.author.id}>`)
          .setColor(gold)
          .addField("Message:", `${sayMessage}`);

        ch.send(botEmbed);
      });
  }
};
