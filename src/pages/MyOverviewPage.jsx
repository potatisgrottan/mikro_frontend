import React, { useEffect, useState } from "react";
import api, {journalApi} from "../api";

function MyOverviewPage() {
    const [overview, setOverview] = useState({ patient: null, encounters: [], observations: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const res = await journalApi.get("/me");
                setOverview(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!overview.patient) return <p>No patient data found</p>;

    const { patient, encounters, observations } = overview;

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Welcome, {patient.name}</h1>
            <p>Personal Number: {patient.personalNumber || "N/A"}</p>
            <p>Date of Birth: {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "N/A"}</p>
            <p>Address: {patient.address || "N/A"}</p>
            <p>Phone: {patient.phoneNumber || "N/A"}</p>

            <h2>Encounters</h2>
            {encounters.length === 0 ? (
                <p>No encounters found.</p>
            ) : (
                <ul>
                    {encounters.map(e => (
                        <li key={e.id}>
                            {e.dateOfEncounter ? new Date(e.dateOfEncounter).toLocaleDateString() : "No Date"} - {e.location || "No Location"}
                            <ul>
                                {observations.filter(o => o.encounterId === e.id).map(o => (
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

export default MyOverviewPage;
