import React, { useState } from "react";
import { authApi } from "../api";

function RegisterPage() {
    const [role, setRole] = useState("PATIENT");

    const [form, setForm] = useState({
        email: "",
        password: "",
        fullName: "",
        personalNumber: "",
        address: "",
        phoneNumber: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            email: form.email,
            password: form.password,
            fullName: form.fullName,
            personalNumber: form.personalNumber,
            address: form.address,
            phoneNumber: form.phoneNumber,
            role   // PATIENT, DOCTOR, NURSE etc
        };

        try {
            await authApi.post("/register", payload);
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

            <form onSubmit={handleSubmit}>

                {/* ROLE SELECTOR */}
                <label>
                    Role:
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="PATIENT">Patient</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="NURSE">Nurse</option>
                    </select>
                </label>
                <br /><br />

                {/* SHARED FIELDS */}
                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                /><br />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                /><br />

                <input
                    name="fullName"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={handleChange}
                /><br />

                <input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={form.phoneNumber}
                    onChange={handleChange}
                /><br />

                <input
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                /><br />

                {/* ONLY PATIENT FIELDS */}
                {role === "PATIENT" && (
                    <>
                        <input
                            name="personalNumber"
                            placeholder="Personal Number"
                            value={form.personalNumber}
                            onChange={handleChange}
                        /><br />
                    </>
                )}

                {/* PRACTITIONERS DO NOT NEED PERSONALNUMBER */}
                {role !== "PATIENT" && (
                    <p style={{ fontStyle: "italic", color: "#777" }}>
                        Personal number is only required for patients.
                    </p>
                )}

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;
