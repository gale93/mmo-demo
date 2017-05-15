package server

import (
	"Relo/utils"
	"encoding/json"
	"math"
	"strconv"
)

//Player is the player structure
type Player struct {
	ID   uint64
	Name string

	Map  string
	X, Y int32
}

func (p *Player) isAuthed() bool {
	return p.ID != 0
}

func (p *Player) getFullName() string {
	return "[ " + p.Name + " | " + strconv.Itoa(int(p.ID)) + " ]"
}

type loginForm struct {
	N, P string
}

func (p *Player) login(msg interface{}) bool {

	var lf loginForm
	json.Unmarshal(*msg.(*json.RawMessage), &lf)

	// todo process login form actually log in players

	p.ID = utils.GetUniqueID()
	p.Name = lf.N
	p.Map = "map"

	return p.isAuthed()
}

type movePlayer struct {
	X, Y int32
}

func (p *Player) move(msg interface{}) bool {
	var mp movePlayer
	json.Unmarshal(*msg.(*json.RawMessage), &mp)

	if math.Abs(float64(p.X-mp.X)) <= 1 && math.Abs(float64(p.Y-mp.Y)) <= 1 {
		p.X = mp.X
		p.Y = mp.Y

		return true
	}

	return false
}
