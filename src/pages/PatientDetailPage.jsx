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
            <h1>{patient.name || "No Name"}</h1>
            <p>Personal Number: {patient.personalNumber || "N/A"}</p>
            <p>Address: {patient.address || "N/A"}</p>
            <p>Phone: {patient.phoneNumber || "N/A"}</p>

            {/* ... (Add Encounter Button) */}

            <h2>Encounters</h2>

            {encounters.length === 0 ? (
                <p>No encounters found.</p>
            ) : (
                <ul>
                    {encounters.map((e) => (
                        <li key={e.id} style={{ marginBottom: "1rem", border: "1px solid #eee", padding: "10px" }}>
                            <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                                {e.dateOfEncounter
                                    ? new Date(e.dateOfEncounter).toLocaleDateString()
                                    : "No Date"
                                }
                                {" - "}
                                {e.location || "No Location"}
                            </div>

                            {canEdit && (
                                <button
                                    onClick={() => navigate(`/encounters/${e.id}/add-observation`)}
                                    style={{ marginLeft: "1rem" }}
                                >
                                    Add Observation
                                </button>
                            )}

                            <ul style={{ marginTop: "0.5rem", listStyle: "none", paddingLeft: "0" }}>
                                {e.observations?.length > 0 ? (

                                    e.observations.map((o) => (
                                        <li key={o.id} style={{/* ... */}}>
                                            <p style={{ margin: 0 }}>
                                                {o.observationText || "No Observation"}
                                            </p>
                                            
                                            {console.log("Obs ID:", o.id, "Image ID:", o.imageId)}

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