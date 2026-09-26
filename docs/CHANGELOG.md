# Changelog - PlaceAI

All notable changes to the PlaceAI platform are documented in this file.

## [2.2.8] - 2026-09-26

### Added
- **AI Placement Command Hub**: Added 4 primary quick-action cards (`Code Practice`, `Resume ATS`, `Mock Interview`, `Campus Network`) and interactive milestone pills on the candidate dashboard.
- **Candidate Welcome Hero Banner**: Added personalized greeting with dynamic placement readiness score, online status beacon, and quick shortcuts.
- **Placement Intelligence Preview**: Added interactive live preview panel to the homepage highlighting ATS scan score, test-case completion, and AI mock readiness.

### Fixed
- **Dashboard Load Failure**: Fixed fatal unclosed comment syntax error in `backend/db-service.js` that caused `ReferenceError` during `getStoredProfile()`.
- **Session Loader Resilience**: Replaced hard session redirects with a 4-tier fallback hierarchy to guarantee instantaneous rendering on web and mobile APK.
- **APK Layout & Navigation**: Removed duplicate bottom navigation bars, fixed header logo tags, and added safe-area bottom padding to prevent content clipping.
- **Landing Page Height & Menu**: Resolved mobile hero vertical blank void and enabled slide-down navigation drawer.

### Security & Performance
- Secured Supabase client initialization against missing global CDN scripts.
- Optimized asset synchronization workflow between web root and Android Capacitor distribution.

---

## [2.2.7] - 2026-09-25

### Added
- Silent background OTA updater integration for Android APK.
- Enhanced profile caching in local storage.

### Changed
- Improved WhatsApp-style single-pane community chat view.
