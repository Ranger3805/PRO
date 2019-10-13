module.exports = {
    config: {
        name: "dm",
        description: "Direct Messages a User",
        usage: " <user> <text>",
        category: "miscellaneous",
        accessableby: "Members",
        setup: "",
        aliases: ["directmessage"]
    },
  run: async (bot, message, args) => {
    const toDm = message.mentions.users.first();
    if(!toDm) return message.reply("Couldn't find that user!");
    const text = args.slice(1).join(" ");
    if(!text) return message.reply("What yo want to dm him ?");
    toDm.send(`You have been dmed by ${message.author} in ${message.guild} \n Message: ${text}`).catch(() => message.reply("Sowwy, he got his dms blocked \:("))
  }
}
 