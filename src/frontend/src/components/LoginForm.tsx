// src/components/LoginForm.tsx
import React from "react";
import { Form, Input, Button, Typography } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/mutations";
import "../styles/Form.css";
import {Title, Item, Text} from "../_shared/constants";

export const LoginForm: React.FC<{onSuccess?: () => void}> = ({ onSuccess }) => {
    const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

    const handleSubmit = async (values: any) => {
        const res = await login({ variables: values });
        if (res.data?.login) onSuccess?.();
    };

    return (
        <Form className="login-form-card" onFinish={handleSubmit} layout="vertical">
            <Title level={3}>Login</Title>
            <Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
                <Input />
            </Item>
            <Item name="password" label="Password" rules={[{ required: true, message: "Please enter your password" }]}>
                <Input.Password />
            </Item>
            {error && <Text className="login-error" type="danger">{error.message}</Text>}
            <Item>
                <Button type="primary" htmlType="submit" loading={loading} block icon={<LoginOutlined />}>
                    Login
                </Button>
            </Item>
        </Form>
    );
};