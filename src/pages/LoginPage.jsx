import React, { useState } from "react";
import api from "../api";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const token = btoa(`${email}:${password}`);

            const response = await api.get("/api/auth/me", {
                headers: {
                    "Authorization": `Basic ${token}`
                }
            });

            const user = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.role === "PATIENT") {
                window.location.href = "/messages";
            } else if (user.role === "DOCTOR" || user.role === "NURSE") {
                window.location.href = "/patients";
            }else {
                alert("Unknown role: " + user.role);
            }

        } catch (err) {
            console.error(err);
            alert("Invalid credentials");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Login</h1>
            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default LoginPage;
