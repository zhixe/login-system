import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
    mutation Register($name: String!, $email: String!, $password: String!) {
        register(name: $name, email: $email, password: $password) {
            id
            name
            email
        }
    }
`;

export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                id
                name
                email
            }
        }
    }
`;

export const GOOGLE_AUTH_MUTATION = gql`
    mutation GoogleAuth($idToken: String!) {
        googleAuth(idToken: $idToken) {
            token
            user {
                id
                name
                email
            }
        }
    }
`;

export const BIND_PASSKEY_MUTATION = gql`
    mutation BindPasskey($userId: ID!, $passkeyId: String!, $publicKey: String!) {
        bindPasskey(userId: $userId, passkeyId: $passkeyId, publicKey: $publicKey)
    }
`;

export const PASSKEY_LOGIN_MUTATION = gql`
    mutation PasskeyLogin($passkeyId: String!, $challengeResponse: String!) {
        passkeyLogin(passkeyId: $passkeyId, challengeResponse: $challengeResponse) {
            token
            user {
                id
                name
                email
            }
        }
    }
`;