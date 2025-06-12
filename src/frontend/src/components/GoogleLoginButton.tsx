// src/components/GoogleLoginButton.tsx
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@apollo/client";
import { GOOGLE_AUTH_MUTATION } from "../graphql/mutations";

export const GoogleLoginButton: React.FC<{onSuccess?: () => void}> = ({ onSuccess }) => {
    const [googleAuth] = useMutation(GOOGLE_AUTH_MUTATION);

    return (
        <GoogleLogin
            onSuccess={async credentialResponse => {
                if (credentialResponse.credential) {
                    await googleAuth({ variables: { idToken: credentialResponse.credential } });
                    onSuccess?.();
                }
            }}
            onError={() => {
                console.error("Google login failed");
            }}
        />
    );
};