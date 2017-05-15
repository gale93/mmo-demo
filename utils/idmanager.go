package utils

var idManager uint64

// GetUniqueID assign new unique id to the given object
func GetUniqueID() uint64 {
	idManager++

	return idManager
}
