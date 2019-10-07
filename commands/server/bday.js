const { Discord } = require("discord.js")
const { RichEmbed } = require("discord.js")
const { gold } = require("../../colours.json")
const { prefix } = require("../../botconfig.json");
const Constants = require("../../util/Constants");
module.exports= {
    config: {
        name: "bday",
        description: "Create a birthday!",
        usage: "<name> <age> ",
        category: "server",
        setup: "Permissions Required: Manage Roles or Administrator. Channel Required: \`🎉》birthday\`",
        accessableby: "Administartors",
        aliases: ["birthday"]
    },
    run: async (bot, message, args, guild) => {
      if (!message.guild.member(bot.user).hasPermission("MANAGE_ROLES")) return message.channel.send(`Sorry, couldn't make the announcement. I dont have permission too.`)

 if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("Sorry. Seems you dont have the permissions to create a bday announcement!");
      
      const db = bot.db
      .collection("guildConfig")
      .findOne({ guildId: message.guild.id }, (err, doc) => {
        if (err) console.error(err);
        if (!doc) doc = Constants.DefaultOptions.guildConfig;
        
        const chId = doc.birthdayChannelId;
        if (!chId) return;
        const ch = bot.channels.get(chId);
        if (!ch) return message.channel.send("No channel was specified do @Series#6195 help for it!");
        
      const cmd = args.slice(1).join(' ').split(' | ');

      if (cmd < 1) return message.channel.send("**You did not provide any text to embed!** Example Usage:\`!bday Series age \`").then(m => m.delete(20000))
      
      let botEmbed = new RichEmbed()
      .setTitle("🎉》 Birthday!")
      .setDescription(`Its ${args[0]} birthday! He/She is now ${args[1]}, Please wish them a great birhtday in there dms!`)
      .setColor(gold);

        ch.send(botEmbed)
    });
    }
}