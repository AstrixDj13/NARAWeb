// Chatbot.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRobot, FaTimes, FaCommentDots } from "react-icons/fa";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Ask me anything about this website." }
  ]);
  const [input, setInput] = useState("");
  const [siteMap, setSiteMap] = useState(null);
  const [isOpen, setIsOpen] = useState(true); // ✅ for minimizing

  useEffect(() => {
    fetch("/siteMap.json")
      .then(res => res.json())
      .then(data => setSiteMap(data));
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const systemPrompt = `You are a helpful chatbot that helps users navigate a website. Here is the sitemap: ${JSON.stringify(
      siteMap
    )}. Answer the user's question accordingly.`;

    try {
      const response = await axios.post(
        "https://api.anthropic.com/v1/messages",
        {
          model: "claude-3-5-sonnet-latest",
          messages: [
            { role: "user", content: `${systemPrompt}\n\nUser: ${input}` }
          ],
          max_tokens: 500
        },
        {
          headers: {
            "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
          }
        }
      );

      const botMessage = {
        sender: "bot",
        text: response.data.content[0].text
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn't process that request." }
      ]);
      console.error("Anthropic API Error:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <FaRobot /> Chat with NARA
            <FaTimes className="chatbot-close" onClick={() => setIsOpen(false)} />
          </div>
          <div className="chatbot-chatbox">
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.sender === "user" ? "chatbot-user-msg" : "chatbot-bot-msg"}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input-area">
            <input
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} // ✅ enter to send
              placeholder="Ask about products, collections, login, etc."
            />
            <button onClick={sendMessage} className="chatbot-button">Send</button>
          </div>
        </div>
      ) : (
        <button className="chatbot-toggle-button" onClick={() => setIsOpen(true)}>
          <FaCommentDots size={20} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
