import React from "react";
import { useAuth } from "react-oidc-context";

function ProfilePage() {
    const auth = useAuth();
    const profile = auth.user?.profile;
    const roles = profile?.realm_access?.roles?.join(", ");

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Profile</h1>
            <p><strong>Name:</strong> {profile?.name}</p>
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Username:</strong> {profile?.preferred_username}</p>
            <p><strong>Roles:</strong> {roles}</p>
            <p><strong>User ID (Sub):</strong> {profile?.sub}</p>
        </div>
    );
}

export default ProfilePage;