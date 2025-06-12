import { useState } from "react";
import { authenticateWithPasskey } from "../services/passkeyService";

export function usePasskeyLogin(username: string, onSuccess?: () => void) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const handlePasskeyLogin = async () => {
        setLoading(true);
        setError(undefined);
        try {
            await authenticateWithPasskey(username);
            if (onSuccess) onSuccess();
        } catch (e: any) {
            setError(e.message || "Authentication failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, handlePasskeyLogin };
}