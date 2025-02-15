import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const ChatBot = () => {
  const { showChatBot, toggleChatBot } = useAuth();
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  if (!showChatBot) return null;

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    // Simple bot response logic
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm just a simple bot. Try asking something else!",
          sender: "bot",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-gray-900 text-white shadow-lg rounded-lg p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">ChatBot</h2>
        <button onClick={toggleChatBot} className="text-red-500">
          <FaTimes />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-800 p-2 rounded-lg">
        {messages.map((msg, index) => (
          <p
            key={index}
            className={`p-2 my-1 rounded-lg ${
              msg.sender === "user" ? "bg-blue-600 text-right" : "bg-gray-700"
            }`}
          >
            {msg.text}
          </p>
        ))}
      </div>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Type a message..."
        className="w-full p-2 mt-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
      />
    </div>
  );
};

export default ChatBot;
