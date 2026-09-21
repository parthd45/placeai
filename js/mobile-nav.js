/**
 * Mobile Navigation Handler
 * Handles hamburger menu, sidebar toggle, and mobile overlay
 */

(function () {
    'use strict';

    // Create mobile header and hamburger menu
    function createMobileHeader() {
        // Check if mobile header already exists
        if (document.querySelector('.mobile-header')) {
            return;
        }

        const mobileHeader = document.createElement('div');
        mobileHeader.className = 'mobile-header mobile-only';
        mobileHeader.innerHTML = `
            <div class="hamburger-menu" id="hamburgerMenu">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 18px; font-weight: 700; color: white;">P</span>
                </div>
                <span style="font-size: 18px; font-weight: 700; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PlaceAI</span>
            </div>
            <div style="width: 40px;"></div>
        `;

        // Insert at the beginning of body
        document.body.insertBefore(mobileHeader, document.body.firstChild);

        // Create mobile overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        overlay.id = 'mobileOverlay';
        document.body.appendChild(overlay);

        // Add event listeners
        setupMobileNavigation();
    }

    // Setup mobile navigation event listeners
    function setupMobileNavigation() {
        const hamburger = document.getElementById('hamburgerMenu');
        const overlay = document.getElementById('mobileOverlay');
        const sidebar = document.querySelector('.sidebar');

        if (!hamburger || !overlay || !sidebar) {
            return;
        }

        // Toggle sidebar on hamburger click
        hamburger.addEventListener('click', function () {
            sidebar.classList.toggle('mobile-open');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
        });

        // Close sidebar on overlay click
        overlay.addEventListener('click', function () {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close sidebar when clicking menu items on mobile
        const menuItems = sidebar.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function () {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('mobile-open');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                if (window.innerWidth > 768) {
                    sidebar.classList.remove('mobile-open');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }, 250);
        });
    }

    // Create mobile filter toggle for job matching page
    function createMobileFilterToggle() {
        const filtersContainer = document.querySelector('.filters-sidebar');
        if (!filtersContainer) {
            return;
        }

        // Create filter toggle button
        const filterToggle = document.createElement('button');
        filterToggle.className = 'mobile-filter-toggle mobile-only';
        filterToggle.innerHTML = '<i class="fas fa-filter"></i> Filters';
        filterToggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 100;
            padding: 12px 20px;
            background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
            color: white;
            border: none;
            border-radius: 24px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
            cursor: pointer;
            display: none;
        `;

        document.body.appendChild(filterToggle);

        // Show button on mobile
        if (window.innerWidth <= 768) {
            filterToggle.style.display = 'flex';
        }

        // Toggle filters
        filterToggle.addEventListener('click', function () {
            filtersContainer.classList.toggle('mobile-open');
            const overlay = document.getElementById('mobileOverlay') || createOverlay();
            overlay.classList.toggle('active');
        });

        // Close on overlay click
        const overlay = document.getElementById('mobileOverlay');
        if (overlay) {
            overlay.addEventListener('click', function () {
                filtersContainer.classList.remove('mobile-open');
            });
        }
    }

    // Create overlay if it doesn't exist
    function createOverlay() {
        let overlay = document.getElementById('mobileOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'mobile-overlay';
            overlay.id = 'mobileOverlay';
            document.body.appendChild(overlay);
        }
        return overlay;
    }

    // Initialize on DOM load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        createMobileHeader();
        createMobileFilterToggle();
    }

    // Export for manual initialization if needed
    window.MobileNav = {
        init: init,
        createMobileHeader: createMobileHeader,
        createMobileFilterToggle: createMobileFilterToggle
    };
})();
