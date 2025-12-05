import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, {authApi, journalApi} from "../api";

function PatientListPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        authApi.get("/users/role/PATIENT")
            .then(res => setPatients(res.data))
            .catch(err => setError("Failed to fetch patients"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading patients...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h1>All Patients</h1>
            {patients.length === 0 ? (
                <p>No patients found.</p>
            ) : (
                <ul>
                    {patients.map(patient => (
                        <li key={patient.email} style={{ marginBottom: "1rem" }}>
                            <b>{patient.fullName}</b> - {patient.personalNumber} &nbsp;
                            <button
                                onClick={() => navigate(`/patients/email/${patient.email}`)}
                                style={{
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    padding: "0.4rem 0.8rem",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                View Details
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PatientListPage;

