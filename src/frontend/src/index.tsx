import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConfigProvider } from "antd";
import { ApolloProvider } from "@apollo/client";
import { client } from "./graphql/client";
import {GoogleOAuthProvider} from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <ConfigProvider>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
                    <App />
                </GoogleOAuthProvider>
            </ConfigProvider>
        </ApolloProvider>
    </React.StrictMode>
);