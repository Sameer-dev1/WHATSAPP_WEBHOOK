# WhatsApp Web Frontend

A modern, mobile-responsive React frontend for the WhatsApp Webhook project. This application provides a WhatsApp Web-like interface for viewing and managing conversations received through webhooks.

## 🚀 Features

- **WhatsApp Web Interface**: Familiar chat interface similar to WhatsApp Web
- **Mobile Responsive**: Fully responsive design that works on all devices
- **Real-time Updates**: Live polling for new conversations and messages
- **Search Functionality**: Search through conversations
- **Message Status**: Visual indicators for message delivery status
- **Modern UI**: Built with Tailwind CSS and React
- **Touch Optimized**: Mobile-friendly touch targets and gestures

## 📱 Mobile Responsiveness

The frontend is fully mobile-responsive with the following features:

### Mobile Navigation
- **Collapsible Sidebar**: Conversation list slides in from the left on mobile
- **Hamburger Menu**: Easy access to conversations on small screens
- **Overlay Background**: Dark overlay when sidebar is open
- **Smooth Transitions**: CSS transitions for smooth navigation

### Touch Optimization
- **44px Touch Targets**: All interactive elements meet accessibility standards
- **Touch-Friendly Spacing**: Adequate spacing between elements
- **Smooth Scrolling**: Native-like scrolling behavior on mobile
- **No Zoom on Input**: Prevents unwanted zoom when focusing on inputs

### Responsive Design
- **Flexible Layout**: Adapts to different screen sizes
- **Responsive Typography**: Text sizes adjust based on screen size
- **Optimized Message Bubbles**: Message width adapts to screen size
- **Mobile-First Approach**: Designed for mobile with desktop enhancements

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **ESLint**: Code linting and formatting

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install
npm install axios
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## 🎨 Component Structure

```
src/
├── components/
│   ├── ConversationsList.jsx    # Conversation list with search
│   └── ChatWindow.jsx           # Chat interface with messages
├── utils/
│   └── statusIcons.jsx          # Message status utilities
├── App.jsx                      # Main application component
└── main.jsx                     # Application entry point
```

## 📱 Mobile Features

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-Specific Enhancements
- **Sidebar Navigation**: Slides in from left on mobile
- **Touch Gestures**: Optimized for touch interaction
- **Viewport Handling**: Proper mobile viewport configuration
- **Keyboard Handling**: Prevents zoom on input focus
- **Smooth Animations**: CSS transitions for better UX

## 🔧 Configuration

### API Configuration
The frontend connects to the backend API. Update the API base URL in the components if needed:

- Default: `https://whatsapp-webhook-ftom.onrender.com`
- Update in `ConversationsList.jsx` and `ChatWindow.jsx`



## 🎯 Key Features

### ConversationsList Component
- **Real-time Updates**: Polls for new conversations every 10 seconds
- **Search Functionality**: Filter conversations by name or message content
- **Mobile Responsive**: Adapts layout for different screen sizes
- **Loading States**: Shows loading indicators during API calls

### ChatWindow Component
- **Message Display**: WhatsApp-style message bubbles
- **Send Functionality**: Send new messages with optimistic updates
- **Status Indicators**: Visual feedback for message status
- **Auto-scroll**: Automatically scrolls to latest messages
- **Mobile Optimized**: Touch-friendly input and buttons

## 🚀 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development Tips

1. **Mobile Testing**: Use browser dev tools to test mobile responsiveness
2. **API Integration**: Ensure backend is running on the correct port
3. **Hot Reload**: Changes are automatically reflected in the browser
4. **ESLint**: Code is automatically formatted and linted

## 📱 Mobile Testing

### Browser Dev Tools
1. Open browser developer tools
2. Click the device toggle button
3. Select a mobile device or set custom dimensions
4. Test the responsive behavior

### Real Device Testing
1. Build the application: `npm run build`
2. Serve the build files
3. Access from a mobile device on the same network

## 🎨 Styling

The application uses Tailwind CSS for styling with custom mobile-responsive classes:

- **Responsive Prefixes**: `sm:`, `md:`, `lg:` for different breakpoints
- **Mobile-First**: Base styles for mobile, enhanced for larger screens
- **Custom Colors**: WhatsApp-inspired color scheme
- **Smooth Transitions**: CSS transitions for better UX

## 🔄 Real-time Features

- **Conversation Polling**: Updates every 10 seconds
- **Message Polling**: Updates every 8 seconds
- **Optimistic Updates**: Immediate UI feedback for sent messages
- **Error Handling**: Graceful handling of network errors

---

**Note**: This frontend is designed to work with the WhatsApp Webhook backend. Ensure the backend is running and properly configured for full functionality.
