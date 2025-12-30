// src/components/PrivateRoute.jsx
import React from "react";
import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, roles }) {
    const auth = useAuth();

    // 1. Vänta tills Keycloak laddat klart (annars kastas man ut direkt)
    if (auth.isLoading) {
        return <div>Loading authentication...</div>;
    }

    // 2. Är man inte inloggad? Gå till login
    if (!auth.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // 3. Kolla roller (ligger under realm_access i Keycloak-token)
    const userRoles = auth.user?.profile?.realm_access?.roles || [];

    // Om routen kräver roller och användaren inte har dem
    if (roles && roles.length > 0) {
        const hasRole = roles.some(role => userRoles.includes(role));
        if (!hasRole) {
            return <div>Access Denied: You do not have the required role.</div>;
        }
    }

    return children;
}