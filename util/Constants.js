// You can do with this file anything you want
// Rename, or anything else.
// But don't forget to export data which is in there.
// Or change require pathes

const { Collection } = require("discord.js");

module.exports = {
  minXp: 15,
  maxXp: 25
};

module.exports.DefaultOptions = {
  prefixes: {
    guildId: undefined,
    prefix: undefined
  },

  warns: {
    userId: undefined,
    guildId: undefined,
    date: undefined,
    info: [],
    count: 0
  },

  guildConfig: {
    guildId: undefined,//done
    disabledCommands: [],//done
    premium: false,//done
    prefix: undefined,//done
    welcomeChannelId: undefined,//done
    leaveChannelId: undefined,//done
    modChannelId: undefined,//done
    announcementsChannelId: undefined,//done
    birthdayChannelId: undefined,//done
    reportsChannelId: undefined,//done
    qotdChannelId: undefined,//done
    fotdChannelId: undefined,//done
    partnerChannelId: undefined,//done
    suggestionChannelId: undefined,//done
    capsProtection: undefined,//done
    spamProtection: undefined,//done
    verificationChannelId: undefined //done
  },

  xp: {
    userId: undefined,
    guildId: undefined,
    xp: 0,
    lvl: 0,
    lvlXp: 0
  },
  
  cooldowns: {
    userId: undefined,
    guildId: undefined,
    xp: 0
  },
  
  balance: {
    userId: undefined,
    guildId: undefined,
    money: 0,
    salary: 5
  },
  
  inventory: {
    userId: undefined,
    guildId: undefined,
    items: []
  }
};

module.exports.Cooldowns = {
  xp: 1 * 1000 * 60
};

module.exports.Jobs = new Collection([
  [
    "baker",
    {
      name: "baker",
      aliases: []
    }
  ],
  [
    "engineer",
    {
      name: "engineer",
      aliases: []
    }
  ],
  [
    "programmer",
    {
      name: "programmer",
      aliases: []
    }
  ],
  [
    "seller",
    {
      name: "seller",
      aliases: []
    }
  ],
  [
    "police_man",
    {
      name: "police man",
      aliases: ["police"] // Just an instance
    }
  ],
  [
    "dentist",
    {
      name: "dentist",
      aliases: []
    }
  ],
  [
    "worker",
    {
      name: "worker",
      aliases: []
    }
  ],
   [
    "manager",
    {
      name: "manager",
      aliases: []
    }
  ],
   [
    "taxi",
    {
      name: "taxi",
      aliases: []
    }
  ],
]);
