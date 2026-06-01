# 🦉 MockMate AI — Premium AI-Powered Interview Coach

MockMate AI is a state-of-the-art, high-fidelity interview preparation platform that prepares candidates for technical, behavioral, and HR rounds. Using advanced Large Language Models (LLMs) via Google Gemini, the platform dynamically generates tailored questions, assesses response qualities, calculates speech analytics, parses resumes, and creates holistic candidate performance scorecards.

Developed with a modular monorepo architecture and designed with a mobile-first responsive grid system, MockMate delivers an immersive preparation experience.

---

## 🌟 Key Features

* **🤖 Dynamic AI Mock Interviews**: Participate in role-specific practice tracks (Technical, HR, Behavioral, or Mixed) powered by the Google Gemini Pro engine.
* **📊 Deep Performance Metrics**: Track preparedness scores, speech analytics, and core categories using beautiful dynamic Recharts (radar charts, area gradients, and score trends).
* **📄 Smart Resume Profile Analyzer**: Upload PDF/TXT resumes. The AI instantly extracts key technical skills, parses career achievements, maps outstanding projects, and constructs specialized interview sessions.
* **📱 Unified Responsive Layout**: Fully optimized mobile UI equipped with a slide-out navigation sidebar drawer and quick-launch dashboard overlays.
* **🔐 Google OAuth 2.0 Integration**: Authenticate seamlessly via one-tap Google SSO.
* **⚡ Cold-Start Database Sync**: High-efficiency backend synchronization middleware protecting serverless endpoints from connection race conditions.

---

## 🏗️ Repository Architecture

The project is structured as a unified monorepo divided into a React SPA client and an Express REST server:

```text
MockMate/
├── client/                 # Frontend React Application (Vite + TS)
│   ├── src/
│   │   ├── assets/         # High-resolution brand and mascot assets
│   │   ├── components/     # Reusable UI widgets (Header, Navbar, Sidebar)
│   │   ├── context/        # Session and Authentication state managers
│   │   ├── pages/          # Layout views (Dashboard, Studio, Analyzer, Reports)
│   │   └── services/       # REST API fetching client
│   ├── tsconfig.json       # Strict TypeScript configurations
│   └── vercel.json         # React Router SPA URL rewrites for Vercel
│
├── server/                 # Backend Node.js Express Application
│   ├── src/
│   │   ├── config/         # Database, Cloudinary, and MemoryStore controllers
│   │   ├── controllers/    # Route handler logic (Auth, Interviews, Resumes)
│   │   ├── middleware/     # JWT verification and route interceptors
│   │   ├── models/         # Mongoose DB Schemas (User, Interview, Report, Resume)
│   │   ├── routes/         # Express endpoint maps
│   │   └── services/       # Gemini AI generative engine helpers
│   ├── server.js           # Express main server entrypoint
│   └── vercel.json         # Node.js Serverless mapping for Vercel
│
├── BrandKit/               # Logo and mascot vector files
└── package.json            # Monorepo task runner & scripts
```

---

## 🛠️ Technology Stack

### Frontend (Client)
* **Core**: React 19, TypeScript
* **Build Engine**: Vite
* **Styling**: Tailwind CSS
* **Animations**: Framer Motion
* **Analytics Rendering**: Recharts
* **Icons**: Lucide React
* **Document Exporting**: jsPDF, html2canvas

### Backend (Server)
* **Runtime**: Node.js, Express
* **Database**: MongoDB (via Mongoose ODM)
* **Artificial Intelligence**: Google Gemini Pro (`@google/generative-ai`)
* **Storage & Hosting**: Cloudinary (avatar and document uploads)
* **Security & Tokens**: JWT (JSON Web Tokens), bcryptjs (password hashing)
* **Runtime Compatibility**: Vercel Serverless Functions (`@vercel/node`)

---

## 🚀 Local Development Setup

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and [MongoDB](https://www.mongodb.com/) installed locally.

### 2. Installation
Run the root-level installation script to configure dependencies across all folders in a single command:
```bash
npm run install-all
```

### 3. Environment Variables Config
Create a `.env` file in the `/server` directory and add the following keys:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mockmate?retryWrites=true&w=majority
JWT_SECRET=your_jwt_signature_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

### 4. Running Locally
Run the concurrent dev server script to launch the React frontend and Express backend at once:
```bash
npm run dev
```
* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:5000`

---

## ☁️ Vercel Deployment

MockMate is pre-configured to deploy seamlessly on Vercel as two microservice projects.

### 1. Deploying the Backend (`server/`)
1. Create a new Vercel project and link your repository.
2. Set the **Root Directory** to `server`.
3. Set the **Framework Preset** to **Other** (Vercel will build via `vercel.json`).
4. Set the **Environment Variables** (from your local `server/.env`).
5. Deploy. Copy the live API base URL (e.g., `https://mockmate-backend.vercel.app`).

### 2. Deploying the Frontend (`client/`)
1. Create a second Vercel project and link your repository.
2. Set the **Root Directory** to `client`.
3. Set the **Framework Preset** to **Vite** (Vercel handles build/dist commands).
4. Add the following **Environment Variable**:
   * `VITE_API_BASE_URL`: Set this to your live backend base URL followed by `/api` (e.g. `https://mockmate-backend.vercel.app/api`).
5. Deploy.

---

## ⚙️ Key Technical Enhancements

* **⚡ Serverless Cold-Start Connection Sync**: Express servers on serverless structures can hit race conditions during cold starts. We implemented a custom Mongoose connection state middleware in [app.js](file:///c:/Users/Aryan%20Pandey/Desktop/MockMate/server/src/app.js) that intercepts incoming cold start calls, blocks the request during active Mongo handshakes, and continues cleanly once the database is fully online.
* **🛡️ Trailing Slash CORS Tolerance**: Added automatic cleaning logic that strips trailing slashes from the `CLIENT_URL` environmental variable, preventing strict browser preflight mismatches.
* **✨ Dynamic SPA Router Compatibility**: Built-in Vercel rewrites protect client-side React Router pages from triggering broken paths on page refreshes.
