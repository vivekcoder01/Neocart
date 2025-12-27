import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

import { db, auth } from "../firebase";
import "./Chat.css";

function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  // 🔄 FETCH MESSAGES (REAL-TIME)
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(data);
    });

    return () => unsubscribe();
  }, []);

  // 📤 ADMIN REPLY (WITH AUTH CHECK)
  const sendReply = async () => {
    const user = auth.currentUser;

    if (!user || user.email !== "admin@neocart.com") {
      alert("Not authorized as admin");
      return;
    }

    if (!reply.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: reply,
      sender: "admin",
      createdAt: new Date()
    });

    setReply("");
  };

  return (
    <div className="chat-container" style={{ width: "100%" }}>
      <div className="chat-header">🛠 Admin Chat Panel</div>

      {/* ===== MESSAGES ===== */}
      <div className="chat-messages">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`message ${msg.sender}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* ===== INPUT ===== */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Reply as admin..."
          value={reply}
          onChange={e => setReply(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendReply()}
        />
        <button onClick={sendReply}>Send</button>
      </div>
    </div>
  );
}

export default AdminChat;
