// src/components/RegisterForm.tsx
import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "../graphql/mutations";
import "../styles/Form.css";
import {Item, Title, Text} from "../_shared/constants";

export const RegisterForm: React.FC<{onSuccess?: () => void}> = ({ onSuccess }) => {
    const [register, { loading, error }] = useMutation(REGISTER_MUTATION);
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        const res = await register({ variables: values });
        if (res.data?.register) onSuccess?.();
    };

    return (
        <Form className="register-form-card"  form={form} onFinish={handleSubmit} layout="vertical">
            <Title level={3}>Register Account</Title>
            <Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
            </Item>
            <Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                <Input />
            </Item>
            <Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
                <Input.Password />
            </Item>
            <Item name="confirm" label="Confirm Password" dependencies={['password']} hasFeedback
                       rules={[
                           { required: true },
                           ({ getFieldValue }) => ({
                               validator(_, value) {
                                   if (!value || getFieldValue('password') === value) return Promise.resolve();
                                   return Promise.reject('Passwords do not match!');
                               },
                           }),
                       ]}>
                <Input.Password />
            </Item>
            {error && <Text className="register-error" type="danger">{error.message}</Text>}
            <Item>
                <Button type="primary" htmlType="submit" loading={loading} block icon={<UserAddOutlined />}>
                    Register
                </Button>
            </Item>
        </Form>
    );
};