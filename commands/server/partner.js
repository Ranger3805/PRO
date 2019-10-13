const { Discord } = require("discord.js")
const { RichEmbed } = require("discord.js")
const { WebhookClient } = require("discord.js")
const { gold } = require("../../colours.json")
const { prefix } = require("../../botconfig.json");
const Constants = require("../../util/Constants");
module.exports= {
    config: {
        name: "partner",
        description: "Create a partner!",
        usage: "<name> <text> ",
        category: "server",
        setup: "Permissions Required: Manage Roles or Administrator. Channel Required: \`📝》partnership\`",
        accessableby: "Administartors",
        aliases: [""]
    },
    run: async (bot, message, args, guild) => {
      if (!message.guild.member(bot.user).hasPermission("MANAGE_WEBHOOKS")) return message.channel.send(`Sorry, couldn't make the partner. I dont have permission too.`)

 if (!message.member.hasPermission("MANAGE_WEBHOOKS")) return message.reply("Sorry. Seems you dont have the permissions to create a partner!");
      
          const db = bot.db
      .collection("guildConfig")
      .findOne({ guildId: message.guild.id }, (err, doc) => {
        if (err) console.error(err);
        if (!doc) doc = Constants.DefaultOptions.guildConfig;
        
        const chId = doc.partnerChannelId;
        if (!chId) return;
        const ch = bot.channels.get(chId);
        if (!ch) return;
        
      const cmd = args.slice(1).join(' ').split(' | ');

      if (cmd < 1) return message.channel.send("**You did not provide any text to embed!** Example Usage:\`!partner Series Hey this series\`").then(m => m.delete(20000))
      
      let botEmbed = new RichEmbed()
      .setTitle(":clipboard:》 Partner")
      .setDescription(`**${args[0]}**, \n ${cmd}`)
      .setFooter(`Authorized by: ${message.guild.owner.user.username}`)
      .setColor(gold);


        ch.send(botEmbed)
      message.delete();
        
    })
          }
              
}