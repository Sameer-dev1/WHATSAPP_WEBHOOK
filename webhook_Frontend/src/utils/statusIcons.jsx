// WhatsApp-style status icons and colors
export const getStatusIcon = (status) => {
  switch (status) {
    case 'sent':
      return { 
        icon: (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
            <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
          </svg>
        ), 
        color: 'text-gray-400' 
      };
    case 'delivered':
      return { 
        icon: (
          <div className="flex items-center space-x-0.5">
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
            </svg>
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
            </svg>
          </div>
        ), 
        color: 'text-gray-400' 
      };
    case 'read':
      return { 
        icon: (
          <div className="flex items-center space-x-0.5">
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
            </svg>
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
            </svg>
          </div>
        ), 
        color: 'text-blue-500' 
      };
    case 'failed':
      return { 
        icon: (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        ), 
        color: 'text-red-500' 
      };
    default:
      return { icon: null, color: 'text-gray-400' };
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'sent':
      return 'text-gray-400';
    case 'delivered':
      return 'text-gray-400';
    case 'read':
      return 'text-blue-500';
    case 'failed':
      return 'text-red-500';
    default:
      return 'text-gray-400';
  }
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};
