import React from "react";
import { Button, Card, Typography, Spin } from "antd";
import { KeyOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import "../styles/PasskeyLoginForm.css";

interface PasskeyLoginFormProps {
    loading: boolean;
    onPasskeyLogin: () => void;
    error?: string;
}

export const PasskeyLoginForm: React.FC<PasskeyLoginFormProps> = ({
                                                                      loading,
                                                                      onPasskeyLogin,
                                                                      error,
                                                                  }) => (
    <Card className="passkey-login-card">
        <div className="passkey-login-header">
            <SafetyCertificateOutlined style={{ fontSize: 44, color: "#1890ff" }} />
            <Typography.Title level={2} className="passkey-login-title">
                Sign in with Passkey
            </Typography.Title>
            <Typography.Text type="secondary">
                Passwordless. Secure. Fast.
            </Typography.Text>
        </div>
        <Button
            className="passkey-login-btn"
            type="primary"
            block
            size="large"
            icon={<KeyOutlined />}
            onClick={onPasskeyLogin}
            disabled={loading}
        >
            {loading ? <Spin /> : "Sign in with Passkey"}
        </Button>
        {error && (
            <Typography.Text className="passkey-login-error">
                {error}
            </Typography.Text>
        )}
        <div className="passkey-login-footer">
            Trouble signing in?{" "}
            <a href="/recovery" style={{ color: "#1890ff" }}>
                Use a recovery code
            </a>
            <br />
            <span>(Passkey sign-in uses device biometrics or your phone)</span>
        </div>
    </Card>
);