const { Discord } = require("discord.js")
const { RichEmbed } = require("discord.js")
const { prefix } = require("../../botconfig.json");

module.exports= {
    config: {
    name: "gannounce",
    noalias: "No Aliases",
    description: "Sends an announcements into servers",
    usage: ``,
    category: "owner",
    accessableby: "Bot Owner",
    aliases: []
},

  run: async (bot, message, args) => {

  if(message.author.id != "459414913505558549") return message.channel.send("Only the **Bot Owner** can use this command")
    let guild = bot.guilds 
    let gChannel = guild.forEach(guild.channels.filter(c => c.permissionsFor(bot.user).has("SEND_MESSAGES") && c.type === "text").map(r => r.id)[0]) 
    
    let gMessage = args.join(' ')
    
    let gEmbed = new RichEmbed()
    .setTitle("》Global Announcement")
    .setDescription(gMessage)
    
    gChannel.send(gEmbed)
    message.delete()
  }
}