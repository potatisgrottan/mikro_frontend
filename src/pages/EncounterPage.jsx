import React, { useState } from "react";
import api, {journalApi} from "../api";

function EncounterPage({ patientEmail }) {
  const [form, setForm] = useState({ location: "", dateOfEncounter: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const practitionerEmail = JSON.parse(localStorage.getItem("user")).email;

        await journalApi.post(`/encounters/make`, {
            patientEmail,
            practitionerEmail,
            location: form.location,
            dateOfEncounter: form.dateOfEncounter ? new Date(form.dateOfEncounter) : new Date()
        });

        alert("Encounter added!");
    };


  return (
    <form onSubmit={handleSubmit}>
      <input name="location" placeholder="Location" onChange={handleChange} />
      <input name="dateOfEncounter" type="date" onChange={handleChange} />
      <button type="submit">Add Encounter</button>
    </form>
  );
}

export default EncounterPage;
