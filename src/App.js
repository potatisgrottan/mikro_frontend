import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PatientListPage from "./pages/PatientListPage";
import PatientDetailPage from "./pages/PatientDetailPage";
import MessagePage from "./pages/messages/MessagePage";
import ConversationPage from "./pages/messages/ConversationPage";
import HomePage from "./pages/HomePage";
import Layout from "./layouts/Layout";
import PrivateRoute from "./components/PrivateRoute";
import MyOverviewPage from "./pages/MyOverviewPage";
import EncounterPage from "./pages/EncounterPage";
import AddObservationPage from "./pages/AddObservation";
import EncounterPageWrapper from "./pages/EncounterPageWrapper";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Private routes */}
                    <Route
                        path="/patients"
                        element={
                            <PrivateRoute roles={["DOCTOR","NURSE"]}>
                                <PatientListPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/patients/id/:id"
                        element={
                            <PrivateRoute roles={["DOCTOR","NURSE"]}>
                                <PatientDetailPage />
                            </PrivateRoute>
                        }
                    />
                    {/* Patient egen översikt */}
                    <Route
                        path="/my-overview"
                        element={
                            <PrivateRoute roles={["PATIENT"]}>
                                <MyOverviewPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/messages"
                        element={
                            <PrivateRoute roles={["PATIENT","DOCTOR","NURSE"]}>
                                <MessagePage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/messages/:userId"
                        element={
                            <PrivateRoute roles={["PATIENT","DOCTOR","NURSE"]}>
                                <ConversationPage />
                            </PrivateRoute>
                        }
                    />
<Route
  path="/patients/:patientId/add-encounter"
  element={
      <PrivateRoute roles={["DOCTOR","NURSE"]}>
          <EncounterPageWrapper />
      </PrivateRoute>
  }
/>

                    <Route
                        path="/encounters/:encounterId/add-observation"
                        element={
                            <PrivateRoute roles={["DOCTOR","NURSE"]}>
                                <AddObservationPage />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;


