import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api, {journalApi} from "../api";

function AddObservationPage() {
    const { encounterId } = useParams();
    const [form, setForm] = useState({ observationText: "" });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await journalApi.post(`/observations/${encounterId}/observations`, {
            observationText: form.observationText
        });
        alert("Observation added!");
    } catch (err) {
        console.error(err);
        alert("Failed to add observation");
    }
};

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                name="observationText"
                placeholder="Observation"
                value={form.observationText}
                onChange={handleChange}
            />
            <button type="submit">Add Observation</button>
        </form>
    );
}

export default AddObservationPage;
