import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, searchApi } from "../api"; 

function PatientListPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); 
    
    const navigate = useNavigate();

    // 1. Filtrera bort "andre1@gmail.com" när alla patienter laddas
    const loadAllPatients = () => {
        setLoading(true);
        authApi.get("/users/role/PATIENT")
            .then(res => {
                // VIKTIGT: Här filtrerar vi listan innan vi sparar den i state
                const filtered = res.data.filter(p => p.email !== "andre1@gmail.com");
                setPatients(filtered);
                setError(null);
            })
            .catch(err => setError("Failed to fetch patients"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadAllPatients();
    }, []);

    // 2. Filtrera bort "andre1@gmail.com" även vid sökning
    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!searchQuery.trim()) {
            loadAllPatients();
            return;
        }

        setLoading(true);
        try {
            const res = await searchApi.get(`/patients?q=${searchQuery}`);
            
            const mappedResults = res.data.map(p => ({
                ...p,
                fullName: `${p.firstName} ${p.lastName}`,
                email: p.email,
                personalNumber: p.personalNumber || "Se detaljer" 
            }));

            // VIKTIGT: Här filtrerar vi sökresultatet innan vi sparar det i state
            const filteredResults = mappedResults.filter(p => p.email !== "andre1@gmail.com");

            setPatients(filteredResults);
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

            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p>Loading...</p>}

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