import React, { useState } from "react";
import api from "../api";

function EncounterPage({ patientId }) {
  const [form, setForm] = useState({ location: "", dateOfEncounter: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();

  const practitionerId = JSON.parse(localStorage.getItem("user")).id;

  await api.post(
    `/api/encounters?patientId=${patientId}&userId=${practitionerId}&location=${form.location}`
  );

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
