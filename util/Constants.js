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
    guildId: undefined,
    disabledCommands: [],
    premium: false,
    prefix: undefined,
    welcomeChannelId: undefined,
    leaveChannelId: undefined,
    modChannelId: undefined,
    messageLogsEditChannelId: undefined,
    messageLogsDeleteChannelId: undefined,
    announcementsChannelId: undefined,
    birthdayChannelId: undefined,
    reportsChannelId: undefined,
    qotdChannelId: undefined,
    fotdChannelId: undefined,
    partnerChannelId: undefined,
    swearProtection: undefined,
    capsProtection: undefined,
    spamProtection: undefined,
    linkProtection: undefined,
    linkBypassRole: undefined,
    linkBypassChannelId: undefined
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
