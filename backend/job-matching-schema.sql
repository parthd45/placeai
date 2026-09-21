-- PlaceAI Job Matching Database Schema
-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- ============================================
-- JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL, -- Full-time, Part-time, Contract, Internship
  experience_level TEXT NOT NULL, -- Entry Level, Mid Level, Senior Level
  work_mode TEXT, -- Remote, Hybrid, On-site
  salary_min INTEGER,
  salary_max INTEGER,
  required_skills TEXT[], -- Array of skills
  responsibilities TEXT[], -- Array of responsibilities
  requirements TEXT[], -- Array of requirements
  experience_min INTEGER,
  experience_max INTEGER,
  application_url TEXT,
  posted_date TIMESTAMP DEFAULT NOW(),
  deadline_date TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SAVED JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- ============================================
-- JOB APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'applied', -- applied, interview, offered, accepted, rejected
  applied_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- JOB PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS job_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_locations JSONB,
  preferred_job_types JSONB,
  min_salary INTEGER,
  max_salary INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_preferences ENABLE ROW LEVEL SECURITY;

-- Jobs: Everyone can read active jobs
CREATE POLICY "Anyone can view active jobs" ON jobs
  FOR SELECT USING (is_active = true);

-- Saved Jobs: Users can only see their own saved jobs
CREATE POLICY "Users can view their own saved jobs" ON saved_jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved jobs" ON saved_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved jobs" ON saved_jobs
  FOR DELETE USING (auth.uid() = user_id);

-- Job Applications: Users can only see their own applications
CREATE POLICY "Users can view their own applications" ON job_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications" ON job_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON job_applications
  FOR UPDATE USING (auth.uid() = user_id);

-- Job Preferences: Users can only see and modify their own preferences
CREATE POLICY "Users can view their own preferences" ON job_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON job_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON job_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- SAMPLE JOB DATA (50+ realistic jobs)
-- ============================================

INSERT INTO jobs (title, company_name, description, location, job_type, experience_level, work_mode, salary_min, salary_max, required_skills, responsibilities, requirements, experience_min, experience_max, application_url) VALUES

-- Tech Companies - Software Engineering
('Senior Software Engineer', 'Google', 'Join our team to build scalable systems that impact billions of users. Work on cutting-edge technologies and solve complex problems.', 'Bangalore', 'Full-time', 'Senior Level', 'Hybrid', 2000000, 4000000, ARRAY['Java', 'Python', 'Distributed Systems', 'Kubernetes'], ARRAY['Design and implement scalable backend systems', 'Mentor junior engineers', 'Collaborate with cross-functional teams'], ARRAY['5+ years of software development experience', 'Strong problem-solving skills', 'Experience with cloud platforms'], 5, 10, 'https://careers.google.com'),

('Frontend Developer', 'Microsoft', 'Build beautiful and responsive user interfaces for Microsoft products used by millions worldwide.', 'Hyderabad', 'Full-time', 'Mid Level', 'Hybrid', 1200000, 2000000, ARRAY['React', 'TypeScript', 'CSS', 'JavaScript'], ARRAY['Develop responsive web applications', 'Optimize application performance', 'Write clean, maintainable code'], ARRAY['3+ years of frontend development experience', 'Strong knowledge of React and TypeScript', 'Experience with modern build tools'], 3, 6, 'https://careers.microsoft.com'),

('Full Stack Developer', 'Amazon', 'Work on end-to-end development of e-commerce platforms serving millions of customers daily.', 'Bangalore', 'Full-time', 'Mid Level', 'On-site', 1500000, 2500000, ARRAY['Node.js', 'React', 'AWS', 'MongoDB'], ARRAY['Build and maintain full-stack applications', 'Design RESTful APIs', 'Ensure application scalability'], ARRAY['4+ years of full-stack development', 'Experience with AWS services', 'Strong database knowledge'], 4, 7, 'https://amazon.jobs'),

('DevOps Engineer', 'Flipkart', 'Manage and optimize our cloud infrastructure to ensure high availability and performance.', 'Bangalore', 'Full-time', 'Mid Level', 'Hybrid', 1400000, 2200000, ARRAY['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'], ARRAY['Automate deployment processes', 'Monitor system performance', 'Implement security best practices'], ARRAY['3+ years of DevOps experience', 'Strong knowledge of containerization', 'Experience with infrastructure as code'], 3, 6, 'https://flipkart.com/careers'),

('Data Scientist', 'Swiggy', 'Use data to drive business decisions and improve customer experience through machine learning models.', 'Bangalore', 'Full-time', 'Senior Level', 'Remote', 1800000, 3000000, ARRAY['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'], ARRAY['Build predictive models', 'Analyze large datasets', 'Present insights to stakeholders'], ARRAY['5+ years of data science experience', 'Strong statistical knowledge', 'Experience with ML frameworks'], 5, 8, 'https://careers.swiggy.com'),

-- Startups
('Backend Engineer', 'Razorpay', 'Build robust payment systems that process billions in transactions securely and efficiently.', 'Bangalore', 'Full-time', 'Mid Level', 'Hybrid', 1300000, 2100000, ARRAY['Go', 'PostgreSQL', 'Redis', 'Microservices'], ARRAY['Develop payment processing systems', 'Optimize database queries', 'Ensure system reliability'], ARRAY['3+ years of backend development', 'Experience with payment systems', 'Strong understanding of databases'], 3, 6, 'https://razorpay.com/jobs'),

('Product Manager', 'CRED', 'Lead product strategy and execution for innovative fintech products.', 'Bangalore', 'Full-time', 'Senior Level', 'On-site', 2500000, 4000000, ARRAY['Product Management', 'Analytics', 'User Research', 'Agile'], ARRAY['Define product roadmap', 'Work with engineering and design teams', 'Analyze user metrics'], ARRAY['5+ years of product management experience', 'Strong analytical skills', 'Experience in fintech'], 5, 10, 'https://careers.cred.club'),

('Mobile App Developer', 'Zomato', 'Create delightful mobile experiences for millions of food lovers across India.', 'Gurgaon', 'Full-time', 'Mid Level', 'Hybrid', 1200000, 2000000, ARRAY['React Native', 'iOS', 'Android', 'JavaScript'], ARRAY['Develop cross-platform mobile applications', 'Optimize app performance', 'Implement new features'], ARRAY['3+ years of mobile development', 'Experience with React Native', 'Published apps on App Store/Play Store'], 3, 6, 'https://zomato.com/careers'),

-- Entry Level Opportunities
('Junior Software Engineer', 'Infosys', 'Start your career in software development with comprehensive training and mentorship.', 'Pune', 'Full-time', 'Entry Level', 'On-site', 400000, 700000, ARRAY['Java', 'SQL', 'HTML', 'CSS'], ARRAY['Write clean code', 'Participate in code reviews', 'Learn from senior developers'], ARRAY['Bachelor''s degree in Computer Science', 'Basic programming knowledge', 'Good communication skills'], 0, 2, 'https://infosys.com/careers'),

('Graduate Engineer Trainee', 'TCS', 'Join our comprehensive training program and kickstart your IT career.', 'Mumbai', 'Full-time', 'Entry Level', 'On-site', 350000, 600000, ARRAY['Programming', 'Problem Solving', 'Communication'], ARRAY['Complete training modules', 'Work on real projects', 'Collaborate with teams'], ARRAY['Bachelor''s degree in any stream', 'Willingness to learn', 'Team player'], 0, 1, 'https://tcs.com/careers'),

('Software Development Intern', 'PhonePe', 'Get hands-on experience building fintech products used by millions.', 'Bangalore', 'Internship', 'Entry Level', 'Hybrid', 25000, 50000, ARRAY['Python', 'JavaScript', 'Git'], ARRAY['Work on real features', 'Learn from experienced engineers', 'Contribute to codebase'], ARRAY['Currently pursuing Bachelor''s/Master''s degree', 'Basic programming skills', 'Passion for technology'], 0, 0, 'https://phonepe.com/careers'),

-- Data & Analytics
('Data Analyst', 'Myntra', 'Analyze fashion and e-commerce data to drive business insights and growth.', 'Bangalore', 'Full-time', 'Mid Level', 'Hybrid', 1000000, 1600000, ARRAY['SQL', 'Python', 'Excel', 'Tableau', 'Statistics'], ARRAY['Create dashboards and reports', 'Analyze customer behavior', 'Support business decisions with data'], ARRAY['2+ years of data analysis experience', 'Strong SQL skills', 'Experience with visualization tools'], 2, 5, 'https://myntra.com/careers'),

('Machine Learning Engineer', 'Ola', 'Build ML models to optimize ride allocation and improve customer experience.', 'Bangalore', 'Full-time', 'Senior Level', 'Hybrid', 2000000, 3500000, ARRAY['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP'], ARRAY['Develop and deploy ML models', 'Optimize model performance', 'Research new ML techniques'], ARRAY['4+ years of ML experience', 'Strong mathematics background', 'Experience with production ML systems'], 4, 8, 'https://ola.com/careers'),

-- Design & Product
('UI/UX Designer', 'Paytm', 'Design intuitive and beautiful interfaces for India''s leading digital payments platform.', 'Noida', 'Full-time', 'Mid Level', 'Hybrid', 1000000, 1800000, ARRAY['Figma', 'Adobe XD', 'User Research', 'Prototyping'], ARRAY['Create user-centered designs', 'Conduct user research', 'Collaborate with product and engineering'], ARRAY['3+ years of UI/UX design experience', 'Strong portfolio', 'Experience with design tools'], 3, 6, 'https://paytm.com/careers'),

('Product Designer', 'Meesho', 'Shape the future of social commerce through thoughtful product design.', 'Bangalore', 'Full-time', 'Senior Level', 'Remote', 1500000, 2500000, ARRAY['Product Design', 'Figma', 'User Research', 'Design Systems'], ARRAY['Lead design projects', 'Create design systems', 'Mentor junior designers'], ARRAY['5+ years of product design experience', 'Strong problem-solving skills', 'Experience in e-commerce'], 5, 8, 'https://meesho.com/careers'),

-- Remote Opportunities
('Remote Full Stack Developer', 'GitLab', 'Work from anywhere while building tools used by developers worldwide.', 'Remote', 'Full-time', 'Mid Level', 'Remote', 1800000, 3000000, ARRAY['Ruby on Rails', 'Vue.js', 'PostgreSQL', 'Git'], ARRAY['Develop new features', 'Fix bugs and improve performance', 'Participate in code reviews'], ARRAY['4+ years of full-stack development', 'Experience with Ruby on Rails', 'Strong communication skills'], 4, 7, 'https://gitlab.com/jobs'),

('Remote Frontend Engineer', 'Automattic', 'Build WordPress.com and other products used by millions globally.', 'Remote', 'Full-time', 'Mid Level', 'Remote', 1500000, 2500000, ARRAY['React', 'JavaScript', 'CSS', 'WordPress'], ARRAY['Develop WordPress features', 'Optimize performance', 'Work with distributed team'], ARRAY['3+ years of frontend development', 'Experience with React', 'Self-motivated and independent'], 3, 6, 'https://automattic.com/work-with-us'),

-- More Companies
('Cloud Architect', 'Adobe', 'Design and implement cloud solutions for Adobe Creative Cloud.', 'Noida', 'Full-time', 'Senior Level', 'Hybrid', 2500000, 4000000, ARRAY['AWS', 'Azure', 'Cloud Architecture', 'Microservices'], ARRAY['Design cloud infrastructure', 'Ensure scalability and security', 'Lead technical discussions'], ARRAY['7+ years of cloud experience', 'Strong architectural skills', 'Experience with multiple cloud platforms'], 7, 12, 'https://adobe.com/careers'),

('QA Engineer', 'Freshworks', 'Ensure quality of SaaS products used by businesses worldwide.', 'Chennai', 'Full-time', 'Mid Level', 'Hybrid', 900000, 1500000, ARRAY['Selenium', 'Test Automation', 'API Testing', 'Java'], ARRAY['Write and execute test cases', 'Automate testing processes', 'Report and track bugs'], ARRAY['3+ years of QA experience', 'Experience with automation tools', 'Strong attention to detail'], 3, 6, 'https://freshworks.com/careers'),

('Security Engineer', 'Hackerrank', 'Protect our platform and user data through robust security practices.', 'Bangalore', 'Full-time', 'Senior Level', 'Remote', 1800000, 3000000, ARRAY['Security', 'Penetration Testing', 'Network Security', 'Python'], ARRAY['Conduct security audits', 'Implement security measures', 'Respond to security incidents'], ARRAY['5+ years of security experience', 'Security certifications preferred', 'Experience with security tools'], 5, 10, 'https://hackerrank.com/careers'),

('Blockchain Developer', 'Polygon', 'Build the future of Web3 and decentralized applications.', 'Bangalore', 'Full-time', 'Mid Level', 'Remote', 2000000, 3500000, ARRAY['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js'], ARRAY['Develop smart contracts', 'Build DApps', 'Optimize blockchain performance'], ARRAY['3+ years of blockchain development', 'Strong understanding of cryptography', 'Experience with Ethereum'], 3, 7, 'https://polygon.technology/careers'),

-- Additional roles across various domains
('Business Analyst', 'Accenture', 'Bridge the gap between business needs and technical solutions.', 'Bangalore', 'Full-time', 'Mid Level', 'Hybrid', 1000000, 1700000, ARRAY['Business Analysis', 'SQL', 'Excel', 'Communication'], ARRAY['Gather business requirements', 'Create documentation', 'Work with stakeholders'], ARRAY['3+ years of BA experience', 'Strong analytical skills', 'Experience in consulting'], 3, 6, 'https://accenture.com/careers'),

('Technical Writer', 'Postman', 'Create clear and comprehensive documentation for developer tools.', 'Bangalore', 'Full-time', 'Mid Level', 'Remote', 1000000, 1600000, ARRAY['Technical Writing', 'API Documentation', 'Markdown', 'Git'], ARRAY['Write API documentation', 'Create tutorials and guides', 'Collaborate with engineering'], ARRAY['3+ years of technical writing', 'Understanding of APIs', 'Excellent writing skills'], 3, 6, 'https://postman.com/company/careers'),

('Site Reliability Engineer', 'Netflix', 'Ensure the reliability and performance of streaming services for millions.', 'Remote', 'Full-time', 'Senior Level', 'Remote', 3000000, 5000000, ARRAY['Linux', 'Kubernetes', 'Monitoring', 'Automation'], ARRAY['Maintain system reliability', 'Automate operations', 'Respond to incidents'], ARRAY['5+ years of SRE experience', 'Strong troubleshooting skills', 'Experience with large-scale systems'], 5, 10, 'https://netflix.com/jobs'),

('Growth Hacker', 'Udaan', 'Drive user acquisition and retention through data-driven growth strategies.', 'Bangalore', 'Full-time', 'Mid Level', 'On-site', 1200000, 2000000, ARRAY['Growth Marketing', 'Analytics', 'A/B Testing', 'SQL'], ARRAY['Run growth experiments', 'Analyze user data', 'Optimize conversion funnels'], ARRAY['3+ years of growth marketing', 'Strong analytical skills', 'Experience with growth tools'], 3, 6, 'https://udaan.com/careers'),

('AI Research Scientist', 'Navi', 'Research and develop AI solutions for fintech products.', 'Bangalore', 'Full-time', 'Senior Level', 'Hybrid', 2500000, 4000000, ARRAY['Machine Learning', 'Deep Learning', 'Research', 'Python'], ARRAY['Conduct AI research', 'Publish papers', 'Implement research findings'], ARRAY['PhD or 5+ years of AI research', 'Strong publication record', 'Experience with ML frameworks'], 5, 10, 'https://navi.com/careers');

-- Add more jobs (continuing to reach 50+)
INSERT INTO jobs (title, company_name, description, location, job_type, experience_level, work_mode, salary_min, salary_max, required_skills, responsibilities, requirements, experience_min, experience_max, application_url) VALUES

('iOS Developer', 'Dream11', 'Build engaging mobile experiences for India''s largest fantasy sports platform.', 'Mumbai', 'Full-time', 'Mid Level', 'Hybrid', 1300000, 2100000, ARRAY['Swift', 'iOS', 'UIKit', 'SwiftUI'], ARRAY['Develop iOS applications', 'Optimize app performance', 'Implement new features'], ARRAY['3+ years of iOS development', 'Published apps on App Store', 'Strong Swift knowledge'], 3, 6, 'https://dream11.com/careers'),

('Android Developer', 'ShareChat', 'Create social media experiences for millions of Indian language users.', 'Bangalore', 'Full-time', 'Mid Level', 'On-site', 1200000, 2000000, ARRAY['Kotlin', 'Android', 'MVVM', 'Jetpack'], ARRAY['Build Android applications', 'Ensure app quality', 'Collaborate with design team'], ARRAY['3+ years of Android development', 'Experience with Kotlin', 'Understanding of Material Design'], 3, 6, 'https://sharechat.com/careers'),

('Content Strategist', 'Unacademy', 'Shape the content strategy for India''s leading ed-tech platform.', 'Bangalore', 'Full-time', 'Mid Level', 'Hybrid', 800000, 1400000, ARRAY['Content Strategy', 'SEO', 'Writing', 'Analytics'], ARRAY['Develop content plans', 'Optimize for SEO', 'Analyze content performance'], ARRAY['3+ years of content strategy', 'Strong writing skills', 'Experience in education sector'], 3, 6, 'https://unacademy.com/careers'),

('Sales Engineer', 'Salesforce', 'Help customers understand and implement Salesforce solutions.', 'Hyderabad', 'Full-time', 'Mid Level', 'Hybrid', 1500000, 2500000, ARRAY['Salesforce', 'Sales', 'Technical Presentation', 'CRM'], ARRAY['Conduct product demos', 'Support sales team', 'Understand customer needs'], ARRAY['3+ years of sales engineering', 'Salesforce certification', 'Strong communication skills'], 3, 6, 'https://salesforce.com/careers'),

('Customer Success Manager', 'Zoho', 'Ensure customer satisfaction and drive product adoption.', 'Chennai', 'Full-time', 'Mid Level', 'On-site', 900000, 1500000, ARRAY['Customer Success', 'Communication', 'Problem Solving', 'SaaS'], ARRAY['Onboard new customers', 'Resolve customer issues', 'Drive product adoption'], ARRAY['3+ years of customer success', 'Experience in SaaS', 'Strong relationship building'], 3, 6, 'https://zoho.com/careers'),

('Cybersecurity Analyst', 'Wipro', 'Protect enterprise systems from cyber threats and vulnerabilities.', 'Bangalore', 'Full-time', 'Mid Level', 'On-site', 1100000, 1800000, ARRAY['Cybersecurity', 'SIEM', 'Incident Response', 'Networking'], ARRAY['Monitor security systems', 'Investigate incidents', 'Implement security policies'], ARRAY['3+ years of security experience', 'Security certifications', 'Experience with SIEM tools'], 3, 6, 'https://wipro.com/careers'),

('Data Engineer', 'Airtel', 'Build data pipelines to process billions of telecom records daily.', 'Gurgaon', 'Full-time', 'Mid Level', 'Hybrid', 1400000, 2200000, ARRAY['Spark', 'Hadoop', 'Python', 'SQL', 'ETL'], ARRAY['Build data pipelines', 'Optimize data processing', 'Ensure data quality'], ARRAY['3+ years of data engineering', 'Experience with big data tools', 'Strong SQL skills'], 3, 6, 'https://airtel.com/careers'),

('Game Developer', 'Zynga', 'Create engaging mobile games played by millions worldwide.', 'Bangalore', 'Full-time', 'Mid Level', 'Hybrid', 1300000, 2100000, ARRAY['Unity', 'C#', 'Game Development', '3D Graphics'], ARRAY['Develop game features', 'Optimize game performance', 'Fix bugs'], ARRAY['3+ years of game development', 'Experience with Unity', 'Published games preferred'], 3, 6, 'https://zynga.com/careers'),

('Marketing Analyst', 'Byju''s', 'Analyze marketing campaigns and drive data-driven marketing decisions.', 'Bangalore', 'Full-time', 'Mid Level', 'On-site', 900000, 1500000, ARRAY['Marketing Analytics', 'Google Analytics', 'SQL', 'Excel'], ARRAY['Analyze campaign performance', 'Create marketing reports', 'Provide insights'], ARRAY['2+ years of marketing analytics', 'Strong analytical skills', 'Experience with analytics tools'], 2, 5, 'https://byjus.com/careers'),

('HR Business Partner', 'Flipkart', 'Partner with business leaders to drive HR initiatives and employee engagement.', 'Bangalore', 'Full-time', 'Senior Level', 'On-site', 1500000, 2500000, ARRAY['HR Management', 'Employee Relations', 'Talent Management'], ARRAY['Support business units', 'Drive HR programs', 'Manage employee relations'], ARRAY['5+ years of HR experience', 'Strong business acumen', 'Experience in tech companies'], 5, 10, 'https://flipkart.com/careers');

-- Add even more diverse roles
INSERT INTO jobs (title, company_name, description, location, job_type, experience_level, work_mode, salary_min, salary_max, required_skills, responsibilities, requirements, experience_min, experience_max, application_url) VALUES

('Solutions Architect', 'Oracle', 'Design enterprise solutions for large-scale database and cloud implementations.', 'Bangalore', 'Full-time', 'Senior Level', 'Hybrid', 2200000, 3500000, ARRAY['Oracle', 'Cloud Architecture', 'Enterprise Solutions', 'Java'], ARRAY['Design technical solutions', 'Lead implementation projects', 'Provide technical guidance'], ARRAY['7+ years of solutions architecture', 'Oracle certifications', 'Experience with enterprise clients'], 7, 12, 'https://oracle.com/careers'),

('Scrum Master', 'Thoughtworks', 'Facilitate agile practices and help teams deliver high-quality software.', 'Pune', 'Full-time', 'Mid Level', 'Hybrid', 1200000, 2000000, ARRAY['Scrum', 'Agile', 'Facilitation', 'Coaching'], ARRAY['Facilitate scrum ceremonies', 'Remove impediments', 'Coach teams on agile'], ARRAY['3+ years as Scrum Master', 'CSM certification', 'Experience in software development'], 3, 6, 'https://thoughtworks.com/careers'),

('Network Engineer', 'Cisco', 'Design and maintain enterprise network infrastructure.', 'Bangalore', 'Full-time', 'Mid Level', 'On-site', 1100000, 1800000, ARRAY['Networking', 'Cisco', 'Routing', 'Switching', 'Firewall'], ARRAY['Configure network devices', 'Troubleshoot network issues', 'Implement security measures'], ARRAY['3+ years of networking experience', 'CCNA/CCNP certification', 'Strong troubleshooting skills'], 3, 6, 'https://cisco.com/careers'),

('Digital Marketing Manager', 'Nykaa', 'Lead digital marketing strategies for India''s leading beauty e-commerce platform.', 'Mumbai', 'Full-time', 'Senior Level', 'Hybrid', 1500000, 2500000, ARRAY['Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Analytics'], ARRAY['Develop marketing strategies', 'Manage campaigns', 'Analyze ROI'], ARRAY['5+ years of digital marketing', 'Experience in e-commerce', 'Strong analytical skills'], 5, 8, 'https://nykaa.com/careers'),

('Finance Analyst', 'Deloitte', 'Provide financial analysis and insights for consulting projects.', 'Mumbai', 'Full-time', 'Mid Level', 'On-site', 1000000, 1700000, ARRAY['Financial Analysis', 'Excel', 'Financial Modeling', 'Accounting'], ARRAY['Perform financial analysis', 'Create financial models', 'Support consulting projects'], ARRAY['3+ years of finance experience', 'CA/CFA preferred', 'Strong Excel skills'], 3, 6, 'https://deloitte.com/careers'),

('Legal Counsel', 'Uber', 'Provide legal support for ride-sharing and delivery operations in India.', 'Bangalore', 'Full-time', 'Senior Level', 'Hybrid', 2000000, 3500000, ARRAY['Corporate Law', 'Compliance', 'Contract Management'], ARRAY['Draft and review contracts', 'Ensure regulatory compliance', 'Provide legal advice'], ARRAY['5+ years of legal experience', 'Law degree', 'Experience in tech/startups'], 5, 10, 'https://uber.com/careers'),

('Operations Manager', 'Dunzo', 'Optimize delivery operations and improve efficiency across cities.', 'Bangalore', 'Full-time', 'Mid Level', 'On-site', 1100000, 1800000, ARRAY['Operations Management', 'Logistics', 'Analytics', 'Process Improvement'], ARRAY['Manage daily operations', 'Optimize processes', 'Analyze operational metrics'], ARRAY['3+ years of operations experience', 'Experience in logistics', 'Strong problem-solving skills'], 3, 6, 'https://dunzo.com/careers'),

('Embedded Systems Engineer', 'Bosch', 'Develop embedded software for automotive and IoT applications.', 'Bangalore', 'Full-time', 'Mid Level', 'On-site', 1200000, 2000000, ARRAY['C', 'C++', 'Embedded Systems', 'RTOS', 'Microcontrollers'], ARRAY['Develop embedded software', 'Debug hardware issues', 'Optimize system performance'], ARRAY['3+ years of embedded development', 'Experience with RTOS', 'Strong C/C++ skills'], 3, 6, 'https://bosch.com/careers'),

('Research Engineer', 'Samsung', 'Conduct R&D for next-generation mobile and consumer electronics.', 'Bangalore', 'Full-time', 'Senior Level', 'On-site', 2000000, 3500000, ARRAY['Research', 'Innovation', 'Electronics', 'Signal Processing'], ARRAY['Conduct research projects', 'Develop prototypes', 'Publish research papers'], ARRAY['PhD or 5+ years of research', 'Strong publication record', 'Experience in electronics'], 5, 10, 'https://samsung.com/careers'),

('Technical Support Engineer', 'Dell', 'Provide technical support for enterprise customers using Dell products.', 'Bangalore', 'Full-time', 'Entry Level', 'Hybrid', 500000, 900000, ARRAY['Technical Support', 'Troubleshooting', 'Customer Service', 'Hardware'], ARRAY['Resolve customer issues', 'Provide technical guidance', 'Document solutions'], ARRAY['1+ years of support experience', 'Strong communication skills', 'Technical aptitude'], 1, 3, 'https://dell.com/careers'),

('Consultant', 'McKinsey', 'Solve complex business problems for Fortune 500 clients.', 'Mumbai', 'Full-time', 'Mid Level', 'On-site', 2500000, 4000000, ARRAY['Consulting', 'Strategy', 'Analytics', 'Presentation'], ARRAY['Analyze business problems', 'Develop recommendations', 'Present to clients'], ARRAY['MBA from top school', '3+ years of consulting', 'Strong analytical skills'], 3, 6, 'https://mckinsey.com/careers'),

('Investment Analyst', 'Goldman Sachs', 'Analyze investment opportunities and support portfolio management.', 'Bangalore', 'Full-time', 'Mid Level', 'On-site', 2000000, 3500000, ARRAY['Financial Analysis', 'Investment Banking', 'Excel', 'Valuation'], ARRAY['Analyze companies and markets', 'Build financial models', 'Support investment decisions'], ARRAY['3+ years of finance experience', 'CFA preferred', 'Strong analytical skills'], 3, 6, 'https://goldmansachs.com/careers'),

('Supply Chain Analyst', 'Amazon', 'Optimize supply chain operations for e-commerce logistics.', 'Bangalore', 'Full-time', 'Mid Level', 'On-site', 1100000, 1800000, ARRAY['Supply Chain', 'Logistics', 'Excel', 'SQL', 'Analytics'], ARRAY['Analyze supply chain data', 'Optimize inventory', 'Improve processes'], ARRAY['3+ years of supply chain experience', 'Strong analytical skills', 'Experience in e-commerce'], 3, 6, 'https://amazon.jobs'),

('Brand Manager', 'Procter & Gamble', 'Manage brand strategy and marketing for consumer products.', 'Mumbai', 'Full-time', 'Senior Level', 'On-site', 1800000, 3000000, ARRAY['Brand Management', 'Marketing', 'Strategy', 'Consumer Insights'], ARRAY['Develop brand strategies', 'Manage marketing campaigns', 'Analyze market trends'], ARRAY['5+ years of brand management', 'MBA preferred', 'Experience in FMCG'], 5, 10, 'https://pg.com/careers'),

('Architect', 'Larsen & Toubro', 'Design commercial and residential building projects.', 'Mumbai', 'Full-time', 'Senior Level', 'On-site', 1500000, 2500000, ARRAY['Architecture', 'AutoCAD', 'Revit', 'Project Management'], ARRAY['Create architectural designs', 'Manage projects', 'Coordinate with contractors'], ARRAY['7+ years of architecture experience', 'Registered architect', 'Experience with large projects'], 7, 12, 'https://larsentoubro.com/careers');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables were created successfully
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('jobs', 'saved_jobs', 'job_applications', 'job_preferences');

-- Count total jobs inserted
SELECT COUNT(*) as total_jobs FROM jobs;

-- View sample jobs
SELECT title, company_name, location, job_type, experience_level 
FROM jobs 
LIMIT 10;
