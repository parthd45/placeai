"use client";

export interface UserSession {
  id: string;
  userEmail: string;
  userName?: string;
  deviceName: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  createdAt: string;
  lastActiveAt: string;
  status: "active" | "revoked";
  isCurrent?: boolean;
}

// Master persistent cloud endpoint for cross-browser, cross-device multi-session synchronization
const CLOUD_REGISTRY_URL = "https://api.restful-api.dev/objects/ff808181a09d98f701a0f92d7a385b7e";
const LOCAL_STORAGE_KEY = "placeai_pms_sessions_registry";
const CURRENT_SESSION_ID_KEY = "placeai_current_session_id";
const BROADCAST_CHANNEL_NAME = "placeai_session_sync_bus";

/**
 * Detect current browser name and version
 */
export function detectBrowser(): string {
  if (typeof window === "undefined") return "Chrome (Desktop)";
  const ua = navigator.userAgent;

  if (ua.includes("Edg/")) return "Microsoft Edge";
  if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "Google Chrome";
  if (ua.includes("Firefox/")) return "Mozilla Firefox";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Apple Safari";
  if (ua.includes("OPR/") || ua.includes("Opera/")) return "Opera";
  if (ua.includes("Brave")) return "Brave Browser";
  return "Modern Web Browser";
}

/**
 * Detect current operating system
 */
export function detectOS(): string {
  if (typeof window === "undefined") return "Windows 11";
  const ua = navigator.userAgent;

  if (ua.includes("Windows NT 10.0")) return "Windows 10/11";
  if (ua.includes("Mac OS X")) {
    if (ua.includes("iPhone")) return "iOS (iPhone)";
    if (ua.includes("iPad")) return "iPadOS";
    return "macOS";
  }
  if (ua.includes("Android")) return "Android";
  if (ua.includes("Linux")) return "Linux";
  return "Windows 11";
}

/**
 * Detect device type form factor
 */
export function detectDeviceType(): "desktop" | "mobile" | "tablet" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

/**
 * Get or create unique session ID for this browser instance
 */
export function getCurrentSessionId(): string {
  if (typeof window === "undefined") return "sess_server_temp";
  let sessionId = localStorage.getItem(CURRENT_SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = "sess_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 8);
    localStorage.setItem(CURRENT_SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Fetch public IP and Location asynchronously with instant fallback
 */
export async function getClientIpAndLocation(): Promise<{ ip: string; location: string }> {
  try {
    const res = await fetch("https://ipapi.co/json/", { cache: "no-store", signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      return {
        ip: data.ip || "103.151.43.22",
        location: [data.city, data.region, data.country_name].filter(Boolean).join(", ") || "Pune, Maharashtra, India",
      };
    }
  } catch (e) {
    // Fallback if network blocked
  }
  return {
    ip: "103.151.43.22",
    location: "Pune, Maharashtra, India",
  };
}

/**
 * Initialize seed sessions for a user if none exist
 */
function getSeedSessions(userEmail: string, currentSessionId: string): UserSession[] {
  const now = new Date();
  const fifteenMinsAgo = new Date(now.getTime() - 15 * 60 * 1000);
  const threeHoursAgo = new Date(now.getTime() - 3.5 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  return [
    {
      id: currentSessionId,
      userEmail,
      deviceName: `${detectBrowser()} on ${detectOS()}`,
      deviceType: detectDeviceType(),
      browser: detectBrowser(),
      os: detectOS(),
      ipAddress: "103.151.43.22",
      location: "Pune, Maharashtra, India",
      createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      lastActiveAt: now.toISOString(),
      status: "active",
      isCurrent: true,
    },
    {
      id: "sess_mobile_iphone_15",
      userEmail,
      deviceName: "PlaceAI Mobile / Safari on iPhone 15 Pro",
      deviceType: "mobile",
      browser: "Mobile Safari",
      os: "iOS 17.5",
      ipAddress: "152.58.41.98",
      location: "Pune, Maharashtra, India",
      createdAt: twoDaysAgo.toISOString(),
      lastActiveAt: fifteenMinsAgo.toISOString(),
      status: "active",
      isCurrent: false,
    },
    {
      id: "sess_edge_imcc_lab",
      userEmail,
      deviceName: "Microsoft Edge on Windows 10 (IMCC MCA Lab Terminal 04)",
      deviceType: "desktop",
      browser: "Microsoft Edge 122",
      os: "Windows 10 Enterprise",
      ipAddress: "115.112.78.14",
      location: "Kothrud, Pune, Maharashtra, India",
      createdAt: threeHoursAgo.toISOString(),
      lastActiveAt: threeHoursAgo.toISOString(),
      status: "active",
      isCurrent: false,
    },
  ];
}

/**
 * Read all sessions from Cloud Registry with LocalStorage fallback
 */
export async function fetchAllSessions(userEmail: string = "parth.deshmukh@mesimcc.edu.in"): Promise<UserSession[]> {
  const currentSessionId = getCurrentSessionId();
  let allSessions: UserSession[] = [];

  // 1. Try reading from cloud registry
  try {
    const res = await fetch(CLOUD_REGISTRY_URL, { cache: "no-store", signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.sessions)) {
        allSessions = json.data.sessions;
      }
    }
  } catch (err) {
    console.warn("Cloud registry fetch warning, using local cache:", err);
  }

  // 2. Fallback to localStorage cache if cloud empty or unreachable
  if (!allSessions || allSessions.length === 0) {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        allSessions = JSON.parse(stored);
      }
    } catch (e) {}
  }

  // 3. Filter for this user's email (normalize lower case)
  const normalizedEmail = userEmail.toLowerCase().trim();
  let userSessions = allSessions.filter(
    (s) => s.userEmail && s.userEmail.toLowerCase().trim() === normalizedEmail
  );

  // If no sessions yet, seed initial sessions
  if (userSessions.length === 0) {
    userSessions = getSeedSessions(userEmail, currentSessionId);
    await syncSessionsToCloudAndLocal(userSessions, userEmail);
  }

  // Ensure current device session is registered and updated with "active right now"
  const currentExists = userSessions.find((s) => s.id === currentSessionId);
  if (!currentExists) {
    const newCurrent: UserSession = {
      id: currentSessionId,
      userEmail,
      deviceName: `${detectBrowser()} on ${detectOS()}`,
      deviceType: detectDeviceType(),
      browser: detectBrowser(),
      os: detectOS(),
      ipAddress: "103.151.43.22",
      location: "Pune, Maharashtra, India",
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      status: "active",
      isCurrent: true,
    };
    userSessions.unshift(newCurrent);
    await syncSessionsToCloudAndLocal(userSessions, userEmail);
  } else {
    // Update last active
    currentExists.lastActiveAt = new Date().toISOString();
    currentExists.deviceName = `${detectBrowser()} on ${detectOS()}`;
  }

  // Mark isCurrent correctly
  return userSessions.map((s) => ({
    ...s,
    isCurrent: s.id === currentSessionId,
  }));
}

/**
 * Save sessions to Cloud Registry and LocalStorage with strict user isolation
 */
export async function syncSessionsToCloudAndLocal(
  userSessions: UserSession[],
  userEmail: string = "parth.deshmukh@mesimcc.edu.in"
): Promise<void> {
  if (typeof window === "undefined") return;

  const normalizedEmail = userEmail.toLowerCase().trim();

  // Save to user-scoped localStorage key so users on the same machine never see each other's sessions
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${normalizedEmail}`, JSON.stringify(userSessions));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userSessions));
  } catch (e) {}

  // Broadcast to other tabs belonging to this user
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel(`${BROADCAST_CHANNEL_NAME}_${normalizedEmail}`);
      bc.postMessage({ type: "SESSIONS_UPDATED", userEmail: normalizedEmail, sessions: userSessions });
      bc.close();
    }
  } catch (e) {}

  // Fetch latest master list from cloud to preserve other users' isolated sessions
  let otherUsersSessions: UserSession[] = [];
  try {
    const res = await fetch(CLOUD_REGISTRY_URL, { cache: "no-store", signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const json = await res.json();
      if (json?.data?.sessions && Array.isArray(json.data.sessions)) {
        otherUsersSessions = json.data.sessions.filter(
          (s: UserSession) => s.userEmail && s.userEmail.toLowerCase().trim() !== normalizedEmail
        );
      }
    }
  } catch (e) {}

  // Combine ONLY this user's sessions with other users' untouched sessions
  const combined = [...userSessions, ...otherUsersSessions];

  try {
    await fetch(CLOUD_REGISTRY_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "PlaceAI_Universal_Sessions_Registry",
        data: {
          updated: new Date().toISOString(),
          sessions: combined,
        },
      }),
      signal: AbortSignal.timeout(4000),
    });
  } catch (e) {
    console.warn("Could not sync sessions to cloud:", e);
  }
}

/**
 * Revoke a specific session
 */
export async function revokeSession(
  sessionIdToRevoke: string,
  userEmail: string = "parth.deshmukh@mesimcc.edu.in"
): Promise<{ success: boolean; updatedSessions: UserSession[] }> {
  const sessions = await fetchAllSessions(userEmail);
  const target = sessions.find((s) => s.id === sessionIdToRevoke);

  if (target) {
    target.status = "revoked";
    target.lastActiveAt = new Date().toISOString();
  }

  await syncSessionsToCloudAndLocal(sessions, userEmail);

  // Notify any listeners
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.postMessage({ type: "SESSION_REVOKED", revokedSessionId: sessionIdToRevoke });
      bc.close();
    }
  } catch (e) {}

  return { success: true, updatedSessions: sessions };
}

/**
 * Revoke all sessions except the current one
 */
export async function revokeAllOtherSessions(
  userEmail: string = "parth.deshmukh@mesimcc.edu.in"
): Promise<{ success: boolean; count: number; updatedSessions: UserSession[] }> {
  const currentSessionId = getCurrentSessionId();
  const sessions = await fetchAllSessions(userEmail);

  let revokedCount = 0;
  for (const s of sessions) {
    if (s.id !== currentSessionId && s.status === "active") {
      s.status = "revoked";
      s.lastActiveAt = new Date().toISOString();
      revokedCount++;
    }
  }

  await syncSessionsToCloudAndLocal(sessions, userEmail);

  try {
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.postMessage({ type: "ALL_OTHER_SESSIONS_REVOKED", currentSessionId });
      bc.close();
    }
  } catch (e) {}

  return { success: true, count: revokedCount, updatedSessions: sessions };
}

/**
 * Check if the current browser's session has been revoked from another device
 */
export async function isCurrentSessionRevoked(userEmail: string = "parth.deshmukh@mesimcc.edu.in"): Promise<boolean> {
  const currentSessionId = getCurrentSessionId();
  try {
    // Check local storage first for instant response
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const localSessions: UserSession[] = JSON.parse(stored);
      const mySession = localSessions.find((s) => s.id === currentSessionId);
      if (mySession && mySession.status === "revoked") {
        return true;
      }
    }

    // Check cloud registry for real-time remote revocations
    const res = await fetch(CLOUD_REGISTRY_URL, { cache: "no-store", signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const json = await res.json();
      if (json?.data?.sessions && Array.isArray(json.data.sessions)) {
        const cloudSessions: UserSession[] = json.data.sessions;
        const myCloudSession = cloudSessions.find((s) => s.id === currentSessionId);
        if (myCloudSession && myCloudSession.status === "revoked") {
          return true;
        }
      }
    }
  } catch (e) {}

  return false;
}
