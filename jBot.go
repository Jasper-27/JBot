package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"os"
	"os/signal"
	"regexp"
	"runtime"
	"strconv"
	"strings"
	"syscall"

	"github.com/bwmarrin/discordgo"
	"github.com/google/uuid"
)

//global stuff for shortcuts
var p = fmt.Println

var ID = "" // ID used for telling machines apart. Will be based on MAC address
var name = "HOSTNAME PLACEHOLDER"
var BotID string // The ID of this bot in discord

// Used for the nice count feature
type User struct {
	ID string
	NC int
}

var users []User = getUsers()

func main() {

	// Generating the node's unique ID
	ID = generateGUID()

	// Setting the users hostname
	name, _ = os.Hostname()

	// Setting up the token (add the token manually here if you want it to be compiled with the code)
	btok, _ := ioutil.ReadFile("token")
	token := string(btok)
	token = strings.Replace(token, "\n", "", -1)

	// Setting up Bot connection
	dg, err := discordgo.New("Bot " + token)
	if err != nil {
		p(err.Error())
		return
	}

	dg.AddHandler(messageHandler)

	err = dg.Open()
	if err != nil {
		p(err.Error())
		return
	}

	// Works out the bot's ID
	u, err := dg.User("@me")
	if err != nil {
		fmt.Println(err.Error())
	}
	BotID = u.ID

	p("Bot is up")

	// Wait here until CTRL-C or other term signal is received.
	p("Bot is now running. Press CTRL-C to exit.")
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt, os.Kill)
	<-sc

	// Cleanly close down the Discord session.
	dg.Close()

}

func messageHandler(s *discordgo.Session, m *discordgo.MessageCreate) {

	//Dont reply if the message is from the bot
	if m.Author.ID == BotID {
		return
	}

	// used for checking rules against
	low_content := TrimString(m.Content)

	// Ignore all messages created by the bot itself
	if m.Author.ID == s.State.User.ID {
		return
	}

	if strings.Contains(strings.ToLower(m.Content), "!test") {
		s.ChannelMessageSend(m.ChannelID, "testSuccesfull")
	}

	//log of all messages sent in the chat
	p(m.Author.Username, ": ", m.Content)

	// Handles replying to messages in a ping/pong format``
	replies(s, m, low_content)

	// Handles reacting to messages with emojis
	reactions(s, m, low_content)

	// The infamous nice count
	if low_content == "nice" {
		niceCount(s, m)
	}

}

func niceCount(s *discordgo.Session, m *discordgo.MessageCreate) {
	if user, err := findUser(users, m.Author.ID); err == nil {

		// fmt.Println(users[user].ID)

		users[user].NC += 1
		if users[user].NC > 1 {
			niceMessage := m.Author.Username + "'s \"nice\" count has gone up to " + strconv.Itoa(users[user].NC)

			s.ChannelMessageSend(m.ChannelID, niceMessage)
		} else {
			fmt.Println("NewGuy")
		}
		writeUsers()
	} else {
		s.ChannelMessageSend(m.ChannelID, "This is the first time "+m.Author.Username+" has been logged saying \"Nice\"")

		newUser := User{m.Author.ID, 1}

		users = append(users, newUser)
		writeUsers()

	}

}

func generateGUID() string {

	// MacOS doesn't seem to like the hardware addr GUID thing. So guess we going random number
	if runtime.GOOS == "darwin" {
		id := uuid.New()
		return id.String()
	}

	// gets the machines network interfaces
	ifas, err := net.Interfaces()
	if err != nil {
		return ""
	}

	address := ifas[0].HardwareAddr.String()       // gets the MAC(hardware) address from the first network interface
	address = strings.ReplaceAll(address, ":", "") // removes the : so it's easier to copy and paste

	return string(address)
}

// Function for making strings easier to do checks on
func TrimString(text string) string {

	// Remove symbols (has to go before trim, as it will replace trailing symbols with " " )
	re, err := regexp.Compile(`[^\w]`)
	if err != nil {
		log.Fatal(err)
	}
	text = re.ReplaceAllString(text, " ")
	fmt.Println(text)

	text = strings.TrimSpace(text)
	text = strings.ToLower(text)

	return text
}

// Handles replying to messages in a ping/pong format
func replies(s *discordgo.Session, m *discordgo.MessageCreate, low_content string) {
	//Ping Pong
	if low_content == "ping" {
		_, err := s.ChannelMessageSend(m.ChannelID, "Pong!")
		if err != nil {
			fmt.Println("Error with Ping Pong")
		}
	}

	//Kenobo
	if low_content == "hello there" {
		_, err := s.ChannelMessageSend(m.ChannelID, "General Kenobi! You are a bold one")

		if err != nil {
			fmt.Println("Error with Ping Pong")
		}
		err2 := s.MessageReactionAdd(m.ChannelID, m.Message.ID, "❤️")
		if err2 != nil {
			fmt.Println("Error with Ping Pong")
		}
	}

	// Marco Polo
	if low_content == "marco" {
		_, err := s.ChannelMessageSend(m.ChannelID, "Polo!")
		if err != nil {
			fmt.Println("Error with Ping Pong")
		}
	}
}

// Function to handle reacting to messages
func reactions(s *discordgo.Session, m *discordgo.MessageCreate, low_content string) {

	//React with sick when you see an uwu
	if strings.Contains(low_content, "uwu") {
		err := s.MessageReactionAdd(m.ChannelID, m.Message.ID, "🤮")
		if err != nil {
			fmt.Println(err)
		}
	}

	// React with a 🍆 whenever Reece(291990735337553922) sends a message
	if m.Author.ID == "291990735337553922" {
		err := s.MessageReactionAdd(m.ChannelID, m.Message.ID, "🍆")
		if err != nil {
			fmt.Println(err)
		}
	}

}

////////////////////////////////////
/// Nice count related function ////
////////////////////////////////////

// Write the current users to the file
func writeUsers() {
	out, _ := json.MarshalIndent(users, "", "  ")
	err := ioutil.WriteFile("users.json", out, 0644)
	if err != nil {
		fmt.Println(err.Error())
	}
}

// Get the index of a user in the array
func findUser(users []User, userID string) (int, error) {

	for index, user := range users {
		if user.ID == userID {
			//fmt.Println("Found")

			return index, nil
		}
	}
	//err_1 := error("Not found")
	return 0, errors.New("Not Found.")
}

// Read all the users in from the file
func getUsers() []User {
	fmt.Println("These are the users allready in the file")
	fmt.Printf("\n\n")
	content, err := ioutil.ReadFile("users.json")
	if err != nil {
		fmt.Println(err.Error())
	}

	var users []User
	err3 := json.Unmarshal(content, &users)
	if err3 != nil {
		fmt.Println("error with Unmarshal")
		fmt.Println(err3.Error())
	}

	for _, x := range users {
		fmt.Println(x.ID)
	}

	fmt.Printf("\n\n")
	return users
}
