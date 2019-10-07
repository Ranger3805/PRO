const { RichEmbed } = require('discord.js');

const Constants = require('../../util/Constants');

function optionName(name) {
  name = name
    .split('')
    .map(e => (e === e.toUpperCase() ? ` ${e}` : e))
    .join('');
  name = name
    .split(' ')
    .map(e => `${e[0].toUpperCase()}${e.slice(1).toLowerCase()}`)
    .join(' ');
  return name;
}

function optionValue(name) {
  if (/^\d+$/.test(name)) name = `<#${name}>`;
  return name;
}

module.exports = {
  config: {
    name: 'settings',
    aliases: [],
    usage: '',
    category: 'settings',
    setup: 'Permission: Manage Guild',
    description: '',
    accessableby: '',
  },

  run(bot, message, args) {
    if (!message.guild) return;
    if (!message.member) return;
    if (!message.member.permissions.has('MANAGE_GUILD')) return;

    const embed = new RichEmbed(); // Embed could be edited using this line

    const db = bot.db.collection('guildConfig');
    db.findOne({ guildId: message.guild.id }, (err, doc) => {
      if (err) console.error(err);
      if (!doc) doc = Constants.DefaultOptions.guildConfig;
      delete doc._id;
      delete doc.guildId;
      for (const key in doc) {
        if ({}.hasOwnProperty.call(doc, key)) {
          if (typeof doc[key] !== 'string') delete doc[key];
        }
      }
      embed.setDescription(
        Object.keys(doc)
          .map(e => `**${optionName(e)}**: ${optionValue(doc[e] || 'Not Set')}`)
          .join('\n')
      );
      message.channel.send(embed);
    });
  },
};
