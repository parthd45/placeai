/**
 * Usage Tracker Service
 * Tracks feature usage for free users and enforces limits
 * Premium users have unlimited access
 */

(function () {
    'use strict';

    // Usage limits for free users
    const FREE_LIMITS = {
        resume_analysis: 3,      // 3 resume analyses per month
        mock_interview: 5,       // 5 mock interviews per month
        career_recommendations: 10, // 10 career recommendations per month
        skill_analysis: 5        // 5 skill analyses per month
    };

    /**
     * Check if user can use a feature
     * @param {string} feature - Feature name (resume_analysis, mock_interview, etc.)
     * @returns {Promise<Object>} - {allowed: boolean, remaining: number, limit: number, isPremium: boolean}
     */
    async function canUseFeature(feature) {
        try {
            const user = await window.AuthService.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Get user profile to check premium status
            const { data: profile, error: profileError } = await window._supabase
                .from('user_profiles')
                .select('is_premium')
                .eq('user_id', user.id)
                .single();

            if (profileError) throw profileError;

            // Premium users have unlimited access
            if (profile.is_premium) {
                return {
                    allowed: true,
                    remaining: -1, // Unlimited
                    limit: -1,
                    isPremium: true
                };
            }

            // For free users, check usage
            const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
            const limit = FREE_LIMITS[feature] || 0;

            // Get usage count for current month
            const { count, error: countError } = await window._supabase
                .from('feature_usage')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('feature', feature)
                .gte('created_at', `${currentMonth}-01`)
                .lt('created_at', `${getNextMonth(currentMonth)}-01`);

            if (countError) throw countError;

            const used = count || 0;
            const remaining = Math.max(0, limit - used);
            const allowed = remaining > 0;

            return {
                allowed,
                remaining,
                limit,
                isPremium: false,
                used
            };
        } catch (error) {
            console.error('Error checking feature usage:', error);
            return {
                allowed: false,
                remaining: 0,
                limit: 0,
                isPremium: false,
                error: error.message
            };
        }
    }

    /**
     * Track feature usage
     * @param {string} feature - Feature name
     * @returns {Promise<boolean>} - Success status
     */
    async function trackUsage(feature) {
        try {
            const user = await window.AuthService.getCurrentUser();
            if (!user) return false;

            // Check if user can use feature first
            const check = await canUseFeature(feature);
            if (!check.allowed && !check.isPremium) {
                return false;
            }

            // Don't track usage for premium users
            if (check.isPremium) {
                return true;
            }

            // Record usage
            const { error } = await window._supabase
                .from('feature_usage')
                .insert({
                    user_id: user.id,
                    feature: feature,
                    created_at: new Date().toISOString()
                });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error tracking usage:', error);
            return false;
        }
    }

    /**
     * Get usage statistics for current month
     * @returns {Promise<Object>} - Usage stats for all features
     */
    async function getUsageStats() {
        try {
            const user = await window.AuthService.getCurrentUser();
            if (!user) return null;

            // Get user profile
            const { data: profile } = await window._supabase
                .from('user_profiles')
                .select('is_premium')
                .eq('user_id', user.id)
                .single();

            if (profile?.is_premium) {
                return {
                    isPremium: true,
                    features: Object.keys(FREE_LIMITS).reduce((acc, feature) => {
                        acc[feature] = {
                            used: 0,
                            limit: -1,
                            remaining: -1
                        };
                        return acc;
                    }, {})
                };
            }

            // Get usage for current month
            const currentMonth = new Date().toISOString().slice(0, 7);
            const stats = {};

            for (const feature of Object.keys(FREE_LIMITS)) {
                const { count } = await window._supabase
                    .from('feature_usage')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .eq('feature', feature)
                    .gte('created_at', `${currentMonth}-01`)
                    .lt('created_at', `${getNextMonth(currentMonth)}-01`);

                const used = count || 0;
                const limit = FREE_LIMITS[feature];
                const remaining = Math.max(0, limit - used);

                stats[feature] = { used, limit, remaining };
            }

            return {
                isPremium: false,
                features: stats
            };
        } catch (error) {
            console.error('Error getting usage stats:', error);
            return null;
        }
    }

    /**
     * Show premium upgrade modal
     * @param {string} feature - Feature that triggered the modal
     */
    function showPremiumModal(feature) {
        const featureNames = {
            resume_analysis: 'Resume Analysis',
            mock_interview: 'Mock Interview',
            career_recommendations: 'Career Recommendations',
            skill_analysis: 'Skill Analysis'
        };

        const modal = document.createElement('div');
        modal.className = 'premium-modal-overlay';
        modal.innerHTML = `
      <div class="premium-modal">
        <div class="premium-modal-header">
          <i class="fas fa-crown"></i>
          <h2>Upgrade to Premium</h2>
        </div>
        <div class="premium-modal-body">
          <p>You've reached your free limit for <strong>${featureNames[feature]}</strong> this month.</p>
          <div class="premium-benefits">
            <h3>Premium Benefits:</h3>
            <ul>
              <li><i class="fas fa-check"></i> Unlimited Resume Analysis</li>
              <li><i class="fas fa-check"></i> Unlimited Mock Interviews</li>
              <li><i class="fas fa-check"></i> Unlimited Career Recommendations</li>
              <li><i class="fas fa-check"></i> Unlimited Skill Analysis</li>
              <li><i class="fas fa-check"></i> Priority Support</li>
              <li><i class="fas fa-check"></i> Advanced Features</li>
            </ul>
          </div>
          <div class="premium-pricing">
            <div class="price">₹99/month</div>
            <div class="price-note">or ₹999/year (Save 17%)</div>
          </div>
        </div>
        <div class="premium-modal-footer">
          <button class="btn-upgrade" onclick="window.location.href='dashboard.html#premium'">
            <i class="fas fa-crown"></i> Upgrade Now
          </button>
          <button class="btn-cancel" onclick="this.closest('.premium-modal-overlay').remove()">
            Maybe Later
          </button>
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        // Add styles
        if (!document.getElementById('premium-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'premium-modal-styles';
            styles.textContent = `
        .premium-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .premium-modal {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 24px;
          max-width: 500px;
          width: 90%;
          border: 2px solid #f59e0b;
          box-shadow: 0 20px 60px rgba(245, 158, 11, 0.3);
          animation: slideUp 0.3s;
        }

        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .premium-modal-header {
          text-align: center;
          padding: 32px 32px 24px;
          border-bottom: 1px solid rgba(245, 158, 11, 0.2);
        }

        .premium-modal-header i {
          font-size: 48px;
          color: #f59e0b;
          margin-bottom: 16px;
        }

        .premium-modal-header h2 {
          font-size: 28px;
          color: #f59e0b;
          margin: 0;
        }

        .premium-modal-body {
          padding: 32px;
        }

        .premium-modal-body p {
          color: #cbd5e1;
          font-size: 16px;
          margin-bottom: 24px;
          text-align: center;
        }

        .premium-benefits h3 {
          color: #f59e0b;
          font-size: 18px;
          margin-bottom: 16px;
        }

        .premium-benefits ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .premium-benefits li {
          color: #e2e8f0;
          padding: 10px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .premium-benefits li i {
          color: #10b981;
          font-size: 18px;
        }

        .premium-pricing {
          text-align: center;
          margin-top: 24px;
          padding: 20px;
          background: rgba(245, 158, 11, 0.1);
          border-radius: 12px;
        }

        .price {
          font-size: 36px;
          font-weight: 800;
          color: #f59e0b;
        }

        .price-note {
          color: #94a3b8;
          font-size: 14px;
          margin-top: 8px;
        }

        .premium-modal-footer {
          padding: 24px 32px 32px;
          display: flex;
          gap: 12px;
        }

        .btn-upgrade {
          flex: 1;
          padding: 16px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .btn-upgrade:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(245, 158, 11, 0.4);
        }

        .btn-cancel {
          padding: 16px 24px;
          background: transparent;
          color: #94a3b8;
          border: 1px solid #334155;
          border-radius: 12px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
        }
      `;
            document.head.appendChild(styles);
        }
    }

    // Helper function to get next month
    function getNextMonth(yearMonth) {
        const [year, month] = yearMonth.split('-').map(Number);
        if (month === 12) {
            return `${year + 1}-01`;
        }
        return `${year}-${String(month + 1).padStart(2, '0')}`;
    }

    // Export functions
    if (typeof window !== 'undefined') {
        window.UsageTracker = {
            canUseFeature,
            trackUsage,
            getUsageStats,
            showPremiumModal,
            FREE_LIMITS
        };
    }
})();
