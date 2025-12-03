import React, { useState } from "react";
import api from "../publicApi"; // din axios instans

function RegisterPage() {
    const [userType, setUserType] = useState("PATIENT");

    const [userForm, setUserForm] = useState({
        email: "",
        password: "",
    });

    const [patientForm, setPatientForm] = useState({
        name: "",
        personalNumber: "",
        dateOfBirth: "",
        address: "",
        phoneNumber: ""
    });

    const [practitionerForm, setPractitionerForm] = useState({
        name: "",
        phoneNumber: "",
        hospitalRole: "DOCTOR"
    });

    const handleChange = (e, formType) => {
        const { name, value } = e.target;
        if (formType === "user") setUserForm({ ...userForm, [name]: value });
        if (formType === "patient") setPatientForm({ ...patientForm, [name]: value });
        if (formType === "practitioner") setPractitionerForm({ ...practitionerForm, [name]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const role = userType === "PATIENT" ? "PATIENT" : practitionerForm.hospitalRole;

        const payload = {
            email: userForm.email,
            password: userForm.password,
            role,
            name: userType === "PATIENT" ? patientForm.name : practitionerForm.name,
            phoneNumber: userType === "PATIENT" ? patientForm.phoneNumber : practitionerForm.phoneNumber,
            address: userType === "PATIENT" ? patientForm.address : null,
            dateOfBirth: userType === "PATIENT" ? patientForm.dateOfBirth : null,
            personalNumber: userType === "PATIENT" ? patientForm.personalNumber : null
        };

        try {
            await api.post("/api/auth/register", payload);
            alert("Registered! Please login.");
            window.location.href = "/login";
        } catch (err) {
            console.error(err);
            alert("Registration failed");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <label>
                    User Type:
                    <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                        <option value="PATIENT">Patient</option>
                        <option value="PRACTITIONER">Practitioner</option>
                    </select>
                </label>
                <br /><br />

                <input
                    name="email"
                    placeholder="Email"
                    value={userForm.email}
                    onChange={(e) => handleChange(e, "user")}
                /><br />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={userForm.password}
                    onChange={(e) => handleChange(e, "user")}
                /><br />

                {userType === "PATIENT" && (
                    <>
                        <input name="name" placeholder="Full Name" value={patientForm.name} onChange={(e) => handleChange(e, "patient")} /><br />
                        <input name="personalNumber" placeholder="Personal Number" value={patientForm.personalNumber} onChange={(e) => handleChange(e, "patient")} /><br />
                        <input name="dateOfBirth" type="date" value={patientForm.dateOfBirth} onChange={(e) => handleChange(e, "patient")} /><br />
                        <input name="address" placeholder="Address" value={patientForm.address} onChange={(e) => handleChange(e, "patient")} /><br />
                        <input name="phoneNumber" placeholder="Phone Number" value={patientForm.phoneNumber} onChange={(e) => handleChange(e, "patient")} /><br />
                    </>
                )}

                {userType === "PRACTITIONER" && (
                    <>
                        <input name="name" placeholder="Full Name" value={practitionerForm.name} onChange={(e) => handleChange(e, "practitioner")} /><br />
                        <input name="phoneNumber" placeholder="Phone Number" value={practitionerForm.phoneNumber} onChange={(e) => handleChange(e, "practitioner")} /><br />
                        <label>
                            Hospital Role:
                            <select name="hospitalRole" value={practitionerForm.hospitalRole} onChange={(e) => handleChange(e, "practitioner")}>
                                <option value="DOCTOR">Doctor</option>
                                <option value="NURSE">Nurse</option>
                            </select>
                        </label><br />
                    </>
                )}

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;
