import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import Navbar from "../components/Navbar";
import { authApi } from "../api"; //

const Layout = ({ children }) => {
    const auth = useAuth();

    useEffect(() => {
        if (auth.isAuthenticated && auth.user?.access_token) {

            const syncToAuthService = async () => {
                try {
                    // Vi skickar en tom body {}, men skickar med token i headern
                    await authApi.post("/auth/sync", {}, {
                        headers: { Authorization: `Bearer ${auth.user.access_token}` }
                    });
                    console.log("User synced to AuthDB successfully");
                } catch (error) {
                    // Ignorera fel om det bara är nätverkssvaj, men bra att logga
                    console.error("Failed to sync user to AuthDB:", error);
                }
            };

            syncToAuthService();
        }
    }, [auth.isAuthenticated, auth.user]);

    return (
        <div>
            <Navbar />
            <main style={{ padding: "1rem" }}>{children}</main>
        </div>
    );
};

export default Layout;