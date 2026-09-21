/**
 * Modern Page Transition Loading Animation
 * Automatically adds loading animation to all pages
 */

(function () {
    // Add loading animation HTML to the page
    function initLoadingAnimation() {
        // Check if loader already exists
        if (document.getElementById('pageTransitionLoader')) {
            return;
        }

        // Create loader HTML
        const loaderHTML = `
      <div class="page-transition-loader" id="pageTransitionLoader">
        <div class="transition-spinner">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;

        // Insert at the end of body
        document.body.insertAdjacentHTML('beforeend', loaderHTML);

        const transitionLoader = document.getElementById('pageTransitionLoader');

        // Show loader on link clicks
        document.addEventListener('click', function (e) {
            const link = e.target.closest('a');
            if (link && link.href && !link.target && link.hostname === window.location.hostname) {
                if (!link.href.includes('#')) {
                    transitionLoader.classList.add('active');
                }
            }
        });

        // Show loader on page unload
        window.addEventListener('beforeunload', function () {
            transitionLoader.classList.add('active');
        });

        window.addEventListener('pagehide', function (event) {
            if (event.persisted) {
                transitionLoader.classList.add('active');
            }
        });

        // Hide loader when page loads
        window.addEventListener('load', function () {
            setTimeout(() => {
                transitionLoader.classList.remove('active');
            }, 300);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoadingAnimation);
    } else {
        initLoadingAnimation();
    }
})();
