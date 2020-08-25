const config = require("./config.json");
const Discord = require('discord.js');
const dbot = new Discord.Client({disableEveryone: true});

dbot.login(config.token);

var mineflayer = require('mineflayer');
var bot = mineflayer.createBot({
  host: config.ip, // Server IP for bot to connect to
  port: config.port,       // server port for bot to connect to
  username: config.username, // email for bot
  password: config.password,          // password for bot
  version: config.version, // version of server bot is trying to connect to
});
dbot.on("ready", async () => {
    console.log(`Discord bot ${dbot.user.username} is ready!`);

    dbot.user.setActivity("for chat messages", {type: "WATCHING"}); // Bot info
    dbot.user.setStatus('dnd') // Bot status dnd / online / idle
    bot.setControlState('forward', true) //bot goes forward for anti-afk PLEASE improve this in a pull request.

});
bot.on('login', () => {
    bot.chat(config.loginmessage) // message on login
    console.log(`Minecraft bot is ready!`);
});
bot.on('message', msg => { 
      try {
        dbot.guilds.get(config.guildid).channels.get(config.chatchannelid).send({embed: {
        color: 3447003,
        description: (msg.toString()) // embed for the chat in discord
        }});
      }
      catch(error) {
        console.error(error);
      }
    });
dbot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  if(!message.channel.id == config.chatchannelid) return; // set to your discord channel id for the chat

  let prefix = config.prefix; //prefix for the bot commands like !send etc
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0]
  let args = messageArray.slice(1);
  let botmessage = args.join(" ");
  if(message.author.id == config.userid) { // Set to your user id on discord, or the commands wont work
  if(cmd === `${prefix}send`){
    bot.chat(botmessage)
    message.channel.send("sent")
  };
  if(cmd === `${prefix}look`){
    bot.look(botmessage,0,false);
  };
} else {
  message.channel.send("No permission, this command requires (BOT OWNER).")
}
});
function bindEvents(bot) {

  bot.on('error', function(err) {
      console.log('Error attempting to reconnect: ' + err.errno + '.');
      process.exit(1)
      if (err.code == undefined) {
          console.log('Invalid credentials OR bot needs to wait because it relogged too quickly.');
      }
  });
}
bot.on('kicked', function(reason) {
  console.log("I got kicked for", reason, "lol");
  });

  bot.on('end', function() {
    console.log("Bot has ended");
    process.exit(1)
});
bot.on('error', err => console.log(err));
