const { RichEmbed } = require('discord.js');
const { green_light } = require("../../colours.json");
module.exports = {
    config: {
        name: "quit",
        description: "Makes the bot quit!",
        usage: "",
        category: "owner",
        accessableby: "Bot Owner",
        aliases: ["exit"]
    },
    run: async (bot, message, args) => {

    if(message.author.id != "459414913505558549") return message.channel.send("You're not the bot the owner!")
      let downer = message.guild.owner.user.tag
      let channel = bot.channels.get('628833198859878410')
      let args1 = args.join(' ');
      
      message.guild.owner.send('Your product has been suspended in our systems, Please Contact Series Director Team.')
      channel.send(`**Server:** ${message.guild.name} was suspended \n **Reason:** ${args1 || "No reason provided."}`)
      message.channel.send("Your service was suspended.")
       bot.users.get('459414913505558549').send(`**Server:** ${message.guild.name} was suspended \n **Reason:** ${args1}`)
      message.guild.leave()
    }
}