const { RichEmbed } = require("discord.js");

const Constants = require("../../util/Constants"); // Todo: change path

module.exports = {
  config: {
    // Todo: change config
    name: "jobs",
    description: "",
    usage: "",
    category: "economy", // Todo: change category
    accessableby: "",
    setup: "",
    aliases: []
  },

  run(bot, message, args) {
    const embed = new RichEmbed();

    embed.setTitle("Available jobs").setDescription(
      Constants.Jobs.map(e =>
        e.name
          .split(/ +/)
          .map(e => `${e[0].toUpperCase()}${e.slice(1)}`)
          .join(" ")
      ).join("\n")
    );

    message.channel.send(embed);
  }
};
