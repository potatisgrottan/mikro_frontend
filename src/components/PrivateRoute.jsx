import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, roles }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) return <Navigate to="/login" />;

    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

    return children;
}

