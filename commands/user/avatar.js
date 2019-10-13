const { RichEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "avatar",
        description: "Get a member's avatar",
        usage: "<user>",
        category: "misc",
        aliases: ["av"]
    },
    run: async (client, message, args) => {
        if (!args[0]) {
            let embed = new RichEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setTitle(`Avatar`)
            .setColor('#fde3a7')
            .setImage(message.author.avatarURL);

            message.channel.send(embed);

        }
        let avatarMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        let embed = new RichEmbed()
        .setAuthor(avatarMember.user.tag, avatarMember.user.avatarURL)
        .setTitle(`Avatar`)
        .setColor('#fde3a7')
        .setImage(avatarMember.user.avatarURL);

        message.channel.send(embed);
    }
}