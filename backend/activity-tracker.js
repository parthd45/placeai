/**
 * PlaceAI - Authentic GitHub-Style Activity Contribution Tracker
 * Tracks real student placement preparation activities, real Supabase profile data,
 * real milestones (skills, projects, experience, resume, education, LinkedIn sync),
 * calculates real active streaks, and renders real contribution green dots.
 * 
 * NOTE: 100% Real Data Driven. No fake random seeds.
 */

(function () {
  'use strict';

  class ActivityTracker {
    constructor() {
      this.userId = null;
      this.BASE_STORAGE_KEY = 'placeai_real_activity_map';
      this.BASE_LOG_KEY = 'placeai_real_activity_log';
      this.clearLegacyFakeData();
    }

    clearLegacyFakeData() {
      try {
        // Remove legacy fake generated map if it exists
        localStorage.removeItem('placeai_activity_map');
        localStorage.removeItem('placeai_activity_log');
      } catch (e) {
        // Ignore
      }
    }

    setUserId(uid) {
      if (!uid) return;
      this.userId = uid;
    }

    getStorageKey() {
      return this.userId ? `${this.BASE_STORAGE_KEY}_${this.userId}` : this.BASE_STORAGE_KEY;
    }

    getLogKey() {
      return this.userId ? `${this.BASE_LOG_KEY}_${this.userId}` : this.BASE_LOG_KEY;
    }

    getTodayKey() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    getStoredMap() {
      try {
        const raw = localStorage.getItem(this.getStorageKey());
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    saveStoredMap(map) {
      try {
        localStorage.setItem(this.getStorageKey(), JSON.stringify(map));
      } catch (e) {
        console.warn('Could not save activity map:', e);
      }
    }

    getStoredLogs() {
      try {
        const raw = localStorage.getItem(this.getLogKey());
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    saveStoredLogs(logs) {
      try {
        localStorage.setItem(this.getLogKey(), JSON.stringify(logs.slice(0, 50)));
      } catch (e) {
        console.warn('Could not save activity logs:', e);
      }
    }

    /**
     * Synchronize and compute real contributions from actual Supabase User Profile data.
     * Ensures all real skills, projects, experience, education, bio, and resume are credited.
     * @param {Object} profile - User profile object from Supabase
     * @param {Object} user - Supabase auth user object
     */
    syncFromRealProfile(profile, user) {
      if (!profile && !user) return;
      if (user && user.id) {
        this.setUserId(user.id);
      } else if (profile && profile.id) {
        this.setUserId(profile.id);
      }

      const map = this.getStoredMap();
      const today = this.getTodayKey();

      // Determine real registration / account creation date
      let accountDate = today;
      if (user && user.created_at) {
        accountDate = user.created_at.split('T')[0];
      } else if (profile && profile.created_at) {
        accountDate = profile.created_at.split('T')[0];
      }

      // Calculate real activity points from actual user data
      let basePoints = 0;

      // 1. Account registration milestone (on actual creation date)
      if (!map[accountDate]) {
        map[accountDate] = 2; // Real registration contribution
      }

      // 2. Real Profile completeness
      if (profile) {
        if (profile.bio && profile.bio.trim().length > 10) {
          basePoints += 2; // Profile summary
        }
        if (profile.mobile) {
          basePoints += 1; // Verified contact
        }
        if (profile.skills && Array.isArray(profile.skills)) {
          // 1 real point for every skill
          basePoints += profile.skills.length;
        }
        if (profile.experience && Array.isArray(profile.experience)) {
          // 3 real points per real work experience entry
          basePoints += profile.experience.length * 3;
        }
        if (profile.education && Array.isArray(profile.education)) {
          // 2 real points per real education entry
          basePoints += profile.education.length * 2;
        }
        if (profile.projects && Array.isArray(profile.projects)) {
          // 3 real points per real project
          basePoints += profile.projects.length * 3;
        }
        if (profile.certifications && Array.isArray(profile.certifications)) {
          // 2 real points per real certification
          basePoints += profile.certifications.length * 2;
        }
        if (profile.resume_url) {
          basePoints += 5; // Real uploaded resume
        }
        if (profile.linkedin_url) {
          basePoints += 4; // Real connected LinkedIn
        }
      }

      // Ensure today reflects real accumulated profile actions if map was empty
      if (basePoints > 0) {
        map[today] = Math.max(map[today] || 0, basePoints);
      }

      this.saveStoredMap(map);

      // Dispatch event to update the heatmap
      window.dispatchEvent(new CustomEvent('placeai:activity-recorded', {
        detail: { date: today, count: map[today] || 0 }
      }));
    }

    /**
     * Record a real action performed by the user
     * @param {string} actionType - 'skill', 'project', 'experience', 'education', 'resume', 'linkedin_sync'
     * @param {number} points - Contribution points
     * @param {string} description - Real description label
     */
    recordActivity(actionType, points = 1, description = '') {
      const today = this.getTodayKey();
      const map = this.getStoredMap();

      map[today] = (map[today] || 0) + points;
      this.saveStoredMap(map);

      // Add to recent activity log
      const logs = this.getStoredLogs();
      logs.unshift({
        type: actionType,
        points: points,
        description: description || actionType.replace('_', ' ').toUpperCase(),
        timestamp: new Date().toISOString()
      });
      this.saveStoredLogs(logs);

      // Dispatch event to re-render heatmap and stats live
      window.dispatchEvent(new CustomEvent('placeai:activity-recorded', {
        detail: { date: today, count: map[today], points, description }
      }));

      console.log(`[Real Activity Recorded] ${actionType} (+${points} pts). Today's total: ${map[today]}`);
      return map[today];
    }

    /**
     * Compute activity intensity level (0 to 4)
     * 0: 0 pts (dark / no activity)
     * 1: 1-2 pts (subtle emerald)
     * 2: 3-5 pts (medium emerald)
     * 3: 6-8 pts (vibrant green)
     * 4: 9+ pts (electric green)
     */
    getLevel(count) {
      if (!count || count <= 0) return 0;
      if (count <= 2) return 1;
      if (count <= 5) return 2;
      if (count <= 8) return 3;
      return 4;
    }

    /**
     * Calculate Real Current Streak, Longest Streak, and Total Contributions
     */
    getStats() {
      const map = this.getStoredMap();
      const today = new Date();
      let total = 0;
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      // Count total in last 365 days
      for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const k = `${y}-${m}-${day}`;
        const count = map[k] || 0;
        total += count;

        if (count > 0) {
          tempStreak++;
          if (tempStreak > longestStreak) longestStreak = tempStreak;
        } else {
          tempStreak = 0;
        }
      }

      // Compute current streak starting from today or yesterday
      let checkDate = new Date(today);
      const todayKey = this.getTodayKey();
      if (!map[todayKey]) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (true) {
        const y = checkDate.getFullYear();
        const m = String(checkDate.getMonth() + 1).padStart(2, '0');
        const day = String(checkDate.getDate()).padStart(2, '0');
        const k = `${y}-${m}-${day}`;
        if (map[k] && map[k] > 0) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      return {
        totalContributions: total,
        currentStreak: currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak)
      };
    }
  }

  // Export to window
  window.ActivityTracker = new ActivityTracker();
})();
