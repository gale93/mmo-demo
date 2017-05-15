package server

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

//Client contains user info
type Client struct {
	handler *Handler
	conn    *websocket.Conn
}

func newClient(conn *websocket.Conn, handler *Handler) *Client {
	return &Client{
		conn:    conn,
		handler: handler,
	}
}

//Send will send the data to the open connection
func (c *Client) send(header string, v interface{}) {
	var m Message
	m.Header = header
	m.Body = v

	c.conn.WriteJSON(m)
}

// HandleRemote will seek messages from client
func (c *Client) handleRemote() {
	log.Println("A connection has been estabilished.")
	c.handler.clientsCH <- c

	var p Packet
	p.client = c

	for {
		var err error
		var msg []byte

		if _, msg, err = c.conn.ReadMessage(); err != nil {
			break
		}

		var objmap map[string]*json.RawMessage
		json.Unmarshal(msg, &objmap)

		json.Unmarshal(*objmap["header"], &p.message.Header)
		p.message.Body = objmap["body"]

		//time.Sleep(time.Second / 4)
		c.handler.pktCH <- p
	}

	c.conn.Close()
	c.handler.clientsCH <- c
}
