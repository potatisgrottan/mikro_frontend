import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
const oidcConfig = {
    authority: "http://keycloaka.app.cloud.cbh.kth.se/realms/hospital-realm",
    client_id: "hospital-app",
    redirect_uri: window.location.origin,
    onSigninCallback: () => {
        // Snyggar till URL:en efter inloggning (tar bort ?code=...)
        window.history.replaceState({}, document.title, window.location.pathname);
    }
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
