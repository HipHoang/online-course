# Implementation TODO

## Task 1: Level 2 AI (Smart AI)
- [x] Modify `backend/app/services/ai_service.py` - add search_courses + smart generate_reply

## Task 2: AI Chat History (SQL)
- [x] Create `backend/app/models/chat_message.py`
- [x] Update `backend/app/models/__init__.py` to export ChatMessage
- [x] Modify `backend/app/routes/ai_routes.py` - save messages, add /history endpoint

## Task 3: User ↔ User Chat
- [x] Create `backend/app/models/chat.py` - Conversation, ConversationUser, Message
- [x] Update `backend/app/models/__init__.py` to export new chat models
- [x] Create `backend/app/routes/chat_routes.py`
- [x] Update `backend/app/__init__.py` to register chat_bp

## Task 4: Firebase Firestore (Realtime Chat)
- [x] Update `frontend/package.json` - add firebase dependency
- [x] Create `frontend/src/config/firebase.js`
- [x] Create `frontend/src/services/firebaseChatService.js`
- [x] Modify `frontend/src/components/AIChat.jsx` - Firestore integration

## Bug Fixes
- [x] Fix duplicate messages in AIChat.jsx
- [x] Fix 503 error & add fallback in ai_service.py

