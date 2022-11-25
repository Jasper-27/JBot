package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"os"
	"os/signal"
	"regexp"
	"runtime"
	"strings"
	"syscall"

	"github.com/bwmarrin/discordgo"
	"github.com/google/uuid"
)

//global stuff for shortcuts
var p = fmt.Println

var ID = "" // ID used for telling machines apart. Will be based on MAC address
var name = "HOSTNAME PLACEHOLDER"

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

	reactions(s, m, low_content)

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
