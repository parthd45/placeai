/**
 * Project Idea Generator
 * Generates personalized project ideas based on target role, skills, and difficulty
 * 100% Free - No API costs (Rule-based AI)
 */

(function () {
    'use strict';

    // Project Templates Database
    const PROJECT_TEMPLATES = {
        'Software Engineer': [
            {
                title: 'Real-Time Chat Application',
                description: 'Build a WhatsApp-like chat app with real-time messaging, group chats, and media sharing',
                difficulty: 'Intermediate',
                techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
                estimatedTime: '3-4 weeks',
                whyRecruitersLove: 'Demonstrates real-time systems, WebSockets, and full-stack skills',
                features: ['User authentication', 'Real-time messaging', 'Group chats', 'File sharing', 'Online status'],
                learningOutcomes: ['WebSocket programming', 'Real-time data sync', 'Scalable architecture']
            },
            {
                title: 'E-Commerce Platform with Payment Integration',
                description: 'Complete online store with product catalog, cart, checkout, and payment gateway',
                difficulty: 'Advanced',
                techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe/Razorpay'],
                estimatedTime: '4-6 weeks',
                whyRecruitersLove: 'Shows understanding of complex business logic and payment systems',
                features: ['Product catalog', 'Shopping cart', 'Payment integration', 'Order tracking', 'Admin dashboard'],
                learningOutcomes: ['Payment gateway integration', 'Transaction handling', 'Security best practices']
            },
            {
                title: 'Task Management System (Trello Clone)',
                description: 'Kanban-style project management tool with drag-and-drop functionality',
                difficulty: 'Intermediate',
                techStack: ['React', 'Node.js', 'MongoDB', 'Redux'],
                estimatedTime: '2-3 weeks',
                whyRecruitersLove: 'Popular interview project that shows state management skills',
                features: ['Drag-and-drop boards', 'Task assignments', 'Due dates', 'Labels and filters'],
                learningOutcomes: ['Complex state management', 'Drag-and-drop APIs', 'RESTful design']
            },
            {
                title: 'Social Media Dashboard',
                description: 'Analytics dashboard showing metrics from multiple social platforms',
                difficulty: 'Beginner',
                techStack: ['React', 'Chart.js', 'REST APIs'],
                estimatedTime: '1-2 weeks',
                whyRecruitersLove: 'Shows data visualization and API integration skills',
                features: ['Multi-platform data', 'Interactive charts', 'Real-time updates', 'Export reports'],
                learningOutcomes: ['Data visualization', 'API integration', 'Dashboard design']
            },
            {
                title: 'Video Streaming Platform (YouTube Clone)',
                description: 'Video upload, streaming, and recommendation system',
                difficulty: 'Advanced',
                techStack: ['React', 'Node.js', 'AWS S3', 'FFmpeg'],
                estimatedTime: '5-6 weeks',
                whyRecruitersLove: 'Demonstrates media handling and cloud services expertise',
                features: ['Video upload', 'Streaming', 'Recommendations', 'Comments', 'Subscriptions'],
                learningOutcomes: ['Media processing', 'Cloud storage', 'CDN integration']
            }
        ],

        'Frontend Developer': [
            {
                title: 'Interactive Portfolio Website',
                description: 'Stunning portfolio with animations, dark mode, and responsive design',
                difficulty: 'Beginner',
                techStack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
                estimatedTime: '1 week',
                whyRecruitersLove: 'Shows design sense and attention to detail',
                features: ['Smooth animations', 'Dark/light mode', 'Responsive design', 'Contact form'],
                learningOutcomes: ['CSS animations', 'Responsive design', 'Performance optimization']
            },
            {
                title: 'Component Library (Like Material-UI)',
                description: 'Reusable React component library with documentation',
                difficulty: 'Advanced',
                techStack: ['React', 'TypeScript', 'Storybook', 'CSS-in-JS'],
                estimatedTime: '4-5 weeks',
                whyRecruitersLove: 'Shows deep understanding of component architecture',
                features: ['20+ components', 'TypeScript types', 'Storybook docs', 'NPM package'],
                learningOutcomes: ['Component design', 'TypeScript', 'Library development']
            },
            {
                title: 'Weather Dashboard with Maps',
                description: 'Real-time weather app with interactive maps and forecasts',
                difficulty: 'Intermediate',
                techStack: ['React', 'Leaflet.js', 'Weather API'],
                estimatedTime: '2 weeks',
                whyRecruitersLove: 'Demonstrates API integration and map visualization',
                features: ['Current weather', '7-day forecast', 'Interactive maps', 'Location search'],
                learningOutcomes: ['Map libraries', 'API handling', 'Geolocation']
            }
        ],

        'Backend Developer': [
            {
                title: 'RESTful API with Authentication',
                description: 'Secure REST API with JWT authentication and role-based access',
                difficulty: 'Intermediate',
                techStack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
                estimatedTime: '2-3 weeks',
                whyRecruitersLove: 'Core backend skill that every company needs',
                features: ['User auth', 'CRUD operations', 'Rate limiting', 'API documentation'],
                learningOutcomes: ['API design', 'Security', 'Authentication']
            },
            {
                title: 'Microservices Architecture',
                description: 'Multi-service system with Docker and message queues',
                difficulty: 'Advanced',
                techStack: ['Node.js', 'Docker', 'RabbitMQ', 'PostgreSQL'],
                estimatedTime: '5-6 weeks',
                whyRecruitersLove: 'Shows enterprise-level architecture knowledge',
                features: ['Multiple services', 'Message queues', 'Service discovery', 'Load balancing'],
                learningOutcomes: ['Microservices', 'Docker', 'Distributed systems']
            },
            {
                title: 'GraphQL API Server',
                description: 'Modern GraphQL API with subscriptions and caching',
                difficulty: 'Advanced',
                techStack: ['Node.js', 'Apollo Server', 'GraphQL', 'Redis'],
                estimatedTime: '3-4 weeks',
                whyRecruitersLove: 'GraphQL is highly sought after in modern companies',
                features: ['GraphQL schema', 'Subscriptions', 'Caching', 'DataLoader'],
                learningOutcomes: ['GraphQL', 'Real-time subscriptions', 'Caching strategies']
            }
        ],

        'Data Scientist': [
            {
                title: 'Customer Churn Prediction Model',
                description: 'ML model to predict customer churn with visualization dashboard',
                difficulty: 'Intermediate',
                techStack: ['Python', 'Scikit-learn', 'Pandas', 'Streamlit'],
                estimatedTime: '3-4 weeks',
                whyRecruitersLove: 'Solves real business problem with ML',
                features: ['Data preprocessing', 'Model training', 'Predictions', 'Interactive dashboard'],
                learningOutcomes: ['ML pipelines', 'Feature engineering', 'Model deployment']
            },
            {
                title: 'Sentiment Analysis on Social Media',
                description: 'NLP project analyzing sentiment from Twitter/Reddit data',
                difficulty: 'Advanced',
                techStack: ['Python', 'NLTK', 'TensorFlow', 'Flask'],
                estimatedTime: '4-5 weeks',
                whyRecruitersLove: 'Shows NLP skills which are in high demand',
                features: ['Data scraping', 'Text preprocessing', 'Sentiment classification', 'Visualization'],
                learningOutcomes: ['NLP', 'Deep learning', 'Text processing']
            },
            {
                title: 'Sales Forecasting Dashboard',
                description: 'Time series forecasting with interactive visualizations',
                difficulty: 'Intermediate',
                techStack: ['Python', 'Prophet', 'Plotly', 'Dash'],
                estimatedTime: '2-3 weeks',
                whyRecruitersLove: 'Demonstrates business analytics skills',
                features: ['Time series analysis', 'Forecasting', 'Interactive charts', 'Trend analysis'],
                learningOutcomes: ['Time series', 'Forecasting models', 'Data visualization']
            }
        ],

        'Mobile Developer': [
            {
                title: 'Food Delivery App (Swiggy Clone)',
                description: 'Full-featured food ordering app with real-time tracking',
                difficulty: 'Advanced',
                techStack: ['React Native', 'Firebase', 'Google Maps API'],
                estimatedTime: '5-6 weeks',
                whyRecruitersLove: 'Shows complete mobile app development skills',
                features: ['Restaurant listings', 'Cart', 'Order tracking', 'Push notifications'],
                learningOutcomes: ['Mobile UI/UX', 'Real-time updates', 'Maps integration']
            },
            {
                title: 'Fitness Tracker App',
                description: 'Track workouts, calories, and progress with charts',
                difficulty: 'Intermediate',
                techStack: ['React Native', 'SQLite', 'Chart libraries'],
                estimatedTime: '3-4 weeks',
                whyRecruitersLove: 'Popular app category with local storage',
                features: ['Workout logging', 'Progress charts', 'Goal setting', 'Reminders'],
                learningOutcomes: ['Local storage', 'Charts', 'Notifications']
            }
        ],

        'DevOps Engineer': [
            {
                title: 'CI/CD Pipeline with Docker',
                description: 'Automated deployment pipeline with testing and monitoring',
                difficulty: 'Advanced',
                techStack: ['Docker', 'Jenkins', 'Kubernetes', 'Terraform'],
                estimatedTime: '4-5 weeks',
                whyRecruitersLove: 'Core DevOps skill every company needs',
                features: ['Automated testing', 'Container orchestration', 'Monitoring', 'Auto-scaling'],
                learningOutcomes: ['CI/CD', 'Containerization', 'Infrastructure as Code']
            },
            {
                title: 'Infrastructure Monitoring Dashboard',
                description: 'Real-time monitoring of servers, databases, and applications',
                difficulty: 'Intermediate',
                techStack: ['Prometheus', 'Grafana', 'Docker', 'Node Exporter'],
                estimatedTime: '2-3 weeks',
                whyRecruitersLove: 'Shows monitoring and observability skills',
                features: ['Metrics collection', 'Alerting', 'Dashboards', 'Log aggregation'],
                learningOutcomes: ['Monitoring', 'Alerting', 'Observability']
            }
        ],

        'UI/UX Designer': [
            {
                title: 'Design System Documentation',
                description: 'Complete design system with components, colors, and guidelines',
                difficulty: 'Intermediate',
                techStack: ['Figma', 'HTML/CSS', 'Storybook'],
                estimatedTime: '3-4 weeks',
                whyRecruitersLove: 'Shows systematic design thinking',
                features: ['Component library', 'Style guide', 'Documentation', 'Code examples'],
                learningOutcomes: ['Design systems', 'Component design', 'Documentation']
            },
            {
                title: 'Mobile App Redesign Case Study',
                description: 'Complete UX research and redesign of existing app',
                difficulty: 'Advanced',
                techStack: ['Figma', 'User Research Tools', 'Prototyping'],
                estimatedTime: '4-5 weeks',
                whyRecruitersLove: 'Demonstrates full UX process',
                features: ['User research', 'Wireframes', 'High-fidelity mockups', 'Prototype'],
                learningOutcomes: ['UX research', 'Design process', 'Prototyping']
            }
        ]
    };

    /**
     * Generate personalized project ideas
     * @param {string} targetRole - Target job role
     * @param {Array} currentSkills - User's current skills
     * @param {string} difficulty - Preferred difficulty level
     * @returns {Array} Array of project ideas
     */
    function generateProjectIdeas(targetRole, currentSkills = [], difficulty = 'all') {
        const roleTemplates = PROJECT_TEMPLATES[targetRole] || PROJECT_TEMPLATES['Software Engineer'];

        let filteredProjects = roleTemplates;

        // Filter by difficulty if specified
        if (difficulty !== 'all') {
            filteredProjects = roleTemplates.filter(p => p.difficulty === difficulty);
        }

        // Score projects based on skill match
        const scoredProjects = filteredProjects.map(project => {
            let score = 0;

            // Check how many required skills user already has
            const matchingSkills = project.techStack.filter(tech =>
                currentSkills.some(skill =>
                    skill.toLowerCase().includes(tech.toLowerCase()) ||
                    tech.toLowerCase().includes(skill.toLowerCase())
                )
            );

            score = (matchingSkills.length / project.techStack.length) * 100;

            return {
                ...project,
                skillMatchScore: Math.round(score),
                matchingSkills: matchingSkills,
                skillsToLearn: project.techStack.filter(tech => !matchingSkills.includes(tech))
            };
        });

        // Sort by skill match (but keep some variety)
        return scoredProjects.sort((a, b) => b.skillMatchScore - a.skillMatchScore);
    }

    /**
     * Get project template by difficulty
     * @param {string} role - Target role
     * @param {string} difficulty - Difficulty level
     * @returns {Array} Filtered projects
     */
    function getProjectsByDifficulty(role, difficulty) {
        const roleTemplates = PROJECT_TEMPLATES[role] || [];
        return roleTemplates.filter(p => p.difficulty === difficulty);
    }

    /**
     * Get all available roles
     * @returns {Array} List of roles
     */
    function getAvailableRoles() {
        return Object.keys(PROJECT_TEMPLATES);
    }

    /**
     * Get random project idea
     * @param {string} role - Target role
     * @returns {Object} Random project
     */
    function getRandomProject(role) {
        const roleTemplates = PROJECT_TEMPLATES[role] || PROJECT_TEMPLATES['Software Engineer'];
        return roleTemplates[Math.floor(Math.random() * roleTemplates.length)];
    }

    // Export functions
    if (typeof window !== 'undefined') {
        window.ProjectIdeaGenerator = {
            generateProjectIdeas,
            getProjectsByDifficulty,
            getAvailableRoles,
            getRandomProject,
            PROJECT_TEMPLATES
        };
    }
})();
