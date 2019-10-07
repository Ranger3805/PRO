const { Discord } = require("discord.js")
const { RichEmbed } = require("discord.js");
const { cyan } = require("../../colours.json")
const { WebhookClient } = require("discord.js");
module.exports = {
    config: {
        name: "premium",
        aliases: [],
        usage: "",
        category: "bot",
        setup: "",
        description: "A link for the Series Premium Pass.",
        accessableby: "Members"
    },

      run: async (bot, message, args) => {

      let bicon = bot.user.displayAvatarURL;

      let botEmbed = new RichEmbed()
      .setTitle("😊| Premium Link!")
      .setURL("https://www.roblox.com/game-pass/7067105/Series-Premium-Pass")
      .setColor(cyan);

      message.channel.send(botEmbed);
   }
 }
