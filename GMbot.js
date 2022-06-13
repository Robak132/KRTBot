const { Client, intents, MessageEmbed, Message, MessageAttachment,  Permissions } = require('discord.js');
var fs = require('fs');
const { readFile } = require('fs/promises');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');
const client = new Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"],
  partials: ["USER", "REACTION", "MESSAGE", "GUILD_SCHEDULED_EVENT", "GUILD_MEMBER", "CHANNEL"]
})
const data = require("./data");
const GMrank = require('./GMrank.json');

client.on("message", newRank => {
  if (newRank.content.startsWith(data.prefix + "rank")) {
    console.log("Komenda wykryta");

    //Zabezpieczenia
    if (newRank.member == null) return newRank.reply("Komendy można użyć tylko na serwerze")
    if (newRank.mentions.users.first() == null) return newRank.reply("Nie wybrano użytkownika")

    GMrank['GMS'].forEach(GMID => {
      if (newRank.author.id == GMID["GMID"]) {
        console.log("osoba jest mistrzem gry");

        let role = newRank.guild.roles.cache.find(r => r.id === GMID["RankID"]);
        //Wyszukujemy roli korzystając z RankID
        let member = newRank.mentions.members.first();
        member.roles.add(role);
  }})}
})

client.on("message", async set => {
  if (set.content.startsWith(data.prefix + "set")) {
    console.log("Komenda wykryta");

    //Zabezpieczenia
    if (set.member == null) return set.reply("Komendy można użyć tylko na serwerze")
    if (set.member.permissions.has("ADMINISTRATOR") != true) return set.reply("Ta komenda wymaga uprawnień administratora")
    if (set.mentions.users.first() == null) return set.reply("Brak ustawionego GMa")
    if (set.mentions.roles.first() == null) return set.reply("Brak ustawionej rangi")

    GMrank['GMS'].push({ 
      GMID: set.mentions.users.first().id,
      RankID: set.mentions.roles.first().id
    });
      fs.writeFile('./GMrank.json', JSON.stringify(GMrank), function(){});
  }
})


client.login(data.token);
