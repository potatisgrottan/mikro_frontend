import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { journalApi } from "../api";
import ImageDisplay from "../components/ImageDisplay";

function MyOverviewPage() {

    const auth = useAuth();


    const userEmail = auth.user?.profile?.email;

    const [patient, setPatient] = useState(null);
    const [encounters, setEncounters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userEmail) return;

        const fetchData = async () => {
            try {
                console.log("Fetching data for:", userEmail);

                const patientRes = await journalApi.get(`/patients/email/${userEmail}`);
                setPatient(patientRes.data);

                const overviewRes = await journalApi.get(
                    `/encounters/patient/${userEmail}/overview`
                );

                setEncounters(overviewRes.data);

            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 404) {
                    setError("Din patientjournal har inte skapats än.");
                } else {
                    setError("Kunde inte hämta din journal.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userEmail]);

    if (loading) return <p>Loading...</p>;

    if (error) return (
        <div style={{ padding: "2rem", color: "red" }}>
            <h3>Ett fel uppstod</h3>
            <p>{error}</p>
            {error.includes("inte skapats") && (
                <p style={{ color: "black", fontSize: "0.9rem" }}>
                    (Eftersom detta är en ny användare måste du lägga till den i
                    <strong> journal_db</strong> manuellt eller via en sync-lösning
                    för att datan ska synas.)
                </p>
            )}
        </div>
    );

    if (!patient) return <p>No patient data found</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h1>{patient.fullName || "No Name"}</h1>
            <p>Email: {patient.email}</p>
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

                            <ul style={{ marginTop: "0.5rem", listStyle: "none", paddingLeft: "10px" }}>
                                {e.observations?.length > 0 ? (
                                    e.observations.map((o) => (
                                        <li key={o.id} style={{ marginBottom: "10px" }}>
                                            <p>{o.observationText || "No Observation"}</p>
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