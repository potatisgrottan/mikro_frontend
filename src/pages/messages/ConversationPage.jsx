import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { messageApi } from "../../api";

function ConversationPage() {
    const { userEmail } = useParams();
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        messageApi.get(`/conversation/${currentUser.email}/${userEmail}`)
            .then(res => setMessages(res.data))
            .catch(err => console.error("Failed to fetch conversation", err));
    }, [currentUser.email, userEmail]);

    const sendMessage = () => {
        messageApi.post("/api/messages", {
            senderEmail: currentUser.email,
            receiverEmail: userEmail,
            message: text
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
                        <b>{m.senderEmail}</b>: {m.message}
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
