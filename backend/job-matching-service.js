/**
 * Job Matching Service
 * Handles job data fetching, filtering, matching algorithm, and saved jobs
 */

(function () {
    'use strict';

    /**
     * Get all jobs from Supabase
     * @returns {Promise<Array>} Array of job objects
     */
    async function getAllJobs() {
        try {
            const supabase = window.supabaseClient;

            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('posted_date', { ascending: false });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error fetching jobs:', error);
            return [];
        }
    }

    /**
     * Get a single job by ID
     * @param {string} jobId - Job ID
     * @returns {Promise<Object>} Job object
     */
    async function getJobById(jobId) {
        try {
            const supabase = window.supabaseClient;

            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('id', jobId)
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Error fetching job:', error);
            return null;
        }
    }

    /**
     * Save a job bookmark
     * @param {string} userId - User ID
     * @param {string} jobId - Job ID
     * @param {boolean} save - True to save, false to unsave
     * @returns {Promise<Object>} Result
     */
    async function saveJobBookmark(userId, jobId, save = true) {
        try {
            const supabase = window.supabaseClient;

            if (save) {
                // Save bookmark
                const { data, error } = await supabase
                    .from('saved_jobs')
                    .insert([
                        {
                            user_id: userId,
                            job_id: jobId,
                            saved_at: new Date().toISOString()
                        }
                    ])
                    .select();

                if (error) {
                    // If already exists, ignore
                    if (error.code === '23505') {
                        return { success: true, message: 'Already saved' };
                    }
                    throw error;
                }

                return { success: true, data: data };
            } else {
                // Remove bookmark
                const { error } = await supabase
                    .from('saved_jobs')
                    .delete()
                    .eq('user_id', userId)
                    .eq('job_id', jobId);

                if (error) throw error;

                return { success: true, message: 'Bookmark removed' };
            }
        } catch (error) {
            console.error('Error saving bookmark:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get saved jobs for a user
     * @param {string} userId - User ID
     * @returns {Promise<Array>} Array of saved job IDs
     */
    async function getSavedJobs(userId) {
        try {
            const supabase = window.supabaseClient;

            const { data, error } = await supabase
                .from('saved_jobs')
                .select('job_id')
                .eq('user_id', userId);

            if (error) throw error;

            return data ? data.map(item => item.job_id) : [];
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
            return [];
        }
    }

    /**
     * Save a job application
     * @param {string} userId - User ID
     * @param {string} jobId - Job ID
     * @param {Object} applicationData - Additional application data
     * @returns {Promise<Object>} Result
     */
    async function saveJobApplication(userId, jobId, applicationData = {}) {
        try {
            const supabase = window.supabaseClient;

            const { data, error } = await supabase
                .from('job_applications')
                .insert([
                    {
                        user_id: userId,
                        job_id: jobId,
                        status: 'applied',
                        applied_at: new Date().toISOString(),
                        notes: applicationData.notes || null
                    }
                ])
                .select();

            if (error) throw error;

            return { success: true, data: data };
        } catch (error) {
            console.error('Error saving application:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get application history for a user
     * @param {string} userId - User ID
     * @returns {Promise<Array>} Array of applications
     */
    async function getApplicationHistory(userId) {
        try {
            const supabase = window.supabaseClient;

            const { data, error } = await supabase
                .from('job_applications')
                .select('*')
                .eq('user_id', userId)
                .order('applied_at', { ascending: false });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error fetching applications:', error);
            return [];
        }
    }

    /**
     * Save job search preferences
     * @param {string} userId - User ID
     * @param {Object} preferences - Preferences object
     * @returns {Promise<Object>} Result
     */
    async function saveJobPreferences(userId, preferences) {
        try {
            const supabase = window.supabaseClient;

            const { data, error } = await supabase
                .from('job_preferences')
                .upsert([
                    {
                        user_id: userId,
                        preferred_locations: preferences.locations || [],
                        preferred_job_types: preferences.jobTypes || [],
                        min_salary: preferences.minSalary || null,
                        max_salary: preferences.maxSalary || null,
                        updated_at: new Date().toISOString()
                    }
                ])
                .select();

            if (error) throw error;

            return { success: true, data: data };
        } catch (error) {
            console.error('Error saving preferences:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get job search preferences
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Preferences object
     */
    async function getJobPreferences(userId) {
        try {
            const supabase = window.supabaseClient;

            const { data, error } = await supabase
                .from('job_preferences')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // No preferences found
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error fetching preferences:', error);
            return null;
        }
    }

    /**
     * Calculate match score for a job based on user profile
     * @param {Object} job - Job object
     * @param {Object} userProfile - User profile object
     * @returns {number} Match score (0-100)
     */
    function calculateMatchScore(job, userProfile) {
        let score = 0;

        // Skills match (40% weight)
        if (job.required_skills && userProfile.skills) {
            const jobSkills = job.required_skills.map(s => s.toLowerCase());
            const userSkills = userProfile.skills.map(s => s.toLowerCase());

            const matchingSkills = jobSkills.filter(skill =>
                userSkills.some(us => us.includes(skill) || skill.includes(us))
            );

            const skillsScore = (matchingSkills.length / jobSkills.length) * 40;
            score += skillsScore;
        } else {
            score += 20; // Default partial score
        }

        // Experience match (20% weight)
        if (job.experience_min !== null && job.experience_max !== null && userProfile.yearsOfExperience !== undefined) {
            const userExp = userProfile.yearsOfExperience;
            if (userExp >= job.experience_min && userExp <= job.experience_max) {
                score += 20;
            } else if (userExp >= job.experience_min - 1 && userExp <= job.experience_max + 1) {
                score += 15; // Close match
            } else {
                score += 5; // Partial credit
            }
        } else {
            score += 10; // Default partial score
        }

        // Location match (15% weight)
        if (job.location && userProfile.preferredLocations) {
            const isLocationMatch = userProfile.preferredLocations.some(loc =>
                job.location.toLowerCase().includes(loc.toLowerCase()) ||
                loc.toLowerCase().includes(job.location.toLowerCase())
            );
            score += isLocationMatch ? 15 : 5;
        } else {
            score += 7; // Default partial score
        }

        // Resume quality (15% weight) - from resume analyzer score
        if (userProfile.resumeScore) {
            score += (userProfile.resumeScore / 100) * 15;
        } else {
            score += 7; // Default partial score
        }

        // Company fit (10% weight) - from career recommendations
        if (job.company_name && userProfile.targetCompanies) {
            const isCompanyMatch = userProfile.targetCompanies.some(company =>
                job.company_name.toLowerCase().includes(company.toLowerCase()) ||
                company.toLowerCase().includes(job.company_name.toLowerCase())
            );
            score += isCompanyMatch ? 10 : 3;
        } else {
            score += 5; // Default partial score
        }

        // Ensure score is between 0 and 100
        return Math.min(100, Math.max(0, Math.round(score)));
    }

    /**
     * Filter jobs based on criteria
     * @param {Array} jobs - Array of jobs
     * @param {Object} filters - Filter criteria
     * @returns {Array} Filtered jobs
     */
    function filterJobs(jobs, filters) {
        return jobs.filter(job => {
            // Location filter
            if (filters.locations && filters.locations.length > 0) {
                if (!filters.locations.includes(job.location)) {
                    return false;
                }
            }

            // Job type filter
            if (filters.jobTypes && filters.jobTypes.length > 0) {
                if (!filters.jobTypes.includes(job.job_type)) {
                    return false;
                }
            }

            // Experience level filter
            if (filters.experienceLevels && filters.experienceLevels.length > 0) {
                if (!filters.experienceLevels.includes(job.experience_level)) {
                    return false;
                }
            }

            // Work mode filter
            if (filters.workModes && filters.workModes.length > 0) {
                if (!filters.workModes.includes(job.work_mode)) {
                    return false;
                }
            }

            // Salary filter
            if (filters.minSalary && job.salary_max) {
                if (job.salary_max < filters.minSalary) {
                    return false;
                }
            }

            if (filters.maxSalary && job.salary_min) {
                if (job.salary_min > filters.maxSalary) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Sort jobs based on criteria
     * @param {Array} jobs - Array of jobs
     * @param {string} sortBy - Sort criteria (match, recent, salary)
     * @returns {Array} Sorted jobs
     */
    function sortJobs(jobs, sortBy = 'match') {
        const sortedJobs = [...jobs];

        switch (sortBy) {
            case 'match':
                sortedJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
                break;
            case 'recent':
                sortedJobs.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
                break;
            case 'salary':
                sortedJobs.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
                break;
            default:
                break;
        }

        return sortedJobs;
    }

    // Export functions
    if (typeof window !== 'undefined') {
        window.JobMatchingService = {
            getAllJobs,
            getJobById,
            saveJobBookmark,
            getSavedJobs,
            saveJobApplication,
            getApplicationHistory,
            saveJobPreferences,
            getJobPreferences,
            calculateMatchScore,
            filterJobs,
            sortJobs,
            fetchJobsFromAggregator,
            searchJobs
        };
    }

    /**
     * Fetch jobs from REAL public aggregators
     * 1. Remotive API (Filtered for India)
     * 2. The Muse (Filtered for India)
     * @param {string} query - Search query (optional)
     * @returns {Promise<Array>} Array of normalized job objects
     */
    async function fetchJobsFromAggregator(query = '') {
        const aggregatedJobs = [];
        const corsProxy = 'https://api.allorigins.win/get?url=';

        // 1. Fetch from Remotive (Massive DB, Filter Client Side for India)
        try {
            // Remotive allows fetching all jobs. We will fetch and then filter locally for "India"
            // This is efficient because the JSON is cached by browser/CDN usually
            let remotiveUrl = `https://remotive.com/api/remote-jobs`;
            if (query) {
                remotiveUrl += `?search=${encodeURIComponent(query)}`;
            }

            const response = await fetch(remotiveUrl);
            if (response.ok) {
                const data = await response.json();
                const indiaJobs = data.jobs.filter(job => {
                    const loc = job.candidate_required_location.toLowerCase();
                    const title = job.title.toLowerCase();
                    const desc = job.description.toLowerCase();

                    // Strict India Filter
                    return loc.includes('india') ||
                        loc.includes('worldwide') ||
                        loc.includes('anywhere') ||
                        title.includes('india') ||
                        desc.includes('bangalore') ||
                        desc.includes('mumbai') ||
                        desc.includes('delhi') ||
                        desc.includes('pune') ||
                        desc.includes('hyderabad') ||
                        desc.includes('chennai');
                }).map(job => ({
                    id: `remotive-${job.id}`,
                    title: job.title,
                    company_name: job.company_name,
                    location: job.candidate_required_location || 'Remote',
                    job_type: job.job_type || 'Full-time',
                    experience_level: 'Mid Level', // Remotive doesn't always specify
                    salary_min: null,
                    salary_max: null,
                    posted_date: job.publication_date,
                    description: job.description,
                    apply_link: job.url,
                    required_skills: job.tags || [],
                    is_external: true,
                    source: 'Remotive'
                }));

                aggregatedJobs.push(...indiaJobs);
            }
        } catch (error) {
            console.warn('Error fetching from Remotive:', error);
        }

        // 2. Fetch from The Muse (Tech jobs focus, backup)
        try {
            let museUrl = `https://www.themuse.com/api/public/jobs?category=Software%20Engineering&category=Data%20Science&descending=true&page=1`;
            if (query) {
                museUrl += `&level=${encodeURIComponent(query)}`;
            }

            const response = await fetch(museUrl);
            if (response.ok) {
                const data = await response.json();
                const museJobs = data.results
                    .filter(job => {
                        // Strict Location Filtering for India
                        const locationString = job.locations.map(l => l.name).join(', ').toLowerCase();
                        return locationString.includes('india') || locationString.includes('bangalore') || locationString.includes('mumbai') || locationString.includes('delhi') || locationString.includes('pune') || locationString.includes('hyderabad') || locationString.includes('chennai') || locationString.includes('gurgaon') || locationString.includes('noida');
                    })
                    .map(job => ({
                        id: `muse-${job.id}`,
                        title: job.name,
                        company_name: job.company.name,
                        location: job.locations[0]?.name || 'India (Remote)',
                        job_type: 'Full-time',
                        experience_level: job.levels[0]?.name || 'Mid Level',
                        salary_min: null,
                        salary_max: null,
                        posted_date: job.publication_date,
                        description: job.contents,
                        apply_link: job.refs.landing_page,
                        required_skills: [],
                        is_external: true,
                        source: 'The Muse'
                    }));
                aggregatedJobs.push(...museJobs);
            }
        } catch (error) {
            console.warn('Error fetching from The Muse:', error);
        }

        return aggregatedJobs;
    }

    /**
     * Search jobs across internal DB and external aggregators
     * @param {string} query - Search query
     * @param {Object} filters - Filters to apply
     * @returns {Promise<Object>} Object with internal and external jobs
     */
    async function searchJobs(query, filters = {}) {
        // 1. Get internal jobs
        const allInternalJobs = await getAllJobs();

        let filteredInternal = allInternalJobs;
        if (query) {
            const lowerQuery = query.toLowerCase();
            filteredInternal = allInternalJobs.filter(job =>
                job.title.toLowerCase().includes(lowerQuery) ||
                job.company_name.toLowerCase().includes(lowerQuery) ||
                (job.required_skills && job.required_skills.some(s => s.toLowerCase().includes(lowerQuery)))
            );
        }
        filteredInternal = filterJobs(filteredInternal, filters);

        // 2. Get external jobs
        // Remotive usually returns a lot of jobs, so filtering effectively is key
        const externalJobs = await fetchJobsFromAggregator(query);

        let filteredExternal = externalJobs;
        if (query) {
            const lowerQuery = query.toLowerCase();
            filteredExternal = filteredExternal.filter(job =>
                job.title.toLowerCase().includes(lowerQuery) ||
                job.company_name.toLowerCase().includes(lowerQuery)
            );
        }

        // Apply local filtering to external jobs too
        if (filters.locations && filters.locations.length > 0) {
            // Basic external location filtering
            filteredExternal = filteredExternal.filter(j =>
                filters.locations.some(loc => j.location.toLowerCase().includes(loc.toLowerCase())) ||
                (filters.locations.includes('Remote') && j.location.toLowerCase().includes('remote'))
            );
        }

        return {
            internal: filteredInternal,
            external: filteredExternal,
            all: [...filteredInternal, ...filteredExternal]
        };
    }
})();
