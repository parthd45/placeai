# Place Wise (PlaceAI) 🎓
### AI-Driven Training & Placement Support System

[![Version](https://img.shields.io/badge/version-2.2.8-purple.svg)](https://github.com/parthd45/placeai)
[![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Android%20APK-blue.svg)](https://github.com/parthd45/placeai)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

PlaceAI is a comprehensive, end-to-end career readiness and placement automation platform designed for colleges, placement cells, and ambitious candidates. Leveraging modern artificial intelligence, machine learning, and natural language processing, PlaceAI bridges the gap between candidate preparation and recruiter requirements.

---

## 🚀 Key Modules & Capabilities

### 1. 💼 AI Resume & ATS Analyzer
- Automated resume parsing and evaluation using natural language processing (NLP).
- Real-time ATS keyword matching against target job descriptions and roles.
- Actionable semantic suggestions to boost resume ranking and recruiter pass-rates.

### 2. 💻 Interactive DSA & Code Practice Studio
- Multi-language online code editor and execution engine.
- Curated curriculum of technical interview problems covering Arrays, Linked Lists, Trees, Graphs, and Dynamic Programming.
- Instant automated test-case evaluation with time and space complexity metrics.

### 3. 🎙️ AI Mock Interview Simulation
- Context-aware technical and behavioral interview simulation powered by AI.
- Adaptive questioning based on candidate responses and selected domains.
- Detailed performance scorecard analyzing communication clarity, depth of explanation, and technical accuracy.

### 4. 📊 Placement Command Hub & Analytics
- Multi-tier resilient session authentication with instantaneous load times.
- Real-time candidate readiness score and personalized placement roadmap.
- Comprehensive analytics for campus placement coordinators to monitor skill growth and offer predictability.

---

## 📱 Mobile App (Capacitor & Android)

PlaceAI is fully optimized as a responsive Progressive Web App and a native Android application powered by Capacitor.
- **Single-pane responsive architecture**: Designed for zero-scroll friction on mobile devices.
- **Safe-area aware**: Full support for Android gestures, notches, and status bars.
- **Offline & Low-Bandwidth Resilient**: Multi-tier local session caching ensures the app loads in `< 100ms` without waiting on network roundtrips.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Modern Vanilla CSS with Glassmorphism, Bootstrap 5.
- **Backend & Database**: Supabase (PostgreSQL, Realtime subscriptions, Auth), Firebase.
- **Mobile Container**: Capacitor Android Native Bridge.
- **Styling**: Curated HSL dark palette (`#0a0f1d`), smooth micro-transitions, and responsive grid layouts.

---

## 📦 Project Structure

```
PlaceAI-source/
├── android/                 # Capacitor Android native project & assets
├── backend/                 # Database, auth, and backend integrations
│   ├── auth-service.js      # Authentication and OAuth workflows
│   ├── db-service.js        # Supabase database queries and fallbacks
│   └── supabase-init.js     # Safe client initialization
├── css/                     # Global styles, color schemes, and app themes
│   ├── placeai-native-app.css # Mobile and app container styles
│   └── style.css            # Core responsive layout stylesheet
├── js/                      # Shared helper scripts and mobile navigation
├── docs/                    # Architectural documentation and release notes
├── dashboard.html           # Main candidate placement command hub
├── index.html               # Modernized platform landing page
├── code-practice.html       # DSA & Coding execution environment
├── resume-analyzer.html     # NLP Resume ATS scoring engine
└── mock-interview.html      # AI Interview simulation portal
```

---

## 📝 Recent Updates (v2.2.8)

- **Fixed User Dashboard Startup**: Resolved database query timeout fallbacks and restored instant candidate profile loading.
- **AI Command Hub**: Added glassmorphic quick-action launch cards and interactive roadmap progress indicators.
- **Landing Page Polish**: Elevated homepage modules with clean cards, dark-mode glass styling, and an interactive placement intelligence showcase.
- **APK Optimization**: Synchronized web runtime with native Android assets and eliminated UI clipping behind the navigation bar.

---

## 👤 Author & Maintainer

**Parth P Deshmukh**  
MCA Student, IMCC Pune  
GitHub: [@parthd45](https://github.com/parthd45)