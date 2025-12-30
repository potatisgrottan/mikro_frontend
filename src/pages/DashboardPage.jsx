import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "react-oidc-context"; // <--- Importera hooken

function DashboardPage() {
    const auth = useAuth(); // <--- Hämta auth-objektet
    const userProfile = auth.user?.profile;
    const userRoles = userProfile?.realm_access?.roles || []; // Hämta roller från token

    // Hjälpfunktioner för roller
    const isStaff = userRoles.some(r => ["DOCTOR", "NURSE", "PATIENT"].includes(r.toUpperCase()));

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Welcome, {userProfile?.preferred_username || userProfile?.email}</h1>

            {isStaff ? (
                <>
                    <Link to="/patients">View Patients</Link><br />
                    <Link to="/messages">Messages</Link>
                </>
            ) : (
                <>
                    <Link to="/my-overview">My Journal</Link><br />
                    <Link to="/messages">Messages</Link>
                </>
            )}
        </div>
    );
}

export default DashboardPage;