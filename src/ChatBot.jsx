import React, { useState, useRef, useEffect } from "react";
import "./assets/css/styles.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Welcome to Trinetra Games! How can I help you today?", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample responses - customize these for your gaming site
  const botResponses = {
    "game": "We have a wide selection of games including EA FC 24, Call of Duty, GTA, FIFA, and more!",
    "price": "Our game prices start from Rs1000. We also have free games available!",
    "sale": "Check out our Spring Sale Spotlight for the best deals!",
    "buy": "To purchase a game, simply click on it and follow the checkout process.",
    "free": "Yes, we have several free games including PUBG, Apex Legends, and Valorant.",
    "fifa": "We have various FIFA titles available, from FIFA 14 to the latest EA FC 24.",
    "hello": "Hi there! How can I help you with your gaming needs today?",
    "hi": "Hello gamer! Looking for something specific?",
    "payment": "We accept credit cards, UPI, and net banking for all purchases.",
    "download": "After purchase, you can download games directly from your library.",
    "help": "I can help you find games, check prices, or answer questions about our platform."
  };

  // Handle sending messages
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const newMessages = [...messages, { text: inputValue, sender: "user" }];
    setMessages(newMessages);
    setInputValue('');
    
    // Show bot is typing
    setIsTyping(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botReply = getBotResponse(inputValue.toLowerCase());
      setMessages([...newMessages, { text: botReply, sender: "bot" }]);
      setIsTyping(false);
    }, 800);
  };

  // Get bot response based on user input
  const getBotResponse = (input) => {
    // Check for keywords in the input
    for (const [keyword, response] of Object.entries(botResponses)) {
      if (input.includes(keyword)) {
        return response;
      }
    }
    // Default response
    return "I'm not sure I understand. You can ask about our games, prices, sales, or how to make a purchase.";
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <button 
          className="chat-button"
          onClick={() => setIsOpen(true)}
        >
          Chat Support
        </button>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Trinetra Game Support</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender}`}
              >
                {message.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing">
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="chat-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about games, prices, etc."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;