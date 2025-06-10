import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import LoginPage from "./pages/LoginPage";
import { client } from "./graphql/client";
import {ApolloProvider} from "@apollo/client";
// import RegisterPage from "./pages/RegisterPage"; // For future use
// import HomePage from "./pages/HomePage"; // For future use

// Optionally set up theme here (light/dark, custom colors)
const customTheme = {
    algorithm: theme.defaultAlgorithm, // or theme.darkAlgorithm
    token: {
        colorPrimary: "#0072ff",
        borderRadius: 8,
        fontFamily: "Inter, 'Segoe UI', Arial, sans-serif",
    },
};

const App: React.FC = () => (
    <ApolloProvider client={client}>
        <ConfigProvider theme={customTheme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    {/* <Route path="/register" element={<RegisterPage />} /> */}
                    {/* <Route path="/home" element={<HomePage />} /> */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </ConfigProvider>
    </ApolloProvider>
);

export default App;