package main

import (
	"fmt"
	"io/ioutil"
	"net"
	"os"
	"os/signal"
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

	// Where to download files to

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

	// Ignore all messages created by the bot itself
	if m.Author.ID == s.State.User.ID {
		return
	}

	if strings.Contains(strings.ToLower(m.Content), "!test") {
		s.ChannelMessageSend(m.ChannelID, "testSuccesfull")
	}

	//log of all messages sent in the chat
	p(m.Author.Username, ": ", m.Content)

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
