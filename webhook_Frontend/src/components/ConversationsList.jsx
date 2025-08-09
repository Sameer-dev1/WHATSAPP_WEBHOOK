// src/components/ConversationsList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatTimestamp } from "../utils/statusIcons.jsx";

export default function ConversationsList({ onSelect }) {
  const [conversations, setConversations] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConversations();
    // optional: poll every 10s to reflect new messages
    const id = setInterval(fetchConversations, 10000);
    return () => clearInterval(id);
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://whatsapp-webhook-ftom.onrender.com/conversations");
      // normalize structure for UI safety
      const list = (res.data || []).map(c => ({
        wa_id: c._id,
        name: c.name || c._id,
        last_message: c.last_message || "",
        last_timestamp: c.last_timestamp || c.last_time || "",
        status_icon: c.status_icon || "",
      }));
      setConversations(list);
    } catch (e) {
      console.error("Failed to load conversations", e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = conversations.filter(c =>
    `${c.name} ${c.last_message}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* WhatsApp-style header */}
      <div className="flex items-center justify-between px-3 md:px-4 py-3 bg-[#075E54] text-white shadow-sm">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base md:text-lg font-semibold">WhatsApp Web</h1>
            <p className="text-xs opacity-90">Webhook Messages</p>
          </div>
        </div>
        <button className="p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-colors">
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* WhatsApp-style search */}
      <div className="px-3 md:px-4 py-2 md:py-3 border-b border-gray-100 bg-gray-50">
        <div className="relative">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search or start new chat"
            className="w-full px-3 md:px-4 py-2 pl-8 md:pl-10 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
          <svg className="absolute left-2.5 md:left-3 top-2.5 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* WhatsApp-style conversation list */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
          </div>
        )}
        
        {filtered.map(conv => (
          <div
            key={conv.wa_id}
            onClick={() => onSelect(conv.wa_id, conv)}
            className="cursor-pointer px-3 md:px-4 py-2.5 md:py-3 hover:bg-gray-50 border-b border-gray-100 flex items-start transition-colors"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-2.5 md:mr-3 flex-shrink-0 text-sm md:text-base">
              {conv.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900 truncate text-sm md:text-base">{conv.name}</h3>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {formatTimestamp(conv.last_timestamp)}
                </span>
              </div>
              <div className="flex items-center mt-0.5 md:mt-1">
                <p className="text-xs md:text-sm text-gray-600 truncate flex-1">
                  {conv.last_message || "No messages yet"}
                </p>
                {conv.status_icon && (
                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                    {conv.status_icon}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {(!loading && filtered.length === 0) && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
            <svg className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-center">No conversations found</p>
            <p className="text-xs opacity-75 text-center">Start a conversation to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
}
