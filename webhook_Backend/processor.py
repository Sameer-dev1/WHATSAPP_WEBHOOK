import os
import json
from pymongo import MongoClient
from dotenv import load_dotenv

# --- Load .env ---
load_dotenv()

# --- MongoDB Setup ---
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI not found in environment variables.")

client = MongoClient(MONGO_URI)
db = client['whatsapp']
collection = db['processed_messages']
pending_collection = db['pending_status_updates']

# --- Process Payloads in Two Passes ---
def process_payloads(folder_path):
    message_payloads = []
    status_payloads = []

    # Separate payloads
    for filename in os.listdir(folder_path):
        if filename.endswith('.json'):
            with open(os.path.join(folder_path, filename), 'r', encoding='utf-8') as file:
                payload = json.load(file)
                if is_message_payload(payload):
                    message_payloads.append(payload)
                elif is_status_payload(payload):
                    status_payloads.append(payload)

    print(f"Found {len(message_payloads)} message payloads")
    print(f"Found {len(status_payloads)} status payloads")

    # First pass: messages
    for payload in message_payloads:
        handle_message_payload(payload)

    # Second pass: statuses
    for payload in status_payloads:
        handle_status_payload(payload)


# --- Helpers ---
def is_message_payload(payload):
    metadata = payload.get("metaData", {})
    entry_list = metadata.get("entry", [])
    if entry_list:
        changes = entry_list[0].get("changes", [])
        if changes and "messages" in changes[0].get("value", {}):
            return True
    return False


def is_status_payload(payload):
    metadata = payload.get("metaData", {})
    entry_list = metadata.get("entry", [])
    if entry_list:
        changes = entry_list[0].get("changes", [])
        if changes and "statuses" in changes[0].get("value", {}):
            return True
    return False


# --- Insert Message ---
def handle_message_payload(payload):
    try:
        metadata = payload.get("metaData", {})
        entry = metadata["entry"][0]
        value = entry["changes"][0]["value"]

        for msg in value["messages"]:
            meta_msg_id = msg.get("id")
            document = {
                "meta_msg_id": meta_msg_id,
                "from": msg.get("from"),
                "timestamp": msg.get("timestamp"),
                "type": msg.get("type"),
                "text": msg.get("text", {}).get("body", ""),
                "status": "sent",
                "wa_id": value.get("contacts", [{}])[0].get("wa_id"),
            }

            # Insert only if not already present
            result = collection.update_one(
                {"meta_msg_id": meta_msg_id},
                {"$setOnInsert": document},
                upsert=True
            )

            if result.upserted_id:
                print(f"Inserted new message: {meta_msg_id}")
            else:
                print(f"Message already exists: {meta_msg_id}")

            # Apply any pending status for this message
            pending_status = pending_collection.find_one({"meta_msg_id": meta_msg_id})
            if pending_status:
                collection.update_one(
                    {"meta_msg_id": meta_msg_id},
                    {"$set": {"status": pending_status["status"]}}
                )
                pending_collection.delete_one({"meta_msg_id": meta_msg_id})
                print(f"Applied pending status to {meta_msg_id}")

    except Exception as e:
        print(f"Error handling message payload: {e}")


# --- Update Status ---
def handle_status_payload(payload):
    try:
        metadata = payload.get("metaData", {})
        entry = metadata["entry"][0]
        value = entry["changes"][0]["value"]

        for status in value["statuses"]:
            msg_id = status.get("id")
            new_status = status.get("status")

            result = collection.update_one(
                {"meta_msg_id": msg_id},
                {"$set": {"status": new_status}}
            )

            if result.modified_count:
                print(f"Updated message {msg_id} to status {new_status}")
            else:
                # Store as pending if message not found
                pending_collection.update_one(
                    {"meta_msg_id": msg_id},
                    {"$set": {"status": new_status}},
                    upsert=True
                )
                print(f"Stored pending status update for {msg_id}")

    except Exception as e:
        print(f"Error handling status payload: {e}")


if __name__ == "__main__":
    process_payloads('payloads')  # Path to your unzipped payloads folder
