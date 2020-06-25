const Discord = require('discord.js')
const fs = require('fs');
const client = new Discord.Client()
const channel = client.channels.cache.get('644539373077004299')



//https://discord.com/oauth2/authorize?client_id=717442260131774485&scope=bot
// The token


var data = fs.readFileSync('token.txt',{encoding:'utf8', flag:'r'});


//Removes the newline from the token file
data = data.replace(/(\r\n|\n|\r)/gm, "");

client.login(data)

//File used for the JSON
var userFile = 'users.json'

// Used to check the time between "Nice" messages
var lastTime = null

// 5 mins, 60 seconds in a min, 1000 ms in a second
var saveTime = 5 * 60 * 1000; /* ms */


class user {
  ID
  UName
  NC
  RNC
}

// How to make the new user
//test = {ID:"test", NC: 0, RNC: 0,}



//Creating the users array from the json
let rawdata = fs.readFileSync(userFile);
let users = JSON.parse(rawdata);

//Shows all the users in the array
console.log(users)


function niceCode(msg){

  theUserIndex = findUsers(msg.member.id)

  var now = new Date();
  now = now - 0


  if (theUserIndex == null){

    //Creates a new user with basic entry in the json file
    console.log("New user: " + msg.member.id)
    newUser = {ID:msg.member.id, UName:msg.author.username, NC: 1, RNC: 0,}
    users.push(newUser)
    console.log(newUser)
    msg.channel.send("This is " + msg.member.user.username + "'s first \"Nice\" ");

  }else{

    users[theUserIndex].NC++
    msg.channel.send(msg.member.user.username + "'s \"Nice\" count has gone up to " + users[theUserIndex].NC);

    users[theUserIndex].RNC++
    console.log(msg.member.user.username + "'s recent \"Nice\" count has gone up to " + users[theUserIndex].RNC)

    if (users[theUserIndex].RNC > 5){
      msg.reply("Watch it sunshine")
    }

    // The kicking can cause an error. Not an issue now but soon will cause the app to crash
    // I can't find a work around at the moment

    if (users[theUserIndex].RNC > 10){
      msg.author.send('Cunt');
      try {
        msg.member.kick();
      }catch(err){
        console.log("Could not kick user")
        console.log(err)
      }

    }

  }


  if (lastTime == null){
    lastTime = now
    console.log("Time has been set")
  }


  if ((now - lastTime) > saveTime){
    //console.log("Saving users to file");

    lastTime = now;
    console.log("Saving users");

    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  }

}


//When the client connects
client.on('ready', () => {

console.log(`logged in as ${client.user.tag}!`)

//Sets the bots username and activity
client.user.setUsername('jBot');
client.user.setActivity('Doing bot things');

})


//When a new user is added to the discord
client.on('guildMemberAdd', member => {
  console.log("New member was added")
  // Send the message to a designated channel on a server:
  channel = member.guild.channels.cache.find(ch => ch.name === 'general');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
});

//Runs when the message is read
client.on('message', msg => {


  console.log(msg.author.username + " : " + msg.content)

  if(msg.author === client.id){
    console.log("message from me")
    return
  }

  // My ID
  if (msg.author.id === "326743504443146241"){
    msg.reply("Hello Master")
  }


  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }

  if (msg.content.toLowerCase() === 'hello there') {
    msg.channel.send('General Kenobi! You are a bold one');
  }



  var now = new Date();
  now = now - 0 // makes now a number. Don't ask why

  //The Nice count code
  if (msg.content.toLowerCase() === 'nice'){

    niceCode(msg)

  }




  if (msg.content.toLowerCase().includes("uwu")){
    //msg.channel.send("UwU");  // Yeah. Don't do that. That breaks things
    msg.react('🤮')
    msg.author.send('Fuck you');
  }

})

// Checks to see if the userID is in the array of allready created users
function findUsers(userID){

  var user = null;
  users.forEach((item, i) => {
    //console.log(item.ID)
    //console.log(item.ID + " : " + userID)

    //var testi = item.ID
    if (item.ID === userID){
      console.log("Found")
      user = i;
    }

  });

  // Returns 0 if the user was not found
  return user;
}

// clears the recent nice count of all the users
function clearRN(){

  users.forEach((item, i) => {
    item.RNC = 0
  });

  console.log("Cleared recent nice count");

}

//Runs the clear nice function every 2 mins
setInterval(clearRN, (5 * 60 * 1000));



//Says when it disconnects
client.on("disconnected", function () {

	console.log("Disconnected!"); // send message that bot has disconnected.
	process.exit(1); //exit node.js with an error

});
