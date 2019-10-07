const { RichEmbed } = require("discord.js");
const mongo = require("mongodb");

const Constants = require("../../util/Constants");

function success(message, itemName) {
  message.channel.send(
    new RichEmbed().setDescription(`You've successfully bought ${itemName}`)
  );
}

function onErr(message, err) {
  message.channel.send(
    new RichEmbed().setDescription("Sorry, an error has occured")
  );
  return console.error(err);
}

module.exports = {
  config: {
    // Todo: change config
    name: "buy",
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

    const name = args[0].toLowerCase();
    if (!name) {
      embed.setDescription("Please specify valid item name.");
      return message.channel.send(embed);
    }

    const db = bot.db.collection("shop");
    db.findOne({ name, guildId: message.guild.id }, (err, doc) => {
      if (err) return onErr(message, err);
      if (!doc) {
        embed.setDescription("Item not found");
        return message.channel.send(embed);
      }
      bot.db
        .collection("balance")
        .findOne(
          { userId: message.author.id, guildId: message.guild.id },
          (err, balDoc) => {
            if (err) return onErr(message, err);
            const newBalDoc = {
              ...Constants.DefaultOptions.balance,
              ...(balDoc || {}),
              userId: message.author.id,
              guildId: message.guild.id
            };
            if (newBalDoc.money < doc.price) {
              embed.setDescription(`Not enough money to buy ${doc.name}`);
              return message.channel.send(embed);
            }
            bot.db
              .collection("inventory")
              .findOne(
                { userId: message.author.id, guildId: message.guild.id },
                (err, invDoc) => {
                  if (err) return onErr(message, err);
                  const newDoc = {
                    ...Constants.DefaultOptions.inventory,
                    ...(invDoc || {}),
                    userId: message.author.id,
                    guildId: message.guild.id
                  };
                  newBalDoc.money -= doc.price;
                  newDoc.items = [doc.name, ...newDoc.items];
                  if (!balDoc) {
                    bot.db
                      .collection("balance")
                      .insertOne(
                        { ...newBalDoc, _id: new mongo.ObjectId() },
                        (err, result) => {
                          if (err) return onErr(message, err);
                        }
                      );
                  } else {
                    bot.db
                      .collection("balance")
                      .updateOne(
                        { _id: newBalDoc._id },
                        { $set: newBalDoc },
                        (err, result) => {
                          if (err) return onErr(message, err);
                        }
                      );
                  }
                  if (!invDoc) {
                    return bot.db
                      .collection("inventory")
                      .insertOne(
                        { ...newDoc, _id: new mongo.ObjectId() },
                        (err, result) => {
                          if (err) return onErr(message, err);
                          success(message, doc.name);
                        }
                      );
                  }
                  bot.db
                    .collection("inventory")
                    .updateOne(
                      { _id: newDoc._id },
                      { $set: newDoc },
                      (err, result) => {
                        if (err) return onErr(message, err);
                        success(message, doc.name);
                      }
                    );
                }
              );
          }
        );
    });
  }
};
