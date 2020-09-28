/*
To get this program to work you need two files

1. token.txt (A file containing your discord bots token)


*/

//https://discord.com/api/oauth2/authorize?client_id= 758403936784482315&scope=bot&permissions=1

const Discord = require('discord.js')
const fs = require('fs');
const client = new Discord.Client()
//const channel = client.channels.cache.get('644539373077004299')
const sortArray = require('sort-array')

//Allows exectuing programs on the server
const { exec } = require("child_process");

// 5 mins, 60 seconds in a min, 1000 ms in a second
const saveTime = 5 * 60 * 1000; /* ms */

const SpamCap = 6


//https://discord.com/oauth2/authorize?client_id=717442260131774485&scope=bot


var token = fs.readFileSync('token.txt',{encoding:'utf8', flag:'r'});
var theUserIndex = null
token = token.replace(/(\r\n|\n|\r)/gm, ""); //Removes the newline from the token file
client.login(token)




var lastTime = null  // Used to check the time between "Nice" messages


class user {
  ID
  UName
  NC
  RNC
}

var keywords = [
 "nice", 
 "fortune",
 "hello there", 
 "ping", 
 "marco", 
 "marco!", 
 "list scores", 
 "neofetch"]


//Reads the userfile, or creates it if it doesn't exist
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

//Saves the users stats to the json files
function saveToFiles(){
  console.log("Saving users to file")
  console.log(users)
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

//runs fortune on the sever. the program must be insgtalled 
function fortuneCode(msg){
  exec("/usr/games/fortune", (error, stdout, stderr) => {
    if (error) {
      //console.log(`error: ${error.message}`);
      //msg.reply("Could not run fortune")
       
      // On MacOS (as an example) fortune is stored somewhere stupid
      exec("fortune", (error, stdout, stderr) => {
        if (error) {
          //console.log(`error: ${error.message}`);
          msg.reply("Could not run fortune")

        }
        if (stderr) {
            //msg.reply(`There was an error: ${stderr}`)
            console.log(`stderr: ${stderr}`);
            return;
        }
        msg.channel.send(`${stdout}`);
      });

    }
    if (stderr) {
        //msg.reply(`There was an error: ${stderr}`)
        console.log(`stderr: ${stderr}`);
        return;
    }
    msg.channel.send(`${stdout}`);
  });

}

//Runs neofetch on the server. The program must be installed 
function neofetchCode(msg){
  exec("neofetch --stdout", (error, stdout, stderr) => {
    if (error) {
        //console.log(`error: ${error.message}`);
        msg.reply("Could not run neofetch")
        return;
    }
    if (stderr) {
        msg.reply(`There was an error: ${stderr}`)
        console.log(`stderr: ${stderr}`);
        return;
    }
    msg.reply(`${stdout}`);
  });

}

//Gets the ranking for the nice count
function rankings(msg){
  console.log(msg.content)

  sortArray(users, {
    by: 'NC'
    ,order: 'desc'  // In descending order (coma there for commenting)
  })

  var loops = users.length

  if (users.length > 10){
    loops = 10
  }


  var message = " "

  for (let i = 0; i < loops; i++) {

    message = message + (i+1) + ") " + users[i].UName + ":  " + users[i].NC  + " \n "
    //msg.channel.send(users[i].UName + " \n "+ "Hello")
  }

  msg.channel.send(message)

 
}

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







//When the client connects
client.on('ready', () => {

  console.log(`logged in as ${client.user.tag}!`)

  console.log(client.user.id)

  // Does this  work? Well at some point it did 


  //Sets the bots username and activity
  client.user.setUsername('jBot');
  //client.user.setActivity(':-)');
  client.user.setActivity('You sleep', { type: 'WATCHING' });

  

})




//Runs when the message is read
client.on('message', msg => {

  
  // Commands (Soon this will be a different thing )
  if (msg.author.id === "326743504443146241" ){  // My ID.
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



  //Checks if the message is one of the keywords
  var found = false
  for ( var i = 0; i < keywords.length && !found; i++) {
    if (keywords[i] === msg.content.toLowerCase()) {
      found = true;
      console.log(msg.content)
      break;
    }
  }


  //If the message is one of the keywords
  if (found === true){


    try{
      theUserIndex = findUsers(msg.member.id)
    }catch{
      console.log("The user was not found")
    }


    //This try stops the code from crashing if it cant find a user
    // This happens when you DM the bot
    try {
        
  
      if (theUserIndex == null){

        //Creates a new user with basic entry in the json file
        console.log("New user: " + msg.member.id)
        newUser = {ID:msg.member.id, UName:msg.author.username, NC: 0, RNC: 0,}
        users.push(newUser)
        console.log(newUser)
        msg.channel.send("This is " + msg.member.user.username + "'s first use of the jBot ");

        theUserIndex = findUsers(msg.member.id)
    
      }else{
        users[theUserIndex].RNC++
        console.log(msg.member.user.username + "'s spam count has gone up to " + users[theUserIndex].RNC)
        

        if (users[theUserIndex].RNC == 3){
          msg.author.send("Please don't use the bot to spam the server. It is just annoying.")
        }else if (users[theUserIndex].RNC === SpamCap){
          msg.author.send("You have been temporarily blocked from running jBot commands. ")
          msg.reply("You have been blocked from running jBot commands temporarily ")
          return
        }else if(users[theUserIndex].RNC > SpamCap){
          return
        }

    
        // The kicking can cause an error. Not an issue now but soon will cause the app to crash
        // I can't find a work around at the moment
    
        // The try is not working. Not sure why
        if (users[theUserIndex].RNC > SpamCap){
          return 
        }
      }



      //The message replies 
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

      if (msg.content.toLowerCase() == 'fortune'){
        fortuneCode(msg)
      }

      if (msg.content.toLowerCase() == 'neofetch'){
        neofetchCode(msg)
      }
        

      //The Nice count code
      if (msg.content.toLowerCase() === 'nice'){
        users[theUserIndex].NC++
        msg.channel.send(msg.member.user.username + "'s \"Nice\" count = " + users[theUserIndex].NC)
      }


      
      var now = new Date();
      now = now - 0 // makes now a number. Don't ask why
      
    } catch{
      console.log("error")
    }
  }

  

  //These commands do not fall under the spam filter. 
  //This means people will not be penilised for using them 
  
  if (msg.content.toLowerCase() == "fuck you <@!" + client.user.id + ">"){
    msg.channel.send("Fuck you " + msg.author.username )
  }


  if (msg.content.toLowerCase().includes("uwu")){
    msg.react('🤮')
    msg.author.send('Go uwu somewhere else');
  }

  //Prints message to terminal for debugging.
  console.log(msg.author.username + " : " + msg.content)
})


// hour * min * sec * ms
setInterval(clearRN, (60 * 60 * 1000));   //Runs the clear nice function every time interval 
setInterval(saveToFiles, (60 * 60 * 1000));   //save the users every time interval 


//Says when it disconnects
client.on("disconnected", function () {

	console.log("Disconnected!"); // send message that bot has disconnected.
	process.exit(1); //exit node.js with an error

});
