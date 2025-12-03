import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

function ConversationPage() {
    const { userId } = useParams(); 
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [userMap, setUserMap] = useState({});

    useEffect(() => {
        api.get("/api/users").then(res => {
            const map = {};
            res.data.forEach(u => {
                map[u.id] = u.username;
            });
            setUserMap(map);
        });
    }, []);

    useEffect(() => {
        api.get(`/api/messages/conversation/${currentUser.id}/${userId}`)
            .then(res => setMessages(res.data))
            .catch(err => console.error("Failed to fetch conversation", err));
    }, [currentUser.id, userId]);

    const sendMessage = () => {
        api.post("/api/messages", {
            senderId: currentUser.id,
            receiverId: userId,
            content: text
        }).then(res => {
            setMessages([...messages, res.data]);
            setText("");
        });
    };

    return (
        <div>
            <h2>Conversation</h2>
            <div style={{ border: "1px solid gray", padding: "1rem", marginBottom: "1rem" }}>
                {messages.map(m => (
                    <div key={m.id}>
                        <b>{userMap[m.senderId] || m.senderId}</b>: {m.content || m.message}
                    </div>
                ))}
            </div>
            <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Write a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default ConversationPage;
