import React from "react";
import { useAuth } from "react-oidc-context";

export default function PrivateRoute({ children, roles }) {
    const auth = useAuth();

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    // 1. Är användaren inloggad?
    if (!auth.isAuthenticated) {
        // Alt: Skicka direkt till login: auth.signinRedirect(); return null;
        return <div>You are not logged in. <button onClick={() => auth.signinRedirect()}>Login</button></div>;
    }

    // 2. Kolla roller (Keycloak sparar ofta roller i 'realm_access.roles' i token)
    // OBS: Du kan behöva kolla exakt var dina roller ligger genom att logga 'auth.user?.profile'
    const userRoles = auth.user?.profile?.realm_access?.roles || [];

    // För enklare matchning, gör allt uppercase om du har blandat i Keycloak
    const normalizedRoles = userRoles.map(r => r.toUpperCase()); // ['DOCTOR', 'OFFLINE_ACCESS'...]

    // Om routen kräver roller, kolla om vi har någon av dem
    if (roles) {
        const hasRole = roles.some(role => normalizedRoles.includes(role));
        if (!hasRole) {
            return <div>Access Denied. You do not have the required role.</div>;
        }
    }

    return children;
}