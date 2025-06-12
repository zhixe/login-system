// src/components/PasskeyLoginLink.tsx
import React from "react";
import { Button, Spin } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import "../styles/Passkey.css";

export const PasskeyLoginLink: React.FC<{ onClick: () => void; loading?: boolean }> = ({ onClick, loading }) => (
    <div className="passkey-link-container">
        <Button
            type="link"
            icon={<KeyOutlined />}
            className="passkey-login-link"
            onClick={onClick}
            disabled={loading}
            tabIndex={0}
        >
            {loading ? (
                <>
                    <Spin size="small" style={{ marginRight: 8 }} />
                    Signing in...
                </>
            ) : (
                "Sign in with a passkey"
            )}
        </Button>
    </div>
);