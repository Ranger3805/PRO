const { RichEmbed } = require("discord.js");
const mongo = require("mongodb");

const Constants = require("../../util/Constants");

function success(message, user, reason) {
  message.channel.send(
    new RichEmbed().setDescription(
      `**${user} has been warned!**\n\`\`\`\n${reason}\n\`\`\``
    )
  );
}

module.exports = {
  config: {
    name: "warn",
    description: "Warns the user.(credits to zargovv)",
    usage: " <user> <reason>",
    category: "moderation",
    accessableby: "Moderators",
    setup: "Permissions Required: Kick Members.",
    aliases: []
  },

  run(bot, message, args) {
    if (!message.guild) return;
    if (!message.member) return;
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    const user = message.mentions.users.first() || bot.users.get(args[0]);

    const embed = new RichEmbed(); // You may edit this, to design it by default

    if (!user) {
      embed.setDescription("Please provide a user to warn.");
      return message.channel.send(embed);
    }

    const reason = args.slice(1).join(" ");
    if (!reason) {
      embed.setDescription("Please provide the reason.");
      return message.channel.send(embed);
    }

    const db = bot.db.collection("warns");

    db.findOne({ userId: user.id, guildId: message.guild.id }, (err, doc) => {
      if (err) return console.error(err); // Todo: Remove console.error if logging is not needed

      const newDoc = {
        ...Constants.DefaultOptions.warns,
        ...(doc || {}),
        userId: user.id,
        guildId: message.guild.id
      };
      newDoc.count += 1;
      newDoc.info = [
        { warnerId: message.author.id, reason, date: Date.now() },
        ...newDoc.info
      ].slice(0, 10); // Info prop will contain only 10 last warns in order to optimize

      if (!doc) {
        return db.insertOne(
          { ...newDoc, _id: new mongo.ObjectId() },
          (err, result) => {
            if (err) return console.error(err); // Todo: Remove console.error if logging is not needed
            // Todo: Add action on successful document saving if needed.
            success(message, user, reason);
          }
        );
      }

      db.updateOne({ _id: doc._id }, { $set: newDoc }, (err, result) => {
        if (err) return console.error(err); // Todo: Remove console.error if logging is not needed
        // Todo: Add action on successful document saving if needed..
        success(message, user, reason);
        
        
      });
    });
  }
};
