const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const TOKEN = "kesyapraknapcan";
const PREFIX = "g*"

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if(server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
    console.log("Bot Hazır.");
});

bot.on("message", function(message) {
   if (message.author.equals(bot.user)) return;
   
   if (!message.content.startsWith(PREFIX)) return;

   var args = message.content.substring(PREFIX.length).split(" ");

   switch (args[0].toLowerCase()) {
       case "yapımcı":
           message.channel.sendMessage("DCKIRIĞI#2220");
           break;
       case "hakkında":
       
       let serverembed = new Discord.RichEmbed()
       .setDescription("Server Hakkında")
       .setColor("#15f153")
       .addField("Sunucunun Adı", message.guild.name)
       .addField("Sunucudaki Toplam Kişi Sayısı", message.guild.memberCount);

       message.channel.send(serverembed);
       break;
       case "play":
             if (!args[1]) {
                 message.channel.sendMessage("Lütfen Link Giriniz!");
                 return;
             }
             if (!message.member.voiceChannel) {
                 message.channel.sendMessage("Ses Kanalında Olman Gerek!");
                 return;
             }

             if (!servers[message.guild.id]) servers[message.guild.id] = {
                 queue: []
             };

             var server = servers[message.guild.id];

             server.queue.push(args[1]);

             if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                 play(connection, message);
             });
             break;
    case "skip":
            var server = servers[message.guild.id];

            if(server.dispatcher) server.dispatcher.end();
            break;
    case "stop":
            var server = servers[message.guild.id];

            if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
    default:
       message.channel.sendMessage("Böyle Bir Komut Yok");
   }
});

bot.login(process.env.BOT_TOKEN);
