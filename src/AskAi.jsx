import React, { useState, useEffect, useRef } from 'react';
import ChatHistory from './ChatHistory.jsx';
import img from './art.png';
import Navbar from './Navbar.jsx';
import './assets/css/AskAi.css';

const AskAi = () => {
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('both');
  const [showChatHistory, setShowChatHistory] = useState(false);
  const chatBoxRef = useRef(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchDeepSeekResponse = async (message) => {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer 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`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [{ role: 'user', content: message }]
        })
      });
      
      const data = await response.json();
      return data.choices[0]?.message?.content || 'No response from DeepSeek';
    } catch (error) {
      console.error('DeepSeek API call failed:', error);
      return 'DeepSeek API error';
    }
  };

  const fetchQwenResponse = async (message) => {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "qwen/qwen2.5-vl-3b-instruct:free",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: message }
              ]
            }
          ]
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.choices[0]?.message?.content || "No response from Qwen";
    } catch (error) {
      console.error("Qwen API call failed:", error);
      return "Qwen API error";
    }
  };
    
  const handleApiCall = async () => {
    if (!userMessage.trim()) return;
    
    setIsLoading(true);
    const userMsg = userMessage;
    setMessages(prevMessages => [...prevMessages, { role: 'user', content: userMsg }]);
    setUserMessage(''); // Clear input immediately for better UX
    
    if (selectedModel === 'deepseek' || selectedModel === 'both') {
      const deepSeekResponse = await fetchDeepSeekResponse(userMsg);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'bot', content: `DeepSeek: ${deepSeekResponse}` }
      ]);
    }
    
    if (selectedModel === 'qwen' || selectedModel === 'both') {
      const qwenResponse = await fetchQwenResponse(userMsg);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'bot', content: `Qwen: ${qwenResponse}` }
      ]);
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleApiCall();
    }
  };

  const toggleChatHistory = () => {
    setShowChatHistory(!showChatHistory);
  };

  return (
    <div className="ask-ai-page">
      <Navbar />
      
      <div className="content-container">
        {/* Mobile Chat History Toggle Button */}
        <button 
          className="history-toggle-btn"
          onClick={toggleChatHistory}
        >
          {showChatHistory ? 'Hide History' : 'Show History'}
        </button>
        
        {/* Chat History Sidebar - will show/hide on mobile */}
        <div className={`chat-history-container ${showChatHistory ? 'show' : ''}`}>
          <ChatHistory 
            messages={messages} 
            onSelectMessage={setUserMessage} 
            onSelectConversation={() => setShowChatHistory(false)}
          />
        </div>
        
        <div className="chat-box-container">
          
          
          <div className="model-selector">
            <label htmlFor="model-select">Choose AI Model:</label>
            <select 
              id="model-select" 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={isLoading}
            >
              <option value="both">Both Models</option>
              <option value="deepseek">DeepSeek Only</option>
              <option value="qwen">Qwen Only</option>
            </select>
          </div>
          
          <div className="chat-box" ref={chatBoxRef}>
            {messages.length === 0 ? (
              <div className="empty-chat-message">
                <p>Send a message to start chatting with Trinetra AI</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  <span>{msg.content}</span>
                </div>
              ))
            )}
          </div>
          
          <div className="input-container">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={isLoading}
            />
            
            <button 
              onClick={handleApiCall} 
              disabled={isLoading}
              className="send-button"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAi;