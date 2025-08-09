# app.py

from flask import Flask, jsonify, request
from flask_cors import CORS   # <-- NEW
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime

# --- Load .env ---
load_dotenv()

# --- MongoDB Setup ---
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI not found in environment variables.")

client = MongoClient(MONGO_URI)
db = client['whatsapp']
messages_collection = db['processed_messages']

# --- Flask App ---
app = Flask(__name__)
CORS(app)  # <-- ENABLES CORS FOR ALL ROUTES

# Get all conversations grouped by wa_id
@app.route('/conversations', methods=['GET'])
def get_conversations():
    pipeline = [
        {"$sort": {"timestamp": -1}},  # newest messages first
        {
            "$group": {
                "_id": "$wa_id",
                "last_message": {"$first": "$text"},
                "last_timestamp": {"$first": "$timestamp"},
                "name": {"$first": "$from"}  # basic sender info
            }
        },
        {"$sort": {"last_timestamp": -1}}
    ]
    conversations = list(messages_collection.aggregate(pipeline))
    return jsonify(conversations)

# Get all messages for a given wa_id
@app.route('/messages/<wa_id>', methods=['GET'])
def get_messages(wa_id):
    # Sort by timestamp in ascending order (oldest first, newest last)
    # This ensures messages appear in chronological order in the chat
    msgs = list(messages_collection.find({"wa_id": wa_id}, {"_id": 0}).sort("timestamp", 1))
    return jsonify(msgs)

# Save a new message
@app.route('/send_message', methods=['POST'])
def send_message():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['wa_id', 'text', 'timestamp']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Ensure timestamp is current if not provided
        timestamp = data.get('timestamp')
        if not timestamp:
            timestamp = int(datetime.utcnow().timestamp())
        
        # Create message document
        message = {
            "wa_id": data['wa_id'],
            "text": data['text'],
            "timestamp": timestamp,
            "from": "me",  # Indicates this is a sent message
            "status": "sent",  # Initial status
            "meta_msg_id": data.get('meta_msg_id', f"local-{timestamp}"),
            "created_at": datetime.utcnow()
        }
        
        # Insert into database
        result = messages_collection.insert_one(message)
        
        # Return success response
        return jsonify({
            "success": True,
            "message_id": str(result.inserted_id),
            "message": "Message saved successfully"
        }), 201
        
    except Exception as e:
        return jsonify({"error": f"Failed to save message: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
