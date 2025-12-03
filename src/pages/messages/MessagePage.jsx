import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function MessagesPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get("/api/users")
            .then(res => {
                const map = {};
                res.data.forEach(u => {
                    map[u.id] = u.fullName || u.username || u.email;
                });
                setUserMap(map);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!user?.id) return;

        setLoading(true);
        api.get(`/api/messages/all/${user.id}`)
            .then(res => {
                const grouped = groupByOtherUser(res.data, user.id);
                setConversations(Object.values(grouped));
            })
            .catch(() => setError("Failed to fetch messages"))
            .finally(() => setLoading(false));
    }, [user?.id]);

    useEffect(() => {
        api.get("/api/users/available-to-message")
            .then(res => setAvailableUsers(res.data))
            .catch(() => setError("Failed to fetch users to message"));
    }, []);

    const goToConversation = (otherUser) => {
        navigate(`/messages/${otherUser.id}`);
    };

    if (loading) return <p>Loading messages...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h1>Messages</h1>

            {/* Existing conversations */}
            {conversations.length > 0 && (
                <>
                    <h3>Your Conversations</h3>
                    {conversations.map(c => (
                        <div
                            key={c.otherUser.id}
                            onClick={() => goToConversation(c.otherUser)}
                            style={{ cursor: "pointer", marginBottom: "0.5rem" }}
                        >
                            <b>{userMap[c.otherUser.id] || c.otherUser.id}</b>
                            <span>: {c.messages[c.messages.length - 1]?.content}</span>
                        </div>
                    ))}
                </>
            )}

            {/* Start new message */}
            {availableUsers.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                    <h3>Start a Conversation</h3>
                    {availableUsers.map(p => (
                        <div
                            key={p.id}
                            onClick={() => goToConversation(p)}
                            style={{ cursor: "pointer", marginBottom: "0.5rem" }}
                        >
                            {p.fullName || p.username || p.email}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function groupByOtherUser(messages, currentUserId) {
    const groups = {};

    messages.forEach(msg => {
        if (!msg || !msg.sender || !msg.recipient) return;

        const other =
            msg.sender.id === currentUserId ? msg.recipient : msg.sender;

        if (!other || !other.id) return;

        if (!groups[other.id]) {
            groups[other.id] = {
                otherUser: other,
                messages: []
            };
        }

        groups[other.id].messages.push(msg);
    });

    return groups;
}

export default MessagesPage;
