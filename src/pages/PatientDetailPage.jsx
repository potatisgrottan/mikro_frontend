import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function PatientDetailPage() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")); 
    const canEdit = ["DOCTOR", "NURSE"].includes(user?.role);

    const [patient, setPatient] = useState(null);
    const [overview, setOverview] = useState({ encounters: [], observations: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const patientRes = await api.get(`/api/patients/id/${id}`);
                setPatient(patientRes.data);

                const overviewRes = await api.get(`/api/patients/${id}/overview`);
                setOverview({
                    encounters: overviewRes.data.encounters || [],
                    observations: overviewRes.data.observations || []
                });
            } catch (err) {
                console.error(err);
                setError("Failed to fetch patient data");
            } finally {
                setLoading(false);
            }
        };
        fetchOverview();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!patient) return <p>Patient not found</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h1>{patient.name || "No Name"}</h1>
            <p>Personal Number: {patient.personalNumber || "N/A"}</p>
            <p>Date of Birth: {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "N/A"}</p>
            <p>Address: {patient.address || "N/A"}</p>
            <p>Phone: {patient.phoneNumber || "N/A"}</p>

            {canEdit && (
                <button
                    onClick={() => navigate(`/patients/${id}/add-encounter`)}
                    style={{ margin: "1rem 0" }}
                >
                    Add Encounter
                </button>
            )}

            <h2>Encounters</h2>
            {overview.encounters.length === 0 ? (
                <p>No encounters found.</p>
            ) : (
                <ul>
                    {overview.encounters.map((e) => (
                        <li key={e.id} style={{ marginBottom: "0.5rem" }}>
                            {e.dateOfEncounter ? new Date(e.dateOfEncounter).toLocaleDateString() : "No Date"} - {e.location || "No Location"}

                            {canEdit && (
                                <button
                                    onClick={() => navigate(`/encounters/${e.id}/add-observation`)}
                                    style={{ marginLeft: "1rem" }}
                                >
                                    Add Observation
                                </button>
                            )}

                            <ul style={{ marginTop: "0.5rem" }}>
                                {overview.observations
                                    .filter(o => o.encounterId === e.id)
                                    .map(o => (
                                        <li key={o.id}>{o.observationText || "No Observation"}</li>
                                    ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PatientDetailPage;
