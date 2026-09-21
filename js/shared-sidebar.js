/**
 * Shared Sidebar Component
 * Injects the purple AI Features sidebar into all feature pages
 */

function injectSidebar(activePage) {
  // Add sidebar styles if not already added
  if (!document.getElementById('sidebarStyles')) {
    const styles = document.createElement('style');
    styles.id = 'sidebarStyles';
    styles.textContent = `
      .hamburger-menu {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #334155;
        color: #e2e8f0;
        padding: 10px 16px;
        border-radius: 8px;
        border: 1px solid #475569;
        font-weight: 500;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s;
      }

      .hamburger-menu:hover {
        background: #475569;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .hamburger-icon {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .hamburger-icon span {
        width: 18px;
        height: 2px;
        background: #e2e8f0;
        border-radius: 2px;
        transition: all 0.3s;
      }

      .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s;
      }

      .sidebar-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .sidebar {
        position: fixed;
        top: 0;
        left: -320px;
        width: 320px;
        height: 100vh;
        background: #1e293b;
        z-index: 1000;
        transition: left 0.3s;
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
      }

      .sidebar.active {
        left: 0;
      }

      .sidebar-header {
        padding: 24px;
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .sidebar-header h3 {
        color: white;
        font-size: 22px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0;
      }

      .sidebar-close {
        background: none;
        border: none;
        color: white;
        font-size: 32px;
        cursor: pointer;
        transition: all 0.2s;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .sidebar-close:hover {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
      }

      .sidebar-content {
        padding: 20px 16px;
        overflow-y: auto;
        height: calc(100vh - 88px);
      }

      .sidebar-section {
        margin-bottom: 24px;
      }

      .sidebar-section-title {
        color: #94a3b8;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 12px;
        padding: 0 12px;
      }

      .sidebar-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        margin-bottom: 4px;
        border-radius: 8px;
        color: #cbd5e1;
        text-decoration: none;
        transition: all 0.2s;
        cursor: pointer;
        position: relative;
      }

      .sidebar-item:hover {
        background: #334155;
        color: #f1f5f9;
      }

      .sidebar-item.active {
        background: #334155;
        color: white;
      }

      .sidebar-item i {
        font-size: 18px;
        width: 20px;
        text-align: center;
      }

      .sidebar-item-text {
        flex: 1;
        font-size: 15px;
        font-weight: 500;
      }

      .sidebar-badge {
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
      }

      .sidebar-badge.ai {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white;
      }

      .sidebar-badge.soon {
        background: #475569;
        color: #94a3b8;
      }
    `;
    document.head.appendChild(styles);
  }

  // Create sidebar HTML
  const sidebarHTML = `
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>
    <div class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <h3>
          <i class="fas fa-sparkles"></i>
          AI Features
        </h3>
        <button class="sidebar-close" onclick="toggleSidebar()">&times;</button>
      </div>
      <div class="sidebar-content">
        <div class="sidebar-section">
          <div class="sidebar-section-title">MAIN</div>
          <a href="dashboard.html" class="sidebar-item">
            <i class="fas fa-user"></i>
            <span class="sidebar-item-text">Profile</span>
          </a>
        </div>
        
        <div class="sidebar-section">
          <div class="sidebar-section-title">AI-POWERED FEATURES</div>
          <a href="skill-analysis.html" class="sidebar-item ${activePage === 'skill-analysis' ? 'active' : ''}">
            <i class="fas fa-chart-line"></i>
            <span class="sidebar-item-text">Skill Gap Analysis</span>
            <span class="sidebar-badge ai">AI</span>
          </a>
          <a href="career-recommendations.html" class="sidebar-item ${activePage === 'career-recommendations' ? 'active' : ''}">
            <i class="fas fa-lightbulb"></i>
            <span class="sidebar-item-text">Career Recommendations</span>
            <span class="sidebar-badge ai">AI</span>
          </a>
          <a href="learning-paths.html" class="sidebar-item ${activePage === 'learning-paths' ? 'active' : ''}">
            <i class="fas fa-graduation-cap"></i>
            <span class="sidebar-item-text">Learning Paths</span>
            <span class="sidebar-badge ai">AI</span>
          </a>
          <a href="resume-analyzer.html" class="sidebar-item ${activePage === 'resume-analyzer' ? 'active' : ''}">
            <i class="fas fa-file-alt"></i>
            <span class="sidebar-item-text">Resume Analyzer</span>
            <span class="sidebar-badge ai">AI</span>
          </a>
          <div class="sidebar-item" style="opacity: 0.6; cursor: not-allowed;">
            <i class="fas fa-handshake"></i>
            <span class="sidebar-item-text">Job Matching</span>
            <span class="sidebar-badge soon">SOON</span>
          </div>
          <div class="sidebar-item" style="opacity: 0.6; cursor: not-allowed;">
            <i class="fas fa-chart-pie"></i>
            <span class="sidebar-item-text">Placement Insights</span>
            <span class="sidebar-badge soon">SOON</span>
          </div>
        </div>

        <div class="sidebar-section" id="savedSection" style="display: none;">
          <div class="sidebar-section-title">SAVED</div>
          <div id="savedItemsContainer"></div>
        </div>
      </div>
    </div>
  `;

  // Insert sidebar into body
  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

  // Replace "Back to Dashboard" button with hamburger menu
  const backButton = document.querySelector('.btn-back');
  if (backButton) {
    const hamburgerButton = document.createElement('button');
    hamburgerButton.className = 'hamburger-menu';
    hamburgerButton.onclick = toggleSidebar;
    hamburgerButton.innerHTML = `
      <div class="hamburger-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
      Menu
    `;
    backButton.replaceWith(hamburgerButton);
  }

  // Load and display saved items
  loadSavedItems(activePage);
}

function loadSavedItems(activePage) {
  const savedSection = document.getElementById('savedSection');
  const savedContainer = document.getElementById('savedItemsContainer');

  if (!savedSection || !savedContainer) return;

  let savedItems = [];
  let itemType = '';

  // Load saved careers
  if (activePage === 'career-recommendations') {
    const savedCareers = localStorage.getItem('savedCareers');
    if (savedCareers) {
      try {
        const careerIds = JSON.parse(savedCareers);
        savedItems = careerIds;
        itemType = 'career';
      } catch (e) {
        console.error('Error loading saved careers:', e);
      }
    }
  }

  // Load saved learning paths
  if (activePage === 'learning-paths') {
    const savedPaths = localStorage.getItem('savedLearningPaths');
    if (savedPaths) {
      try {
        const pathIds = JSON.parse(savedPaths);
        savedItems = pathIds;
        itemType = 'path';
      } catch (e) {
        console.error('Error loading saved paths:', e);
      }
    }
  }

  // Show saved section if there are items
  if (savedItems.length > 0) {
    savedSection.style.display = 'block';

    const icon = itemType === 'career' ? 'fa-briefcase' : 'fa-graduation-cap';
    const label = itemType === 'career' ? 'Saved Careers' : 'Saved Paths';

    savedContainer.innerHTML = `
      <div class="sidebar-item" onclick="scrollToSaved()" style="background: rgba(139, 92, 246, 0.1); border-left: 3px solid #8b5cf6;">
        <i class="fas ${icon}"></i>
        <span class="sidebar-item-text">${label}</span>
        <span class="sidebar-badge" style="background: #8b5cf6; color: white;">${savedItems.length}</span>
      </div>
    `;
  } else {
    savedSection.style.display = 'none';
  }
}

function scrollToSaved() {
  // Close sidebar
  toggleSidebar();

  // Scroll to first saved item
  setTimeout(() => {
    const savedCard = document.querySelector('.career-card.saved, .path-card .btn-bookmark.saved');
    if (savedCard) {
      const card = savedCard.closest('.career-card, .path-card');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.animation = 'pulse 0.5s ease';
      }
    }
  }, 300);
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar && overlay) {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  }
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  // Detect current page from URL
  const path = window.location.pathname;
  let activePage = '';

  if (path.includes('skill-analysis')) {
    activePage = 'skill-analysis';
  } else if (path.includes('career-recommendations')) {
    activePage = 'career-recommendations';
  } else if (path.includes('learning-paths')) {
    activePage = 'learning-paths';
  } else if (path.includes('resume-analyzer')) {
    activePage = 'resume-analyzer';
  }

  // Only inject if we're on a feature page
  if (activePage) {
    injectSidebar(activePage);

    // Listen for storage changes to update saved section
    window.addEventListener('storage', function (e) {
      if (e.key === 'savedCareers' || e.key === 'savedLearningPaths') {
        loadSavedItems(activePage);
      }
    });

    // Also listen for custom events (for same-page updates)
    window.addEventListener('bookmarkChanged', function () {
      loadSavedItems(activePage);
    });
  }
});

// Helper function to trigger bookmark update
window.updateSidebarSaved = function () {
  window.dispatchEvent(new Event('bookmarkChanged'));
};
