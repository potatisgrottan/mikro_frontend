import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { journalApi } from "../api";
import ImageDisplay from "../components/ImageDisplay";

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
                const patientRes = await journalApi.get(`/patients/email/${email}`);
                setPatient(patientRes.data);

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
            <h1>{patient.fullName || "No Name"}</h1>
            <p>Personal Number: {patient.personalNumber || "N/A"}</p>
            <p>Address: {patient.address || "N/A"}</p>
            <p>Phone: {patient.phoneNumber || "N/A"}</p>

            {canEdit && (
                <button
                    onClick={() => navigate(`/patients/${email}/add-encounter`)}
                    style={{ margin: "1rem 0", padding: "0.5rem 1rem", cursor: "pointer" }}
                >
                    Add Encounter
                </button>
            )}

            <h2>Encounters</h2>
            {encounters.length === 0 ? (
                <p>No encounters found.</p>
            ) : (
                <ul style={{ paddingLeft: 0 }}>
                    {encounters.map((e) => (
                        <li
                            key={e.id}
                            style={{ marginBottom: "1rem", border: "1px solid #eee", padding: "10px", listStyle: "none" }}
                        >
                            <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                                {e.dateOfEncounter ? new Date(e.dateOfEncounter).toLocaleDateString() : "No Date"} -{" "}
                                {e.location || "No Location"}
                            </div>

                            {canEdit && (
                                <button
                                    onClick={() => navigate(`/encounters/${e.id}/add-observation`)}
                                    style={{ marginLeft: "1rem", padding: "0.3rem 0.6rem" }}
                                >
                                    Add Observation
                                </button>
                            )}

                            <ul style={{ marginTop: "0.5rem", listStyle: "none", paddingLeft: 0 }}>
                                {e.observations?.length > 0 ? (
                                    e.observations.map((o) => (
                                        <li key={o.id} style={{ marginBottom: "0.5rem" }}>
                                            <p style={{ margin: 0 }}>{o.observationText || "No Observation"}</p>
                                            {o.imageId && <ImageDisplay imageId={o.imageId} />}
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
