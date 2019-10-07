  const { readdirSync } = require('fs')
  module.exports = (bot) => {
    const load = dirs => {
        const commands = readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'));
      commands.forEach(file => {
            let pull = require(`../commands/${dirs}/${file}`);
            bot.commands.set(pull.config.name, pull);
            if (pull.config.aliases) pull.config.aliases.forEach(a => bot.aliases.set(a, pull.config.name));
      });
        };
        ["fun", "images", "bot", "moderation", "owner", "tickets", "music", "server", "settings", "user", "economy"].forEach(x => load(x));
};
