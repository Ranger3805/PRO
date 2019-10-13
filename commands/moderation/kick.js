const { RichEmbed } = require("discord.js")
const { redlight } = require("../../colours.json");
const Constants = require("../../util/Constants");
module.exports = {
    config: {
        name: "kick",
        description: "Kick a user from the guild!",
        usage: " <@user> <reason>",
        category: "moderation",
        setup: "Permissions Required: Manage Roles or Administrator. Channel Required: \`modlogs\`",
        accessableby: "Moderator",
        aliases: ["k"]
    },
    run: async (bot, message, args) => {

    if(!message.member.hasPermission(["KICK_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("You dont have permission to perform this command!")

    let kickMember = message.mentions.members.first() || message.guild.members.get(args[0])
    if(!kickMember) return message.channel.send("Please provide a user to kick!")

    let reason = args.slice(1).join(" ")
    if(!reason) reason = "No reason given!"

    if(!message.guild.me.hasPermission(["KICK_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("I dont have permission to do this!")

    kickMember.send(`Hello, you have been kicked from ${message.guild.name} for: ${reason}`).then(() =>
    kickMember.kick()).catch(err => console.log(err))

    message.channel.send(`**${kickMember.user.tag}** has been kicked`).then(m => m.delete(5000))

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
    .addField("Moderation:", "Kick")
    .addField("Action Applied to:", kickMember.user.username)
    .addField("Moderator:", message.author.username)
    .addField("Reason:", reason)
    .addField("Date:", message.createdAt.toLocaleString())

        ch.send(embed)
    })
          }
}
