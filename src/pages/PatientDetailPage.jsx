import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { journalApi } from "../api";

function PatientDetailPage() {
    const { email } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const canEdit = ["DOCTOR", "NURSE"].includes(user?.role);

    const [patient, setPatient] = useState(null);
    const [encounters, setEncounters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                // 1. Load patient
                const patientRes = await journalApi.get(`/patients/email/${email}`);
                setPatient(patientRes.data);

                // 2. Load encounter + observation overview
                const overviewRes = await journalApi.get(`/encounters/patient/${email}/overview`);
                setEncounters(overviewRes.data);

            } catch (err) {
                console.error(err);
                setError("Failed to fetch patient data");
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, [email]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!patient) return <p>Patient not found</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h1>{patient.name || "No Name"}</h1>
            <p>Personal Number: {patient.personalNumber || "N/A"}</p>
            <p>Address: {patient.address || "N/A"}</p>
            <p>Phone: {patient.phoneNumber || "N/A"}</p>

            {canEdit && (
                <button
                    onClick={() => navigate(`/encounters/make`)}
                    style={{ margin: "1rem 0" }}
                >
                    Add Encounter
                </button>
            )}

            <h2>Encounters</h2>

            {encounters.length === 0 ? (
                <p>No encounters found.</p>
            ) : (
                <ul>
                    {encounters.map((e) => (
                        <li key={e.id} style={{ marginBottom: "1rem" }}>
                            {e.dateOfEncounter
                                ? new Date(e.dateOfEncounter).toLocaleDateString()
                                : "No Date"
                            }
                            {" - "}
                            {e.location || "No Location"}

                            {canEdit && (
                                <button
                                    onClick={() => navigate(`/encounters/${e.id}/add-observation`)}
                                    style={{ marginLeft: "1rem" }}
                                >
                                    Add Observation
                                </button>
                            )}

                            {/* Observations */}
                            <ul style={{ marginTop: "0.5rem" }}>
                                {e.observations?.length > 0 ? (
                                    e.observations.map((o) => (
                                        <li key={o.id}>
                                            {o.observationText || "No Observation"}
                                        </li>
                                    ))
                                ) : (
                                    <li>No observations</li>
                                )}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PatientDetailPage;
