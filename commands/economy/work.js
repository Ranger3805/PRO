const { RichEmbed } = require("discord.js");
const mongo = require("mongodb");

const Constants = require("../../util/Constants");

const uses = {};

function getJob(name) {
  if (!name) return false;
  const job =
    Constants.Jobs.find(e => e.name === name) ||
    Constants.Jobs.find(e => e.aliases.includes(name));
  return job;
}

function done(bot, message, earned) {
  message.channel.send(`Congrats! You have worked hard and earned ${earned}!`);
}

module.exports = {
  config: {
    // Todo: change config
    name: "work",
    description: "",
    usage: "",
    category: "economy", // Todo: change category
    accessableby: "",
    setup: "",
    aliases: []
  },

  run(bot, message, args) {
    if (!message.guild) return;

    const embed = new RichEmbed();

    const jobName = args.join(" ");
    const job = getJob(jobName);
    if (!job) {
      embed.setDescription("No job was specified! Use `jobs` command to see available jobs");
      return message.channel.send(embed);
    }

    const id = `${message.guild.id}${message.author.id}`;

    if (!uses[id]) uses[id] = 0;
    uses[id] += 1;

    const db = bot.db.collection("balance");
    db.findOne(
      { userId: message.author.id, guildId: message.guild.id },
      (err, doc) => {
        const newDoc = {
          ...Constants.DefaultOptions.balance,
          ...(doc || {}),
          userId: message.author.id,
          guildId: message.guild.id
        };

        if (uses[id] >= 5) {
          delete uses[id];
          newDoc.salary += 1;
        }
        if (err) console.error(err);

        newDoc.money += newDoc.salary;

        if (!doc) {
          return db.insertOne(
            { ...newDoc, _id: new mongo.ObjectId() },
            (err, result) => {
              if (err) console.error(err);
              done(bot, message, newDoc.salary);
            }
          );
        }

        db.updateOne({ _id: newDoc._id }, { $set: newDoc }, (err, result) => {
          if (err) console.error(err);
          done(bot, message, newDoc.salary);
        });
      }
    );
  }
};
