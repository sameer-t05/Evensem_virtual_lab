# 🔬 Virtual Lab — Real-Time Collaborative Physics Simulator

A full-stack, real-time collaborative physics laboratory built with **React**, **Matter.js**, and **Socket.io**. Multiple users can join a shared room, drop physics objects onto a canvas, connect them with constraints (ropes, springs, pivots, gears), tune material properties, and watch simulations unfold together — all synced in real time.

---

## ✨ Features

| Category | Details |
|---|---|
| **Physics Engine** | Powered by [Matter.js](https://brm.io/matter-js/) — realistic 2D rigid-body simulation with gravity, collisions, friction, and restitution |
| **Real-Time Collaboration** | Socket.io rooms let multiple users see each other's changes instantly |
| **Object Toolkit** | Add circles, rectangles, and static platforms to the canvas |
| **Constraints** | Connect bodies with ropes, springs, pivot joints, and motorized gears |
| **Material Properties** | Live-tune restitution (bounciness), friction, density, rope length, spring stiffness, and motor speed |
| **Analytics Panel** | Real-time charts (via Recharts) showing kinetic energy, body count, and other simulation metrics |
| **Save / Load** | Persist full simulation state (bodies + constraints) to MongoDB and reload it later |
| **Room Gallery** | Browse and rejoin previously saved rooms from the lobby |
| **Pause / Resume** | Freeze the simulation at any point and resume when ready |

---

## 🏗️ Tech Stack

### Frontend
- **React 19** — UI framework
- **Vite 8** — Build tool & dev server
- **Matter.js** — 2D physics engine
- **Recharts** — Analytics charts
- **Socket.io Client** — Real-time communication
- **Tailwind CSS 4** — Utility-first styling

### Backend
- **Node.js + Express 5** — REST API server
- **Socket.io** — WebSocket layer for real-time sync
- **MongoDB + Mongoose 9** — Database for room & simulation persistence
- **dotenv** — Environment variable management

---

## 📁 Project Structure

```
Virtual_lab-main/
├── backend/
│   ├── models/
│   │   └── Room.js              # Mongoose schema for rooms
│   ├── routes/
│   │   └── rooms.js             # REST API routes (CRUD for rooms)
│   ├── server.js                # Express + Socket.io server entry
│   ├── .env.example             # Environment variable template
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyticsPanel.jsx   # Real-time simulation metrics
│   │   │   ├── Lobby.jsx            # Room creation & join screen
│   │   │   ├── MaterialPicker.jsx   # Material property controls
│   │   │   ├── PhysicsCanvas.jsx    # Main Matter.js canvas
│   │   │   └── Toolbar.jsx          # Object & constraint tools
│   │   ├── App.jsx              # Root component with state management
│   │   ├── App.css              # Application styles
│   │   ├── index.css            # Global styles
│   │   ├── main.jsx             # React entry point
│   │   └── socket.js            # Socket.io client instance
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas** account (free tier works) — [Sign up](https://www.mongodb.com/cloud/atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/sameer-t05/Evensem_virtual_lab.git
cd Evensem_virtual_lab
```

### 2. Set Up the Backend

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Now open `backend/.env` and add your MongoDB connection string:

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

> **💡 Tip:** Get your MongoDB URI from [MongoDB Atlas](https://cloud.mongodb.com/) → Database → Connect → Drivers → Node.js

### 3. Set Up the Frontend

```bash
# Navigate to the frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 4. Run the Application

You need **two terminal windows** — one for the backend and one for the frontend:

**Terminal 1 — Start the Backend:**
```bash
cd backend
npm run dev
```
You should see:
```
📦 Connected to MongoDB Atlas successfully!
🚀 Server running on http://localhost:5001
```

**Terminal 2 — Start the Frontend:**
```bash
cd frontend
npm run dev
```
You should see:
```
VITE v8.x.x  ready in XXXms
➜  Local:   http://localhost:5173/
```

### 5. Open in Browser

Navigate to **[http://localhost:5173](http://localhost:5173)** to access the Virtual Lab.

---

## 🎮 How to Use

1. **Create or Join a Room** — From the lobby, create a new room or enter an existing room code to join
2. **Add Objects** — Use the toolbar to select circles, rectangles, or static platforms and click on the canvas to place them
3. **Add Constraints** — Select rope, spring, pivot, or gear tools and click on two bodies to connect them
4. **Tune Properties** — Use the Material Picker panel to adjust physics properties (bounciness, friction, density, etc.)
5. **Collaborate** — Share the room code with others so they can join and interact with the same simulation
6. **Save** — Click the 💾 Save button to persist the simulation state to the database
7. **Pause / Resume** — Use the ⏸ Pause button to freeze the simulation

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | Health check — returns server status |
| `POST` | `/api/rooms` | Create a new room with a random 6-char code |
| `GET` | `/api/rooms` | Fetch gallery of saved rooms |
| `GET` | `/api/rooms/:roomId` | Fetch a specific room's physics data |
| `PUT` | `/api/rooms/:roomId/save` | Save simulation state (bodies + constraints) |

---

## 🔄 Real-Time Socket Events

| Event | Direction | Description |
|---|---|---|
| `join-room` | Client → Server | Join a specific room |
| `physics-update` | Bidirectional | Sync physics body states |
| `add-body` | Bidirectional | Broadcast new body creation |
| `remove-body` | Bidirectional | Broadcast body deletion |
| `add-constraint` | Bidirectional | Broadcast new constraint |
| `remove-constraint` | Bidirectional | Broadcast constraint deletion |
| `clear-canvas` | Bidirectional | Clear all objects |
| `user-joined` | Server → Client | Notify when a user joins |
| `user-left` | Server → Client | Notify when a user leaves |

---

## 🛠️ Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5001` | Backend server port |
| `MONGO_URI` | **Yes** | — | MongoDB Atlas connection string |

---

## 📜 Available Scripts

### Backend (`/backend`)
| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-restart on changes) |
| `npm start` | Start in production mode |

### Frontend (`/frontend`)
| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Sameer Tilkar**

- GitHub: [@sameer-t05](https://github.com/sameer-t05)
