/**
 * Career Recommendations User Integration
 * Fetches logged-in user's skills and calculates personalized match percentages
 */

// Initialize with user data when page loads
async function initializeWithUserData() {
    try {
        console.log('Starting user data initialization...');

        // Wait for backend scripts to initialize (same as dashboard.html)
        if (!window.AuthService || !window.DBService) {
            console.log('Waiting for backend services to initialize...');
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // If still not available, use default data
        if (!window.AuthService || !window.DBService) {
            console.log('Auth services not available, using default data');
            if (typeof renderCareerCards === 'function') {
                renderCareerCards(currentRecommendations);
            }
            return;
        }

        // Get current session (exactly like dashboard.html does it)
        const sessionResult = await window.AuthService.getCurrentSession();
        console.log('Session result:', sessionResult);

        if (!sessionResult.success || !sessionResult.session) {
            console.log('User not logged in, using default data');
            if (typeof renderCareerCards === 'function') {
                renderCareerCards(currentRecommendations);
            }
            return;
        }

        // Get user from session (exactly like dashboard.html line 2062)
        currentUser = sessionResult.session.user;
        console.log('User authenticated:', currentUser.email);

        // Get user profile with skills (exactly like dashboard.html line 2065-2087)
        const profileResult = await window.DBService.getUserProfile(currentUser.id);
        console.log('Profile result:', profileResult);

        if (!profileResult.success || !profileResult.profile) {
            console.log('Could not get profile, using default data');
            if (typeof renderCareerCards === 'function') {
                renderCareerCards(currentRecommendations);
            }
            return;
        }

        userProfile = profileResult.profile;
        userSkills = userProfile.skills || [];

        console.log('User profile loaded:', userProfile);
        console.log('User skills:', userSkills);

        // If user has no skills, render default cards
        if (!userSkills || userSkills.length === 0) {
            console.log('No user skills found, keeping default matches');
            if (typeof renderCareerCards === 'function') {
                renderCareerCards(currentRecommendations);
            }
            return;
        }

        // Personalize the hero section with user name
        updateHeroSection();

        // Calculate personalized matches based on user skills
        calculatePersonalizedMatches();

        // Render the personalized cards
        if (typeof renderCareerCards === 'function') {
            renderCareerCards(currentRecommendations);
        }

        // Update AI insights with personalized data
        updateAIInsights();

        console.log('Personalization complete!');

    } catch (error) {
        console.error('Error loading user data:', error);
        if (typeof renderCareerCards === 'function') {
            renderCareerCards(currentRecommendations);
        }
    }
}

// Update hero section with user name
function updateHeroSection() {
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');

    if (userProfile && heroTitle) {
        const firstName = userProfile.first_name || 'there';
        heroTitle.textContent = 'Welcome back, ' + firstName + '!';
    }
    if (heroSubtitle && userSkills) {
        heroSubtitle.textContent = 'Based on your ' + userSkills.length + ' skills, we\'ve found ' +
            careerRecommendations.length + ' career opportunities for you. Match percentages are personalized to your profile!';
    }
}

// Calculate personalized match percentages based on user skills
function calculatePersonalizedMatches() {
    if (!userSkills || userSkills.length === 0) {
        console.log('No user skills to calculate matches');
        return;
    }

    console.log('Calculating matches with user skills:', userSkills);

    careerRecommendations.forEach(career => {
        // Find which of the career's required skills the user has (case-insensitive)
        const matchedSkills = career.skills.filter(skill =>
            userSkills.some(userSkill =>
                userSkill.toLowerCase().trim() === skill.toLowerCase().trim()
            )
        );

        // Update matched skills for this career
        career.matchedSkills = matchedSkills;

        // Calculate match percentage based purely on skill overlap
        // If you have 0 matching skills = 0%, all skills = 100%
        career.match = Math.round((matchedSkills.length / career.skills.length) * 100);

        // Update match level based on score
        if (career.match >= 70) {
            career.matchLevel = 'high';
        } else if (career.match >= 40) {
            career.matchLevel = 'medium';
        } else {
            career.matchLevel = 'low';
        }

        console.log(`${career.title}: ${matchedSkills.length}/${career.skills.length} skills matched = ${career.match}%`);
    });

    // Sort by match score (highest first)
    careerRecommendations.sort((a, b) => b.match - a.match);
    currentRecommendations = [...careerRecommendations];

    console.log('Personalized matches calculated!');
}

// Update AI insights with personalized data
function updateAIInsights() {
    const insightsGrid = document.querySelector('.insights-grid');
    if (!insightsGrid || !userProfile) return;

    const highMatchCount = careerRecommendations.filter(c => c.match >= 80).length;
    const allSkillsNeeded = new Set();
    careerRecommendations.forEach(c => c.skills.forEach(s => allSkillsNeeded.add(s)));
    const missingSkills = Array.from(allSkillsNeeded).filter(s =>
        !userSkills.some(us => us.toLowerCase() === s.toLowerCase())
    ).slice(0, 3);

    insightsGrid.innerHTML = `
    <div class="insight-card">
      <div class="insight-card-header">
        <i class="fas fa-chart-line insight-card-icon"></i>
        <h3 class="insight-card-title">Your Match Summary</h3>
      </div>
      <p class="insight-card-text">
        You have ${highMatchCount} high-match (80%+) career opportunities based on your ${userSkills.length} skills. Keep developing your expertise to unlock more!
      </p>
    </div>
    <div class="insight-card">
      <div class="insight-card-header">
        <i class="fas fa-graduation-cap insight-card-icon"></i>
        <h3 class="insight-card-title">Skills to Learn</h3>
      </div>
      <p class="insight-card-text">
        ${missingSkills.length > 0
            ? 'Learning ' + missingSkills.join(', ') + ' could significantly boost your match scores across multiple careers.'
            : 'Your skills cover most career requirements. Consider specializing further!'}
      </p>
    </div>
    <div class="insight-card">
      <div class="insight-card-header">
        <i class="fas fa-star insight-card-icon"></i>
        <h3 class="insight-card-title">Your Top Skills</h3>
      </div>
      <p class="insight-card-text">
        ${userSkills.length > 0
            ? 'Your skills: ' + userSkills.slice(0, 5).join(', ') + (userSkills.length > 5 ? ' and ' + (userSkills.length - 5) + ' more' : '')
            : 'Add skills to your profile to see personalized recommendations!'}
      </p>
    </div>
  `;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWithUserData);
} else {
    initializeWithUserData();
}
