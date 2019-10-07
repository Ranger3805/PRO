const { discord } = require("discord.js");
const { gold } = require("../../colours.json");
const { RichEmbed } = require("discord.js");
const ms = require("ms");
const mongo = require("mongodb");

const { giveawayEnd } = require("../../util/helpers");

module.exports = {
  config: {
    name: "giveaway",
    noaliases: "No Aliases",
    aliases: [],
    usage: "<winnercount> <time in secounds> <item>",
    category: "server",
    setup: "",
    descrption: "Sends a giveaway in the server.",
    accessableby: "Administartors"
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      return message.channel.send("Sorry! You can't do a giveaway!");
    }

    message.delete().catch(() => {});

    try {
      let msg = await message.channel.send("Reward:");

      const collectorOpts = { max: 1, time: 1000 * 60, errors: ["time"] };

      let filter = e => e.author.id === message.author.id;
      let res = await message.channel
        .awaitMessages(filter, collectorOpts)
        .catch(() => {});
      const reward = res.first().content;
      if (!reward) throw new Error();

      await msg.delete().catch(() => {});
      msg = await message.channel.send("Winner count:");

      filter = e =>
        e.author.id === message.author.id &&
        !!Number(e.content.replace(/\D/g, ""));
      res = await message.channel
        .awaitMessages(filter, collectorOpts)
        .catch(() => {});
      const winnerCount = Number(res.first().content.replace(/\D/g, ""));
      if (!winnerCount) throw new Error();

      await msg.delete().catch(() => {});
      msg = await message.channel.send("Time:");

      filter = e =>
        e.author.id === message.author.id && /^\d+[smhd]$/i.test(e.content);
      filter = e => {
        console.log(e.content);
        console.log(/^\d+[smhd]$/i.test(e.content));
        return (
          e.author.id === message.author.id && /^\d+[smhd]$/i.test(e.content)
        );
      };
      res = await message.channel
        .awaitMessage(filter, collectorOpts)
        .catch(() => {});
      const time = ms(res.first().content);
      if (!time) throw new Error();
      //Is everything ok?

      await msg.delete().catch(() => {});

      const endDate = new Date(Date.now() + time);

      const embed = new RichEmbed()
        .setTitle("🎉 **GIVEAWAY** 🎉")
        .setFooter(`Ends in: ${endDate}`)
        .setDescription(`Reward: ${reward}`);

      msg = await message.channel.send(embed);
      msg.react("🎉");

      giveawayEnd(bot, message, endDate.getTime(), {
        reward,
        winnerCount,
        time
      });

      const db = bot.db.collection("giveaways");
      db.insertOne({
        messageId: msg.id,
        channelId: msg.channel.id,
        reward,
        winnerCount,
        end: endDate.getTime(),
        _id: new mongo.ObjectId()
      });
    } catch (e) {
      return;
    }
  }
};
