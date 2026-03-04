# 3D Product Viewer (MERN + Three.js)

A fully functional 3D Product Viewer built with the MERN stack and React Three Fiber. This application allows users to upload `GLB`/`GLTF` 3D models and interactively customize their presentation environments in real-time. Created as a Full Stack Developer test assignment.

## 🌟 Key Features

### Core Capabilities
* **3D Viewer context**: Robust `Canvas` integration allowing you to intuitively Rotate, Zoom, and Pan around any loaded object.
* **Model Uploading**: Fully robust `.glb`/`.gltf` multipart uploading mapped reliably via `Multer` locally to your NodeJS backend.
* **Persistent Configuration**: Changes made to the active scene (background color, wireframe state, lighting) are serialized to a `MongoDB` database and fetched automatically.

### Premium Enhancements
* **HDRI Support**: Pick from multiple high-end environment presets (e.g. City, Studio, Sunset, Night) seamlessly leveraging Three's equirectangular processing mappings.
* **Live Material Overlay**: Granularly override any loaded 3D model's metallic mapping, roughness gradients, and core RGB diffuse coloration right from the UI sidebar sliders!
* **Spatial Hotspots**: Activate *Annotation Mode* to drop absolute interconnected text hotspots by directly clicking across polygon geometry vertices on your model.

---

## 💻 Tech Stack

* **Frontend**: React.js, Vite, TailwindCSS
* **3D Integration**: Three.js, `@react-three/fiber` (R3F), `@react-three/drei`
* **Data Persistence**: MongoDB with Mongoose
* **Backend Server**: Node.js, Express.js
* **Miscellaneous**: Axios, Lucide-React, React-Hot-Toast

---

## 🛠 Required Installation & Setup

Before you start, ensure you have **Node.js** and **MongoDB** installed on your system.
This project separates frontend (`client`) and backend (`server`) environments.

### 1. Database Configuration
* Launch a local instance of MongoDB (usually running on `mongodb://127.0.0.1:27017/`) or prepare a connection string URI from MongoDB Atlas.
* Inside `server/.env`, initialize your database route. If the file is missing, create it like so:
```text
MONGO_URI=mongodb://127.0.0.1:27017/threejs_viewer
PORT=5000
```

### 2. Backend Initialization
Open a bash terminal inside the `/server` folder.
```bash
cd server
npm install
npm run dev
```
The Express application will actively spin up alongside `nodemon` on `http://localhost:5000`.

### 3. Frontend Initialization 
Open a new terminal inside the `/client` folder.
* Utilize the provided `client/.env.example` mapping to create a `client/.env` file.
```text
VITE_API_BASE_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api
```
Run the frontend vite build script:
```bash
cd client
npm install
npm run dev
```

The React-Three-Fiber environment operates heavily relying on Vite proxy resolution configured in `vite.config.js`. Navigating to `http://localhost:5173/` should open the WebGL view seamlessly communicating with your active backend!

---

## 🚢 Building for Production
The internal MERN pipeline has been upgraded heavily to natively support single-domain express distributions!
1. Under `/client`, run globally `npm run build`. This creates a `/client/dist` directory.
2. In production logic (`NODE_ENV=production`), the Node.js server acts as the central router for your frontend, aggressively serving Express Statics from `client/dist`. 

If utilizing Docker or remote deployments (e.g., Render), simply map `.env` variables and launch `node server.js` from `/server/`.
