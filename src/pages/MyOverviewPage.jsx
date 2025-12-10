import React, { useEffect, useState } from "react";
import { journalApi } from "../api";
import ImageDisplay from "../components/ImageDisplay";

function MyOverviewPage() {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const [patient, setPatient] = useState(null);
    const [encounters, setEncounters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patientRes = await journalApi.get(`/patients/email/${currentUser.email}`);
                setPatient(patientRes.data);

                const overviewRes = await journalApi.get(
                    `/encounters/patient/${currentUser.email}/overview`
                );

                setEncounters(overviewRes.data);

            } catch (err) {
                console.error(err);
                setError("Failed to load your medical overview");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser.email]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!patient) return <p>No patient data found</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h1>{patient.fullName || "No Name"}</h1>
            <p>Personal Number: {patient.personalNumber || "N/A"}</p>
            <p>Address: {patient.address || "N/A"}</p>
            <p>Phone: {patient.phoneNumber || "N/A"}</p>

            <h2>Your Encounters</h2>

            {encounters.length === 0 ? (
                <p>No encounters found.</p>
            ) : (
                <ul>
                    {encounters.map((e) => (
                        <li key={e.id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
                            <strong>
                                {e.dateOfEncounter
                                    ? new Date(e.dateOfEncounter).toLocaleDateString()
                                    : "No Date"}
                            </strong>
                            {" - "}
                            {e.location || "No Location"}

                            {/* Observations */}
                            <ul style={{ marginTop: "0.5rem", listStyle: "none", paddingLeft: "10px" }}>
                                {e.observations?.length > 0 ? (
                                    e.observations.map((o) => (
                                        <li key={o.id} style={{ marginBottom: "10px" }}>
                                            <p>{o.observationText || "No Observation"}</p>

                                            {/* 2. LÄGG TILL BILDVISNING HÄR */}
                                            {o.imageId && (
                                                <div style={{ marginTop: "5px" }}>
                                                    <ImageDisplay imageId={o.imageId} />
                                                </div>
                                            )}
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

export default MyOverviewPage;