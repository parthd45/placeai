// Career Recommendations Initialization Script
// This script loads user data and personalizes the career recommendations

(function() {
  'use strict';
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    // Check if we're on the career recommendations page
    if (!document.getElementById('recommendationsGrid')) {
      return;
    }
    
    // If renderCareerCards is already defined and currentRecommendations exists,
    // render the default recommendations immediately
    if (typeof renderCareerCards === 'function' && typeof currentRecommendations !== 'undefined') {
      console.log('Rendering career recommendations...');
      renderCareerCards(currentRecommendations);
    }
  }
})();
