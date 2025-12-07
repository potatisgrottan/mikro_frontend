import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { journalApi } from "../api";

function EncounterPage({ patientEmail }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({ location: "", dateOfEncounter: "" });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const practitionerEmail = JSON.parse(localStorage.getItem("user")).email;

        try {
            await journalApi.post(`/encounters/make`, {
                patientEmail,
                practitionerEmail,
                location: form.location,
                dateOfEncounter: form.dateOfEncounter ? new Date(form.dateOfEncounter).toISOString() : new Date().toISOString()
            });
            alert("Encounter added!");
            navigate(-1); // gå tillbaka till patientdetail
        } catch (err) {
            console.error(err);
            alert("Failed to add encounter");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "2rem" }}
        >
            <input
                name="location"
                placeholder="Location"
                onChange={handleChange}
                required
                style={{ padding: "0.5rem" }}
            />
            <input
                name="dateOfEncounter"
                type="date"
                onChange={handleChange}
                style={{ padding: "0.5rem" }}
            />
            <button type="submit" style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
                Add Encounter
            </button>
        </form>
    );
}

export default EncounterPage;
