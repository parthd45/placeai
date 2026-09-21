/**
 * Mock Interview Service
 * Handles interview sessions, answer evaluation, and feedback generation
 * 100% Free - No API costs, pure JavaScript logic
 */

(function () {
    'use strict';

    const InterviewService = {
        // Get questions by type and difficulty
        getQuestions: function (type, difficulty, count = 10, domain = null) {
            const questions = window.InterviewQuestions || {};
            let questionPool = [];

            if (type === 'technical') {
                questionPool = questions.technical[difficulty] || [];

                // Filter by domain if specified
                if (domain && domain !== 'general') {
                    // Map domain to category keywords
                    const domainMap = {
                        'web-development': ['Web Development', 'JavaScript', 'React', 'Node.js', 'Frontend', 'Backend'],
                        'data-science': ['Data Science', 'Analytics', 'Python', 'Statistics'],
                        'machine-learning': ['Machine Learning', 'AI', 'Deep Learning', 'Neural Networks'],
                        'mobile-development': ['Mobile', 'Android', 'iOS', 'React Native', 'Flutter'],
                        'devops': ['DevOps', 'Cloud', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'],
                        'cybersecurity': ['Security', 'Cybersecurity', 'Encryption', 'Authentication'],
                        'database': ['Database', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL']
                    };

                    const domainCategories = domainMap[domain] || [];
                    questionPool = questionPool.filter(q =>
                        domainCategories.some(cat =>
                            (q.category || '').toLowerCase().includes(cat.toLowerCase())
                        )
                    );
                }
            } else if (type === 'hr') {
                questionPool = questions.hr || [];
            } else if (type === 'behavioral') {
                questionPool = questions.behavioral || [];
            }

            // Shuffle and return random questions
            const shuffled = this.shuffleArray([...questionPool]);
            return shuffled.slice(0, Math.min(count, shuffled.length));
        },

        // Shuffle array helper
        shuffleArray: function (array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },

        // Main evaluation function
        evaluateAnswer: function (question, answer) {
            if (!answer || answer.trim().length === 0) {
                return {
                    score: 0,
                    breakdown: {
                        keywords: 0,
                        length: 0,
                        structure: 0,
                        clarity: 0
                    },
                    feedback: {
                        overall: 'Please provide an answer.',
                        keywords: 'No answer provided.',
                        length: 'No answer provided.',
                        structure: 'No answer provided.',
                        clarity: 'No answer provided.'
                    },
                    suggestions: ['Please type your answer to continue.']
                };
            }

            const breakdown = {
                keywords: this.calculateKeywordScore(answer, question.keywords || []),
                length: this.calculateLengthScore(answer),
                structure: this.calculateStructureScore(answer, question),
                clarity: this.calculateClarityScore(answer)
            };

            // Weighted total score
            const score = Math.round(
                breakdown.keywords * 0.4 +
                breakdown.length * 0.2 +
                breakdown.structure * 0.2 +
                breakdown.clarity * 0.2
            );

            const feedback = this.generateFeedback(breakdown, question, answer);
            const suggestions = this.generateSuggestions(breakdown, question);

            return {
                score,
                breakdown,
                feedback,
                suggestions
            };
        },

        // Calculate keyword matching score (0-100)
        calculateKeywordScore: function (answer, keywords) {
            if (!keywords || keywords.length === 0) return 50;

            const answerLower = answer.toLowerCase();
            let matchedKeywords = 0;

            keywords.forEach(keyword => {
                if (answerLower.includes(keyword.toLowerCase())) {
                    matchedKeywords++;
                }
            });

            const matchPercentage = (matchedKeywords / keywords.length) * 100;
            return Math.min(100, matchPercentage);
        },

        // Calculate length score (0-100)
        calculateLengthScore: function (answer) {
            const wordCount = answer.trim().split(/\s+/).length;

            if (wordCount < 20) {
                return Math.min(50, wordCount * 2.5); // Too short
            } else if (wordCount >= 50 && wordCount <= 200) {
                return 100; // Ideal length
            } else if (wordCount > 200 && wordCount <= 300) {
                return 80; // A bit long but okay
            } else if (wordCount > 300) {
                return Math.max(50, 100 - (wordCount - 300) / 5); // Too long
            }

            return 70; // Default for 20-50 words
        },

        // Calculate structure score (0-100)
        calculateStructureScore: function (answer, question) {
            let score = 50; // Base score

            // Check for STAR method in behavioral questions
            if (question.starRequired || question.type === 'STAR') {
                const hasSTAR = this.checkSTARMethod(answer);
                score = hasSTAR ? 100 : 40;
            } else {
                // Check for good structure (introduction, body, conclusion)
                const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);

                if (sentences.length >= 3) {
                    score = 80;
                }

                // Bonus for examples
                if (answer.toLowerCase().includes('example') ||
                    answer.toLowerCase().includes('for instance') ||
                    answer.toLowerCase().includes('such as')) {
                    score = Math.min(100, score + 20);
                }
            }

            return score;
        },

        // Check for STAR method
        checkSTARMethod: function (answer) {
            const answerLower = answer.toLowerCase();
            const starIndicators = {
                situation: ['situation', 'context', 'background', 'scenario'],
                task: ['task', 'goal', 'objective', 'challenge', 'problem'],
                action: ['action', 'did', 'implemented', 'developed', 'created', 'took'],
                result: ['result', 'outcome', 'achieved', 'success', 'impact', 'learned']
            };

            let starCount = 0;
            for (const [key, indicators] of Object.entries(starIndicators)) {
                const hasIndicator = indicators.some(indicator =>
                    answerLower.includes(indicator)
                );
                if (hasIndicator) starCount++;
            }

            return starCount >= 3; // At least 3 out of 4 STAR components
        },

        // Calculate clarity score (0-100)
        calculateClarityScore: function (answer) {
            let score = 100;

            // Check for filler words
            const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally'];
            const answerLower = answer.toLowerCase();
            let fillerCount = 0;

            fillerWords.forEach(filler => {
                const regex = new RegExp(`\\b${filler}\\b`, 'gi');
                const matches = answerLower.match(regex);
                if (matches) fillerCount += matches.length;
            });

            score -= fillerCount * 5; // Deduct 5 points per filler word

            // Check for proper sentences
            const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
            if (sentences.length === 0) {
                score -= 30;
            }

            // Check for capitalization
            const hasProperCapitalization = /^[A-Z]/.test(answer.trim());
            if (!hasProperCapitalization) {
                score -= 10;
            }

            return Math.max(0, Math.min(100, score));
        },

        // Generate detailed feedback
        generateFeedback: function (breakdown, question, answer) {
            const feedback = {};

            // Overall feedback
            if (breakdown.keywords + breakdown.length + breakdown.structure + breakdown.clarity >= 320) {
                feedback.overall = '🎉 Excellent answer! You covered all key points effectively.';
            } else if (breakdown.keywords + breakdown.length + breakdown.structure + breakdown.clarity >= 240) {
                feedback.overall = '👍 Good answer! You addressed most important aspects.';
            } else if (breakdown.keywords + breakdown.length + breakdown.structure + breakdown.clarity >= 160) {
                feedback.overall = '👌 Decent answer, but there\'s room for improvement.';
            } else {
                feedback.overall = '💡 Your answer needs more detail and relevant information.';
            }

            // Keyword feedback
            if (breakdown.keywords >= 80) {
                feedback.keywords = 'Great use of relevant technical terms!';
            } else if (breakdown.keywords >= 50) {
                feedback.keywords = 'You mentioned some key concepts, but could include more.';
            } else {
                feedback.keywords = 'Try to include more relevant keywords and technical terms.';
            }

            // Length feedback
            const wordCount = answer.trim().split(/\s+/).length;
            if (breakdown.length >= 90) {
                feedback.length = `Perfect length (${wordCount} words).`;
            } else if (wordCount < 20) {
                feedback.length = `Answer is too brief (${wordCount} words). Aim for 50-200 words.`;
            } else if (wordCount > 300) {
                feedback.length = `Answer is too long (${wordCount} words). Try to be more concise.`;
            } else {
                feedback.length = `Good length (${wordCount} words).`;
            }

            // Structure feedback
            if (question.starRequired && breakdown.structure >= 80) {
                feedback.structure = 'Excellent use of STAR method!';
            } else if (question.starRequired && breakdown.structure < 80) {
                feedback.structure = 'Try using STAR method: Situation, Task, Action, Result.';
            } else if (breakdown.structure >= 80) {
                feedback.structure = 'Well-structured answer with clear flow.';
            } else {
                feedback.structure = 'Consider adding examples or organizing your answer better.';
            }

            // Clarity feedback
            if (breakdown.clarity >= 90) {
                feedback.clarity = 'Very clear and professional communication!';
            } else if (breakdown.clarity >= 70) {
                feedback.clarity = 'Clear communication with minor improvements possible.';
            } else {
                feedback.clarity = 'Avoid filler words and ensure proper sentence structure.';
            }

            return feedback;
        },

        // Generate improvement suggestions
        generateSuggestions: function (breakdown, question) {
            const suggestions = [];

            if (breakdown.keywords < 60 && question.keywords) {
                const missingKeywords = question.keywords.slice(0, 3).join(', ');
                suggestions.push(`💡 Try mentioning: ${missingKeywords}`);
            }

            if (breakdown.length < 70) {
                suggestions.push('📝 Provide more details and examples to strengthen your answer.');
            }

            if (breakdown.structure < 70 && question.starRequired) {
                suggestions.push('⭐ Use STAR method: Describe the Situation, Task, Action you took, and Result.');
            }

            if (breakdown.clarity < 70) {
                suggestions.push('✨ Use clear, professional language. Avoid filler words.');
            }

            if (question.expectedPoints && question.expectedPoints.length > 0) {
                suggestions.push(`🎯 Key points to cover: ${question.expectedPoints.join(', ')}`);
            }

            return suggestions.length > 0 ? suggestions : ['Keep up the good work!'];
        },

        // Generate final interview report
        generateReport: function (answers) {
            const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
            const averageScore = Math.round(totalScore / answers.length);

            const categoryScores = {};
            answers.forEach(answer => {
                const category = answer.question.category || 'General';
                if (!categoryScores[category]) {
                    categoryScores[category] = { total: 0, count: 0 };
                }
                categoryScores[category].total += answer.score;
                categoryScores[category].count++;
            });

            const strengths = [];
            const weaknesses = [];
            const recommendations = [];

            // Analyze performance
            Object.entries(categoryScores).forEach(([category, data]) => {
                const avg = Math.round(data.total / data.count);
                if (avg >= 75) {
                    strengths.push(`Strong performance in ${category} (${avg}%)`);
                } else if (avg < 60) {
                    weaknesses.push(`Needs improvement in ${category} (${avg}%)`);
                    recommendations.push(`Study more about ${category} concepts`);
                }
            });

            // Overall recommendations
            if (averageScore >= 80) {
                recommendations.push('You\'re well-prepared! Focus on mock interviews for confidence.');
            } else if (averageScore >= 60) {
                recommendations.push('Good foundation. Practice more technical questions.');
            } else {
                recommendations.push('Focus on fundamentals and practice regularly.');
            }

            return {
                averageScore,
                totalQuestions: answers.length,
                categoryScores,
                strengths: strengths.length > 0 ? strengths : ['Keep practicing to identify strengths'],
                weaknesses: weaknesses.length > 0 ? weaknesses : ['No major weaknesses identified'],
                recommendations
            };
        }
    };

    // Export for use in HTML pages
    if (typeof window !== 'undefined') {
        window.InterviewService = InterviewService;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = InterviewService;
    }
})();
