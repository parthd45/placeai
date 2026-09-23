/**
 * PlaceAI - GitHub-Style Activity Contribution Tracker
 * Tracks student placement preparation activities, updates the green contribution heatmap,
 * calculates active streaks, and logs events.
 */

(function () {
  'use strict';

  class ActivityTracker {
    constructor() {
      this.STORAGE_KEY = 'placeai_activity_map';
      this.LOG_KEY = 'placeai_activity_log';
      this.init();
    }

    init() {
      // Initialize or seed activity map if empty
      let map = this.getStoredMap();
      if (Object.keys(map).length === 0) {
        map = this.seedInitialActivities();
        this.saveStoredMap(map);
      }
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
        const raw = localStorage.getItem(this.STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    saveStoredMap(map) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(map));
      } catch (e) {
        console.warn('Could not save activity map:', e);
      }
    }

    getStoredLogs() {
      try {
        const raw = localStorage.getItem(this.LOG_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    saveStoredLogs(logs) {
      try {
        localStorage.setItem(this.LOG_KEY, JSON.stringify(logs.slice(0, 50)));
      } catch (e) {
        console.warn('Could not save activity logs:', e);
      }
    }

    /**
     * Record an action (e.g. project added, skill added, mock interview, resume upload)
     * @param {string} actionType - 'skill', 'project', 'experience', 'education', 'resume', 'linkedin_sync', 'practice'
     * @param {number} points - Contribution points (1 to 5)
     * @param {string} description - Brief label
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

      console.log(`Activity recorded: ${actionType} (+${points} pts). Today's total: ${map[today]}`);
      return map[today];
    }

    /**
     * Compute activity level for color grading
     * 0: None, 1: 1-2, 2: 3-5, 3: 6-8, 4: 9+
     */
    getLevel(count) {
      if (!count || count <= 0) return 0;
      if (count <= 2) return 1;
      if (count <= 5) return 2;
      if (count <= 8) return 3;
      return 4;
    }

    /**
     * Calculate Current Streak, Longest Streak, and Total Contributions
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
        const k = d.toISOString().split('T')[0];
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
        const k = checkDate.toISOString().split('T')[0];
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

    /**
     * Seed realistic initial activities for candidates so the heatmap looks alive
     */
    seedInitialActivities() {
      const map = {};
      const now = new Date();
      // Generate some realistic past activity over the last 90 days
      for (let i = 0; i < 90; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const k = d.toISOString().split('T')[0];
        // 45% chance of activity on any day
        if (Math.random() < 0.48) {
          map[k] = Math.floor(Math.random() * 6) + 1;
        }
      }
      // Ensure today has at least 1-2 points
      const todayKey = this.getTodayKey();
      map[todayKey] = (map[todayKey] || 0) + 2;
      return map;
    }
  }

  // Export to window
  window.ActivityTracker = new ActivityTracker();
})();
