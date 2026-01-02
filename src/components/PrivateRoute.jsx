import React from "react";
import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, roles }) {
    const auth = useAuth();

    // 1. Laddar Keycloak fortfarande? Visa text
    if (auth.isLoading) {
        return <div>Loading authentication...</div>;
    }

    // 2. Inte inloggad? Skicka till login
    if (!auth.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // 3. Hämta roller från Keycloak-profilen
    // Vi kollar både i 'realm_access' och 'resource_access' för säkerhets skull
    const realmRoles = auth.user?.profile?.realm_access?.roles || [];
    const resourceRoles = auth.user?.profile?.resource_access?.['hospital-app']?.roles || [];

    // Slå ihop alla roller användaren har
    const userRoles = [...realmRoles, ...resourceRoles];

    // --- DEBUGGING (Kolla i webbläsarens konsol F12) ---
    console.log("Användarens roller från Keycloak:", userRoles);
    console.log("Krävda roller för denna sida:", roles);
    // ---------------------------------------------------

    // 4. Kolla behörighet (Case Insensitive - struntar i stora/små bokstäver)
    if (roles && roles.length > 0) {
        const hasRole = roles.some(requiredRole =>
            userRoles.some(userRole => userRole.toUpperCase() === requiredRole.toUpperCase())
        );

        if (!hasRole) {
            return (
                <div style={{ padding: "2rem", color: "red" }}>
                    <h2>Access Denied</h2>
                    <p>You do not have permission to view this page.</p>
                    <p>Required role: {roles.join(", ")}</p>
                    <p>Your roles: {userRoles.join(", ") || "None"}</p>
                </div>
            );
        }
    }

    return children;
}