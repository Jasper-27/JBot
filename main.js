/*
To get this program to work you need two files

1. token.txt (A file containing your discord bots token)


*/



const Discord = require('discord.js')
const fs = require('fs');
const client = new Discord.Client()
const channel = client.channels.cache.get('644539373077004299')
const sortArray = require('sort-array')


//https://discord.com/oauth2/authorize?client_id=717442260131774485&scope=bot
// The token


var token = fs.readFileSync('token.txt',{encoding:'utf8', flag:'r'});
token = token.replace(/(\r\n|\n|\r)/gm, ""); //Removes the newline from the token file
client.login(token)




var lastTime = null  // Used to check the time between "Nice" messages

// 5 mins, 60 seconds in a min, 1000 ms in a second
var saveTime = 5 * 60 * 1000; /* ms */


class user {
  ID
  UName
  NC
  RNC
}





if (fs.existsSync('users.json')) {
  var userFile = 'users.json'

}else{
  fs.writeFileSync("users.json", JSON.stringify([], null, 2));
  var userFile = 'users.json'
}


//Creating the users array from the json
let rawdata = fs.readFileSync(userFile);
let users = JSON.parse(rawdata);




//Shows all the users in the array
console.log(users)

function saveToFiles(){
  console.log("Saving users to file")
  console.log(users)
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

function niceCode(msg){
  try{
      theUserIndex = findUsers(msg.member.id)
  }catch{
    return
  }


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

    if (users[theUserIndex].RNC > 3){
      msg.reply("Watch it sunshine")

    }

    // The kicking can cause an error. Not an issue now but soon will cause the app to crash
    // I can't find a work around at the moment


    // The try is not working. Not sure why
    if (users[theUserIndex].RNC > 6){
      try {
        users[theUserIndex].NC = 0;
        msg.channel.send("Kicking user: " + msg.author.username + ", for spamming");
        msg.author.send("Don't spam. It is just annoying and gets you kicked");
        msg.member.kick();
      }catch(err){
        msg.channel.send("Could not kick user. You got lucky this time")
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
    lastTime = now;
    console.log("Saving users");

    saveToFiles()
  }

}

function rankings(msg){
  console.log(msg.content)

  sortArray(users, {
    by: 'NC'
    ,order: 'desc'  // In descending order (coma there for commenting)
  })

  var loops = users.length

  if (users.length > 10){
    loops = 9
  }


  var message = " "

  for (let i = 0; i < loops; i++) {

    message = message + (i+1) + ") " + users[i].UName + ":  " + users[i].NC  + " \n "
    //msg.channel.send(users[i].UName + " \n "+ "Hello")
  }

  msg.channel.send(message)

 
}

//When the client connects
client.on('ready', () => {

console.log(`logged in as ${client.user.tag}!`)



// Does this but work? Well at some point it did 


//Sets the bots username and activity
client.user.setUsername('jBot');
client.user.setActivity('with your mama');
//client.user.setActivity('discord.js', { type: 'RUNNING' })  //the type is wrong

})

/*  Commented out because it is not working


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

*/



//Runs when the message is read
client.on('message', msg => {

  console.log(msg.author.username + " : " + msg.content)

  if(msg.author === client.id){
    console.log("message from me")
    return
  }


  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }

  if (msg.content.toLowerCase() === 'marco' || msg.content.toLowerCase() === 'marco!' ){
    msg.reply("Polo!")
  }

  if (msg.content.toLowerCase() === 'hello there') {
    msg.channel.send('General Kenobi! You are a bold one');
  }


  if (msg.content.toLowerCase() == "list scores"){
    rankings(msg)

  }

/*
 this bit is broken. Takes ages and too large a group will fuck it.


Write a routine that finds each users position individually. Much better and more reusable. 
*/

/*
  if (msg.content.toLowerCase() === "nr"){

    //Sorts array
    sortArray(users, {
      by: 'NC'
      ,order: 'desc'  // In descending order (coma there for commenting)
    })

    users.forEach((item, i) => {

      msg.channel.send(item.UName + ": " + item.NC)
    });


  }

*/

  var now = new Date();
  now = now - 0 // makes now a number. Don't ask why

  //The Nice count code
  if (msg.content.toLowerCase() === 'nice'){

    niceCode(msg)

  }




  if (msg.content.toLowerCase().includes("uwu")){
    msg.react('🤮')
    msg.author.send('Go uwu somewhere else');
  }

  // Commands (Soon this will be a different thing )

  // My ID. So it only does things when i ask it too
  if (msg.author.id === "326743504443146241" ){
    var arg = null

    if(msg.content.substring(0,5) == "jbot:"){
      console.log("Command")
      var command = msg.content.split(' ')[1]
      arg = msg.content.split(' ')[2]

      if(command === "save"){
        msg.channel.send("saving users to file")
        saveToFiles()
      }

      if(command === "kick"){
        var member= msg.mentions.members.first();
        try{
          member.kick()
        }catch{
          msg.channel.send("Could not kick user")
        }


      }
    }
  }
})

// Checks to see if the userID is in the array of allready created users
function findUsers(userID){
  var user = null;
  users.forEach((item, i) => {

    if (item.ID === userID){
      user = i;
    }
  });

  return user;  // Returns null if the user was not found
}

// clears the recent nice count of all the users
function clearRN(){

  users.forEach((item, i) => {
    item.RNC = 0
  });

  console.log("Cleared recent nice count");

}


setInterval(clearRN, (5 * 60 * 1000));   //Runs the clear nice function every 5 mins


//Says when it disconnects
client.on("disconnected", function () {

	console.log("Disconnected!"); // send message that bot has disconnected.
	process.exit(1); //exit node.js with an error

});
