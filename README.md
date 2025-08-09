# WhatsApp Webhook Project

A real-time WhatsApp webhook handler with a modern React frontend for viewing and managing conversations. This project consists of a Flask backend that processes WhatsApp webhooks and a React frontend that provides a WhatsApp Web-like interface.

## 🚀 Features

### Backend (Flask)
- **Webhook Processing**: Handles incoming WhatsApp webhook messages
- **Message Storage**: Stores messages in a database for persistence
- **Conversation Management**: Organizes messages by conversation
- **RESTful API**: Provides endpoints for frontend communication
- **Real-time Updates**: Supports polling for new messages

### Frontend (React)
- **WhatsApp Web Interface**: Familiar chat interface similar to WhatsApp Web
- **Mobile Responsive**: Fully responsive design that works on all devices
- **Real-time Messaging**: Live updates of conversations and messages
- **Search Functionality**: Search through conversations
- **Message Status**: Visual indicators for message delivery status
- **Modern UI**: Built with Tailwind CSS for a clean, modern look

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)
- npm or yarn (Node.js package manager)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd whatsapp_webhook
```

### 2. Backend Setup

```bash
cd webhook_Backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python app.py
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd webhook_Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📱 Mobile Responsiveness

The frontend is fully mobile-responsive with the following features:

- **Collapsible Sidebar**: On mobile devices, the conversation list slides in from the left
- **Touch-Friendly**: All buttons and inputs are optimized for touch interaction
- **Responsive Typography**: Text sizes adjust based on screen size
- **Mobile Navigation**: Hamburger menu for accessing conversations on mobile
- **Optimized Layout**: Message bubbles and spacing adapt to screen size

## 🔧 Configuration

### Backend Configuration

Edit `webhook_Backend/config.py` to configure:

- Database settings
- Webhook endpoints
- API keys and secrets
- CORS settings

### Frontend Configuration

The frontend connects to the backend API. Update the API base URL in the components if needed:

- Default: `http://localhost:5000`
- Update in `ConversationsList.jsx` and `ChatWindow.jsx`

## 📡 API Endpoints

### Backend API

- `GET /conversations` - Get all conversations
- `GET /messages/{wa_id}` - Get messages for a specific conversation
- `POST /send_message` - Send a new message
- `POST /webhook` - WhatsApp webhook endpoint

### Webhook Payloads

Sample webhook payloads are included in `webhook_Backend/payloads/` for testing:

- Message payloads
- Status update payloads
- Various conversation scenarios

## 🎨 UI Components

### ConversationsList
- Displays all conversations
- Search functionality
- Real-time updates
- Mobile-responsive design

### ChatWindow
- Message display with bubbles
- Send/receive functionality
- Status indicators
- Mobile-optimized input

## 🚀 Development

### Running in Development Mode

1. Start the backend:
   ```bash
   cd webhook_Backend
   python app.py
   ```

2. Start the frontend:
   ```bash
   cd webhook_Frontend
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser

### Building for Production

```bash
cd webhook_Frontend
npm run build
```

The built files will be in the `dist/` directory.

## 📱 Mobile Features

- **Swipe Navigation**: Slide gestures for navigation
- **Touch Optimization**: 44px minimum touch targets
- **Viewport Handling**: Proper mobile viewport configuration
- **Keyboard Handling**: Prevents zoom on input focus
- **Smooth Scrolling**: Native-like scrolling behavior

## 🔒 Security Considerations

- CORS configuration for API access
- Input validation and sanitization
- Environment variable management
- Secure webhook handling

## 📝 Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URL=your-database-url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🆘 Support

For support and questions:

1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

## 🔄 Updates

The application includes automatic polling for:
- New conversations (every 10 seconds)
- New messages (every 8 seconds)

This ensures real-time updates without manual refresh.

---

**Note**: This is a development project. For production use, ensure proper security measures, error handling, and deployment configurations are in place.
