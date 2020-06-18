const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const cron = require('cron');
require('dotenv').config();


const botClient = new Discord.Client();

const TOKEN = token.env.TOKEN;

const prefix = "!";
var version = "1.0";

var servers = {};

botClient.on('ready',() =>{
    console.log('Andy the Android is ready!' + " version " + version);

    const morning = new cron.CronJob('0 30 4 * * 1-5', () => {
        var morningMessage = botClient.channels.cache.find(channel => channel.id === '713088552518418432');
        const morningEmbed = new Discord.MessageEmbed()
            .setColor('#31a5af')
            .setTitle('Good Day Devs! Hope you have a great day!')
            .setTimestamp()
        morningMessage.send(morningEmbed);
      });
      
      morning.start();

    const job = new cron.CronJob('0 0 12 * * 1,3,5', () => {
        var announcement = botClient.channels.cache.find(channel => channel.id === '713088552518418432');
        const embed = new Discord.MessageEmbed()
            .setColor('#31a5af')
            .setTitle('ANNOUNCEMENTS')
            .setAuthor("From: Executive Board")
            .setDescription('1. Set trainings with your respective Chiefs! \n 2. No meeting this week!')
            .setTimestamp()
        announcement.send(embed);
      });
      
      job.start();
});
    botClient.on("guildMemberAdd", member => {
        member.send("Welcome to DSC Loyola 20-21 discord server! Type in !help to any channel in the server to get started ^__^")
            .catch(console.error);
    });

botClient.login(TOKEN);