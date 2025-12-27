import { useEffect, useState } from "react";
import "./Chat.css";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

function Chat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  // 🔹 Fetch messages in real-time
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(data);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: input,
      sender: "user",
      createdAt: new Date()
    });

    setInput("");
    setTyping(true);

    // Auto admin reply (demo)
    setTimeout(async () => {
      await addDoc(collection(db, "messages"), {
        text: "Thanks for your message. Our team will reply shortly.",
        sender: "admin",
        createdAt: new Date()
      });
      setTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Button */}
      <button className="chat-toggle" onClick={() => setOpen(!open)}>
        💬
      </button>

      {open && (
        <div className="chat-container">
          <div className="chat-header">
            Customer Support
            <span onClick={() => setOpen(false)}>✖</span>
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}

            {typing && <p className="typing">Admin is typing...</p>}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
