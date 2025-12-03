import React from "react";

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Profile</h1>
      <p>Username: {user.username}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

export default ProfilePage;
