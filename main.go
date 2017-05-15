package main

import (
	"Relo/server"
	"log"
	"net/http"
)

func main() {

	handler := server.NewHandler()
	go handler.Serve()

	// websocket listener
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		server.Connection(handler, w, r)
	})

	// server static contents
	http.Handle("/", http.FileServer(http.Dir("client")))

	log.Println("Server ready to load.")
	http.ListenAndServe(":9393", nil)
}
