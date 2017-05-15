package server

// Message is the standard format for communication trought ws
type Message struct {
	Header string
	Body   interface{}
}

// Packet is the structure of message inside the server
type Packet struct {
	client  *Client
	message Message
}
