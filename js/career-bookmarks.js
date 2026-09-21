/**
 * Career Recommendations - Bookmark Functionality
 * Adds bookmark feature with localStorage persistence and sorting
 */

// Initialize saved careers from localStorage
let savedCareers = new Set();

function loadSavedCareers() {
    const saved = localStorage.getItem('savedCareers');
    if (saved) {
        try {
            savedCareers = new Set(JSON.parse(saved));
        } catch (e) {
            console.error('Error loading saved careers:', e);
            savedCareers = new Set();
        }
    }
}

function saveCareers() {
    localStorage.setItem('savedCareers', JSON.stringify([...savedCareers]));
}

function toggleCareerBookmark(careerId) {
    if (savedCareers.has(careerId)) {
        savedCareers.delete(careerId);
    } else {
        savedCareers.add(careerId);
    }
    saveCareers();

    // Update sidebar saved section
    if (window.updateSidebarSaved) {
        window.updateSidebarSaved();
    }

    // Re-render to move bookmarked items to top
    if (typeof applyFilters === 'function') {
        applyFilters();
    }
}

// Override the existing applyFilters or renderCareerCards to add bookmark functionality
document.addEventListener('DOMContentLoaded', function () {
    loadSavedCareers();

    // Wait a bit for the page to load its own scripts
    setTimeout(function () {
        // Enhance existing bookmark buttons
        enhanceBookmarkButtons();

        // Sort cards to put bookmarked ones on top
        sortCareerCards();
    }, 1000);
});

function enhanceBookmarkButtons() {
    // Find all existing bookmark buttons (look for bookmark icons)
    const bookmarkButtons = document.querySelectorAll('button[onclick*="saveJob"], .action-btn, button i.fa-bookmark');

    bookmarkButtons.forEach(btn => {
        const button = btn.tagName === 'BUTTON' ? btn : btn.closest('button');
        if (!button) return;

        // Find the parent card
        const card = button.closest('[onclick*="learnMore"]');
        if (!card) return;

        // Extract career ID from the card's onclick
        const onclickAttr = card.getAttribute('onclick');
        const match = onclickAttr ? onclickAttr.match(/learnMore\((\d+)\)/) : null;

        if (match) {
            const careerId = parseInt(match[1]);
            const isSaved = savedCareers.has(careerId);

            // Update button state
            const icon = button.querySelector('i');
            if (icon) {
                if (isSaved) {
                    button.classList.add('saved');
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                } else {
                    button.classList.remove('saved');
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
            }

            // Override the onclick to use our bookmark function
            button.onclick = function (e) {
                e.stopPropagation();
                toggleCareerBookmark(careerId);

                // Update button state
                if (icon) {
                    if (savedCareers.has(careerId)) {
                        this.classList.add('saved');
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                    } else {
                        this.classList.remove('saved');
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                    }
                }
            };
        }
    });

    // Add saved state styles if not already added
    if (!document.getElementById('bookmarkStyles')) {
        const styles = document.createElement('style');
        styles.id = 'bookmarkStyles';
        styles.textContent = `
      button.saved {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
        border-color: #8b5cf6 !important;
        color: white !important;
      }
      
      button.saved:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4) !important;
      }
    `;
        document.head.appendChild(styles);
    }
}

function sortCareerCards() {
    const grid = document.getElementById('recommendationsGrid');
    if (!grid) return;

    const cards = Array.from(grid.children);

    // Sort cards: bookmarked first
    cards.sort((a, b) => {
        const aOnclick = a.getAttribute('onclick');
        const bOnclick = b.getAttribute('onclick');

        const aMatch = aOnclick ? aOnclick.match(/learnMore\((\d+)\)/) : null;
        const bMatch = bOnclick ? bOnclick.match(/learnMore\((\d+)\)/) : null;

        if (!aMatch || !bMatch) return 0;

        const aId = parseInt(aMatch[1]);
        const bId = parseInt(bMatch[1]);

        const aIsSaved = savedCareers.has(aId);
        const bIsSaved = savedCareers.has(bId);

        if (aIsSaved && !bIsSaved) return -1;
        if (!aIsSaved && bIsSaved) return 1;
        return 0;
    });

    // Re-append cards in sorted order
    cards.forEach(card => grid.appendChild(card));
}

// Export for use in other scripts
window.careerBookmarks = {
    toggle: toggleCareerBookmark,
    getSaved: () => [...savedCareers],
    isSaved: (id) => savedCareers.has(id)
};
