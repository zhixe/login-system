import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { gql } from "@apollo/client";
import { client } from "../graphql/client";

// Registration
export async function registerWithPasskey(username: string) {
    // 1. Get registration options from backend
    const { data, errors } = await client.mutate({
        mutation: gql`
            mutation StartPasskeyRegistration($username: String!) {
                startRegistration(username: $username) {
                    publicKey
                }
            }
        `,
        variables: { username },
    });
    if (errors) throw new Error(errors[0].message);

    function cleanRegistrationOptions(opts: any) {
        return {
            ...opts,
        };
    }

    // 2. Start WebAuthn registration in browser
    const options = data.startRegistration.publicKey;
    console.log("register options", options);
    const attestation = await startRegistration(options);
    // const attestation = await startRegistration(cleanRegistrationOptions(options));

    // 3. Send attestation to backend to complete registration
    const { errors: finishErrors } = await client.mutate({
        mutation: gql`
            mutation FinishPasskeyRegistration($username: String!, $attestation: JSON!) {
                finishRegistration(username: $username, attestation: $attestation)
            }
        `,
        variables: { username, attestation },
    });
    if (finishErrors) throw new Error(finishErrors[0].message);
}

// Login
export async function authenticateWithPasskey(username: string) {
    // 1. Get authentication options from backend
    const { data, errors } = await client.mutate({
        mutation: gql`
            mutation StartPasskeyAuth($username: String!) {
                startLogin(username: $username) {
                    publicKey
                }
            }
        `,
        variables: { username },
    });
    if (errors) throw new Error(errors[0].message);

    // 2. Run WebAuthn authentication in browser
    console.log("auth options", data.startLogin.publicKey);
    const assertion = await startAuthentication(data.startLogin.publicKey);

    // 3. Send assertion to backend for verification
    const { errors: finishErrors } = await client.mutate({
        mutation: gql`
            mutation FinishPasskeyAuth($username: String!, $assertion: JSON!) {
                finishLogin(username: $username, assertion: $assertion)
            }
        `,
        variables: { username, assertion },
    });
    if (finishErrors) throw new Error(finishErrors[0].message);
}