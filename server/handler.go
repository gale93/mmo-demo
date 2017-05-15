package server

import (
	"encoding/json"
	"log"
)

//Handler will handle all connections and clients
type Handler struct {
	clientsCH chan *Client
	pktCH     chan Packet

	clients map[*Client]*Player
}

// NewHandler is used in the main
func NewHandler() *Handler {
	return &Handler{
		pktCH:     make(chan Packet),
		clientsCH: make(chan *Client),
		clients:   make(map[*Client]*Player),
	}
}

func (h *Handler) broadcast(header string, i interface{}, mapName string) {
	for k, v := range h.clients {
		if mapName == "any" || v.Map == mapName {
			k.send(header, i)
		}
	}
}

func (h *Handler) disconnect(c *Client) {
	log.Println(h.clients[c].getFullName(), " closed connection.")
	h.broadcast("player_left", h.clients[c].ID, h.clients[c].Map)

	delete(h.clients, c)
}

// Serve is te be used with "go" keyword. must work
// on separate thread
func (h *Handler) Serve() {
	for {
		select {

		case client := <-h.clientsCH:
			if _, ok := h.clients[client]; ok {
				h.disconnect(client)
			} else {
				h.clients[client] = &Player{X: 3, Y: 3}
			}

		case packet := <-h.pktCH:
			h.elaborate(&packet)
		}
	}
}

func (h *Handler) servePlayerList(c *Client, mapName *string) {
	var list []*Player
	for _, v := range h.clients {
		if v.Map == *mapName {
			list = append(list, v)
		}
	}
	c.send("player_list", list)
}

func (h *Handler) elaborate(p *Packet) {
	switch p.message.Header {
	case "login":
		if h.clients[p.client].login(p.message.Body) {
			log.Println(h.clients[p.client].getFullName(), " connected.")
			p.client.send("login", h.clients[p.client])
		} else {
			p.client.send("login_failed", nil)
		}
	case "to_map":
		var newMap string
		json.Unmarshal(*p.message.Body.(*json.RawMessage), &newMap)
		oldMap := h.clients[p.client].Map

		h.clients[p.client].Map = "moving"

		log.Println(h.clients[p.client].getFullName(), " joined map [", newMap, "]")
		h.broadcast("player_left", h.clients[p.client].ID, oldMap)
		h.broadcast("player_join", h.clients[p.client], newMap)

		h.clients[p.client].Map = newMap

		fallthrough
	case "player_list":
		var mapName string
		json.Unmarshal(*p.message.Body.(*json.RawMessage), &mapName)

		h.servePlayerList(p.client, &mapName)
	case "move":
		if h.clients[p.client].move(p.message.Body) {
			h.broadcast("move", h.clients[p.client], h.clients[p.client].Map)
		}
	default:
	}
}
