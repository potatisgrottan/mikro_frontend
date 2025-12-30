import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
    authority: "https://keycloaka.app.cloud.cbh.kth.se/realms/hospital-realm",
    client_id: "hospital-app",
    redirect_uri: window.location.origin,
    onSigninCallback: () => {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AuthProvider {...oidcConfig}>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
