import React from "react";
import { Link } from "react-router-dom";

function DashboardPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user?.username}</h1>
      {user?.role === "DOCTOR" || user?.role === "STAFF" ? (
        <>
          <Link to="/patients">View Patients</Link><br />
          <Link to="/messages">Messages</Link>
        </>
      ) : (
        <>
          <Link to={`/patient/${user.id}`}>My Journal</Link><br />
          <Link to="/messages">Messages</Link>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
