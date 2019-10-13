const { RichEmbed } = require("discord.js");
const { gold } = require("../../colours.json");
const fetch = require("node-fetch");


module.exports= {
    config: {
        name: "subcount",
        description: "Sends the subcunt of a yt channl using id",
        usage: "",
        category: "user",
        accessableby: "Members",
        aliases: []
    },
    run: async (bot, message, args) => {
      
      const channelId= args.join(' ')
      if(!channelId) return message.channel.send("Please enter a valid id of the channel!");
      
      const apiKey = "AIzaSyCkJhmTkk7u5Up9efk9cBltjEruY1-hyH4";

      const data = await(await fetch(`https://apis.duncte123.me/youtube/${apiKey}/${channelId}`)).json()                         
                         
       message.channel.send(`Channel has currently ${data.data.subs} subs and ${data.data.views} views`);
      
     
} 
}