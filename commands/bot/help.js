const { RichEmbed } = require("discord.js");
const { prefix } = require("../../botconfig.json");
const { readdirSync } = require("fs")
const { stripIndents } = require("common-tags")
const { gold } = require("../../colours.json")

const Constants = require("../../util/Constants");

module.exports = {
    config: {
        name: "help",
        aliases: ["h", "halp", "commands"],
        usage: " (command)",
        category: "bot",
        setup: "",
        description: "Displays all commands that the bot has.",
        accessableby: "Members"
    },
    run: async (bot, message, args) => {
        const embed = new RichEmbed()
            .setColor(gold)
            .setAuthor(`⭐| Series Help`, message.guild.iconURL)
            .setThumbnail(bot.user.displayAvatarURL)

        if(!args[0]) {
            const categories = readdirSync("./commands/")
            categories.push("disabled");

            embed.setDescription(`These are the avaliable commands for ${message.guild.me.displayName}\nThe bot prefix is: **${prefix}**`)
            embed.setFooter(`⭐| © Series | Total Commands: ${bot.commands.size}`, bot.user.displayAvatarURL);

          bot.db.collection("guildConfig").findOne({ guildId: message.guild.id }, (err, doc) => {
            if (err) console.error(err);
            if (!doc) doc = Constants.DefaultOptions.guildConfig;
            const commands = bot.commands.map(e => {
              if (doc.disabledCommands.includes(e.config.name)) {
                e.config.displayCategory = "disabled";
              } else {
                e.config.displayCategory = e.config.category;
              }
              return e;
            });
            categories.forEach(category => {
                let dir = commands.filter(c => c.config.displayCategory === category);
                if (dir.length > 0) {
                  const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1)
                  embed.addField(`❯ ${capitalise} [${dir.length}]:`, dir.map(c => `\`${c.config.name}\``).join(" "))
                }
            })
            message.author.send(embed).catch(() => {});
          });
        } else {
            let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
            if(!command) return message.channel.send(embed.setTitle("Invalid Command.").setDescription(`Do \`${prefix}help\` for the list of the commands.`))
            command = command.config

            embed.setDescription(stripIndents`The bot's prefix is: \`${prefix}\`\n
            **Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}
            **Description:** ${command.description || "No Description provided."}
            **Setup:** ${command.setup || "No setup is required!"}
            **Usage:** ${command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : "No Usage"}
            **Accessible by:** ${command.accessableby || "Members"}
            **Aliases:** ${command.aliases ? command.aliases.join(", ") : "None."}`)

            return message.channel.send(embed)
        }
    }
}
