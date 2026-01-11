import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { messageApi } from "../../api";

function MessagesPage() {
    const auth = useAuth();
    const userEmail = auth.user?.profile?.email;
    const token = auth.user?.access_token;

    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);

    // 1. Hämta tillgängliga användare (Start New)
    useEffect(() => {
        if (!userEmail || !token) return;

        messageApi.get("/users/available-to-message", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                // FILTRERING: Ta bort andre1@gmail.com från listan över användare man kan kontakta
                const filteredUsers = res.data.filter(u => u.email !== "andre1@gmail.com");
                setAvailableUsers(filteredUsers);
            })
            .catch(() => console.log("Could not load users"));

    }, [userEmail, token]);

    // 2. Hämta existerande konversationer (Your Conversations)
    useEffect(() => {
        if (!userEmail || !token) return;

        messageApi.get("/all", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                const grouped = groupByOtherUser(res.data, userEmail);
                
                // FILTRERING: Ta bort konversationen med andre1@gmail.com från översikten
                const filteredConversations = Object.values(grouped).filter(
                    conv => conv.otherUserEmail !== "andre1@gmail.com"
                );
                
                setConversations(filteredConversations);
            })
            .catch(err => console.log(err));

    }, [userEmail, token]); 


    const goToConversation = (otherUserEmail) => {
        navigate(`/messages/${otherUserEmail}`);
    };

    return (
        <div>
            <h1>Messages</h1>

            <h3>Your Conversations</h3>
            {conversations.length === 0 ? <p>No conversations found.</p> : (
                conversations.map(c => (
                    <div
                        key={c.otherUserEmail}
                        onClick={() => goToConversation(c.otherUserEmail)}
                        style={{ 
                            cursor: "pointer", 
                            marginBottom: "0.5rem", 
                            padding: "10px", 
                            border: "1px solid #eee",
                            borderRadius: "4px" 
                        }}
                    >
                        <b>{c.otherUserEmail}</b>: {c.messages[c.messages.length - 1]?.message}
                    </div>
                ))
            )}

            <h3>Start New</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {availableUsers
                    .filter(u => u.email !== userEmail) // Dölj även sig själv
                    .map(u => (
                        <div
                            key={u.email}
                            onClick={() => goToConversation(u.email)}
                            style={{ 
                                cursor: "pointer", 
                                color: "#007bff",
                                textDecoration: "underline" 
                            }}
                        >
                            {u.fullName || u.email}
                        </div>
                    ))}
            </div>
        </div>
    );
}

// Hjälpfunktion för att gruppera meddelanden per motpart
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