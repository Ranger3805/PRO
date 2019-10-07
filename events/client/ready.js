module.exports = async bot => {
     console.log(`${bot.user.username} is online`)
    // bot.user.setActivity("Hello", {type: "STREAMING", url:"https://twitch.tv/Strandable"});

    setInterval(function() {
        let statuses = [
          
            "!help",
            `over ${bot.users.size} user${bot.users.size !== 1 ? 's' : ''}!`,
            `over ${bot.guilds.size} server${bot.guilds.size !== 1 ? 's' : ''}!`,
          
        ]

        let status = statuses[Math.floor(Math.random() * statuses.length)];
        bot.user.setActivity(status, {type: "WATCHING"});

    }, 30000)

}
