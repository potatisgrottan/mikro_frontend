import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, searchApi } from "../api"; // 🔑 Importera searchApi

function PatientListPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // 🔑 State för söktext
    
    const navigate = useNavigate();

    // Funktion för att ladda ALLA patienter (från Auth Service)
    const loadAllPatients = () => {
        setLoading(true);
        authApi.get("/users/role/PATIENT")
            .then(res => {
                setPatients(res.data);
                setError(null);
            })
            .catch(err => setError("Failed to fetch patients"))
            .finally(() => setLoading(false));
    };

    // Ladda alla vid start
    useEffect(() => {
        loadAllPatients();
    }, []);

    // 🔑 Funktion för att SÖKA (från Quarkus Search Service)
    const handleSearch = async (e) => {
        e.preventDefault(); // Förhindra att formuläret laddar om sidan
        
        // Om sökfältet är tomt, ladda alla igen
        if (!searchQuery.trim()) {
            loadAllPatients();
            return;
        }

        setLoading(true);
        try {
            // Anropa din Quarkus-tjänst: /api/search/patients?q=...
            const res = await searchApi.get(`/patients?q=${searchQuery}`);
            
            // Mappa om datan så den passar din lista (Quarkus använder patientName, Auth använder fullName)
            const mappedResults = res.data.map(p => ({
                ...p,
                fullName: p.patientName, // Mappa om namnet
                email: p.patientEmail,   // Mappa om e-posten
                // personalNumber kanske saknas i sökindexet om du inte la till det, 
                // men conditions finns!
            }));

            setPatients(mappedResults);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Search failed. Ensure Search Service is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Patient List</h1>

            {/* 🔑 SÖKFÄLT */}
            <form onSubmit={handleSearch} style={{ marginBottom: "2rem", display: "flex", gap: "10px" }}>
                <input 
                    type="text" 
                    placeholder="Search by name or condition (e.g. 'flu', 'broken')..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: "10px", width: "300px", fontSize: "1rem" }}
                />
                <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
                    Search
                </button>
                <button 
                    type="button" 
                    onClick={() => { setSearchQuery(""); loadAllPatients(); }}
                    style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#6c757d", color: "white", border: "none" }}
                >
                    Clear
                </button>
            </form>

            {/* ERROR HANTERING */}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p>Loading...</p>}

            {/* RESULTATLISTA */}
            {!loading && patients.length === 0 ? (
                <p>No patients found.</p>
            ) : (
                <ul>
                    {patients.map((patient) => (
                        <li key={patient.email || patient.patientEmail} style={{ marginBottom: "1rem", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                                        {patient.fullName || patient.patientName}
                                    </span>
                                    
                                    {/* Visa villkor/conditions om det kommer från söktjänsten */}
                                    {patient.conditions && (
                                        <div style={{ color: "green", fontSize: "0.9rem", marginTop: "5px" }}>
                                            Found matching condition: <em>{patient.conditions}</em>
                                        </div>
                                    )}

                                    <div style={{ color: "#666", fontSize: "0.9rem" }}>
                                        {patient.personalNumber ? `PN: ${patient.personalNumber}` : `Email: ${patient.email}`}
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/patients/email/${patient.email}`)}
                                    style={{
                                        backgroundColor: "#007bff",
                                        color: "#fff",
                                        border: "none",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "4px",
                                        cursor: "pointer"
                                    }}
                                >
                                    View Details
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PatientListPage;