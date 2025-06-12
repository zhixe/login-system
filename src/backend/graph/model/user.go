package model

type User struct {
	ID                   string `json:"id"`
	Name                 string `json:"name"`
	Email                string `json:"email"`
	GoogleID             string `json:"GoogleId"`
	RegisteredWithGoogle bool   `json:"registered_with_google"`
	HasPassword          bool   `json:"has_password"`
}

type AuthPayload struct {
	Token string `json:"Token"`
	User  *User  `json:"User"`
}
