# PlaceAI Technical Architecture & Design Document

## 1. Executive Overview
PlaceAI is structured as an ultra-low latency, mobile-first web and native hybrid platform. It provides students and campus recruiters with automated placement prep, code evaluation, ATS resume parsing, and mock interview readiness.

---

## 2. Authentication & Session Resilience Hierarchy
To prevent "blank dashboard" or infinite login redirects on slow mobile connections or offline states, PlaceAI utilizes a 4-tier resilient authentication hierarchy in `dashboard.html` and `backend/auth-service.js`:

```
   ┌──────────────────────────────────────────────┐
   │ 1. Active Supabase Auth Session (JWT / OAuth)│
   └──────────────────────┬───────────────────────┘
                          ▼ [Fallback if unavailable]
   ┌──────────────────────────────────────────────┐
   │ 2. Local Storage User ('placeai_current_user')│
   └──────────────────────┬───────────────────────┘
                          ▼ [Fallback if unavailable]
   ┌──────────────────────────────────────────────┐
   │ 3. Cached Phone Authentication ('placeai_phone_user')
   └──────────────────────┬───────────────────────┘
                          ▼ [Fallback if unavailable]
   ┌──────────────────────────────────────────────┐
   │ 4. Seamless Candidate Guest Session (Instant)│
   └──────────────────────────────────────────────┘
```

### Guarantees:
- Dashboard **never** aborts rendering due to missing network credentials.
- Profile cards always display fallback values (`Guest Candidate`, default avatar, sample skill progress) if database queries exceed the 2500ms safety timeout.
- User inputs and progress persist seamlessly across page refreshes.

---

## 3. Database Layer (`backend/db-service.js`)
- **Timeout Protection**: Every asynchronous Supabase call is wrapped in `withDbTimeout(promise, timeoutMs)` preventing hangs.
- **Dynamic Profile Linking**: User accounts created via OAuth or Phone OTP automatically associate with the corresponding record in `user_profiles`.
- **Graceful Error Handling**: Network errors, 404s, or schema discrepancies fail non-destructively, returning structured `{ success: false, error: ... }` objects.

---

## 4. Mobile & APK Runtime Architecture
- Built on **Capacitor 5.x** for Android.
- **Safe-Area Insets**: Uses CSS `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` to prevent content clipping by notches and gesture bars.
- **Unified Navigation**: Drawer navigation on landing pages, bottom tab bar on authenticated dashboard views.
- **Zero-Flicker Transitions**: Cached CSS stylesheets and pre-rendered DOM trees provide 60 FPS transitions on Android devices.
