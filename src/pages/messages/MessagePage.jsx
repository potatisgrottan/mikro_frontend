import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { messageApi } from "../../api";

function MessagesPage() {
    const auth = useAuth();
    const userEmail = auth.user?.profile?.email;

    // --- HÄR VAR FELET: Vi måste skapa variabeln token ---
    const token = auth.user?.access_token;
    // ----------------------------------------------------

    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);

    useEffect(() => {
        if (!userEmail || !token) return;

        messageApi.get("/users/available-to-message", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setAvailableUsers(res.data))
            .catch(() => console.log("Could not load users"));

    }, [userEmail, token]);

    useEffect(() => {
        if (!userEmail || !token) return;

        messageApi.get("/all", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                const grouped = groupByOtherUser(res.data, userEmail);
                setConversations(Object.values(grouped));
            })
            .catch(err => console.log(err));

    }, [userEmail, token]); // <--- HÄR VAR FELET: Du hade 'headers' kvar här, jag bytte till 'token'


    const goToConversation = (otherUserEmail) => {
        navigate(`/messages/${otherUserEmail}`);
    };

    return (
        <div>
            <h1>Messages</h1>

            <h3>Your Conversations</h3>
            {conversations.map(c => (
                <div
                    key={c.otherUserEmail}
                    onClick={() => goToConversation(c.otherUserEmail)}
                    style={{ cursor: "pointer", marginBottom: "0.5rem" }}
                >
                    <b>{c.otherUserEmail}</b>: {c.messages[c.messages.length - 1]?.message}
                </div>
            ))}

            <h3>Start New</h3>
            {availableUsers
                .filter(u => u.email !== userEmail)
                .map(u => (
                    <div
                        key={u.email}
                        onClick={() => goToConversation(u.email)}
                        style={{ cursor: "pointer" }}
                    >
                        {u.fullName || u.email}
                    </div>
                ))}
        </div>
    );
}

function groupByOtherUser(messages, currentUserEmail) {
    const groups = {};

    messages.forEach(msg => {
        const otherEmail =
            msg.senderEmail === currentUserEmail ? msg.receiverEmail : msg.senderEmail;

        if (!groups[otherEmail]) {
            groups[otherEmail] = { otherUserEmail: otherEmail, messages: [] };
        }
        groups[otherEmail].messages.push(msg);
    });

    return groups;
}

export default MessagesPage;