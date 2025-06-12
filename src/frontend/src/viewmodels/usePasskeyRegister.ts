import { useState } from "react";
import { registerWithPasskey} from "../services/passkeyService";

export function usePasskeyRegister(username: string, onSuccess?: () => void) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const handleRegister = async () => {
        setLoading(true);
        setError(undefined);
        try {
            await registerWithPasskey(username);
            if (onSuccess) onSuccess();
        } catch (e: any) {
            setError(e.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, handleRegister };
}