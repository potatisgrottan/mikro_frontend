import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, searchApi } from "../api"; // 1. Importera searchApi

function PatientListPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 2. State för söktexten
    const [searchQuery, setSearchQuery] = useState(""); 
    
    const navigate = useNavigate();

    // Ladda alla patienter (Default: Från Auth Service)
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

    useEffect(() => {
        loadAllPatients();
    }, []);

    // 3. Hantera Sökning (Anropar Quarkus Search Service)
    const handleSearch = async (e) => {
        e.preventDefault();
        
        // Om sökfältet är tomt, ladda alla vanliga patienter igen
        if (!searchQuery.trim()) {
            loadAllPatients();
            return;
        }

        setLoading(true);
        try {
            // Anropa: http://localhost:8084/api/search/patients?q=...
            const res = await searchApi.get(`/patients?q=${searchQuery}`);
            
            // 4. Mappa om datan från Search Service så den passar listan
            // Search Service returnerar: { firstName, lastName, email, conditions }
            // Denna vy förväntar sig: { fullName, email, personalNumber }
            const mappedResults = res.data.map(p => ({
                ...p,
                fullName: `${p.firstName} ${p.lastName}`, // Slå ihop namnen
                email: p.email,
                // Eftersom vi kör proxy mot Auth, kanske personalNumber saknas i just Search-svaret
                // om vi inte la till det i UserDto i Java. Vi hanterar det snyggt:
                personalNumber: p.personalNumber || "Se detaljer" 
            }));

            setPatients(mappedResults);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Search failed. Is the Search Service running on port 8084?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Patient List</h1>

            {/* 5. SÖKFÄLT */}
            <form onSubmit={handleSearch} style={{ marginBottom: "2rem", display: "flex", gap: "10px" }}>
                <input 
                    type="text" 
                    placeholder="Search name or email..." 
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

            {/* Error & Loading */}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p>Loading...</p>}

            {/* Lista */}
            {!loading && patients.length === 0 ? (
                <p>No patients found.</p>
            ) : (
                <ul>
                    {patients.map((patient) => (
                        <li key={patient.email} style={{ marginBottom: "1rem", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                                        {patient.fullName}
                                    </span>
                                    
                                    {/* Visa om det finns conditions (från söktjänsten) */}
                                    {patient.conditions && (
                                        <div style={{ color: "green", fontSize: "0.9rem" }}>
                                            Source: {patient.conditions}
                                        </div>
                                    )}

                                    <div style={{ color: "#666", fontSize: "0.9rem" }}>
                                        {patient.personalNumber !== "Se detaljer" 
                                            ? `${patient.personalNumber}` 
                                            : patient.email}
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