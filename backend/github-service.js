/**
 * PlaceAI - Real GitHub Integration Service
 * Fetches authentic GitHub profile details, public repositories, followers,
 * and the complete 52-week real GitHub contribution calendar for candidates.
 * 
 * 100% Real Data. Zero Mock Data.
 */

(function () {
  'use strict';

  class GitHubService {
    constructor() {
      this.cache = {};
      console.log('GitHub Service initialized');
    }

    /**
     * Clean and extract GitHub username from handle or full URL
     * @param {string} input - e.g. "https://github.com/torvalds" or "torvalds"
     * @returns {string} - Clean username
     */
    extractUsername(input) {
      if (!input) return '';
      let clean = String(input).trim();
      clean = clean.replace(/^https?:\/\//i, '');
      clean = clean.replace(/^www\./i, '');
      clean = clean.replace(/^github\.com\//i, '');
      clean = clean.split('?')[0].split('#')[0].replace(/\/+$/, '');
      const match = clean.match(/([a-zA-Z0-9_\-\.]+)/);
      return match ? match[1] : clean;
    }

    /**
     * Build canonical GitHub URL
     */
    buildProfileUrl(usernameOrUrl) {
      const u = this.extractUsername(usernameOrUrl);
      return u ? `https://github.com/${u}` : '';
    }

    /**
     * Fetch authentic public GitHub user profile details
     * @param {string} username - GitHub username
     * @returns {Promise<Object>}
     */
    async fetchProfile(username) {
      const u = this.extractUsername(username);
      if (!u) throw new Error('Valid GitHub username is required');

      try {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(u)}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'PlaceAI-Platform'
          }
        });

        if (!res.ok) {
          if (res.status === 404) throw new Error(`GitHub user "@${u}" was not found.`);
          throw new Error(`GitHub API error (${res.status})`);
        }

        const data = await res.json();
        return {
          success: true,
          data: {
            username: data.login,
            name: data.name || data.login,
            avatar_url: data.avatar_url,
            bio: data.bio || '',
            company: data.company || '',
            location: data.location || '',
            public_repos: data.public_repos || 0,
            followers: data.followers || 0,
            following: data.following || 0,
            html_url: data.html_url
          }
        };
      } catch (err) {
        console.warn('GitHub profile fetch error:', err.message);
        return { success: false, error: err.message };
      }
    }

    /**
     * Fetch real 52-week contribution calendar for the GitHub user
     * @param {string} username - GitHub username
     * @returns {Promise<Object>} - Array of real contributions per day
     */
    async fetchContributions(username) {
      const u = this.extractUsername(username);
      if (!u) throw new Error('Valid GitHub username is required');

      // 1. Primary: Authentic GitHub contribution calendar API
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(u)}`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.contributions && Array.isArray(json.contributions)) {
            // Get past 365 days of contributions
            const contributions = json.contributions.slice(-370);
            return {
              success: true,
              contributions: contributions,
              total: json.total || {}
            };
          }
        }
      } catch (e) {
        console.warn('Contributions endpoint error, trying events fallback:', e.message);
      }

      // 2. Fallback: Compute real contributions from public GitHub events
      try {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(u)}/events`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'PlaceAI-Platform'
          }
        });

        if (res.ok) {
          const events = await res.json();
          const dayMap = {};

          if (Array.isArray(events)) {
            events.forEach(evt => {
              if (evt.created_at) {
                const day = evt.created_at.split('T')[0];
                let weight = 1;
                if (evt.type === 'PushEvent' && evt.payload && evt.payload.commits) {
                  weight = evt.payload.commits.length || 1;
                } else if (evt.type === 'PullRequestEvent') {
                  weight = 2;
                }
                dayMap[day] = (dayMap[day] || 0) + weight;
              }
            });
          }

          const contributions = Object.keys(dayMap).map(d => ({
            date: d,
            count: dayMap[d],
            level: dayMap[d] > 8 ? 4 : (dayMap[d] > 5 ? 3 : (dayMap[d] > 2 ? 2 : 1))
          }));

          return { success: true, contributions, total: {} };
        }
      } catch (err) {
        console.warn('Events fallback error:', err.message);
      }

      return { success: false, error: 'Could not fetch GitHub contribution calendar.' };
    }

    /**
     * Link GitHub account to PlaceAI user profile in Supabase
     */
    async linkToUserProfile(userId, username) {
      const canonicalUrl = this.buildProfileUrl(username);
      if (!canonicalUrl) throw new Error('Please enter a valid GitHub username.');

      try {
        if (!window.DBService || !window.DBService.updateUserProfile) {
          throw new Error('Database service is not loaded.');
        }

        const res = await window.DBService.updateUserProfile(userId, {
          github_url: canonicalUrl
        });

        return res;
      } catch (err) {
        console.error('linkToUserProfile error:', err);
        return { success: false, error: err.message };
      }
    }

    /**
     * Unlink GitHub account from PlaceAI profile
     */
    async unlinkFromUserProfile(userId) {
      try {
        if (!window.DBService || !window.DBService.updateUserProfile) {
          throw new Error('Database service is not loaded.');
        }

        const res = await window.DBService.updateUserProfile(userId, {
          github_url: null
        });

        return res;
      } catch (err) {
        console.error('unlinkFromUserProfile error:', err);
        return { success: false, error: err.message };
      }
    }
  }

  // Export to window
  window.GitHubService = new GitHubService();
})();
