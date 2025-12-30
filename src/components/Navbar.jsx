// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";

function Navbar() {
    const auth = useAuth();

    // Hämta info från Keycloak-profilen
    const user = auth.user?.profile;
    const userRoles = user?.realm_access?.roles || [];
    const isPatient = userRoles.includes("PATIENT");

    const handleLogout = () => {
        auth.removeUser();
        auth.signoutRedirect();
    };

    return (
        <nav style={{
            backgroundColor: "#fff", borderBottom: "1px solid #ddd", padding: "1rem 2rem",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            position: "sticky", top: 0, zIndex: 10
        }}>

            {/* Vänster sida */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Link to="/" style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#007bff", textDecoration: "none" }}>
                    MediTrack
                </Link>

                {auth.isAuthenticated && (
                    <>
                        {!isPatient && (
                            <Link to="/patients" style={{ textDecoration: "none", color: "#333" }}>Patients</Link>
                        )}
                        <Link to="/messages" style={{ textDecoration: "none", color: "#333" }}>Messages</Link>
                    </>
                )}
            </div>

            {/* Höger sida */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {auth.isAuthenticated ? (
                    <>
            <span style={{ color: "#555" }}>
                Hi, {user?.preferred_username || user?.email}
            </span>

                        {isPatient && (
                            <Link to="/my-overview" style={{
                                backgroundColor: "#007bff", color: "#fff", padding: "0.4rem 0.8rem",
                                borderRadius: "4px", textDecoration: "none"
                            }}>
                                My Journal
                            </Link>
                        )}

                        <button onClick={handleLogout} style={{
                            backgroundColor: "#dc3545", color: "#fff", border: "none",
                            padding: "0.4rem 0.8rem", borderRadius: "4px", cursor: "pointer"
                        }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <button onClick={() => auth.signinRedirect()} style={{
                        backgroundColor: "#007bff", color: "#fff", border: "none",
                        padding: "0.4rem 0.8rem", borderRadius: "4px", cursor: "pointer"
                    }}>
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;