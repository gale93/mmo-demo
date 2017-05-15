package utils

import (
	"encoding/base64"
	"math/rand"
	"time"
)

// RandomString generates a random string.
func RandomString(size int) string {
	rb := make([]byte, size)
	rand.Read(rb)

	return base64.URLEncoding.EncodeToString(rb)
}

func init() {
	rand.Seed(time.Now().UnixNano())
}
