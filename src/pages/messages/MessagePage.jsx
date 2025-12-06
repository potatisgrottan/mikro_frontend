import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { messageApi, authApi } from "../../api";

function MessagesPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const headers = { Authorization: token };


    const [conversations, setConversations] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);

    useEffect(() => {
        if (!user?.email) return;

        messageApi.get("/users/available-to-message", { headers })
            .then(res => setAvailableUsers(res.data))
            .catch(() => console.log("Could not load users"));
    }, [user?.email]);

    useEffect(() => {
        if (!user?.email) return;

        messageApi.get("/all", { headers })
            .then(res => {
                const grouped = groupByOtherUser(res.data, user.email);
                setConversations(Object.values(grouped));
            })
            .catch(err => console.log(err));
    }, [user?.email]);


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
                .filter(u => u.email !== user.email)
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
