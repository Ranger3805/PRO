const { RichEmbed } = require("discord.js");
const mongo = require("mongodb");

const Constants = require("./Constants");

function nextLvlXp(lvl) {
  return 100 + (50 + lvl * 5) * lvl;
}

function giveawayEnd(bot, message, end, options = {}) {
  setTimeout(() => {
    const winners = [];

    const { winnerCount, reward } = options;

    const users = message.reactions
      .get("🎉")
      .users.array()
      .filter(e => e.id !== bot.user.id);

    if (users.length < 1) {
      return message.channel.send("No one has won so the bot wins.");
    }

    if (users.length < winnerCount) {
      return message.channel.send(
        "There are too few people who participated, so the bot won."
      );
    }

    for (let i = 0; i < winnerCount; i++) {
      const winnerIndex = Math.floor(Math.random() * users.length);
      const winner = users.splice(winnerIndex, 1)[0];
      winners.push(winner);
    }

    winners.forEach(winner =>
      message.channel.send(`Congratulations ${winner}! You have won ${reward}`)
    );

    bot.db
      .collection("giveaways")
      .findOne(
        { messageId: message.id, channelId: message.channel.id },
        (err, doc) => {
          if (err) console.error(err);
          if (doc) {
            bot.db.collection("giveaways").deleteOne({ _id: doc._id });
          }
        }
      );
  }, end - Date.now());
}

function set(bot) {
  function channelCommand(message, val, doc) {
    if (!val) val = message.channel.id;
    if (!/^\d+$/.test(val)) {
      if (/^<#\d+>$/) val = val.replace(/\D/g, "");
      else {
        const ch = message.guild.channels.find(e => e.name === val);
        if (!ch) val = message.channel.id;
        else val = ch.id;
      }
    }
    if (!bot.channels.has(val)) {
      message.channel.send(
        new RichEmbed().setDescription('Channel not found')
      );
      return;
    }
    return val;
  }

  function valToBool(message, val, doc) {
    val = !(!val || ["0", "false"].includes(val));
    return val;
  }

  const setCommands = [
    {
      name: "prefix",
      aliases: [],
      async run(message, val, doc) {
        if (!val) val = undefined;
        const prefix = doc.prefix;
        doc.prefix = val;
        return [doc, (val || prefix)];
      }
    },
    {
      name: "welcomechannel",
      aliases: [],
      async run(message, val, doc) {
        if (!message.channel) return;
        val = channelCommand(message, val, doc);
        doc.welcomeChannelId = val;
        return [doc, `<#${val}>`];
      }
    },
    {
      name: "leavechannel",
      aliases: [],
      async run(message, val, doc) {
        if (!message.channel) return;
        val = channelCommand(message, val, doc);
        doc.leaveChannelId = val;
        return [doc, `<#${val}>`];
      }
    },
    {
      name: "moderationchannel",
      aliases: [],
      async run(message, val, doc) {
        if (!message.channel) return;
        val = channelCommand(message, val, doc);
        doc.modChannelId = val;
        return [doc, `<#${val}>`];
      }
    },
    {
      name: "messagelogsedit",
      aliases: [],
      async run(message, val, doc) {
        if (!message.channel) return;
        val = channelCommand(message, val, doc);
        doc.messageLogsEditChannelId = val;
        return [doc, `<#${val}>`];
      }
    },
    {
      name: "messagelogsdelete",
      aliases: [],
      async run(message, val, doc) {
        if (!message.channel) return;
        val = channelCommand(message, val, doc);
        doc.messageLogsDeleteChannelId = val;
        return [doc, `<#${val}>`];
      }
    },
    {
      name: "announcementschannel",
      aliases: [],
      async run(message, val, doc) {
        if (!message.channel) return;
        val = channelCommand(message, val, doc);
        doc.announcementsChannelId = val;
        return [doc, `<#${val}>`];
      }
    },
    {
      name: "birthdaychannel",
      aliases: [],
      async run(message, val, doc) {
        if (!message.channel) return;
        val = channelCommand(message, val, doc);
        doc.birthdayChannelId = val;
        return [doc, `<#${val}>`];
      }
    },
    {
      name: "reportschannel",
      aliases: [],
      async run(message, val, doc) {
        if (!message.channel) return;
        val = channelCommand(message, val, doc);
        doc.reportsChannelId = val;
        return [doc, `<#${val}>`];
      }
    },
    {
      name: "qotdchannel",
      aliases: [],
      async run(message, val, doc) {
        if (!message.channel) return;
        val = channelCommand(message, val, doc);
        doc.qotdChannelId = val;
        return [doc, `<#${val}>`];
      }
    },
    {
      name: "fotdchannel",
      aliases: [],
      async run(message, val, doc) {
        if (!message.channel) return;
        val = channelCommand(message, val, doc);
        doc.fotdChannelId = val;
        return [doc, `<#${val}>`];
      }
    },
    {
      name: "partnerchannel",
      aliases: [],
      async run(message, val, doc) {
        if (!message.channel) return;
        val = channelCommand(message, val, doc);
        doc.partnerChannelId = val;
        return [doc, `<#${val}>`];
      }
    },
    {
      name: "swearprotection",
      aliases: [],
      async run(message, val, doc) {
        val = valToBool(message, val, doc);
        doc.swearProtection = val;
        return [doc, String(val)];
      }
    },
    {
      name: "capsprotection",
      aliases: [],
      async run(message, val, doc) {
        val = valToBool(message, val, doc);
        doc.capsProtection = val;
        return [doc, String(val)];
      }
    },
    {
      name: "spamprotection",
      aliases: [],
      async run(message, val, doc) {
        val = valToBool(message, val, doc);
        doc.spamProtection = val;
        return [doc, String(val)];
      }
    },
    {
      name: "linkprotection",
      aliases: [],
      async run(message, val, doc) {
        val = valToBool(message, val, doc);
        doc.linkProtection = val;
        return [doc, String(val)];
      }
    },
    {
      name: "linkbypass",
      aliases: [],
      async run(message, val, doc) {
        val = valToBool(message, val, doc);
        doc.linkBypass = val;
        return [doc, String(val)];
      }
    }
  ];

  function onErr(message, err) {
    const embed = new RichEmbed();
    embed.setDescription("Sorry, an error has occured");
    message.channel.send(embed);
    console.error(err);
  }

  function success(message, msg) {
    const embed = new RichEmbed();
    embed.setDescription(`Successfully set to ${msg}`);
    message.channel.send(embed);
  }

  setCommands.forEach(e => {
    e.name = `set${e.name}`;
    bot.commands.set(e.name, {
      config: {
        name: e.name,
        aliases: e.aliases.map(e => `set${e}`),
        description: "",
        usage: "",
        category: "settings",
        accessableby: "Members", // Todo: change accessableby
        setup: ""
      },
      run(bot, message, args) {
        if (!message.guild) return;
        if (!message.member) return;
        if (!message.member.permissions.has("MANAGE_GUILD")) return;

        const val = args[0];

        const db = bot.db.collection("guildConfig");
        db.findOne({ guildId: message.guild.id }, (err, doc) => {
          if (err) return onErr(message, err);
          const newDoc = {
            ...Constants.DefaultOptions.guildConfig,
            ...(doc || {}),
            guildId: message.guild.id
          };
          if (!newDoc._id) newDoc._id = new mongo.ObjectId();
          e.run(message, val, newDoc).then(newVal => {
            if (!newVal) return;
            const updatedVal = newVal[1] || 'unknown';
            newVal = newVal[0];
            if (!doc) {
              return db.insertOne(newVal, (err, result) => {
                if (err) return onErr(message, err);
                success(message, updatedVal);
              });
            }
            db.updateOne(
              { _id: newVal._id },
              { $set: newVal },
              (err, result) => {
                if (err) return onErr(message, err);
                success(message, updatedVal);
              }
            );
          });
        });
      }
    });
    if (e.aliases && typeof e.aliases === 'object' && e.aliases instanceof Array) {
      e.aliases.forEach(a => bot.aliases.set(a, e.name))
    }
  });
}

module.exports = { nextLvlXp, giveawayEnd, set };
