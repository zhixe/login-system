CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name TEXT NOT NULL,
                       email TEXT UNIQUE NOT NULL,
                       password_hash TEXT,
                       google_id TEXT,
                       registered_with_google BOOLEAN DEFAULT FALSE,
                       has_password BOOLEAN DEFAULT FALSE,
                       created_at TIMESTAMP DEFAULT NOW(),
                       updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_passkeys (
                               id SERIAL PRIMARY KEY,
                               user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                               passkey_id TEXT UNIQUE NOT NULL,
                               public_key TEXT NOT NULL,
                               created_at TIMESTAMP DEFAULT NOW()
);
