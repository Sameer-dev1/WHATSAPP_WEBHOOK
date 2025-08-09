// src/components/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getStatusIcon, formatTimestamp } from "../utils/statusIcons.jsx";

export default function ChatWindow({ waId, meta }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef();
  const [text, setText] = useState("");

  useEffect(() => {
    if (!waId) {
      setMessages([]);
      return;
    }
    loadMessages();
    const id = setInterval(() => waId && loadMessages(), 8000); // refresh every 8s
    return () => clearInterval(id);
  }, [waId]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/messages/${waId}`);
      // Ensure messages are sorted by timestamp (oldest first, newest last)
      const sortedMessages = (res.data || []).sort((a, b) => a.timestamp - b.timestamp);
      setMessages(sortedMessages);
      // small delay to let render happen
      setTimeout(() => scrollToBottom(), 100);
    } catch (e) {
      console.error("Failed to load messages:", e);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  // Send message and save to backend
  const handleSend = async () => {
    if (!text.trim() || sending) return;
    
    setSending(true);
    const messageText = text.trim();
    setText(""); // Clear input immediately for better UX
    
    // Create optimistic message with current timestamp
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const optimisticMessage = {
      meta_msg_id: `local-${Date.now()}`,
      from: "me",
      timestamp: currentTimestamp,
      text: messageText,
      status: "sent",
      wa_id: waId
    };
    
    // Add to UI immediately (optimistic update) - append to end
    setMessages(prev => [...prev, optimisticMessage]);
    scrollToBottom();

    try {
      // Save to backend
      const response = await axios.post("http://localhost:5000/send_message", {
        wa_id: waId,
        text: messageText,
        timestamp: currentTimestamp,
        meta_msg_id: optimisticMessage.meta_msg_id
      });
      
      if (response.data.success) {
        console.log("Message saved successfully:", response.data.message_id);
        // Reload messages to get the canonical version from database
        setTimeout(() => {
          loadMessages();
        }, 500);
      } else {
        console.error("Failed to save message:", response.data.error);
        // Optionally show error to user
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally revert the optimistic update or show error
      // For now, we'll keep the message in UI but mark it as failed
      setMessages(prev => 
        prev.map(msg => 
          msg.meta_msg_id === optimisticMessage.meta_msg_id 
            ? { ...msg, status: "failed" }
            : msg
        )
      );
    } finally {
      setSending(false);
    }
  };

  if (!waId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 bg-[#f0f2f5]">
        <div className="text-center px-4">
          <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          <h3 className="text-base md:text-lg font-medium mb-2">Welcome to WhatsApp Web</h3>
          <p className="text-sm">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5]">
      {/* WhatsApp-style chat header */}
      <div className="flex items-center px-3 md:px-4 py-2.5 md:py-3 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-2.5 md:mr-3 text-sm md:text-base">
          {meta?.name?.charAt(0).toUpperCase() || waId.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm md:text-base">{meta?.name || waId}</h3>
          <p className="text-xs text-green-600">online</p>
        </div>
        <div className="flex space-x-1 md:space-x-2">
          <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </button>
          <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM12 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* WhatsApp-style messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2 bg-[#e5ddd5]">
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
          </div>
        )}
        
        {messages.map((m, idx) => {
          const isOutgoing = (m.from === "918329446654" || m.from === "me") ? true : (m.from === "me");
          // our sample data uses business number as from; we treat messages where wa_id != from as sent by business -> align right
          const alignRight = m.from === "918329446654" || m.from === "me"; // adjust if needed
          const statusInfo = getStatusIcon(m.status);
          
          return (
            <div key={m.meta_msg_id || idx} className={`flex ${alignRight ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] md:max-w-xs lg:max-w-md px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg shadow-sm ${
                alignRight 
                  ? "bg-[#dcf8c6] text-gray-900" 
                  : "bg-white text-gray-900"
              }`}>
                <div className="whitespace-pre-wrap text-sm md:text-base">{m.text}</div>
                <div className={`flex items-center justify-end mt-1 space-x-1 ${
                  alignRight ? "text-gray-500" : "text-gray-400"
                }`}>
                  <span className="text-xs">
                    {formatTimestamp(m.timestamp)}
                  </span>
                  {alignRight && statusInfo.icon && (
                    <span className={`text-xs ${statusInfo.color}`}>
                      {statusInfo.icon}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* WhatsApp-style input */}
      <div className="p-2 md:p-3 bg-white border-t border-gray-200">
        <div className="flex items-center gap-1.5 md:gap-2">
          <button className="p-1.5 md:p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </button>

          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !sending) handleSend(); }}
            className="flex-1 px-3 md:px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            placeholder={sending ? "Sending..." : "Type a message"}
            disabled={sending}
          />

          <button 
            onClick={handleSend}
            disabled={sending || !text.trim()}
            className={`p-1.5 md:p-2 rounded-full transition-colors ${
              sending || !text.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {sending ? (
              <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
            ) : (
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
