// src/pages/AuthPage.tsx
import React, { useState } from "react";
import { Tabs, Card } from "antd";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { GoogleLoginButton } from "../components/GoogleLoginButton";
import "../styles/Page.css";
import {PasskeyLoginLink} from "../components/PasskeyLoginLink";
import {usePasskeyLogin} from "../viewmodels/usePasskeyLogin";

const AuthPage: React.FC = () => {
    const [tab, setTab] = useState("login");
    const onSuccess = () => { /* set JWT, redirect, etc. */ };
    const [username, setUsername] = useState(""); // for passkey, can use "" or autofilled
    const { loading: passkeyLoading, handlePasskeyLogin } = usePasskeyLogin(username, onSuccess);

    return (
        <div className="auth-page-bg">
            <Card className="auth-page-card">
            <Tabs
                    activeKey={tab}
                    onChange={setTab}
                    centered
                    items={[
                        {
                            key: "login",
                            label: "Login",
                            children: (
                                <>
                                    <LoginForm onSuccess={onSuccess} />
                                    <GoogleLoginButton onSuccess={onSuccess} />
                                    <PasskeyLoginLink
                                        loading={passkeyLoading}
                                        onClick={handlePasskeyLogin}
                                    />
                                </>
                            )
                        },
                        {
                            key: "register",
                            label: "Register",
                            children: (
                                <>
                                    <RegisterForm onSuccess={() => setTab("login")} />
                                    <GoogleLoginButton onSuccess={onSuccess} />
                                </>
                            )
                        }
                    ]}
                />
            </Card>
        </div>
    );
};
export default AuthPage;