# Changelog

All notable changes to this project will be documented in this file.

---

## [0.1.0] - 2025-06-12

### Fixed
- **CORS Policy:** Updated backend CORS configuration to allow cross-origin requests from Netlify frontend (`https://project-2-login-system.netlify.app`) and local dev (`http://localhost:5173`).
- **Content Security Policy (CSP):** Updated Netlify configuration to allow Google authentication scripts and styles by adding `https://accounts.google.com` to `script-src` and `style-src`.
- **GraphQL Endpoint:** Fixed frontend production environment to target the deployed Railway backend URL.
- **Schema Generation:** Resolved gqlgen errors by explicitly specifying model paths and matching struct field casing.
- **Case Sensitivity:** Fixed parameter naming inconsistencies (`passkeyID` vs `passkeyId`) in resolver code.

### Added
- **Dockerfile:** Provided optimized Dockerfile at repository root for seamless Railway and container deployment.

## [0.0.1] - 2025-06-10

### Added
- **Initial Project Setup:** Created the monorepo structure with separate frontend and backend directories.
- **Backend Project Setup:** Initialized the Go backend with Echo framework and GraphQL support.
- **Frontend Project Setup:** Initialized with Vite, React, TypeScript, Ant Design, and Apollo GraphQL.
- **Core Structure:** Established base folder and code organization.

---

> **For complete details, see commit history or the project repository.**