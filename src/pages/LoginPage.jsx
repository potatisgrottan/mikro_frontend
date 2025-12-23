// src/pages/LoginPage.jsx
import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirecta direkt om man redan är inloggad
        if (auth.isAuthenticated) {
            navigate("/");
        }
    }, [auth.isAuthenticated, navigate]);

    // Automatisk redirect (Valfritt):
    // Om du vill slippa trycka på knappen och skickas direkt till Keycloak,
    // avkommentera raden nedan:
    // useEffect(() => { auth.signinRedirect(); }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-slate-800 mb-4">MediTrack</h1>
                <p className="text-slate-500 mb-8">Secure Journal System</p>

                <button
                    onClick={() => auth.signinRedirect()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
                >
                    Log in with Keycloak
                </button>
            </div>
        </div>
    );
}

export default LoginPage;