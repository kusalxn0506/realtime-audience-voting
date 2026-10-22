# ⚡ Real-Time Audience Voting Platform

> **A high-concurrency, zero-server real-time audience voting system and cinematic stage display engineered for lightning talk presentation tournaments.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Architecture: Serverless](https://img.shields.io/badge/Architecture-Serverless%20%2F%20Event--Driven-blue.svg)](#system-architecture)
[![Database: Cloud Firestore](https://img.shields.io/badge/Database-Cloud%20Firestore-orange.svg)](https://firebase.google.com/)
[![Animation: GSAP 3](https://img.shields.io/badge/Animation-GSAP%203-green.svg)](https://greensock.com/gsap/)
[![Status: Production Tested](https://img.shields.io/badge/Status-Production%20Tested-brightgreen.svg)](#battle-tested-performance)

---

## 🌟 Overview

During high-speed presentation tournaments—such as **PechaKucha (20x20)** or university **3-Minute Talks**—hundreds of audience members vote simultaneously in a narrow 60–180 second window. 

Off-the-shelf polling tools (Slido, Mentimeter) often struggle under auditorium Wi-Fi congestion, impose steep pricing tiers for large crowds, and lack cinematic stage visuals.

**Real-Time Audience Voting Platform** is an open-source, zero-server web platform built with vanilla web standards and Firebase. It handled **200+ concurrent live voters** with sub-second synchronization, zero backend servers, and zero downtime.

---

## 📸 Key Interfaces

| Interface | File | Description |
| :--- | :--- | :--- |
| **📱 Mobile Audience Client** | `index.html` | Ultra-fast mobile interface with Google Auth, unique attendee deduplication, 3D interactive tilt cards, and instant voting. |
| **📽️ Stage Projector Screen** | `projector.html` | High-definition cinematic glassmorphism display featuring dynamic GSAP leaderboard reordering, a 180s SVG countdown gauge, synthesized audio beeps, and confetti physics explosions. |
| **🎤 Presenter Portal** | `speaker-portal.html` | Self-service registration portal with client-side HTML5 Canvas image compression (resizes raw camera photos down to optimized JPEG Base64). |
| **🛠️ Admin Dashboard** | `admin.html` | Live tournament controller to open/close voting sessions, view real-time voter counts, export results to CSV, and auto-generate lineup configurations. |

---

## 🏗️ System Architecture

```
                                  ┌────────────────────────┐
                                  │   Speaker Portal       │
                                  │  (speaker-portal.html) │
                                  └───────────┬────────────┘
                                              │ Client-Side Canvas Compression
                                              ▼ (Base64 JPEG)
┌─────────────────────────┐       ┌────────────────────────┐       ┌─────────────────────────┐
│   Audience Mobile Web   │       │     Cloud Firestore    │       │   Stage Projector View  │
│       (index.html)      │ ───►  │      (Zero-Server)     │ ───►  │     (projector.html)    │
│  • Google OAuth 2.0     │ Votes │  • /votes/{studentId}  │ Sync  │  • GSAP Rank Physics    │
│  • Student ID Dedupe    │       │  • /config/voting      │       │  • Circular SVG Timer   │
│  • 3D Tilt Card UI      │       │  • /submissions/{uid}  │       │  • Synthetic Web Audio  │
└─────────────────────────┘       └───────────▲────────────┘       │  • Winner Suspense Reveal│
                                              │                    └─────────────────────────┘
                                              │ Live Session State
                                  ┌───────────┴────────────┐
                                  │    Admin Dashboard     │
                                  │      (admin.html)      │
                                  │  • Open/Close Session  │
                                  │  • CSV Results Export  │
                                  └────────────────────────┘
```

### ⚡ Architectural Highlights
1. **Zero-Server Serverless Pipeline**: Operates directly between browser clients and Google Cloud Firestore. No Node.js / Python backend servers to maintain, scale, or pay for.
2. **Client-Side Image Compression**: Presenter photos are resized and compressed directly in the browser using the HTML5 Canvas API, removing the need for Cloud Storage buckets or image-processing microservices.
3. **Hardware-Synthesized Audio**: Sound effects for countdown urgency and final beeps are generated mathematically using the browser's native **Web Audio API** (`AudioContext` oscillators), requiring 0 audio asset downloads over strained venue Wi-Fi.
4. **Deterministic Deduplication**: Document keys in Firestore are mapped to the voter's verified Attendee/Student ID (`setDoc(doc(db, "votes", studentId))`), guaranteeing atomic one-vote-per-person enforcement even if a user tries multiple browser tabs.

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/kusalxn0506/realtime-audience-voting.git
cd realtime-audience-voting
```

### 2. Set Up Firebase
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Under **Build > Authentication**, enable **Google** as a sign-in provider.
3. Under **Build > Firestore Database**, create a database in production mode.
4. Copy the contents of [`firestore.rules`](file:///Users/souron_xn/Downloads/kusal-nirmala-portfolio_6%20copy/realtime-audience-voting/firestore.rules) into your Firebase Console's **Rules** tab and publish.

### 3. Configure Credentials
Copy `firebase-config.example.js` to `firebase-config.js` and paste your Firebase Web App configuration:

```javascript
// firebase-config.js
export const firebaseConfig = {
  apiKey: "AIzaSyYourProjectApiKey",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef12345678"
};

// Set your tournament administrator's Google email
export const ADMIN_EMAIL = "your-email@gmail.com";
```

### 4. Run Locally
Because the application uses ES modules, run it through any local web server:

```bash
# Using Python
python3 -m http.server 8000

# OR using Node
npx serve .
```

Open `http://localhost:8000/index.html` in your browser!

---

## 📁 Repository Structure

```
realtime-audience-voting/
├── index.html                  # Responsive Audience Voting Client
├── projector.html              # Stage Projector Leaderboard & Timer Screen
├── speaker-portal.html         # Speaker Registration & Canvas Compression Form
├── admin.html                  # Tournament Admin & CSV Export Console
├── participants.js             # Active tournament speakers lineup
├── firebase-config.js          # Active Firebase credentials (git-ignored)
├── firebase-config.example.js  # Template Firebase configuration
├── firestore.rules             # Production Cloud Firestore Security Rules
├── LICENSE                     # MIT Open Source License
└── README.md                   # System Documentation
```

---

## 🔒 Security Rules

The application uses atomic Firestore Security Rules to prevent vote tampering, multiple submissions, and unauthorized session overrides:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isAdmin() {
      return isAuthenticated() && request.auth.token.email == "your-email@gmail.com";
    }

    match /config/voting {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /submissions/{userId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated() && request.auth.uid == userId;
    }

    match /votes/{voteId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated()
        && request.resource.data.userEmail == request.auth.token.email
        && request.resource.data.studentId == voteId;
      allow delete: if isAdmin();
    }
  }
}
```

---

## 👨‍💻 Author & Credits

Designed, architected, and built by **Kusal Nirmala**.

- **Portfolio**: [kusalnirmala.dev](https://kusalnirmala.dev)
- **GitHub**: [@kusalxn0506](https://github.com/kusalxn0506)
- **LinkedIn**: [Kusal Nirmala](https://linkedin.com/in/kusalnirmala)

Originally deployed and battle-tested for the **NSBM Faculty of Computing 26.2 PechaKucha Tournament**, serving over 200 simultaneous university presentation attendees.

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and deploy it for your own university events, tech meetups, and conferences. See [`LICENSE`](file:///Users/souron_xn/Downloads/kusal-nirmala-portfolio_6%20copy/realtime-audience-voting/LICENSE) for details.
