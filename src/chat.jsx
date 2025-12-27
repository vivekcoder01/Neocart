import { useEffect, useState } from "react";
import "./Chat.css";




// 🔥 Firebase imports
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

import { db } from "./firebase";

function Chat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 🔄 REAL-TIME FETCH
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

  // 📤 SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: input,
      sender: "user",
      createdAt: new Date()
    });

    setInput("");
  };

  return (
    <>
      {/* Toggle Button */}
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
                {msg.text}
              </div>
            ))}
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
