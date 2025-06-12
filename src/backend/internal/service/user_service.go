// All user storage/retrieval (in-memory or DB).
package service

import (
	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/google/uuid"
	"sync"
)

// --- User Store (in-memory for demo) ---

type Credential struct {
	ID              []byte
	PublicKey       []byte
	AttestationType string
	Authenticator   webauthn.Authenticator
}

type User struct {
	Username    string
	ID          []byte // unique id
	Credentials []Credential
}

// Implement webauthn.User interface:
func (u *User) WebAuthnID() []byte          { return u.ID }
func (u *User) WebAuthnName() string        { return u.Username }
func (u *User) WebAuthnDisplayName() string { return u.Username }
func (u *User) WebAuthnIcon() string        { return "" }
func (u *User) WebAuthnCredentials() []webauthn.Credential {
	creds := make([]webauthn.Credential, len(u.Credentials))
	for i, c := range u.Credentials {
		creds[i] = webauthn.Credential{
			ID:              c.ID,
			PublicKey:       c.PublicKey,
			AttestationType: c.AttestationType,
			Authenticator:   c.Authenticator,
		}
	}
	return creds
}

// --- In-memory user store (thread safe) ---
var userStore = struct {
	sync.Mutex
	users map[string]*User
}{users: make(map[string]*User)}

func GetOrCreateUser(username string) *User {
	userStore.Lock()
	defer userStore.Unlock()
	if user, exists := userStore.users[username]; exists {
		return user
	}
	newUUID := uuid.New()
	user := &User{Username: username, ID: newUUID[:]}
	userStore.users[username] = user
	return user
}

func GetUser(username string) *User {
	userStore.Lock()
	defer userStore.Unlock()
	return userStore.users[username]
}
