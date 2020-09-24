# JBot
 A simple Discord bot I made using Discord.js

### Dependencies
- node.js
- Discord.js  
- sort-array

### Optional Dependencies
- Fortune  
- neofetch

### Purpose

I made this Discord bot purely for fun. I have it running on a very old Intel Atom PC at my house. I have put the code online in case anyone has any suggestions, or wants a base for a similar project.

### Features
- Keeps track of how many times each user says the word "nice"
- Replies "General Kenobi" to the message "Hello There"
- Kicks and messages user if they spam the message "Nice"
- Reacts with a 🤮 when a user's message contains the word "uwu"
- List "nice" scores
- outputs the result of fortune
- can run neofetch on the server, showing the user what hardware is being used to host the bot. 
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