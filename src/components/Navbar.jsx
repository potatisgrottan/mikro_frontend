import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";

function Navbar() {
    const auth = useAuth();

    const username = auth.user?.profile?.preferred_username || auth.user?.profile?.email;
    const userRoles = auth.user?.profile?.realm_access?.roles || [];

    const isPatient = userRoles.map(r => r.toUpperCase()).includes("PATIENT");
    const isStaff = userRoles.map(r => r.toUpperCase()).some(r => ["DOCTOR", "NURSE"].includes(r));

    const handleLogout = () => {
        auth.removeUser();
        auth.signoutRedirect();
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 py-4 flex justify-between items-center shadow-sm">
            {/* Vänster sida */}
            <div className="flex items-center gap-6">
                <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight hover:text-blue-700 transition">
                    MediTrack
                </Link>

                {auth.isAuthenticated && (
                    <div className="hidden md:flex gap-4">
                        {isStaff && (
                            <Link to="/patients" className="text-slate-600 hover:text-blue-600 font-medium transition">Patients</Link>
                        )}
                        <Link to="/messages" className="text-slate-600 hover:text-blue-600 font-medium transition">Messages</Link>
                    </div>
                )}
            </div>

            {/* Höger sida */}
            <div className="flex items-center gap-4">
                {auth.isAuthenticated ? (
                    <>
            <span className="hidden sm:inline text-slate-500 text-sm font-medium">
                {username}
            </span>

                        {isPatient && (
                            <Link to="/my-overview" className="btn-primary text-sm">
                                My Journal
                            </Link>
                        )}

                        <button
                            onClick={handleLogout}
                            className="text-red-600 hover:text-red-700 font-medium text-sm border border-red-100 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => auth.signinRedirect()}
                        className="btn-primary"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;