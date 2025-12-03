import { useParams } from "react-router-dom";
import EncounterPage from "./EncounterPage";

function EncounterPageWrapper() {
  const { patientId } = useParams(); 
  return <EncounterPage patientId={patientId} />;
}

export default EncounterPageWrapper;
