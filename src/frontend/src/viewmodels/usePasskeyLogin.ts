import { useState } from "react";
import { startAuthentication } from "@simplewebauthn/browser";
import { authenticateWithPasskey } from "../services/passkeyService";

export function usePasskeyLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const handlePasskeyLogin = async () => {
        setLoading(true);
        setError(undefined);
        try {
            await authenticateWithPasskey(); // This should call your backend for options, do WebAuthn, send assertion to backend
            // You might want to redirect or set user state here on success
        } catch (e: any) {
            setError(e.message || "Authentication failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, handlePasskeyLogin };
}