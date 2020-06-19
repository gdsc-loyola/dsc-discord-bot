const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const cron = require('cron');
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const botClient = new Discord.Client();

const prefix = ".";
var version = "1.0";

var servers = {};

botClient.on('ready',() =>{
    
    console.log('Andy the Atenean Android is ready!' + " version " + version);

    const morning = new cron.CronJob('0 30 4 * * 1-5', () => {
        var morningMessage = botClient.channels.cache.find(channel => channel.id === '713088552518418432');
        const morningEmbed = new Discord.MessageEmbed()
            .setColor('#31a5af')
            .setTitle('Good Day Devs! Have a wonderful day ahead :)')
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
        member.send("Welcome to DSC Loyola 20-21 discord server! Type in !help to any channel in the server to get started!")
            .catch(console.error);
    });

    botClient.on('message', async message => {

        let args = message.content.substring(prefix.length).split(" ");
        
        if(message.channel.type == "dm"){
            return;
        }
        else{
            switch (args[0]){
                case 'play':

                    function play(connection, message){
                        var server = servers[message.guild.id];

                            server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));
                            server.dispatcher.on("finish",function(){
                                server.queue.shift()
                                if(server.queue[0]){
                                    play(connection,message)
                                }
                                else if(server.queue[0] >= 1){
                                    server.queue.push(args[1]);
                                    message.channel.send("Added song to the queue!");
                                }
                                else{
                                    connection.disconnect();
                                }
                            });
                    }

                    if(!args[1]){
                        message.channel.send("Please provide a link!");
                        return;
                    }
                    if(!message.member.voice.channel){
                        message.channel.send("Hi user! You must be in a voice channel to play music :)");
                        return;
                    }
                    if(!servers[message.guild.id]) servers[message.guild.id] = {
                        queue: []
                    }

                    var server = servers[message.guild.id];
                    server.queue.push(args[1]);
                    if(!message.guild.voiceChannel) message.member.voice.channel.join().then(function(connection){
                        play(connection, message);
                    })

                break;

                case 'skip':
                    var server = servers[message.guild.id];
                    if(server.dispatcher) server.dispatcher.end();
                    message.channel.send("Skipped song!")
                break;

                case 'stop':
                    var server = servers[message.guild.id];
                    if(message.guild.voice.connection){
                        for(var i = server.queue.length - 1; i >= 0; i--){
                            server.queue.splice(i,1);
                        }
                        server.dispatcher.end();
                        message.channel.send("Ended the queue! I will leave now :<")
                        console.log('stopped the queue');
                    }
                    else{
                        connection.disconnect();
                    }
                break;

                case 'resume':
                    var server = servers[message.guild.id];
                    server.dispatcher.resume();
                    message.channel.send("Resuming the song now!")
                break;

                case 'pause':
                    var server = servers[message.guild.id];
                    server.dispatcher.pause();
                    message.channel.send("Pausing the song now!")
                break;
                
                case 'queue':
                    var server = servers[message.guild.id];
                    var output = "";
                    var count = 1;

                    server.queue.forEach(function(entry) {
                        output = output + count + "." + entry + "\n";
                        count++;
                    });
                    message.channel.send("Songs in queue:" + "\n" + output);
                break;

                case 'announcements':
                    const embed = new Discord.MessageEmbed()
                    // .addField('Player Name',message.author.username)
                    .setColor('#31a5af')
                    .setTitle('ANNOUNCEMENTS FOR TODAY')
                    .setAuthor("From: Executive Board")
                    .setDescription('1. TRANSEM will happen next week. \n 2. Wrap-up meeting this week!')
                    .setTimestamp()
                    message.channel.send(embed);
                break;

                case 'help':
                    const member = message.member.user.tag;
                    const Embed = new Discord.MessageEmbed()
                    .setColor("#31a5af")
                        .setTitle('GENERAL')
                        .addFields(
                            { name: '.announcements', value: 'sends the current announcements of DSC Loyola' },
                            { name: '.info', value: 'reveals something about me :3' },
                            { name: '.basics', value: 'shows a list of discords functionalities' },
                            { name: '.faqs', value: 'answers some questions in navigating our server' },
                        )
                        .setTimestamp();
                    const Embed2 = new Discord.MessageEmbed()
                        .setColor("#31a5af")
                        .setTitle('PLAYING MUSIC')
                        .addFields(
                            { name: '.play <youtube link>', value: 'plays the audio of the selected video from youtube.' },
                            { name: '.pause', value: 'pauses current track on queue.' },
                            { name: '.skip', value: 'skips to the next song on queue.' },
                            { name: '.stop', value: 'stops every song on queue.' },
                            { name: '.queue', value: 'shows all track on queue' },
                        )
                        .setTimestamp();
                    
                    message.channel.send("Hi " + member + "! Check your DMs \(^o^)/");
                    message.author.send("Hi " + member + "! Here is the list of my available commands!"); 
                    message.author.send(Embed);
                    message.author.send(Embed2);
                break;

              case 'basics':
                    const member2 = message.member.user.tag;
                    const help = new Discord.MessageEmbed()
                        .setColor("#31a5af")
                        .setTitle('DISCORD BASICS')
                        .addFields(
                            { name: 'Join a voice channel', value: 'Press the voice channel where you want to connect and click connect' },
                            { name: 'Leave a voice channel', value: 'Click disconnect button (red telephone icon w/ X)' },
                            { name: 'Share screen during call', value: 'Once connected to a voice channel, press the video button (camera icon)' },
                            { name: 'Add a friend', value: 'For Mobile: \n1. Press waving person icon below.\n2. Click on add friend icon on top.'
                            },
                        )
                        .setTimestamp();
                    
                    message.channel.send("Hi " + member2 + "! Check your DMs :)");
                    message.author.send("Hi " + member2 + "! Here are some instructions on how you can get started :)"); 
                    message.author.send(help);
                    break;

                case 'faqs':
                    const member3 = message.member.user.tag;
                    const help2 = new Discord.MessageEmbed()
                        .setColor("#31a5af")
                        .setTitle('FAQS')
                        .addFields(
                            { name: 'How do I ask for an IC?', value: 'Feel free to message any EB member directly!' },
                            { name: 'How do I raise a concern?', value: 'Message our helpdesk channel and I will notify EB members with your concern afterwards.' },
                            { name: 'How do I interact with Andy?', value: 'Type in .help to check what he can do :)' },
                        )
                        .setTimestamp();

                    message.channel.send("Hi " + member3 + "! Check your DMs :)");
                    message.author.send("Hi " + member3 + "! Here some frequently asked questions in navigating our server:");
                    message.author.send(help2);
                break;

                case 'info':
                    const member4 = message.member.user.tag;
                    message.channel.send("Hi! I'm Andy the Atenean Android from DSC Loyola, version 1.0! Nice to meet you, Developer" + member4  + "\nType .help to get started.");
                    
            }
        }
        
    });

botClient.login(TOKEN);
