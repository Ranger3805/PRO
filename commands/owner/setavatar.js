module.exports = {
  config: {
  name: "setavatar",
    description: "Sets the boy's avatar.",
    category: "owner"
  },
  run: async(bot,message, args) => {
  if (message.author.id != "459414913505558549") return message.channel.send("Your not the bot owner!")
bot.user.setAvatar(args[0]);
    message.delete();
}
}