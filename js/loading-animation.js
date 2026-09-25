/**
 * Modern High-Performance Page Transition Loading Animation
 * Lightweight, non-blocking, and guarantees instantaneous page appearance.
 */

(function () {
  function initLoadingAnimation() {
    let transitionLoader = document.getElementById('pageTransitionLoader');
    if (!transitionLoader) {
      const loaderHTML = `
        <div class="page-transition-loader" id="pageTransitionLoader" style="pointer-events: none; transition: opacity 0.2s ease, visibility 0.2s ease;">
          <div class="transition-spinner">
            <span></span><span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', loaderHTML);
      transitionLoader = document.getElementById('pageTransitionLoader');
    }

    function hideLoaderFast() {
      if (transitionLoader) {
        transitionLoader.classList.remove('active');
        transitionLoader.style.opacity = '0';
        transitionLoader.style.visibility = 'hidden';
      }
    }

    // Dismiss immediately
    hideLoaderFast();

    // Dismiss on DOM ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      hideLoaderFast();
    } else {
      document.addEventListener('DOMContentLoaded', hideLoaderFast, { once: true });
    }

    // Dismiss on window load
    window.addEventListener('load', hideLoaderFast, { once: true });

    // Hard safety timer: Loader can NEVER stay visible for more than 200ms
    setTimeout(hideLoaderFast, 200);

    // Subtle spinner on internal navigation with fast auto-dismiss
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a');
      if (link && link.href && !link.target && link.hostname === window.location.hostname) {
        if (!link.href.includes('#') && !link.href.startsWith('javascript:')) {
          if (transitionLoader) {
            transitionLoader.style.visibility = 'visible';
            transitionLoader.classList.add('active');
            // Auto dismiss if page transition doesn't happen in 400ms
            setTimeout(hideLoaderFast, 400);
          }
        }
      }
    });

    window.addEventListener('pageshow', hideLoaderFast);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadingAnimation, { once: true });
  } else {
    initLoadingAnimation();
  }
})();
