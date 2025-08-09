// src/App.js
import React, { useState } from "react";
import ConversationsList from "./components/ConversationsList";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [selectedWaId, setSelectedWaId] = useState(null);
  const [selectedMeta, setSelectedMeta] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSelectConversation = (waId, meta) => {
    setSelectedWaId(waId);
    setSelectedMeta(meta);
    // Hide sidebar on mobile after selection
    setShowSidebar(false);
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      {/* Sidebar - responsive */}
      <div className={`${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:relative absolute inset-y-0 left-0 z-30 w-80 md:w-[30%] md:min-w-[320px] border-r border-gray-200 bg-white flex flex-col transition-transform duration-300 ease-in-out`}>
        <ConversationsList onSelect={handleSelectConversation} />
      </div>

      {/* Chat area - responsive */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header with back button */}
        <div className="md:hidden flex items-center px-4 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => setShowSidebar(true)}
            className="p-2 mr-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">WhatsApp Web</h1>
        </div>
        
        <ChatWindow waId={selectedWaId} meta={selectedMeta} />
      </div>

      {/* Mobile overlay */}
      {showSidebar && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}
