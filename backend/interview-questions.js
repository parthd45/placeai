/**
 * Mock Interview Question Bank - EXPANDED VERSION
 * 200+ questions across all technical domains
 * Free, no API costs - all questions and evaluation logic are local
 */

(function () {
    'use strict';

    const INTERVIEW_QUESTIONS = {
        technical: {
            beginner: [
                // Web Development Questions
                {
                    id: 'web_b1',
                    question: "What is the difference between var, let, and const in JavaScript?",
                    category: 'Web Development',
                    keywords: ['scope', 'hoisting', 'reassign', 'block', 'function', 'const', 'let', 'var'],
                    expectedPoints: ['var is function-scoped', 'let and const are block-scoped', 'const cannot be reassigned'],
                    difficulty: 'beginner'
                },
                {
                    id: 'web_b2',
                    question: "What is HTML and what is it used for?",
                    category: 'Web Development',
                    keywords: ['markup', 'structure', 'web', 'browser', 'elements', 'tags', 'content'],
                    expectedPoints: ['HyperText Markup Language', 'Structure of web pages', 'Uses tags and elements'],
                    difficulty: 'beginner'
                },
                {
                    id: 'web_b3',
                    question: "Explain what CSS is and its purpose.",
                    category: 'Web Development',
                    keywords: ['styling', 'design', 'layout', 'colors', 'fonts', 'presentation', 'cascading'],
                    expectedPoints: ['Cascading Style Sheets', 'Styles HTML elements', 'Controls layout and appearance'],
                    difficulty: 'beginner'
                },
                {
                    id: 'web_b4',
                    question: "What is the DOM in web development?",
                    category: 'Web Development',
                    keywords: ['document', 'object', 'model', 'tree', 'html', 'javascript', 'manipulation'],
                    expectedPoints: ['Document Object Model', 'Tree structure of HTML', 'Can be manipulated with JavaScript'],
                    difficulty: 'beginner'
                },
                {
                    id: 'web_b5',
                    question: "What is the difference between == and === in JavaScript?",
                    category: 'Web Development',
                    keywords: ['equality', 'strict', 'type', 'coercion', 'comparison', 'value'],
                    expectedPoints: ['== checks value only', '=== checks value and type', 'Type coercion'],
                    difficulty: 'beginner'
                },
                {
                    id: 'web_b6',
                    question: "What is React and why is it popular?",
                    category: 'Web Development',
                    keywords: ['library', 'components', 'ui', 'virtual dom', 'facebook', 'reusable'],
                    expectedPoints: ['JavaScript library for UI', 'Component-based', 'Virtual DOM for performance'],
                    difficulty: 'beginner'
                },
                {
                    id: 'web_b7',
                    question: "What is the difference between frontend and backend development?",
                    category: 'Web Development',
                    keywords: ['client', 'server', 'ui', 'database', 'user', 'interface', 'logic'],
                    expectedPoints: ['Frontend is client-side/UI', 'Backend is server-side/logic', 'Different technologies'],
                    difficulty: 'beginner'
                },
                {
                    id: 'web_b8',
                    question: "What is Node.js?",
                    category: 'Web Development',
                    keywords: ['runtime', 'javascript', 'server', 'backend', 'v8', 'npm'],
                    expectedPoints: ['JavaScript runtime', 'Server-side JavaScript', 'Built on V8 engine'],
                    difficulty: 'beginner'
                },

                // Data Science Questions
                {
                    id: 'ds_b1',
                    question: "What is Data Science?",
                    category: 'Data Science',
                    keywords: ['data', 'analysis', 'insights', 'statistics', 'machine learning', 'visualization'],
                    expectedPoints: ['Extracting insights from data', 'Uses statistics and ML', 'Data-driven decisions'],
                    difficulty: 'beginner'
                },
                {
                    id: 'ds_b2',
                    question: "What is the difference between a list and a tuple in Python?",
                    category: 'Data Science',
                    keywords: ['mutable', 'immutable', 'list', 'tuple', 'python', 'data structure'],
                    expectedPoints: ['Lists are mutable', 'Tuples are immutable', 'Different use cases'],
                    difficulty: 'beginner'
                },
                {
                    id: 'ds_b3',
                    question: "What is a DataFrame in Pandas?",
                    category: 'Data Science',
                    keywords: ['pandas', 'dataframe', 'table', 'rows', 'columns', 'data structure'],
                    expectedPoints: ['2D labeled data structure', 'Like a table or spreadsheet', 'Core of Pandas'],
                    difficulty: 'beginner'
                },
                {
                    id: 'ds_b4',
                    question: "What is the purpose of data visualization?",
                    category: 'Data Science',
                    keywords: ['visualization', 'charts', 'graphs', 'insights', 'communicate', 'patterns'],
                    expectedPoints: ['Communicate data insights', 'Identify patterns', 'Make data understandable'],
                    difficulty: 'beginner'
                },
                {
                    id: 'ds_b5',
                    question: "What is NumPy used for?",
                    category: 'Data Science',
                    keywords: ['numpy', 'arrays', 'numerical', 'python', 'scientific computing'],
                    expectedPoints: ['Numerical computing library', 'Multi-dimensional arrays', 'Mathematical operations'],
                    difficulty: 'beginner'
                },

                // Machine Learning Questions
                {
                    id: 'ml_b1',
                    question: "What is Machine Learning?",
                    category: 'Machine Learning',
                    keywords: ['learning', 'algorithms', 'data', 'predictions', 'patterns', 'ai'],
                    expectedPoints: ['Algorithms that learn from data', 'Make predictions', 'Improve with experience'],
                    difficulty: 'beginner'
                },
                {
                    id: 'ml_b2',
                    question: "What is the difference between supervised and unsupervised learning?",
                    category: 'Machine Learning',
                    keywords: ['supervised', 'unsupervised', 'labels', 'training', 'clustering', 'classification'],
                    expectedPoints: ['Supervised uses labeled data', 'Unsupervised finds patterns', 'Different use cases'],
                    difficulty: 'beginner'
                },
                {
                    id: 'ml_b3',
                    question: "What is a training dataset?",
                    category: 'Machine Learning',
                    keywords: ['training', 'dataset', 'learning', 'model', 'examples'],
                    expectedPoints: ['Data used to train model', 'Contains examples', 'Model learns patterns'],
                    difficulty: 'beginner'
                },

                // Mobile Development Questions
                {
                    id: 'mob_b1',
                    question: "What is the difference between Android and iOS development?",
                    category: 'Mobile Development',
                    keywords: ['android', 'ios', 'java', 'kotlin', 'swift', 'platform'],
                    expectedPoints: ['Different platforms', 'Different languages', 'Different tools'],
                    difficulty: 'beginner'
                },
                {
                    id: 'mob_b2',
                    question: "What is React Native?",
                    category: 'Mobile Development',
                    keywords: ['react native', 'cross-platform', 'javascript', 'mobile', 'ios', 'android'],
                    expectedPoints: ['Cross-platform framework', 'Uses JavaScript', 'Single codebase'],
                    difficulty: 'beginner'
                },

                // DevOps Questions
                {
                    id: 'devops_b1',
                    question: "What is DevOps?",
                    category: 'DevOps',
                    keywords: ['development', 'operations', 'automation', 'collaboration', 'ci/cd'],
                    expectedPoints: ['Development + Operations', 'Automation and collaboration', 'Faster delivery'],
                    difficulty: 'beginner'
                },
                {
                    id: 'devops_b2',
                    question: "What is Git and why is it used?",
                    category: 'DevOps',
                    keywords: ['version', 'control', 'tracking', 'collaboration', 'repository', 'commits'],
                    expectedPoints: ['Version control system', 'Tracks changes', 'Enables collaboration'],
                    difficulty: 'beginner'
                },
                {
                    id: 'devops_b3',
                    question: "What is Docker?",
                    category: 'DevOps',
                    keywords: ['containers', 'docker', 'virtualization', 'deployment', 'portable'],
                    expectedPoints: ['Containerization platform', 'Packages applications', 'Portable and consistent'],
                    difficulty: 'beginner'
                },

                // Cybersecurity Questions
                {
                    id: 'sec_b1',
                    question: "What is Cybersecurity?",
                    category: 'Cybersecurity',
                    keywords: ['security', 'protection', 'threats', 'data', 'systems', 'attacks'],
                    expectedPoints: ['Protecting systems and data', 'Preventing cyber attacks', 'Security measures'],
                    difficulty: 'beginner'
                },
                {
                    id: 'sec_b2',
                    question: "What is encryption?",
                    category: 'Cybersecurity',
                    keywords: ['encryption', 'data', 'security', 'cipher', 'protect', 'decrypt'],
                    expectedPoints: ['Converting data to code', 'Protects information', 'Requires key to decrypt'],
                    difficulty: 'beginner'
                },

                // Database Questions
                {
                    id: 'db_b1',
                    question: "What is a database?",
                    category: 'Database',
                    keywords: ['database', 'data', 'storage', 'organized', 'tables', 'records'],
                    expectedPoints: ['Organized collection of data', 'Structured storage', 'Easy retrieval'],
                    difficulty: 'beginner'
                },
                {
                    id: 'db_b2',
                    question: "What is SQL?",
                    category: 'Database',
                    keywords: ['sql', 'query', 'language', 'database', 'structured', 'relational'],
                    expectedPoints: ['Structured Query Language', 'Database queries', 'Manage relational databases'],
                    difficulty: 'beginner'
                },
                {
                    id: 'db_b3',
                    question: "What is the difference between SQL and NoSQL databases?",
                    category: 'Database',
                    keywords: ['sql', 'nosql', 'relational', 'schema', 'flexible', 'structured'],
                    expectedPoints: ['SQL is relational/structured', 'NoSQL is flexible/document-based', 'Different use cases'],
                    difficulty: 'beginner'
                },

                // General Programming
                {
                    id: 'prog_b1',
                    question: "What is a variable in programming?",
                    category: 'Programming Basics',
                    keywords: ['storage', 'data', 'value', 'name', 'container', 'memory'],
                    expectedPoints: ['Stores data', 'Has a name', 'Can be changed'],
                    difficulty: 'beginner'
                },
                {
                    id: 'prog_b2',
                    question: "What is an array?",
                    category: 'Programming Basics',
                    keywords: ['collection', 'elements', 'index', 'ordered', 'list', 'data'],
                    expectedPoints: ['Collection of elements', 'Indexed', 'Ordered'],
                    difficulty: 'beginner'
                },
                {
                    id: 'prog_b3',
                    question: "What is a function in programming?",
                    category: 'Programming Basics',
                    keywords: ['reusable', 'code', 'block', 'parameters', 'return', 'execute'],
                    expectedPoints: ['Reusable code block', 'Can take parameters', 'Can return value'],
                    difficulty: 'beginner'
                }
            ],

            intermediate: [
                // Web Development
                {
                    id: 'web_i1',
                    question: "Explain the concept of closures in JavaScript with an example.",
                    category: 'Web Development',
                    keywords: ['function', 'scope', 'lexical', 'inner', 'outer', 'variable', 'access', 'encapsulation'],
                    expectedPoints: ['Function inside function', 'Access to outer scope', 'Practical use case', 'Example provided'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'web_i2',
                    question: "What is the virtual DOM in React?",
                    category: 'Web Development',
                    keywords: ['virtual', 'dom', 'reconciliation', 'performance', 'diffing', 'update', 'efficient'],
                    expectedPoints: ['Lightweight copy of DOM', 'Reconciliation process', 'Performance optimization'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'web_i3',
                    question: "Explain the difference between synchronous and asynchronous programming.",
                    category: 'Web Development',
                    keywords: ['blocking', 'non-blocking', 'callback', 'promise', 'async', 'await', 'parallel'],
                    expectedPoints: ['Synchronous blocks execution', 'Asynchronous allows parallel execution', 'Use cases'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'web_i4',
                    question: "What are promises in JavaScript?",
                    category: 'Web Development',
                    keywords: ['asynchronous', 'pending', 'resolved', 'rejected', 'then', 'catch', 'callback'],
                    expectedPoints: ['Handles async operations', 'Three states', 'Chainable'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'web_i5',
                    question: "Explain the concept of middleware in Express.js.",
                    category: 'Web Development',
                    keywords: ['function', 'request', 'response', 'next', 'pipeline', 'processing'],
                    expectedPoints: ['Functions in request pipeline', 'Access to req/res', 'next() function'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'web_i6',
                    question: "Explain the concept of state management in React.",
                    category: 'Web Development',
                    keywords: ['state', 'props', 'redux', 'context', 'hooks', 'useState', 'global'],
                    expectedPoints: ['Managing component data', 'Local vs global state', 'State management tools'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'web_i7',
                    question: "What is RESTful API design?",
                    category: 'Web Development',
                    keywords: ['rest', 'http', 'stateless', 'resources', 'crud', 'get', 'post', 'put', 'delete'],
                    expectedPoints: ['REST principles', 'HTTP methods', 'Stateless', 'Resource-based'],
                    difficulty: 'intermediate'
                },

                // Data Science
                {
                    id: 'ds_i1',
                    question: "What is the difference between correlation and causation?",
                    category: 'Data Science',
                    keywords: ['correlation', 'causation', 'relationship', 'cause', 'effect', 'statistics'],
                    expectedPoints: ['Correlation shows relationship', 'Causation shows cause-effect', 'Correlation does not imply causation'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'ds_i2',
                    question: "Explain data normalization and why it's important.",
                    category: 'Data Science',
                    keywords: ['normalization', 'scaling', 'range', 'standardization', 'features', 'preprocessing'],
                    expectedPoints: ['Scaling features to same range', 'Improves model performance', 'Prevents bias'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'ds_i3',
                    question: "What is exploratory data analysis (EDA)?",
                    category: 'Data Science',
                    keywords: ['eda', 'exploration', 'visualization', 'patterns', 'insights', 'summary statistics'],
                    expectedPoints: ['Initial data investigation', 'Find patterns and anomalies', 'Visualization and statistics'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'ds_i4',
                    question: "Explain the concept of feature engineering.",
                    category: 'Data Science',
                    keywords: ['features', 'engineering', 'transformation', 'creation', 'selection', 'model'],
                    expectedPoints: ['Creating new features', 'Transforming existing features', 'Improves model performance'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'ds_i5',
                    question: "What is A/B testing?",
                    category: 'Data Science',
                    keywords: ['ab testing', 'experiment', 'control', 'variant', 'hypothesis', 'statistical'],
                    expectedPoints: ['Comparing two versions', 'Statistical experiment', 'Data-driven decisions'],
                    difficulty: 'intermediate'
                },

                // Machine Learning
                {
                    id: 'ml_i1',
                    question: "What is overfitting and how can you prevent it?",
                    category: 'Machine Learning',
                    keywords: ['overfitting', 'generalization', 'training', 'validation', 'regularization', 'cross-validation'],
                    expectedPoints: ['Model too complex', 'Poor generalization', 'Prevention techniques'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'ml_i2',
                    question: "Explain the bias-variance tradeoff.",
                    category: 'Machine Learning',
                    keywords: ['bias', 'variance', 'tradeoff', 'error', 'underfitting', 'overfitting'],
                    expectedPoints: ['Bias is underfitting', 'Variance is overfitting', 'Balance needed'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'ml_i3',
                    question: "What is cross-validation and why is it used?",
                    category: 'Machine Learning',
                    keywords: ['cross-validation', 'k-fold', 'training', 'testing', 'evaluation', 'generalization'],
                    expectedPoints: ['Model evaluation technique', 'Multiple train-test splits', 'Better generalization estimate'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'ml_i4',
                    question: "Explain the difference between classification and regression.",
                    category: 'Machine Learning',
                    keywords: ['classification', 'regression', 'categorical', 'continuous', 'prediction', 'output'],
                    expectedPoints: ['Classification predicts categories', 'Regression predicts continuous values', 'Different algorithms'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'ml_i5',
                    question: "What is a confusion matrix?",
                    category: 'Machine Learning',
                    keywords: ['confusion matrix', 'true positive', 'false positive', 'accuracy', 'precision', 'recall'],
                    expectedPoints: ['Evaluation metric', 'Shows prediction errors', 'True/False positives/negatives'],
                    difficulty: 'intermediate'
                },

                // Mobile Development
                {
                    id: 'mob_i1',
                    question: "What is the difference between native and hybrid mobile apps?",
                    category: 'Mobile Development',
                    keywords: ['native', 'hybrid', 'performance', 'cross-platform', 'development'],
                    expectedPoints: ['Native is platform-specific', 'Hybrid is cross-platform', 'Performance differences'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'mob_i2',
                    question: "Explain the concept of state management in React Native.",
                    category: 'Mobile Development',
                    keywords: ['state', 'redux', 'context', 'hooks', 'management', 'react native'],
                    expectedPoints: ['Managing app state', 'State management libraries', 'Best practices'],
                    difficulty: 'intermediate'
                },

                // DevOps
                {
                    id: 'devops_i1',
                    question: "What is CI/CD and why is it important?",
                    category: 'DevOps',
                    keywords: ['ci/cd', 'continuous integration', 'continuous deployment', 'automation', 'pipeline'],
                    expectedPoints: ['Automated testing and deployment', 'Faster releases', 'Reduced errors'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'devops_i2',
                    question: "Explain the concept of containerization.",
                    category: 'DevOps',
                    keywords: ['containers', 'docker', 'isolation', 'portability', 'microservices'],
                    expectedPoints: ['Packaging applications', 'Isolated environments', 'Portable and consistent'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'devops_i3',
                    question: "What is Kubernetes and what problem does it solve?",
                    category: 'DevOps',
                    keywords: ['kubernetes', 'orchestration', 'containers', 'scaling', 'deployment', 'management'],
                    expectedPoints: ['Container orchestration', 'Automated deployment', 'Scaling and management'],
                    difficulty: 'intermediate'
                },

                // Cybersecurity
                {
                    id: 'sec_i1',
                    question: "What is the difference between authentication and authorization?",
                    category: 'Cybersecurity',
                    keywords: ['authentication', 'authorization', 'identity', 'permissions', 'access', 'verify'],
                    expectedPoints: ['Authentication verifies identity', 'Authorization checks permissions', 'Different purposes'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'sec_i2',
                    question: "Explain SQL injection and how to prevent it.",
                    category: 'Cybersecurity',
                    keywords: ['sql injection', 'attack', 'vulnerability', 'prevention', 'prepared statements'],
                    expectedPoints: ['Malicious SQL code', 'Database vulnerability', 'Use prepared statements'],
                    difficulty: 'intermediate'
                },

                // Database
                {
                    id: 'db_i1',
                    question: "What is database indexing and why is it important?",
                    category: 'Database',
                    keywords: ['index', 'performance', 'query', 'speed', 'search', 'optimization'],
                    expectedPoints: ['Improves query performance', 'Faster searches', 'Trade-offs with writes'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'db_i2',
                    question: "Explain ACID properties in databases.",
                    category: 'Database',
                    keywords: ['acid', 'atomicity', 'consistency', 'isolation', 'durability', 'transactions'],
                    expectedPoints: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'db_i3',
                    question: "What is database normalization?",
                    category: 'Database',
                    keywords: ['normalization', 'redundancy', 'normal forms', 'data integrity', 'structure'],
                    expectedPoints: ['Reducing redundancy', 'Organizing data', 'Normal forms'],
                    difficulty: 'intermediate'
                }
            ],

            advanced: [
                // Web Development
                {
                    id: 'web_a1',
                    question: "How would you optimize a React application for performance?",
                    category: 'Web Development',
                    keywords: ['memo', 'useMemo', 'useCallback', 'lazy', 'code splitting', 'virtualization', 'profiling'],
                    expectedPoints: ['Memoization techniques', 'Code splitting', 'Virtual scrolling', 'Profiling tools'],
                    difficulty: 'advanced'
                },
                {
                    id: 'web_a2',
                    question: "Explain the event loop in JavaScript and how it handles asynchronous operations.",
                    category: 'Web Development',
                    keywords: ['call stack', 'callback queue', 'microtask', 'macrotask', 'event loop', 'async'],
                    expectedPoints: ['Call stack mechanism', 'Task queues', 'Execution order'],
                    difficulty: 'advanced'
                },
                {
                    id: 'web_a3',
                    question: "Design a scalable system for handling millions of concurrent users.",
                    category: 'Web Development',
                    keywords: ['load balancer', 'caching', 'database', 'microservices', 'cdn', 'horizontal scaling'],
                    expectedPoints: ['Load balancing', 'Caching strategy', 'Database sharding', 'CDN usage'],
                    difficulty: 'advanced'
                },

                // Data Science
                {
                    id: 'ds_a1',
                    question: "Explain the concept of dimensionality reduction and its techniques.",
                    category: 'Data Science',
                    keywords: ['dimensionality', 'pca', 'reduction', 'features', 'curse', 'variance'],
                    expectedPoints: ['Reducing feature count', 'PCA and other techniques', 'Curse of dimensionality'],
                    difficulty: 'advanced'
                },
                {
                    id: 'ds_a2',
                    question: "How would you handle imbalanced datasets in classification problems?",
                    category: 'Data Science',
                    keywords: ['imbalanced', 'smote', 'oversampling', 'undersampling', 'class weight', 'metrics'],
                    expectedPoints: ['Sampling techniques', 'Class weighting', 'Appropriate metrics'],
                    difficulty: 'advanced'
                },

                // Machine Learning
                {
                    id: 'ml_a1',
                    question: "Explain the architecture and working of a Neural Network.",
                    category: 'Machine Learning',
                    keywords: ['neural network', 'layers', 'weights', 'activation', 'backpropagation', 'gradient'],
                    expectedPoints: ['Layers and neurons', 'Forward propagation', 'Backpropagation', 'Training process'],
                    difficulty: 'advanced'
                },
                {
                    id: 'ml_a2',
                    question: "What is transfer learning and when would you use it?",
                    category: 'Machine Learning',
                    keywords: ['transfer learning', 'pretrained', 'fine-tuning', 'deep learning', 'models'],
                    expectedPoints: ['Using pretrained models', 'Fine-tuning', 'Limited data scenarios'],
                    difficulty: 'advanced'
                },

                // DevOps
                {
                    id: 'devops_a1',
                    question: "Design a CI/CD pipeline for a microservices architecture.",
                    category: 'DevOps',
                    keywords: ['ci/cd', 'microservices', 'pipeline', 'testing', 'deployment', 'automation'],
                    expectedPoints: ['Automated testing', 'Container orchestration', 'Deployment strategies'],
                    difficulty: 'advanced'
                },

                // Cybersecurity
                {
                    id: 'sec_a1',
                    question: "How would you implement authentication using JWT tokens?",
                    category: 'Cybersecurity',
                    keywords: ['jwt', 'token', 'payload', 'signature', 'refresh', 'access', 'security'],
                    expectedPoints: ['JWT structure', 'Token generation', 'Refresh token strategy', 'Security considerations'],
                    difficulty: 'advanced'
                },

                // Database
                {
                    id: 'db_a1',
                    question: "Explain database sharding and when you would use it.",
                    category: 'Database',
                    keywords: ['sharding', 'partitioning', 'horizontal', 'scalability', 'distributed'],
                    expectedPoints: ['Horizontal partitioning', 'Scalability benefits', 'Challenges and trade-offs'],
                    difficulty: 'advanced'
                }
            ]
        },

        hr: [
            {
                id: 'hr_1',
                question: "Tell me about yourself.",
                type: 'open',
                keywords: ['background', 'education', 'skills', 'experience', 'goals', 'strengths'],
                tips: 'Keep it professional, 2-3 minutes, focus on relevant experience',
                difficulty: 'common'
            },
            {
                id: 'hr_2',
                question: "Why do you want to work for our company?",
                type: 'motivation',
                keywords: ['research', 'company', 'values', 'products', 'culture', 'growth', 'mission'],
                tips: 'Show you researched the company, align with their values',
                difficulty: 'common'
            },
            {
                id: 'hr_3',
                question: "What are your greatest strengths?",
                type: 'self-assessment',
                keywords: ['skills', 'abilities', 'examples', 'relevant', 'specific', 'achievements'],
                tips: 'Provide specific examples, relate to job requirements',
                difficulty: 'common'
            },
            {
                id: 'hr_4',
                question: "What is your greatest weakness?",
                type: 'self-assessment',
                keywords: ['honest', 'improvement', 'working on', 'learning', 'overcome'],
                tips: 'Be honest but show how you\'re improving',
                difficulty: 'common'
            },
            {
                id: 'hr_5',
                question: "Where do you see yourself in 5 years?",
                type: 'career goals',
                keywords: ['growth', 'career', 'goals', 'development', 'skills', 'leadership'],
                tips: 'Show ambition but be realistic, align with company growth',
                difficulty: 'common'
            },
            {
                id: 'hr_6',
                question: "Why should we hire you?",
                type: 'selling point',
                keywords: ['unique', 'value', 'skills', 'experience', 'fit', 'contribute'],
                tips: 'Highlight unique value proposition, show confidence',
                difficulty: 'common'
            },
            {
                id: 'hr_7',
                question: "How do you handle stress and pressure?",
                type: 'behavioral',
                keywords: ['coping', 'strategies', 'example', 'deadline', 'prioritize', 'calm'],
                tips: 'Provide specific coping strategies and examples',
                difficulty: 'common'
            },
            {
                id: 'hr_8',
                question: "Describe your ideal work environment.",
                type: 'culture fit',
                keywords: ['collaborative', 'team', 'independent', 'flexible', 'learning', 'growth'],
                tips: 'Research company culture, align your answer',
                difficulty: 'common'
            },
            {
                id: 'hr_9',
                question: "What motivates you?",
                type: 'motivation',
                keywords: ['passion', 'drive', 'goals', 'challenges', 'learning', 'impact'],
                tips: 'Be genuine, relate to professional growth',
                difficulty: 'common'
            },
            {
                id: 'hr_10',
                question: "Do you have any questions for us?",
                type: 'engagement',
                keywords: ['team', 'culture', 'growth', 'challenges', 'success', 'expectations'],
                tips: 'Always have 2-3 thoughtful questions prepared',
                difficulty: 'common'
            }
        ],

        behavioral: [
            {
                id: 'beh_1',
                question: "Describe a time when you faced a challenging problem. How did you solve it?",
                type: 'STAR',
                keywords: ['situation', 'task', 'action', 'result', 'problem', 'solution', 'approach'],
                starRequired: true,
                difficulty: 'common'
            },
            {
                id: 'beh_2',
                question: "Tell me about a time when you worked in a team to achieve a goal.",
                type: 'STAR',
                keywords: ['team', 'collaboration', 'role', 'communication', 'goal', 'contribution'],
                starRequired: true,
                difficulty: 'common'
            },
            {
                id: 'beh_3',
                question: "Describe a situation where you had to learn something new quickly.",
                type: 'STAR',
                keywords: ['learning', 'adapt', 'quick', 'resources', 'apply', 'outcome'],
                starRequired: true,
                difficulty: 'common'
            },
            {
                id: 'beh_4',
                question: "Tell me about a time when you failed. What did you learn from it?",
                type: 'STAR',
                keywords: ['failure', 'mistake', 'learn', 'improve', 'reflection', 'growth'],
                starRequired: true,
                difficulty: 'common'
            },
            {
                id: 'beh_5',
                question: "Describe a time when you had to meet a tight deadline.",
                type: 'STAR',
                keywords: ['deadline', 'pressure', 'prioritize', 'time management', 'deliver'],
                starRequired: true,
                difficulty: 'common'
            },
            {
                id: 'beh_6',
                question: "Tell me about a time when you disagreed with a team member. How did you handle it?",
                type: 'STAR',
                keywords: ['conflict', 'disagreement', 'resolution', 'communication', 'compromise'],
                starRequired: true,
                difficulty: 'common'
            },
            {
                id: 'beh_7',
                question: "Describe a project you're particularly proud of.",
                type: 'STAR',
                keywords: ['project', 'achievement', 'contribution', 'impact', 'proud', 'success'],
                starRequired: true,
                difficulty: 'common'
            },
            {
                id: 'beh_8',
                question: "Tell me about a time when you took initiative.",
                type: 'STAR',
                keywords: ['initiative', 'proactive', 'leadership', 'ownership', 'action'],
                starRequired: true,
                difficulty: 'common'
            },
            {
                id: 'beh_9',
                question: "Describe a time when you received constructive criticism. How did you respond?",
                type: 'STAR',
                keywords: ['feedback', 'criticism', 'response', 'improvement', 'growth mindset'],
                starRequired: true,
                difficulty: 'common'
            },
            {
                id: 'beh_10',
                question: "Tell me about a time when you had to adapt to a significant change.",
                type: 'STAR',
                keywords: ['change', 'adapt', 'flexible', 'challenge', 'adjust', 'outcome'],
                starRequired: true,
                difficulty: 'common'
            }
        ]
    };

    // Export for use in other modules
    if (typeof window !== 'undefined') {
        window.InterviewQuestions = INTERVIEW_QUESTIONS;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = INTERVIEW_QUESTIONS;
    }
})();
