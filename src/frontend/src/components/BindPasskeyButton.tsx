// src/components/BindPasskeyButton.tsx
import React from "react";
import { Button } from "antd";
import { usePasskeyRegister } from "../viewmodels/usePasskeyRegister";
export const BindPasskeyButton = ({ userId }: { userId: string }) => {
    const { handleRegister, loading } = usePasskeyRegister(userId, () => {
        // show success, etc.
    });
    return (
        <Button loading={loading} onClick={handleRegister}>Bind Passkey</Button>
    );
};