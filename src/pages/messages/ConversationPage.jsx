import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { messageApi } from "../../api";

function ConversationPage() {
    const { userEmail } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");




    useEffect(() => {
        if (!userEmail) return;

        messageApi.get(`/conversation/${userEmail}`)
            .then(res => setMessages(res.data))
            .catch(err => console.error("Failed to fetch conversation", err));
    }, [userEmail]);

    const sendMessage = () => {
        if (!text.trim()) return;

        messageApi.post("/send", {
            receiverEmail: userEmail,
            content: text
        }).then(res => {
            setMessages([...messages, res.data]);
            setText("");
        }).catch(err => console.error("Failed to send message", err));
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
