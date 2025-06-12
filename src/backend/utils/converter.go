package utils

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"github.com/go-webauthn/webauthn/protocol"
	"io"
)

// MapToReader converts a map to an io.Reader by marshaling it to JSON and returning a bytes.Reader.
func MapToReader(m map[string]interface{}) io.Reader {
	b, _ := json.Marshal(m)
	return bytes.NewReader(b)
}

// base64url encodes the given byte slice using base64 URL encoding without padding.
func base64url(data []byte) string {
	return base64.RawURLEncoding.EncodeToString(data)
}

// extractUserID extracts the user ID from the given interface, which can be a byte slice or a base64-encoded string.
func extractUserID(v interface{}) ([]byte, error) {
	switch vv := v.(type) {
	case []byte:
		return vv, nil
	case string:
		b, err := base64.RawURLEncoding.DecodeString(vv)
		if err != nil {
			return nil, err // Return the error
		}
		return b, nil
	default:
		return nil, nil
	}
}

// EncodeRegistrationOptions converts CredentialCreation options to a map for JSON encoding.
func EncodeRegistrationOptions(opts *protocol.CredentialCreation) map[string]interface{} {
	resp := opts.Response

	userID, _ := extractUserID(resp.User.ID) // fix here

	out := map[string]interface{}{
		"challenge": base64url(resp.Challenge),
		"rp": map[string]interface{}{
			"name": resp.RelyingParty.Name,
			"id":   resp.RelyingParty.ID,
		},
		"user": map[string]interface{}{
			"id":          base64url(userID),
			"name":        resp.User.Name,
			"displayName": resp.User.DisplayName,
		},
		"pubKeyCredParams": resp.Parameters,
		"timeout":          resp.Timeout,
	}

	if resp.Attestation != "" {
		out["attestation"] = resp.Attestation
	}
	return out
}

// EncodeAssertionOptions converts CredentialAssertion options to a map for JSON encoding.
func EncodeAssertionOptions(opts *protocol.CredentialAssertion) map[string]interface{} {
	resp := opts.Response

	// Try both possible names for the field:
	out := map[string]interface{}{
		"challenge":        base64url(resp.Challenge),
		"timeout":          resp.Timeout,
		"rpId":             resp.RelyingPartyID,
		"userVerification": resp.UserVerification,
	}

	allowCreds := make([]map[string]interface{}, len(resp.AllowedCredentials))
	for i, cred := range resp.AllowedCredentials {
		ac := map[string]interface{}{
			"type": "public-key",
			"id":   base64url(cred.CredentialID), // <-- ONLY THIS
		}
		// If Transports exists in your version, you can include this line
		// ac["transports"] = cred.Transports
		allowCreds[i] = ac
	}
	out["allowCredentials"] = allowCreds
	return out
}
