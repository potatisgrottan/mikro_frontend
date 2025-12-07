import React from "react";
import { useParams } from "react-router-dom";
import EncounterPage from "./EncounterPage";

function EncounterPageWrapper() {
    const { patientEmail } = useParams();
    return <EncounterPage patientEmail={patientEmail} />;
}

export default EncounterPageWrapper;
