package service

import (
	"net/http"

	"github.com/go-webauthn/webauthn/protocol"
	"github.com/go-webauthn/webauthn/webauthn"
)

var sessionStore = map[string]*webauthn.SessionData{}

type PasskeyService struct {
	WebAuthn *webauthn.WebAuthn
}

func NewPasskeyService() *PasskeyService {
	web, err := webauthn.New(&webauthn.Config{
		RPDisplayName: "Login System", // Displayed to users
		RPID:          "localhost",
		RPOrigins:     []string{"http://localhost:5173"},
	})
	if err != nil {
		panic(err)
	}
	return &PasskeyService{WebAuthn: web}
}

// --- Registration ---
func (p *PasskeyService) BeginRegistration(user *User) (*protocol.CredentialCreation, *webauthn.SessionData, error) {
	// No WithUserVerification here!
	opts, session, err := p.WebAuthn.BeginRegistration(user)
	if err != nil {
		return nil, nil, err
	}
	return opts, session, nil
}

func (p *PasskeyService) FinishRegistration(user *User, sessionData *webauthn.SessionData, r *http.Request) (*User, error) {
	credential, err := p.WebAuthn.FinishRegistration(user, *sessionData, r)
	if err != nil {
		return nil, err
	}
	user.Credentials = append(user.Credentials, Credential{
		ID:              credential.ID,
		PublicKey:       credential.PublicKey,
		AttestationType: credential.AttestationType,
		Authenticator:   credential.Authenticator,
	})
	return user, nil
}

// --- Login ---
func (p *PasskeyService) BeginLogin(user *User) (*protocol.CredentialAssertion, *webauthn.SessionData, error) {
	opts, session, err := p.WebAuthn.BeginLogin(
		user,
		webauthn.WithUserVerification(protocol.VerificationPreferred),
	)
	if err != nil {
		return nil, nil, err
	}
	return opts, session, nil
}

func (p *PasskeyService) FinishLogin(user *User, sessionData *webauthn.SessionData, r *http.Request) (*User, error) {
	_, err := p.WebAuthn.FinishLogin(user, *sessionData, r)
	if err != nil {
		return nil, err
	}
	return user, nil
}

// --- Session (demo, in-memory) ---
func (p *PasskeyService) SaveSession(username string, sessionData *webauthn.SessionData) {
	sessionStore[username] = sessionData
}
func (p *PasskeyService) GetSession(username string) *webauthn.SessionData {
	return sessionStore[username]
}
