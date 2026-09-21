/**
 * Learning Paths - User Integration and Path Generation
 * Fetches user skills and generates personalized learning paths
 */

// Global variables
let currentUser = null;
let userProfile = null;
let userSkills = [];
let allLearningPaths = [];
let filteredPaths = [];
let savedPaths = new Set();

// Learning path templates based on skill gaps with real course URLs
const learningPathTemplates = [
  {
    id: 'web-fullstack',
    title: 'Full-Stack Web Development',
    description: 'Master both frontend and backend development to become a versatile full-stack developer.',
    icon: 'fa-code',
    category: 'technical',
    difficulty: 'intermediate',
    duration: 40,
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML', 'CSS'],
    outcomes: [
      'Build complete web applications from scratch',
      'Create responsive and dynamic user interfaces',
      'Develop RESTful APIs and backend services',
      'Deploy applications to cloud platforms'
    ],
    courses: [
      { name: 'Full Stack Web Development Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=nu_pCVPKzTk', duration: '12h', free: true },
      { name: 'React JS Full Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=RVFAyFWO4go', duration: '10h', free: true },
      { name: 'Node.js & Express Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', duration: '8h', free: true },
      { name: 'JavaScript Algorithms and Data Structures', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', duration: '10h', free: true }
    ]
  },
  {
    id: 'python-data',
    title: 'Python for Data Science',
    description: 'Learn Python programming and essential data science libraries for analytics and ML.',
    icon: 'fa-chart-bar',
    category: 'technical',
    difficulty: 'beginner',
    duration: 35,
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'SQL'],
    outcomes: [
      'Analyze and visualize data effectively',
      'Clean and preprocess datasets for analysis',
      'Create insightful data visualizations',
      'Write SQL queries for data extraction'
    ],
    courses: [
      { name: 'Python for Data Science Full Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI', duration: '15h', free: true },
      { name: 'Data Analysis with Python', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/', duration: '10h', free: true },
      { name: 'Pandas & NumPy Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=vmEHCJofslg', duration: '8h', free: true },
      { name: 'SQL Tutorial for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', duration: '6h', free: true }
    ]
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning Fundamentals',
    description: 'Build a strong foundation in ML algorithms, model training, and evaluation techniques.',
    icon: 'fa-brain',
    category: 'technical',
    difficulty: 'advanced',
    duration: 50,
    skills: ['Machine Learning', 'TensorFlow', 'Scikit-learn', 'Python', 'Deep Learning'],
    outcomes: [
      'Understand core ML algorithms and when to use them',
      'Build and train neural networks',
      'Evaluate and improve model performance',
      'Deploy ML models to production'
    ],
    courses: [
      { name: 'Machine Learning Full Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=NWONeJKn6kc', duration: '20h', free: true },
      { name: 'Deep Learning Crash Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=VyWAvY2CF9c', duration: '15h', free: true },
      { name: 'TensorFlow Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=tPYj3fFJGjk', duration: '10h', free: true },
      { name: 'Machine Learning by Andrew Ng', platform: 'Coursera', url: 'https://www.coursera.org/learn/machine-learning', duration: '20h', free: true }
    ]
  },
  {
    id: 'cloud-aws',
    title: 'AWS Cloud Practitioner',
    description: 'Get started with cloud computing and prepare for AWS certification.',
    icon: 'fa-cloud',
    category: 'technical',
    difficulty: 'beginner',
    duration: 20,
    skills: ['AWS', 'Cloud Computing', 'EC2', 'S3', 'Lambda'],
    outcomes: [
      'Understand AWS core services and architecture',
      'Deploy applications on AWS infrastructure',
      'Implement basic security best practices',
      'Prepare for AWS certification exam'
    ],
    courses: [
      { name: 'AWS Full Course for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=ulprqHHWlng', duration: '10h', free: true },
      { name: 'AWS Cloud Practitioner Essentials', platform: 'AWS', url: 'https://aws.amazon.com/training/learn-about/cloud-practitioner/', duration: '6h', free: true },
      { name: 'Cloud Computing Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=M988_fsOSWo', duration: '6h', free: true },
      { name: 'AWS Solutions Architect', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=Ia-UEYYR44s', duration: '8h', free: true }
    ]
  },
  {
    id: 'devops',
    title: 'DevOps & CI/CD',
    description: 'Learn modern DevOps practices including Docker, Kubernetes, and CI/CD pipelines.',
    icon: 'fa-infinity',
    category: 'technical',
    difficulty: 'intermediate',
    duration: 30,
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Git'],
    outcomes: [
      'Containerize applications with Docker',
      'Orchestrate containers with Kubernetes',
      'Build automated CI/CD pipelines',
      'Implement infrastructure as code'
    ],
    courses: [
      { name: 'Docker Tutorial for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=pTFZFxd4hOI', duration: '8h', free: true },
      { name: 'Kubernetes Full Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=X48VuDVv0do', duration: '10h', free: true },
      { name: 'DevOps CI/CD Pipeline Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=OPwU3UWCxhw', duration: '6h', free: true },
      { name: 'GitHub Actions Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=R8_veQiYBjI', duration: '4h', free: true },
      { name: 'Jenkins Complete Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=FX322RVNGj4', duration: '6h', free: true }
    ]
  },
  {
    id: 'mobile-react-native',
    title: 'Mobile App Development',
    description: 'Build cross-platform mobile apps using React Native for iOS and Android.',
    icon: 'fa-mobile-alt',
    category: 'technical',
    difficulty: 'intermediate',
    duration: 25,
    skills: ['React Native', 'JavaScript', 'Mobile Development', 'Redux'],
    outcomes: [
      'Build native mobile apps for iOS and Android',
      'Implement responsive mobile UI designs',
      'Handle state management in mobile apps',
      'Publish apps to App Store and Play Store'
    ],
    courses: [
      { name: 'React Native Full Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc', duration: '12h', free: true },
      { name: 'Mobile App Development Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=fis26HvvDII', duration: '8h', free: true },
      { name: 'Build Your First Mobile App', platform: 'Codecademy', url: 'https://www.codecademy.com/catalog/language/javascript', duration: '5h', free: true },
      { name: 'Flutter Complete Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=VPvVD8t02U8', duration: '10h', free: true }
    ]
  },
  {
    id: 'communication',
    title: 'Professional Communication',
    description: 'Enhance your verbal and written communication skills for workplace success.',
    icon: 'fa-comments',
    category: 'soft-skills',
    difficulty: 'beginner',
    duration: 15,
    skills: ['Communication', 'Presentation', 'Email Writing', 'Public Speaking'],
    outcomes: [
      'Deliver compelling presentations',
      'Write professional emails and documents',
      'Communicate effectively in meetings',
      'Build stronger professional relationships'
    ],
    courses: [
      { name: 'Communication Skills Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=JJUrcRaVEhs', duration: '6h', free: true },
      { name: 'Public Speaking Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=AykYRO5d_lI', duration: '4h', free: true },
      { name: 'Business Writing Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=lL1lKaJmOkU', duration: '3h', free: true },
      { name: 'Effective Presentation Skills', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=N0JFQUSlUY4', duration: '4h', free: true }
    ]
  },
  {
    id: 'leadership',
    title: 'Leadership & Management',
    description: 'Develop leadership qualities and learn to manage teams effectively.',
    icon: 'fa-users-cog',
    category: 'soft-skills',
    difficulty: 'intermediate',
    duration: 20,
    skills: ['Leadership', 'Team Management', 'Decision Making', 'Conflict Resolution'],
    outcomes: [
      'Lead and motivate teams effectively',
      'Make data-driven decisions',
      'Resolve conflicts professionally',
      'Build high-performing teams'
    ],
    courses: [
      { name: 'Leadership Skills Training', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=7SSdbdJgJS0', duration: '8h', free: true },
      { name: 'Team Management Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=F6Qo8IDsVNg', duration: '6h', free: true },
      { name: 'Emotional Intelligence Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=Y7m9eNoB3NU', duration: '4h', free: true },
      { name: 'Strategic Leadership Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=lQ6gN6mXdEU', duration: '5h', free: true }
    ]
  },
  {
    id: 'agile-scrum',
    title: 'Agile & Scrum Methodology',
    description: 'Master agile practices and Scrum framework for modern software development.',
    icon: 'fa-tasks',
    category: 'domain',
    difficulty: 'beginner',
    duration: 12,
    skills: ['Agile', 'Scrum', 'Project Management', 'Sprint Planning'],
    outcomes: [
      'Understand Agile principles and values',
      'Run effective sprint ceremonies',
      'Manage product backlogs',
      'Prepare for Scrum certification'
    ],
    courses: [
      { name: 'Agile & Scrum Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=502ILHjX9EE', duration: '6h', free: true },
      { name: 'Scrum Master Training', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=9TycLR0TqFA', duration: '4h', free: true },
      { name: 'Introduction to Agile Development', platform: 'edX', url: 'https://www.edx.org/search?q=agile', duration: '4h', free: true },
      { name: 'Kanban Methodology', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=jf0tlbt9lx0', duration: '3h', free: true }
    ]
  },
  {
    id: 'database',
    title: 'Database Management',
    description: 'Master SQL and NoSQL databases for efficient data storage and retrieval.',
    icon: 'fa-database',
    category: 'technical',
    difficulty: 'beginner',
    duration: 25,
    skills: ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Database Design'],
    outcomes: [
      'Write complex SQL queries',
      'Design efficient database schemas',
      'Optimize database performance',
      'Work with both SQL and NoSQL databases'
    ],
    courses: [
      { name: 'SQL Full Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', duration: '10h', free: true },
      { name: 'MongoDB Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=-56x56UppqQ', duration: '8h', free: true },
      { name: 'Database Design Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=ztHopE5Wnpc', duration: '6h', free: true },
      { name: 'PostgreSQL Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=qw--VYLpxG4', duration: '5h', free: true }
    ]
  },
  {
    id: 'git-version-control',
    title: 'Git & Version Control',
    description: 'Learn Git for code versioning, collaboration, and modern development workflows.',
    icon: 'fa-code-branch',
    category: 'technical',
    difficulty: 'beginner',
    duration: 8,
    skills: ['Git', 'GitHub', 'Version Control', 'Collaboration'],
    outcomes: [
      'Use Git for version control efficiently',
      'Collaborate using GitHub workflows',
      'Manage branches and merge conflicts',
      'Contribute to open source projects'
    ],
    courses: [
      { name: 'Git & GitHub Full Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', duration: '4h', free: true },
      { name: 'Git Tutorial for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=8JJ101D3knE', duration: '2h', free: true },
      { name: 'GitHub Learning Lab', platform: 'GitHub', url: 'https://skills.github.com/', duration: '2h', free: true }
    ]
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving & DSA',
    description: 'Strengthen your problem-solving skills with data structures and algorithms.',
    icon: 'fa-puzzle-piece',
    category: 'technical',
    difficulty: 'intermediate',
    duration: 45,
    skills: ['Problem Solving', 'Data Structures', 'Algorithms', 'Competitive Programming'],
    outcomes: [
      'Solve complex coding problems efficiently',
      'Implement common data structures',
      'Analyze algorithm time and space complexity',
      'Crack technical interviews'
    ],
    courses: [
      { name: 'Data Structures & Algorithms', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=8hly31xKli0', duration: '20h', free: true },
      { name: 'Coding Interview Preparation', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=OPwU3UWCxhw', duration: '15h', free: true },
      { name: 'LeetCode Problems & Solutions', platform: 'LeetCode', url: 'https://leetcode.com/problemset/all/', duration: '10h', free: true },
      { name: 'freeCodeCamp Algorithms', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', duration: '10h', free: true }
    ]
  }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
  loadSavedPaths();
  initializeLearningPaths();
});

// Load saved paths from localStorage
function loadSavedPaths() {
  const saved = localStorage.getItem('savedLearningPaths');
  if (saved) {
    try {
      savedPaths = new Set(JSON.parse(saved));
    } catch (e) {
      console.error('Error loading saved paths:', e);
      savedPaths = new Set();
    }
  }
}

// Save paths to localStorage
function savePaths() {
  localStorage.setItem('savedLearningPaths', JSON.stringify([...savedPaths]));
}

async function initializeLearningPaths() {
  try {
    console.log('Initializing Learning Paths...');

    // Wait for backend services
    if (!window.AuthService || !window.DBService) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Check authentication
    const sessionResult = await window.AuthService.getCurrentSession();

    if (!sessionResult.success || !sessionResult.session) {
      console.log('No active session, redirecting to login');
      window.location.href = 'login.html';
      return;
    }

    currentUser = sessionResult.session.user;
    console.log('User authenticated:', currentUser.email);

    // Load user profile
    const profileResult = await window.DBService.getUserProfile(currentUser.id);

    if (profileResult.success && profileResult.profile) {
      userProfile = profileResult.profile;
      userSkills = userProfile.skills || [];
      console.log('User skills:', userSkills);
    }

    // Generate personalized learning paths
    generateLearningPaths();

    // Update hero section
    updateHeroSection();

    // Render paths
    renderPaths();

    // Update AI insights
    updateAIInsights();

    // Setup logout handler
    setupLogoutHandler();

  } catch (error) {
    console.error('Error initializing:', error);
    // Show paths anyway with default data
    generateLearningPaths();
    renderPaths();
    updateAIInsights();
    setupLogoutHandler();
  }
}

function updateHeroSection() {
  const heroTitle = document.getElementById('heroTitle');
  const heroSubtitle = document.getElementById('heroSubtitle');

  if (userProfile && heroTitle) {
    const firstName = userProfile.first_name || 'there';
    heroTitle.textContent = `${firstName}'s Learning Journey`;
  }

  if (allLearningPaths.length > 0 && heroSubtitle) {
    const gapCount = allLearningPaths.filter(p => p.relevanceScore > 50).length;
    heroSubtitle.textContent = `Based on your ${userSkills.length} skills, we've identified ${gapCount} learning paths to accelerate your career. Each path is customized to fill your skill gaps.`;
  }
}

function generateLearningPaths() {
  allLearningPaths = learningPathTemplates.map(template => {
    const path = { ...template };

    // Normalize user skills for better matching
    const normalizeSkill = (skill) => {
      return skill.toLowerCase()
        .trim()
        .replace(/[.\-_]/g, ' ')  // Replace dots, dashes, underscores with spaces
        .replace(/\s+/g, ' ')      // Normalize multiple spaces
        .replace(/\bjs\b/g, 'javascript')  // Common abbreviations
        .replace(/\bts\b/g, 'typescript')
        .replace(/\bpy\b/g, 'python')
        .replace(/\bml\b/g, 'machine learning');
    };

    const userSkillsNormalized = userSkills.map(s => normalizeSkill(s));

    // Calculate matched and missing skills with improved matching
    const matchedSkills = [];
    const missingSkills = [];

    path.skills.forEach(pathSkill => {
      const pathSkillNormalized = normalizeSkill(pathSkill);

      // Check if user has this skill (exact or partial match)
      const isMatched = userSkillsNormalized.some(userSkill => {
        // Exact match
        if (userSkill === pathSkillNormalized) return true;

        // Partial match (one contains the other, min 3 chars)
        if (pathSkillNormalized.length >= 3 && userSkill.length >= 3) {
          return userSkill.includes(pathSkillNormalized) ||
            pathSkillNormalized.includes(userSkill);
        }

        return false;
      });

      if (isMatched) {
        matchedSkills.push(pathSkill);
      } else {
        missingSkills.push(pathSkill);
      }
    });

    // Calculate relevance score
    const skillMatchRatio = path.skills.length > 0 ? matchedSkills.length / path.skills.length : 0;

    if (matchedSkills.length === 0) {
      path.relevanceScore = 30; // New area, lower priority
    } else if (matchedSkills.length === path.skills.length) {
      path.relevanceScore = 20; // Already mastered
    } else {
      // Sweet spot: has some skills, needs more (50-100%)
      path.relevanceScore = 50 + Math.round(skillMatchRatio * 50);
    }

    path.matchedSkills = matchedSkills;
    path.missingSkills = missingSkills;
    // Remove progress tracking
    path.status = 'not-started';

    return path;
  });

  // Sort by relevance, then by saved status
  allLearningPaths.sort((a, b) => {
    const aIsSaved = savedPaths.has(a.id);
    const bIsSaved = savedPaths.has(b.id);
    if (aIsSaved !== bIsSaved) return aIsSaved ? -1 : 1;
    return b.relevanceScore - a.relevanceScore;
  });

  filteredPaths = [...allLearningPaths];

  // Update stats
  document.getElementById('pathCount').textContent = allLearningPaths.length;
  document.getElementById('courseCount').textContent = allLearningPaths.reduce((sum, p) => sum + p.courses.length, 0);
  document.getElementById('hoursCount').textContent = allLearningPaths.reduce((sum, p) => sum + p.duration, 0);

  console.log('User skills:', userSkills);
  console.log('Generated paths with progress:', allLearningPaths.map(p => ({ title: p.title })));
}

function renderPaths() {
  const grid = document.getElementById('pathsGrid');
  const loadingState = document.getElementById('loadingState');
  const emptyState = document.getElementById('emptyState');
  const aiRecommendations = document.getElementById('aiRecommendations');

  // Hide loading
  loadingState.style.display = 'none';

  if (filteredPaths.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    aiRecommendations.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  grid.style.display = 'grid';
  aiRecommendations.style.display = 'block';

  grid.innerHTML = filteredPaths.map(path => createPathCard(path)).join('');
}

function createPathCard(path) {
  const iconClass = path.category === 'technical' ? 'technical' :
    path.category === 'soft-skills' ? 'soft-skills' : 'domain';

  const buttonText = 'Start Learning';
  const buttonClass = '';

  const skillTags = path.skills.slice(0, 4).map(skill => {
    const isGap = path.missingSkills.includes(skill);
    return `<span class="skill-tag ${isGap ? 'gap' : ''}">${skill}</span>`;
  }).join('');

  const courseItems = path.courses.slice(0, 3).map(course => `
    <div class="course-item" onclick="openCourse('${course.url}', '${path.title}', '${course.name}')" style="cursor: pointer;">
      <i class="fas fa-play-circle"></i>
      <span class="course-name">${course.name}</span>
      <span class="course-platform">${course.platform}</span>
    </div>
  `).join('');

  const isSaved = savedPaths.has(path.id);

  return `
    <div class="path-card" data-category="${path.category}" data-difficulty="${path.difficulty}" data-status="${path.status}">
      <div class="path-header">
        <div class="path-icon ${iconClass}">
          <i class="fas ${path.icon}"></i>
        </div>
        <span class="difficulty-badge ${path.difficulty}">${path.difficulty}</span>
      </div>
      
      <h3 class="path-title">${path.title}</h3>
      <p class="path-description">${path.description}</p>
      
      <div class="path-meta">
        <div class="meta-item">
          <div class="meta-value"><i class="fas fa-clock"></i> ${path.duration}h</div>
          <div class="meta-label">Duration</div>
        </div>
        <div class="meta-item">
          <div class="meta-value"><i class="fas fa-book"></i> ${path.courses.length}</div>
          <div class="meta-label">Courses</div>
        </div>
        <div class="meta-item">
          <div class="meta-value"><i class="fas fa-star"></i> ${path.relevanceScore}%</div>
          <div class="meta-label">Relevance</div>
        </div>
      </div>
      
      <div class="path-skills">
        ${skillTags}
        ${path.skills.length > 4 ? `<span class="skill-tag">+${path.skills.length - 4} more</span>` : ''}
      </div>
      
      <div class="course-list">
        <div class="course-header">Recommended Courses</div>
        ${courseItems}
      </div>
      
      <div class="path-actions">
        <button class="btn-start ${buttonClass}" onclick="openPathDetails('${path.id}')">
          <i class="fas fa-play"></i>
          ${buttonText}
        </button>
        <button class="btn-bookmark ${isSaved ? 'saved' : ''}" onclick="toggleBookmark(this, '${path.id}')" title="${isSaved ? 'Saved' : 'Save for later'}">
          <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
        </button>
      </div>
    </div>
  `;
}

// Open course in new tab
function openCourse(url, pathTitle, courseName) {
  window.open(url, '_blank');
  showToast(`Opening "${courseName}" - Good luck with your learning!`, 'success');
}

// Open detailed path modal
function openPathDetails(pathId) {
  const path = allLearningPaths.find(p => p.id === pathId);
  if (!path) return;

  const coursesHtml = path.courses.map((course, index) => `
    <div class="modal-course-item" onclick="openCourse('${course.url}', '${path.title}', '${course.name}')">
      <div class="course-number">${index + 1}</div>
      <div class="course-info">
        <div class="course-title">${course.name}</div>
        <div class="course-meta">
          <span><i class="fas fa-graduation-cap"></i> ${course.platform}</span>
          <span><i class="fas fa-clock"></i> ${course.duration}</span>
        </div>
      </div>
      <div class="course-action">
        <i class="fas fa-external-link-alt"></i>
      </div>
    </div>
  `).join('');

  const outcomesHtml = path.outcomes.map(o => `<li><i class="fas fa-check"></i> ${o}</li>`).join('');

  const skillsHtml = path.skills.map(skill => {
    const isMatched = path.matchedSkills.includes(skill);
    return `<span class="modal-skill-tag ${isMatched ? 'matched' : 'gap'}">
      ${skill} ${isMatched ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-plus-circle"></i>'}
    </span>`;
  }).join('');

  const modalHtml = `
    <div class="path-modal-overlay" id="pathModal" onclick="closePathModal(event)">
      <div class="path-modal" onclick="event.stopPropagation()">
        <button class="path-modal-close" onclick="closePathModal()">&times;</button>
        
        <div class="path-modal-header">
          <div class="path-modal-icon ${path.category}">
            <i class="fas ${path.icon}"></i>
          </div>
          <div class="path-modal-title-section">
            <h2>${path.title}</h2>
            <p class="path-modal-category"><i class="fas fa-tag"></i> ${path.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            <div class="path-modal-badges">
              <span class="modal-badge relevance"><i class="fas fa-star"></i> ${path.relevanceScore}% Match</span>
              <span class="modal-badge duration"><i class="fas fa-clock"></i> ${path.duration} hours</span>
              <span class="modal-badge difficulty ${path.difficulty}"><i class="fas fa-signal"></i> ${path.difficulty}</span>
            </div>
          </div>
        </div>
        
        <div class="path-modal-body">
          <div class="modal-section">
            <h3><i class="fas fa-info-circle"></i> Overview</h3>
            <p>${path.description}</p>
          </div>
          
          <div class="modal-section">
            <h3><i class="fas fa-bullseye"></i> What You'll Learn</h3>
            <ul class="outcomes-list">
              ${outcomesHtml}
            </ul>
          </div>
          
          <div class="modal-section">
            <h3><i class="fas fa-code"></i> Skills You'll Gain</h3>
            <div class="modal-skills">
              ${skillsHtml}
            </div>
            ${path.matchedSkills.length > 0 ? `
              <p class="skills-match-info"><i class="fas fa-star"></i> You already have ${path.matchedSkills.length} of ${path.skills.length} skills!</p>
            ` : ''}
          </div>
          
          <div class="modal-section">
            <h3><i class="fas fa-graduation-cap"></i> Recommended Courses</h3>
            <div class="modal-courses">
              ${coursesHtml}
            </div>
          </div>
        </div>
        
        <div class="path-modal-footer">
          <button class="btn-secondary" onclick="closePathModal()">
            <i class="fas fa-arrow-left"></i> Back
          </button>
          <button class="btn-primary" onclick="startFirstCourse('${path.id}')">
            <i class="fas fa-play"></i> Start First Course
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  addModalStyles();
}

function startFirstCourse(pathId) {
  const path = allLearningPaths.find(p => p.id === pathId);
  if (path && path.courses.length > 0) {
    closePathModal();
    setTimeout(() => {
      openCourse(path.courses[0].url, path.title, path.courses[0].name);
    }, 300);
  }
}

function closePathModal(event) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('pathModal');
  if (modal) modal.remove();
}

function addModalStyles() {
  if (document.getElementById('pathModalStyles')) return;

  const styles = document.createElement('style');
  styles.id = 'pathModalStyles';
  styles.textContent = `
    .path-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease;
      padding: 20px;
    }
    
    .path-modal {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-radius: 20px;
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
      border: 1px solid rgba(16, 185, 129, 0.3);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.3s ease;
    }
    
    .path-modal::-webkit-scrollbar { width: 8px; }
    .path-modal::-webkit-scrollbar-track { background: #1e293b; }
    .path-modal::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
    
    .path-modal-close {
      position: absolute;
      top: 15px;
      right: 20px;
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 28px;
      cursor: pointer;
      transition: color 0.2s;
      z-index: 10;
    }
    
    .path-modal-close:hover { color: #f43f5e; }
    
    .path-modal-header {
      display: flex;
      gap: 20px;
      padding: 30px;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 95, 70, 0.1) 100%);
      border-bottom: 1px solid rgba(16, 185, 129, 0.2);
    }
    
    .path-modal-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      color: white;
      flex-shrink: 0;
    }
    
    .path-modal-icon.technical { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .path-modal-icon.soft-skills { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .path-modal-icon.domain { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
    
    .path-modal-title-section h2 {
      color: #f1f5f9;
      font-size: 24px;
      margin: 0 0 8px;
    }
    
    .path-modal-category {
      color: #94a3b8;
      margin: 0 0 12px;
      font-size: 14px;
    }
    
    .path-modal-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .modal-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .modal-badge.relevance {
      background: rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    
    .modal-badge.duration {
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
      border: 1px solid rgba(99, 102, 241, 0.3);
    }
    
    .modal-badge.difficulty.beginner {
      background: rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    
    .modal-badge.difficulty.intermediate {
      background: rgba(245, 158, 11, 0.2);
      color: #fcd34d;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    
    .modal-badge.difficulty.advanced {
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    
    .path-modal-body { padding: 25px 30px; }
    
    .modal-section { margin-bottom: 25px; }
    .modal-section:last-child { margin-bottom: 0; }
    
    .modal-section h3 {
      color: #e2e8f0;
      font-size: 16px;
      margin: 0 0 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .modal-section h3 i { color: #10b981; }
    
    .modal-section p {
      color: #cbd5e1;
      line-height: 1.7;
      margin: 0;
    }
    
    .outcomes-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .outcomes-list li {
      color: #cbd5e1;
      padding: 8px 0;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    
    .outcomes-list li i {
      color: #10b981;
      margin-top: 4px;
      font-size: 12px;
    }
    
    .modal-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .modal-skill-tag {
      padding: 8px 14px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 8px;
      color: #6ee7b7;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .modal-skill-tag.gap {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }
    
    .modal-skill-tag i { font-size: 10px; }
    
    .skills-match-info {
      color: #10b981;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .modal-courses {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .modal-course-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 16px;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid #334155;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .modal-course-item:hover {
      background: rgba(16, 185, 129, 0.1);
      border-color: #10b981;
      transform: translateX(5px);
    }
    
    .course-number {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 14px;
      flex-shrink: 0;
    }
    
    .course-info { flex: 1; }
    
    .course-title {
      color: #f1f5f9;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .course-meta {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #94a3b8;
    }
    
    .course-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .course-action {
      color: #10b981;
      font-size: 16px;
    }
    
    .modal-progress {
      background: rgba(15, 23, 42, 0.5);
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #334155;
    }
    
    .modal-progress-bar {
      height: 12px;
      background: #334155;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 10px;
    }
    
    .modal-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #059669);
      border-radius: 6px;
      transition: width 0.5s ease;
    }
    
    .modal-progress-text {
      text-align: center;
      color: #94a3b8;
      font-size: 14px;
    }
    
    .path-modal-footer {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      padding: 20px 30px;
      background: rgba(15, 23, 42, 0.5);
      border-top: 1px solid rgba(16, 185, 129, 0.2);
    }
    
    .btn-secondary {
      padding: 12px 24px;
      background: #334155;
      color: #e2e8f0;
      border: 1px solid #475569;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    
    .btn-secondary:hover { background: #475569; }
    
    .btn-primary {
      padding: 12px 24px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @media (max-width: 600px) {
      .path-modal-header {
        flex-direction: column;
        text-align: center;
      }
      
      .path-modal-icon { margin: 0 auto; }
      .path-modal-badges { justify-content: center; }
      .path-modal-footer { flex-direction: column; }
    }
  `;
  document.head.appendChild(styles);
}

function filterPaths() {
  const category = document.getElementById('categoryFilter').value;
  const difficulty = document.getElementById('difficultyFilter').value;
  const duration = document.getElementById('durationFilter').value;
  const status = document.getElementById('statusFilter').value;

  filteredPaths = allLearningPaths.filter(path => {
    if (category !== 'all' && path.category !== category) return false;
    if (difficulty !== 'all' && path.difficulty !== difficulty) return false;
    if (status !== 'all') {
      if (status === 'recommended' && path.relevanceScore < 50) return false;
      if (status === 'in-progress' && path.status !== 'in-progress') return false;
      if (status === 'completed' && path.status !== 'completed') return false;
    }
    if (duration !== 'all') {
      if (duration === 'short' && path.duration >= 10) return false;
      if (duration === 'medium' && (path.duration < 10 || path.duration > 30)) return false;
      if (duration === 'long' && path.duration <= 30) return false;
    }
    return true;
  });

  renderPaths();
}

function updateAIInsights() {
  const aiGrid = document.getElementById('aiGrid');

  const highPriorityPaths = allLearningPaths.filter(p => p.relevanceScore >= 70).length;
  const inProgressPaths = allLearningPaths.filter(p => p.status === 'in-progress').length;
  const topMissingSkills = getTopMissingSkills();

  aiGrid.innerHTML = `
    <div class="ai-card">
      <div class="ai-card-header">
        <i class="fas fa-bullseye ai-card-icon"></i>
        <h3 class="ai-card-title">Priority Paths</h3>
      </div>
      <p class="ai-card-text">
        ${highPriorityPaths > 0
      ? `You have ${highPriorityPaths} high-priority learning paths that align with your career goals. Focus on these for maximum impact.`
      : 'Complete your profile to get personalized priority recommendations!'}
      </p>
    </div>
    <div class="ai-card">
      <div class="ai-card-header">
        <i class="fas fa-lightbulb ai-card-icon"></i>
        <h3 class="ai-card-title">Skills to Develop</h3>
      </div>
      <p class="ai-card-text">
        ${topMissingSkills.length > 0
      ? `Top skills to focus on: ${topMissingSkills.slice(0, 3).join(', ')}. These appear frequently in high-demand job roles.`
      : 'Add more skills to your profile to see personalized recommendations!'}
      </p>
    </div>
    <div class="ai-card">
      <div class="ai-card-header">
        <i class="fas fa-chart-line ai-card-icon"></i>
        <h3 class="ai-card-title">Learning Progress</h3>
      </div>
      <p class="ai-card-text">
        ${inProgressPaths > 0
      ? `You have ${inProgressPaths} learning path${inProgressPaths > 1 ? 's' : ''} in progress. Keep up the momentum!`
      : 'Start your first learning path today to begin tracking your progress.'}
      </p>
    </div>
  `;
}

function getTopMissingSkills() {
  const skillCount = {};

  allLearningPaths.forEach(path => {
    path.missingSkills.forEach(skill => {
      skillCount[skill] = (skillCount[skill] || 0) + path.relevanceScore;
    });
  });

  return Object.entries(skillCount)
    .sort((a, b) => b[1] - a[1])
    .map(([skill]) => skill)
    .slice(0, 5);
}

function toggleBookmark(button, pathId) {
  const path = allLearningPaths.find(p => p.id === pathId);
  const icon = button.querySelector('i');

  if (savedPaths.has(pathId)) {
    savedPaths.delete(pathId);
    button.classList.remove('saved');
    button.title = 'Save for later';
    icon.classList.remove('fas');
    icon.classList.add('far');
    showToast(`"${path.title}" removed from saved paths`, 'info');
  } else {
    savedPaths.add(pathId);
    button.classList.add('saved');
    button.title = 'Saved';
    icon.classList.remove('far');
    icon.classList.add('fas');
    showToast(`"${path.title}" saved to your list!`, 'success');
  }

  savePaths();

  // Update sidebar saved section
  if (window.updateSidebarSaved) {
    window.updateSidebarSaved();
  }
}

// Toast notification
function showToast(message, type = 'info') {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
    <span>${message}</span>
  `;

  if (!document.getElementById('toastStyles')) {
    const styles = document.createElement('style');
    styles.id = 'toastStyles';
    styles.textContent = `
      .toast-notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        z-index: 10001;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      }
      
      .toast-success {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
      }
      
      .toast-error {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
      }
      
      .toast-info {
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: white;
      }
      
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(styles);
  }

  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
}

function setupLogoutHandler() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function () {
      try {
        await window.AuthService.logout();
        window.location.href = 'login.html';
      } catch (error) {
        console.error('Logout error:', error);
        showToast('Error logging out. Please try again.', 'error');
      }
    });
  }
}
