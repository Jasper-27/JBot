# JBot
 A simple Discord bot I made using Discord.js
 
Add to your server [here](https://discord.com/oauth2/authorize?client_id=717442260131774485&scope=bot&permissions=1)

### Dependencies
- node.js
- Discord.js  
- sort-array

### Optional Dependencies
- Fortune  
- neofetch

### Purpose

I made this Discord bot purely for fun. I have put the code online in case anyone has any suggestions, or wants a base for a similar project. It has been a good little project, and has taught me a lot about JS, NodeJS, and JSON. 

### What it's running on

So at the moment it is running on a raspberry pi4 under my desk at my uni halls. But it used to run on a little AtomPC at my house (untill I managed to make it crash). You can check the specs of the system it is running on, by typing "jbot: neofetch" into the chat. 

### Features
- Keeps track of how many times each user says the word "nice"
- Replies "General Kenobi" to the message "Hello There"
- Kicks and messages user if they spam the message "Nice"
- Reacts with a 🤮 when a user's message contains the word "uwu"
- List "nice" scores
- outputs the result of fortune
- can run neofetch on the server, showing the user what hardware is being used to host the bot (this is done using jbot: neofetch). 
- Commands  
  + jbot: kick @user
  + jbot: save



### Features I want to implement

- Vote to kick
- Roles based on participation
- Add an update feature (Can run a command and it will get itself from GitHub)
- Kick user using using a command (The basics are there but it needs fixing)
- Black list feature: Add a user to a blacklist if they spam (as well as block)
- instead of fortune, it would be cool if the user could add quotes to a list. 


### Issues
- Large groups will be to much for the "nice rankings". Need to rewrite that sections finding each users position and outputting top 10
- Kicking people out of servers is a bit much. Maybe a block list would work better
- Errors out when kicking some people
- very slow. Need to slim down
- I need to introduce some proper error logging 
- I have not used full paths. So this means working direcotory must be specified by the user
