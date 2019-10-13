const { RichEmbed } = require("discord.js")
const { red_light } = require("../../colours.json");
const ms = require("ms");
const Constants = require("../../util/Constants");
module.exports = {
    config: {
        name: "tempmute",
        description: "",
        usage: "<user> <reason> <time>",
        category: "modrration",
        accessableby: "Members",
        aliases: ["tm"]
    },
    run: async (bot, message, args) => {
// check if the command caller has permission to use the command
if(!message.member.hasPermission("MANAGE_ROLES") || !message.guild.owner) return message.channel.send("You dont have permission to use this command.");

if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("I don't have permission to add roles!")
      
//define the reason and mutee
let time = args[2];
let mutee = message.mentions.members.first() || message.guild.members.get(args[0]);
if(!mutee) return message.channel.send("Please supply a user to be warned!");

let reason = args.slice(1).join(" ");
if(!reason) reason = "No reason given"  
//define mute role and if the mute role doesnt exist then create one
let muterole = message.guild.roles.find(r => r.name === "Muted")
if(!muterole) {
    try{
        muterole = message.guild.createRole({
            name: "Muted",
            color: "#514f48",
            permissions: []
        })
        message.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(muterole, {
                "SEND_MESSAGES": false,
                "ADD_REACTIONS": false,
                "SEND_TTS_MESSAGES": false,
                "ATTACH_FILES": false,
                "SPEAK": false
            })
        })
    } catch(e) {
        console.log(e.stack);
    }
}
 const db = bot.db
      .collection("guildConfig")
      .findOne({ guildId: message.guild.id }, (err, doc) => {
        if (err) console.error(err);
        if (!doc) doc = Constants.DefaultOptions.guildConfig;
        
        const chId = doc.modChannelId;
        if (!chId) return;
        const ch = bot.channels.get(chId);
        if (!ch) return;
        
//add role to the mentioned user and also send the user a dm explaing where and why they were muted
mutee.addRole(muterole.id).then(() => {
    message.delete()
    mutee.send(`Hello, you have been muted in ${message.guild.name} for: ${reason} Time: ${ms(ms(time))}`).catch(err => console.log(err))
    message.channel.send(`${mutee.user.username} was successfully muted for ${ms(ms(time))}.`)
})
setTimeout(function(){
  mutee.removeRole(muterole.id)
  message.channel.send(`<@${mutee.user.tag}> has been unmuted!`)
}, ms(time))
//send an embed to the modlogs channel
let embed = new RichEmbed()
    .setColor(red_light)
    .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
    .addField("Moderation:", "tempmute")
    .addField("Mutee:", mutee.user.username)
    .addField("Moderator:", message.author.username)
    .addField("Reason:", reason)
    .addField("Date:", message.createdAt.toLocaleString())
    .addField("Time:", ms(ms(time)))
ch.send(embed)
    })
 }
}