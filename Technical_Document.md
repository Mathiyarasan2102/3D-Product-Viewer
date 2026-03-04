# 3D Product Viewer – Technical Document

This document outlines the architecture, tech stack, codebase structure, and important technical decisions made during the development of the 3D Product Viewer application.

## 1. Architecture Diagram

The application follows a standard MERN (MongoDB, Express, React, Node.js) client-server architecture, enriched with Three.js for 3D model rendering. 

```mermaid
graph TD
    Client[React + Vite + TailwindCSS]
    ThreeJS[Three.js / React Three Fiber]
    API[Node.js + Express API]
    Disk[Local File System '/uploads']
    DB[(MongoDB via Mongoose)]

    Client -->|Renders 3D Context| ThreeJS
    Client <-->|REST API (JSON/FormData)| API
    API -->|Save .glb / .gltf| Disk
    API <-->|Save/Fetch Configuration| DB
```

1. **Frontend**: The React client acts as the User Interface and the 3D rendering context. File uploads happen via `FormData`, and configs via standard JSON requests.
2. **Backend**: An Express.js server exposes `/api/upload` (for file processing with Multer) and `/api/settings` (for configurations).
3. **Database**: MongoDB serves as the persistent data storage for viewer settings (Background Color, Wireframe Mode, Model URI).

---

## 2. Technology Stack

- **Frontend**: React (via Vite)
- **3D Rendering**: Three.js, `@react-three/fiber` (R3F), and `@react-three/drei` (useful abstractions like `OrbitControls`, `Bounds`, `Environment`, etc.)
- **Styling**: TailwindCSS (Utility-first CSS designed for rapid UI creation with dark glassmorphism styling)
- **Icons & UI Extras**: `lucide-react` (icons), `react-hot-toast` (notifications)
- **Backend API**: Node.js & Express
- **File Uploads**: `multer` (multipart/form-data handler for Node.js)
- **Database**: MongoDB and Mongoose (ODM)

---

## 3. Folder Structure

```text
MERN+ThreesJs/
├── client/                     # Frontend Application (Vite/React)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx     # UI configuration panel
│   │   │   └── Viewer3D.jsx    # React Three Fiber canvas
│   │   ├── services/
│   │   │   └── api.js          # Promise-based Axios HTTP client
│   │   ├── App.jsx             # Main Application layout
│   │   ├── main.jsx            # React entry
│   │   └── index.css           # Global Tailwind & Custom styles
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Backend API (Express)
│   ├── config/
│   │   └── db.js               # MongoDB connection logic
│   ├── controllers/
│   │   └── apiController.js    # Logic for /api routes
│   ├── middleware/             # (Available for custom validations/auth)
│   ├── models/
│   │   └── Settings.js         # Mongoose schema
│   ├── routes/
│   │   └── api.js              # API route definitions
│   ├── uploads/                # Local destination for .glb/.gltf uploads
│   ├── .env                    # Environment variables (Mongo URI, Port)
│   └── server.js               # Node.js entry point & middleware bindings
├── README.md
└── Technical_Document.md       # This file
```

---

## 4. Important Technical Decisions

1. **React Three Fiber (R3F) over Pure Three.js**: Pure Three.js requires significant imperative boilerplate and manual lifecycle cleanup. R3F allows building scenes declaratively using React components, abstracting resize observers, raycasting, and render loops, leading to maintainable UI-driven 3D scenes.
2. **Scene Memory Management**: To prevent memory leaks inherent with switching WebGL resources, manual cleanup functions run inside the `useEffect` of the `<Model />` component wrapper. When the `modelUrl` changes or unmounts, it aggressively dumps object `geometry` and `materials` to free up GPU memory.
3. **Auto-Framing**: Calculating a model's arbitrary size and fitting it perfectly into the camera frustum manually is highly problematic. We utilized `@react-three/drei`'s `<Bounds fit clip observe>` module. When a new `<primitive object>` gets loaded, it automatically calculates the bounds and repositions the camera instantly.
4. **Environment HDRI (Bonus Feature)**: An optional target from the assignment was completed. Users can pick multiple environment maps (city, studio, sunset, etc.) leveraging Drei's `<Environment>` component for high-quality reflections.
5. **Materials & Annotations (Bonus Features)**: Complete material overrides (Color, Metalness, Roughness) were successfully created via Traversing `scene.children`. Additionally, clicking any coordinate intersecting the model automatically projects an HTML Hotspot annotation widget anchored absolute to the three.js world. All bonus features securely push and pull from the MongoDB instance.
6. **UI & Aesthetics**: The UI completely avoids native browser inputs. The styling uses custom scrollbars, backdrop-blur for glassmorphism panels, transitions and soft colors mapped inside Tailwind settings, capturing a "Startup MVP" premium feel.

---

## 5. Deployment Instructions

### A. Frontend (Vercel)
1. In your `client/` folder, Vercel will auto-detect Vite. 
2. Change the build command to `npm run build` inside `client`.
3. Configure the **Environment Variable** in your Vercel project: Name: `VITE_API_URL` to point to the production backend (e.g., `https://my-backend.onrender.com/api`).
4. Keep the root directory of your Vercel configuration as `./client`.

### B. Backend API (Render)
1. Push your repository to GitHub. Connect it natively to Render as a Web Service.
2. Ensure the `Root Directory` is set to `./server` or use the Build Command: `cd server && npm install`.
3. Set Start Command: `cd server && node server.js`.
4. Configure Render Environment Variables:
   - `MONGO_URI` = URL to your MongoDB Atlas cluster.
   - `PORT` = Render auto-assigns the port, but mapping `5000` is accepted.
5. **Note on Uploads**: Render ephemeral environments clear local storage upon restart. In a long-term production sense, Multer should stream files directly to an S3 Bucket or Cloudinary instead of the local `uploads` directory. For demo purposes, local uploads persist as long as the instance stays awake.
