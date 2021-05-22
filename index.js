const fs = require('fs');
createFiles();
const Discord = require("discord.js");
const bot = new Discord.Client({presence:{status: 'invisible' },disableMentions:"all"});
const config = require("./config.json");
let sound = "sound.mp3";
bot.login(config.token);

bot.on('ready',()=>{
    console.log("bot is ready");
});
ignorelist = JSON.parse(fs.readFileSync('./ignorelist.json'));
bot.on('message', message =>{
    if(!config.masters.includes(message.author.id))return;
    const args = message.content.split(' ').slice(1);
    if(args.length<1)args[0]='';
    if(message.content.toLowerCase().startsWith("/join")){
        const channel = getChannel(message,args[0]);
        if(channel)
            channel.join();
        else message.reply(`Could not find channel with the id \`${channelID}\``);
    }
    else if(message.content.toLowerCase().startsWith("/leave")){
        const channel = getChannel(message,args[0]);
        if(channel){
            joinBAck[bot.guilds.cache.find(g=>g.channels.cache.find(c=>c.id==channel.id)).id] = true;
            channel.leave();
            console.log(joinBAck);
        }
        else message.reply(`im not in the channel with the id \`${channelID}\``);
    }

    else if(message.content.toLowerCase().startsWith('/ignore')){
        let userid = getUserId(message);
        if(userid){
            ignorelist.push(userid);
            fs.writeFileSync("./ignorelist.json",JSON.stringify(ignorelist,null,'\t'), (err) => {if (err) console.error(err)});
            message.reply(`Added userid ${userid} to the ignore list`); 
        }
    }
    else if(message.content.toLowerCase().startsWith('/unignore')){
        let userid = getUserId(message);
        if(userid){
            ignorelist=ignorelist.filter(id=>id!=userid);
            fs.writeFileSync("./ignorelist.json",JSON.stringify(ignorelist,null,'\t'), (err) => {if (err) console.error(err)});
            message.reply(`removed userid ${userid} from the ignore list`); 
        }
    }
    else if(message.content.toLowerCase().startsWith('/sound')){
        let tempSound = args.join(' ');
        if(fs.existsSync(`./sounds/${tempSound}`)){
            sound=tempSound;
            message.reply(`Interrupt sound changed to \`${sound}\``);
        }else
            message.reply(`Cannot find ${tempSound} in the sounds folder`);
    }

});

var joinBAck = {};
bot.on("voiceStateUpdate",(oldState, newState)=>{
  //AUTO UNMUTE
    if(newState.id==bot.user.id){
        if(newState.serverDeaf.valueOf(1))newState.setDeaf(0);
        if(newState.serverMute.valueOf(1))newState.setMute(0);
    }
    if(oldState.channelID!=newState.channelID&&speakers[oldState.channelID])
        speakers[oldState.channelID]=speakers[oldState.channelID].filter(e=>oldState.member.id!=e);
    
    
    //AUTO JOIN BACK + RESET SPEAKERS OBJECT
    if(newState.id==bot.user.id){
        // if(!newState.channel){
        //     if(activeChannels[oldState.channelID]){
        //         activeChannels[oldState.channelID].destroy();
        //         delete activeChannels[oldState.channelID];
        //     }
        //     return;
        // }


        if(oldState.channel&&oldState.channel!=newState.channel){

            speakers[oldState.channel.id]=[];
           
            if(activeChannels[oldState.channelID]){
                activeChannels[oldState.channelID].destroy();
                delete activeChannels[oldState.channelID];
            }
            console.log(joinBAck[oldState.guild.id]);
            if(!joinBAck[oldState.guild.id]){
                joinBAck[oldState.guild.id]=true;
                if(oldState.channel)oldState.channel.join();
            }
            else if(joinBAck[oldState.guild.id])joinBAck[oldState.guild.id]=false;
            console.log(joinBAck);
        }

        if(newState.member.id == bot.user.id && newState.channel)
            newState.channel.members.forEach(member=>{
                speaking(member,member.voice.speaking)
            })
    }
});


bot.on("guildMemberSpeaking",(member,isSpeaking)=>{
    speaking(member,isSpeaking.bitfield);
});

function getChannel(message,arg){
    if(arg.toLowerCase() == "me"&&message.member)
        return message.member.voice.channel;
    return bot.channels.cache.find(channel => channel.id==arg);
}

function getUserId(message){
    let user=message.mentions.users.first();
    let arg = message.content.split(" ").slice(1).join(' ');
    if(user){
        return user.id;
    }else{
        user = message.guild.members.cache.find(member =>member.displayName.toLowerCase()==arg.toLowerCase()||member.user.username.toLowerCase()==arg.toLowerCase());
        if(user)
            return user.id
        return arg;
    }
}

var speakers = {};
function speaking(member,speaking){
    if(member.id==bot.user.id||member.bot||config.masters.includes(member.id)||ignorelist.includes(member.id))return;
    if(!speakers[member.voice.channelID])
    speakers[member.voice.channelID]=[];

    if(speaking)//add to array of users in this channel that are speaking, if array is includes 1 speak,
        speakers[member.voice.channelID].push(member.id);
    else//remove from array of users in this channel that are speaking, if array is includes 0 stop speak,
        speakers[member.voice.channelID]=speakers[member.voice.channelID].filter(e=>member.id!=e);

    // console.log(speakers);
    try {
        speak(member.voice.channel,speakers[member.voice.channelID].length > 0);
    } catch (error) {
        console.log(error);
    }
}

activeChannels = {};
function speak(channel,play){
    const vc = bot.voice.connections.find(connection => connection.channel.id == channel.id);
    if(!vc) return;

    if(activeChannels[channel.id]){
        if(play)
            activeChannels[channel.id].resume();
        else
            activeChannels[channel.id].pause(true); //true makes it so it doesnt stop sending audio packets so it can instantly continue to talk
        
    }
    else{
        if(!play)return;
        activeChannels[channel.id] = vc.play(`./sounds/${sound}`);

        activeChannels[channel.id].on('finish', ()=>{
            activeChannels[channel.id].destroy();
            delete activeChannels[channel.id];
            speak(channel,play);
        });
        
    }

}

function createFiles(){
    let newFile = false;
    if(!fs.existsSync("./config.json")){
        fs.writeFileSync("./config.json", JSON.stringify({"token":"<ENTER BOT TOKEN HERE>","masters":["USERID OF MASTER","FOR MULTIPLE PUT A COMMA AT THE END OF A LINE"]},null,"\t"), { flag: 'wx' });
        newFile=true;
        console.log("Config created!",'fill in the missing data in the config.json');
    }
    if(!fs.existsSync("./ignorelist.json")){
        fs.writeFileSync("./ignorelist.json", JSON.stringify([],null,"\t"), { flag: 'wx' });
        newFile=true;
        console.log("Ignorelist created!");
    }

    if(newFile)process.exit();
}