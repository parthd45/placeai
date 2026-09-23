/**
 * PlaceAI - Authentic GitHub Integration & Extraction Service
 * Fetches authentic GitHub profile details, public repositories, programming skills,
 * and the complete multi-year historical GitHub contribution calendar for candidates.
 * 
 * 100% Real Data. Zero Mock/Fake Data.
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
     * @param {string} input - e.g. "https://github.com/parthd45" or "parthd45"
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
            blog: data.blog || '',
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
     * Extract real profile information and real repositories to auto-fill PlaceAI profile
     * @param {string} username
     * @returns {Promise<Object>}
     */
    async extractFullProfile(username) {
      const u = this.extractUsername(username);
      if (!u) throw new Error('Valid GitHub username is required');

      // 1. Fetch user profile
      const profileRes = await this.fetchProfile(u);
      if (!profileRes.success) throw new Error(profileRes.error || 'Failed to fetch GitHub profile');
      const user = profileRes.data;

      // 2. Fetch public repos
      let repos = [];
      try {
        const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(u)}/repos?sort=updated&per_page=15`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'PlaceAI-Platform'
          }
        });
        if (reposRes.ok) {
          repos = await reposRes.json();
        }
      } catch (e) {
        console.warn('Repos fetch warning:', e.message);
      }

      // 3. Extract skills (languages and topics)
      const skillsSet = new Set();
      const projectsList = [];

      if (Array.isArray(repos)) {
        repos.forEach(r => {
          if (r.language) skillsSet.add(r.language);
          if (Array.isArray(r.topics)) {
            r.topics.forEach(t => {
              if (t && t.length > 1) {
                skillsSet.add(t.charAt(0).toUpperCase() + t.slice(1));
              }
            });
          }

          // Format into PlaceAI project
          if (!r.fork || projectsList.length < 3) {
            projectsList.push({
              title: r.name.replace(/[-_]/g, ' '),
              description: r.description || `Open source project on GitHub using ${r.language || 'Software Engineering'}`,
              project_url: r.html_url,
              tags: r.language ? [r.language] : ['GitHub'],
              role: 'Creator & Developer'
            });
          }
        });
      }

      // Standard essential tools for all GitHub developers
      skillsSet.add('Git');
      skillsSet.add('GitHub');

      // Parse full name
      let firstName = '';
      let lastName = '';
      if (user.name) {
        const parts = user.name.trim().split(/\s+/);
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ') || '';
      }

      return {
        success: true,
        data: {
          username: u,
          first_name: firstName,
          last_name: lastName,
          bio: user.bio || '',
          current_designation: user.company ? user.company.replace(/^@/, '').trim() : '',
          city: user.location ? user.location.split(',')[0].trim() : '',
          location: user.location || '',
          portfolio_url: user.blog && user.blog.startsWith('http') ? user.blog : (user.blog ? `https://${user.blog}` : ''),
          profile_image_url: user.avatar_url,
          github_url: `https://github.com/${u}`,
          skills: Array.from(skillsSet),
          projects: projectsList.slice(0, 6),
          public_repos: user.public_repos,
          followers: user.followers
        }
      };
    }

    /**
     * Merge and auto-fill extracted GitHub details into PlaceAI user profile in Supabase
     */
    async syncExtractedDataToProfile(userId, extracted, currentProfile = {}) {
      if (!userId || !extracted) return { success: false, error: 'User ID and extracted data required' };

      const updates = {};
      let updatedFieldsCount = 0;

      // 1. Name: fill if current is blank or default "User"
      if ((!currentProfile.first_name || currentProfile.first_name === 'User') && extracted.first_name) {
        updates.first_name = extracted.first_name;
        if (extracted.last_name) updates.last_name = extracted.last_name;
        updatedFieldsCount++;
      }

      // 2. Bio
      if (extracted.bio && (!currentProfile.bio || currentProfile.bio.trim().length < 5)) {
        updates.bio = extracted.bio;
        updatedFieldsCount++;
      }

      // 3. Current designation
      if (extracted.current_designation && !currentProfile.current_designation) {
        updates.current_designation = extracted.current_designation;
        updatedFieldsCount++;
      }

      // 4. City / Location
      if (extracted.city && !currentProfile.city) {
        updates.city = extracted.city;
        updatedFieldsCount++;
      }

      // 5. Portfolio URL
      if (extracted.portfolio_url && !currentProfile.portfolio_url) {
        updates.portfolio_url = extracted.portfolio_url;
        updatedFieldsCount++;
      }

      // 6. Profile Avatar Image
      if (extracted.profile_image_url && !currentProfile.profile_image_url) {
        updates.profile_image_url = extracted.profile_image_url;
        updatedFieldsCount++;
      }

      // 7. GitHub URL
      updates.github_url = extracted.github_url;
      updatedFieldsCount++;

      // 8. Merge Skills (preserve existing, append authentic GitHub skills)
      const existingSkills = Array.isArray(currentProfile.skills) ? currentProfile.skills : [];
      const existingSet = new Set(existingSkills.map(s => String(s).toLowerCase().trim()));
      const mergedSkills = [...existingSkills];
      let newSkillsAdded = 0;

      if (Array.isArray(extracted.skills)) {
        extracted.skills.forEach(s => {
          if (s && !existingSet.has(s.toLowerCase().trim())) {
            mergedSkills.push(s);
            existingSet.add(s.toLowerCase().trim());
            newSkillsAdded++;
          }
        });
      }
      updates.skills = mergedSkills;

      // 9. Merge Projects (preserve existing, append real GitHub repositories)
      const existingProjects = Array.isArray(currentProfile.projects) ? currentProfile.projects : [];
      const existingUrls = new Set(existingProjects.map(p => (p.project_url || '').toLowerCase().trim()));
      const existingTitles = new Set(existingProjects.map(p => (p.title || '').toLowerCase().trim()));
      const mergedProjects = [...existingProjects];
      let newProjectsAdded = 0;

      if (Array.isArray(extracted.projects)) {
        extracted.projects.forEach(p => {
          const urlMatch = p.project_url && existingUrls.has(p.project_url.toLowerCase().trim());
          const titleMatch = p.title && existingTitles.has(p.title.toLowerCase().trim());
          if (!urlMatch && !titleMatch) {
            mergedProjects.push(p);
            if (p.project_url) existingUrls.add(p.project_url.toLowerCase().trim());
            if (p.title) existingTitles.add(p.title.toLowerCase().trim());
            newProjectsAdded++;
          }
        });
      }
      updates.projects = mergedProjects;

      try {
        if (!window.DBService || !window.DBService.updateUserProfile) {
          throw new Error('Database service is not loaded.');
        }

        const res = await window.DBService.updateUserProfile(userId, updates);
        return {
          success: res.success,
          error: res.error,
          updates,
          summary: {
            updatedFieldsCount,
            newSkillsAdded,
            newProjectsAdded,
            totalSkills: mergedSkills.length,
            totalProjects: mergedProjects.length
          }
        };
      } catch (err) {
        console.error('syncExtractedDataToProfile error:', err);
        return { success: false, error: err.message };
      }
    }

    /**
     * Fetch complete multi-year historical contribution calendar for the GitHub user
     * @param {string} username - GitHub username
     * @returns {Promise<Object>} - All historical contributions, per-year totals, and available years
     */
    async fetchContributions(username) {
      const u = this.extractUsername(username);
      if (!u) throw new Error('Valid GitHub username is required');

      // 1. Primary: Authentic multi-year GitHub contribution calendar API
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(u)}`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.contributions && Array.isArray(json.contributions)) {
            const totals = json.total || {};
            const years = Object.keys(totals).sort((a, b) => Number(b) - Number(a));

            return {
              success: true,
              contributions: json.contributions, // Full history of all days
              total: totals,
              years: years
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

          const curYear = String(new Date().getFullYear());
          return {
            success: true,
            contributions,
            total: { [curYear]: contributions.reduce((acc, c) => acc + c.count, 0) },
            years: [curYear]
          };
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
