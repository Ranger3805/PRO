const { RichEmbed } = require("discord.js")
const { redlight } = require("../../colours.json");
const Constants = require("../../util/Constants");
module.exports = {
    config: {
        name: "softban",
        description: "Softbans a user from the guild!",
        usage: " <user> <time>",
        category: "moderation",
        accessableby: "Administrators",
        setup: "Permissions Required: Ban Members or Administrator. Channel Required: \`modlogs\`",
        aliases: ["sb", "sbanish", "sremove"]
    },
    run: async (bot, message, args) => {

   if(!message.member.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("You do not have permission to perform this command!")

   let banMember = message.mentions.members.first() || message.guild.members.get(args[0])
   if(!banMember) return message.channel.send("Please provide a user to ban!")

   let reason = args.slice(1).join(" ");
   if(!reason) reason = "No reason given!"

   if(!message.guild.me.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("I dont have permission to perform this command")

   banMember.send(`Hello, you have been banned from ${message.guild.name} for: ${reason}`).then(() =>
   message.guild.ban(banMember, { days: 1, reason: reason})).then(() => message.guild.unban(banMember.id, { reason: "Softban"})).catch(err => console.log(err))

   message.channel.send(`**${banMember.user.tag}** has been banned`).then(m => m.delete(5000))

    const db = bot.db
      .collection("guildConfig")
      .findOne({ guildId: message.guild.id }, (err, doc) => {
        if (err) console.error(err);
        if (!doc) doc = Constants.DefaultOptions.guildConfig;
        
        const chId = doc.modChannelId;
        if (!chId) return;
        const ch = bot.channels.get(chId);
        if (!ch) return;

    let embed = new RichEmbed()
    .setColor(redlight)
    .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
    .addField("Moderation:", "Softban")
    .addField("Action Applied to:", banMember.user.username)
    .addField("Moderator:", message.author.username)
    .addField("Reason:", reason)
    .addField("Date:", message.createdAt.toLocaleString())

        ch.send(embed)
    })
          }
}
