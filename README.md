# 🎥 Connectly

A full-stack real-time video meeting platform built with **React**, **Node.js**, **Express**, **MongoDB**, **Socket.IO**, and **WebRTC**. Connectly enables users to create or join video meetings, communicate in real time, and maintain a history of their meetings through a secure authentication system.

---

# 🚀 Features

- 🔐 User Registration & Login
- 👤 Join meetings as an authenticated user
- 👥 Join meetings as a guest
- 📹 Real-time video and audio communication
- 💬 In-meeting chat
- 📺 Screen sharing support
- 📝 Meeting history tracking
- 🔄 Real-time communication using Socket.IO
- 🌐 Peer-to-peer media streaming using WebRTC
- 🚪 Logout functionality

---

# 🛠 Tech Stack

| Category | Technology |
|-----------|------------|
| Frontend | React, Vite |
| UI Library | Material UI |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | Token-based Authentication |
| Real-Time Communication | Socket.IO |
| Video Communication | WebRTC |
| HTTP Client | Axios |

---

# 📂 Project Structure

```text
connectly-main/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

# 🏗 Architecture Overview

```text
                React Frontend
                      │
                 Axios Requests
                      │
                      ▼
             Node.js + Express API
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
      MongoDB                Socket.IO Server
                                  │
                                  ▼
                              WebRTC Peers
```

---

# ⚙️ Getting Started

## 1. Clone the Repository

```bash
git clone [Insert Repository URL Here]
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 4. Configure Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
ATLASDB_URL=[Insert MongoDB Atlas Connection String]
```

---

## 5. Start the Backend

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

## 6. Start the Frontend

Development

```bash
npm run dev
```

Build for Production

```bash
npm run build
```

Preview Production Build

```bash
npm run preview
```

---

# 🔑 Environment Variables

| Variable | Description |
|-----------|-------------|
| `ATLASDB_URL` | MongoDB Atlas connection string |

---

# 🌐 API Endpoints

Base URL

```
/api/users
```

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate an existing user |
| POST | `/add_to_activity` | Save meeting activity |
| GET | `/get_all_activity` | Retrieve meeting history |

---

# 🔄 Real-Time Communication

The application uses **Socket.IO** for real-time messaging and signaling between clients.

Socket events identified in the source code include:

- `join-call`
- `signal`
- `chat-message`
- `user-left`
- `disconnect`

Video and audio communication is handled through browser **WebRTC APIs**.

---

# 🌍 Browser Features Used

The application requests permission for:

- 📷 Camera Access
- 🎤 Microphone Access
- 🖥 Screen Sharing (where supported)

---

# 📦 Backend Dependencies

- Express
- Mongoose
- Socket.IO
- bcrypt
- dotenv
- cors
- http-status
- nodemon

---

# 📦 Frontend Dependencies

- React
- React DOM
- React Router DOM
- Axios
- Material UI
- Emotion
- Socket.IO Client

---

# 🚀 Future Enhancements

Potential improvements that are **not currently implemented** but could be added in future versions:

- Meeting scheduling
- Group meeting management
- File sharing during meetings
- Meeting recording
- Chat notifications
- Virtual backgrounds
- End-to-end encryption
- Profile management
- Dark mode

---

# 👨‍💻 Author

**Vibhuvan V**

---

### ⭐ If you found this project helpful, consider giving it a star!
