import { useEffect, useState } from "react";
import "./Chat.css";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

import { db, auth } from "./firebase";

/*
  AdminChat:
  - Reads all messages in real time
  - Only ADMIN can send replies
*/

function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  /* ===================== REAL-TIME FETCH ===================== */
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

  /* ===================== ADMIN REPLY ===================== */
  const sendReply = async () => {
    
    if (
      !auth.currentUser ||
      auth.currentUser.email !== "admin@neocart.com"
    ) {
      alert("Unauthorized");
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

  /* ===================== UI ===================== */
  return (
    <div
      className="chat-container"
      style={{ position: "static", width: "100%" }}
    >
      <div className="chat-header">🛠 Admin Chat Panel</div>

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
