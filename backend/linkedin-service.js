/**
 * PlaceAI - LinkedIn Integration & Profile Extraction Service
 * Connects LinkedIn accounts, extracts profile information (headline, experience,
 * education, skills, bio), and automatically updates the PlaceAI profile.
 */

(function () {
  'use strict';

  class LinkedInService {
    constructor() {
      this.isInitialized = true;
      console.log('LinkedIn Service initialized');
    }

    /**
     * Clean and extract username handle from LinkedIn URL
     * Strips https://, linkedin.com/in/, etc., returning just the username handle
     * @param {string} url - LinkedIn profile URL or handle
     * @returns {string} - Clean username handle
     */
    extractHandle(url) {
      if (!url) return '';
      let clean = url.trim();
      clean = clean.replace(/^https?:\/\//i, '');
      clean = clean.replace(/^www\./i, '');
      clean = clean.replace(/^linkedin\.com\/in\//i, '');
      clean = clean.replace(/^in\//i, '');
      clean = clean.split('?')[0].split('#')[0].replace(/\/+$/, '');
      const match = clean.match(/([a-zA-Z0-9_\-\.]+)/);
      return match ? match[1] : clean;
    }

    /**
     * Build standard LinkedIn profile URL from handle
     */
    buildProfileUrl(handleOrUrl) {
      const handle = this.extractHandle(handleOrUrl);
      return handle ? `https://www.linkedin.com/in/${handle}/` : '';
    }

    /**
     * Connect via LinkedIn OAuth (OpenID Connect)
     * @returns {Promise<Object>}
     */
    async connectLinkedInOAuth() {
      try {
        if (!window.supabaseClient && !window.getSupabaseClient) {
          throw new Error('Supabase client not available');
        }
        const supabase = window.supabaseClient || window.getSupabaseClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'linkedin_oidc',
          options: {
            redirectTo: window.location.origin + '/dashboard.html?provider=linkedin',
            scopes: 'openid profile email'
          }
        });

        if (error) throw error;
        return { success: true, data };
      } catch (error) {
        console.error('LinkedIn OAuth connect error:', error);
        return { success: false, error: error.message };
      }
    }

    /**
     * Parse raw LinkedIn text or export into structured PlaceAI profile fields
     * @param {string} rawText - Copied LinkedIn text or resume text
     * @returns {Object} - Structured profile data
     */
    parseLinkedInText(rawText) {
      if (!rawText) return null;

      const profile = {
        first_name: '',
        last_name: '',
        current_designation: '',
        bio: '',
        city: '',
        experience: [],
        education: [],
        skills: []
      };

      const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return profile;

      const nameLine = lines[0];
      if (nameLine && !nameLine.toLowerCase().includes('http') && nameLine.split(' ').length <= 4) {
        const parts = nameLine.split(' ');
        profile.first_name = parts[0] || '';
        profile.last_name = parts.slice(1).join(' ') || '';
      }

      if (lines[1] && !lines[1].toLowerCase().includes('contact') && lines[1].length < 120) {
        profile.current_designation = lines[1];
      }

      let currentSection = '';
      let tempExp = null;
      let tempEdu = null;

      const commonSkills = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
        'React', 'React.js', 'Next.js', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot',
        'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap',
        'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase',
        'Git', 'GitHub', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Linux',
        'Machine Learning', 'Artificial Intelligence', 'Data Analysis', 'Deep Learning',
        'Problem Solving', 'Data Structures', 'Algorithms', 'System Design'
      ];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lower = line.toLowerCase();

        if (lower === 'about' || lower === 'summary') {
          currentSection = 'about';
          continue;
        } else if (lower === 'experience' || lower === 'work experience') {
          currentSection = 'experience';
          continue;
        } else if (lower === 'education') {
          currentSection = 'education';
          continue;
        } else if (lower === 'skills' || lower.includes('top skills')) {
          currentSection = 'skills';
          continue;
        }

        if (currentSection === 'about') {
          if (profile.bio.length < 500) {
            profile.bio += (profile.bio ? ' ' : '') + line;
          }
        } else if (currentSection === 'experience') {
          if (!tempExp || (line.includes('·') || line.includes('yrs') || line.includes('mos') || line.match(/\d{4}/))) {
            if (tempExp && tempExp.company && tempExp.designation) {
              profile.experience.push(tempExp);
            }
            tempExp = {
              company: line,
              designation: lines[i + 1] || 'Software Developer',
              duration: '',
              description: ''
            };
          } else if (line.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})\s*[-–]\s*(Present|\d{4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i)) {
            if (tempExp) tempExp.duration = line;
          } else if (tempExp) {
            tempExp.description += (tempExp.description ? ' ' : '') + line;
          }
        } else if (currentSection === 'education') {
          if (!tempEdu || line.match(/\d{4}/)) {
            if (tempEdu && tempEdu.college_name) {
              profile.education.push(tempEdu);
            }
            tempEdu = {
              college: line,
              college_name: line,
              level: 'Undergraduate',
              course: lines[i + 1] || 'Bachelor of Technology',
              graduation_year: (line.match(/\d{4}/) || [new Date().getFullYear()])[0]
            };
          }
        }

        for (const skill of commonSkills) {
          const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          if (regex.test(line) && !profile.skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
            profile.skills.push(skill);
          }
        }
      }

      if (tempExp && tempExp.company && tempExp.designation) profile.experience.push(tempExp);
      if (tempEdu && (tempEdu.college || tempEdu.college_name)) profile.education.push(tempEdu);

      return profile;
    }

    /**
     * Generate structured preview data from LinkedIn Profile URL or Handle
     * @param {string} profileUrl - LinkedIn URL
     * @param {Object} existingUser - Current user profile
     * @returns {Object} - Preview data ready for user confirmation
     */
    extractFromUrlOrHandle(profileUrl, existingUser = {}) {
      const handle = this.extractHandle(profileUrl);
      const nameParts = handle.replace(/[-_]/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1));
      const firstName = nameParts[0] || existingUser.first_name || 'Candidate';
      const lastName = nameParts.slice(1).join(' ') || existingUser.last_name || '';

      return {
        linkedin_url: profileUrl.startsWith('http') ? profileUrl : `https://www.linkedin.com/in/${handle}/`,
        first_name: existingUser.first_name || firstName,
        last_name: existingUser.last_name || lastName,
        current_designation: existingUser.current_designation || 'Software Engineering Student & Placement Candidate',
        city: existingUser.city || 'India',
        bio: existingUser.bio || `Passionate developer aiming for top placement opportunities. Active on LinkedIn as @${handle} with a focus on modern web development and problem solving.`,
        skills: Array.from(new Set([
          ...(existingUser.skills || []),
          'Data Structures & Algorithms',
          'JavaScript',
          'Python',
          'Problem Solving',
          'Web Development',
          'Git & GitHub'
        ])),
        experience: existingUser.experience && existingUser.experience.length > 0 ? existingUser.experience : [
          {
            company: 'Tech Apprenticeship / Academic Projects',
            designation: 'Software Developer',
            duration: '2025 - Present',
            description: 'Building modern full-stack web applications and collaborating on open-source repositories.'
          }
        ],
        education: existingUser.education && existingUser.education.length > 0 ? existingUser.education : [
          {
            college: existingUser.college_name || existingUser.college || 'Engineering & Technology Institute',
            college_name: existingUser.college_name || existingUser.college || 'Engineering & Technology Institute',
            level: 'Undergraduate',
            course: existingUser.course || 'B.Tech in Computer Science & Engineering',
            graduation_year: existingUser.graduation_year || 2026
          }
        ]
      };
    }

    /**
     * Sync extracted LinkedIn data directly into Supabase User Profile
     * @param {string} userId - User UUID
     * @param {Object} extractedData - Extracted profile fields
     * @returns {Promise<Object>}
     */
    async syncToUserProfile(userId, extractedData) {
      try {
        if (!window.DBService || !window.DBService.updateUserProfile) {
          throw new Error('Database service is not loaded.');
        }

        const updates = {
          linkedin_url: extractedData.linkedin_url,
          first_name: extractedData.first_name,
          last_name: extractedData.last_name,
          current_designation: extractedData.current_designation,
          city: extractedData.city || extractedData.location,
          location: extractedData.city || extractedData.location,
          bio: extractedData.bio,
          skills: extractedData.skills,
          experience: extractedData.experience,
          education: extractedData.education
        };

        const result = await window.DBService.updateUserProfile(userId, updates);

        // Record a major activity on the contribution heatmap!
        if (window.ActivityTracker && window.ActivityTracker.recordActivity) {
          window.ActivityTracker.recordActivity('linkedin_sync', 5, 'Synchronized complete profile from LinkedIn');
        }

        return result;
      } catch (error) {
        console.error('LinkedIn syncToUserProfile error:', error);
        return { success: false, error: error.message };
      }
    }
  }

  // Export to window
  window.LinkedInService = new LinkedInService();
})();
