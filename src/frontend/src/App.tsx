import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { client } from "./graphql/client";
import {ApolloProvider} from "@apollo/client";
import AuthPage from "./pages/AuthPage";

// Set up theme here (light/dark, custom colors)
const customTheme = {
    algorithm: theme.defaultAlgorithm, // or theme.darkAlgorithm
    token: {
        colorPrimary: "#0072ff",
        borderRadius: 8,
        fontFamily: "Inter, 'Segoe UI', Arial, sans-serif",
    },
};

const App: React.FC = () => (
    <ConfigProvider theme={customTheme}>
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<AuthPage />} />
            </Routes>
        </BrowserRouter>
    </ConfigProvider>
);

export default App;