const { RichEmbed } = require("discord.js");
const Constants = require("../../util/Constants");

module.exports = {
  config:{
    name: "verify",
    description: "Verifies a user!",
    accessiable: "Members",
    alliaces: ["ver"],
    category: "verification"
    
  },
  
  run: async(bot, message, args) => {
    
    var verUser = message.author.username//user who did the command
    var user = message.member
    
    let verLog = new RichEmbed()
    .setTitle(`Verification Notification`)
    .addField("User:", `${verUser}`)
    .setTimestamp()
    
    
      const db = bot.db
      .collection("guildConfig")
      .findOne({ guildId: message.guild.id }, (err, doc) => {
        if (err) console.error(err);
        if (!doc) doc = Constants.DefaultOptions.guildConfig;
        
        const chId = doc.verificationChannelId;
        if (!chId) return;
        const ch = bot.channels.get(chId);
        if (!ch) return message.channel.send("No channel was specified do @Series#6195 help for it!");
        
        let verRole = message.guild.roles.find(r => r.name === "Verfied!")
        if(!verRole) {
          try {
            verRole = message.guild.createRole({
            name: "Verfied!",
            color: "#FFFFFF",
            permissions: []
            })
        } catch(e){
          console.log(e.stack)
        }
                  }
          
       user.addRole(verRole.id).then(() => {
        
        user.send(`Hello, you have been verified in **${message.guild}** \n We hope you enjoy being one of us!`);
        
        message.delete();
        
        ch.send(verLog)
      })

      })
          }
           
}