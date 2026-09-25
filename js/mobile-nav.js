/**
 * PlaceAI Mobile Navigation & Android Back Button Handler
 * Intercepts physical back button & gestures to close modals and navigate smoothly like a native app.
 */
(function () {
  function handleBack() {
    // 1. If WebRTC Call Overlay is active, do not close casually
    const callOverlay = document.querySelector('.placeai-call-overlay.active');
    if (callOverlay) {
      if (confirm('Do you want to end or minimize the ongoing call?')) {
        if (typeof window.endPlaceAICall === 'function') window.endPlaceAICall();
      }
      return true;
    }

    // 2. If in Direct Chat Thread on mobile, back goes to contact list
    const directView = document.getElementById('directView');
    if (directView && directView.classList.contains('mobile-thread-open')) {
      if (typeof window.closeMobileDirectThread === 'function') {
        window.closeMobileDirectThread();
        return true;
      }
    }

    // 3. If Community Chat modal is open, back closes the modal
    const chatModal = document.getElementById('communityChatModal');
    if (chatModal && (chatModal.classList.contains('active') || chatModal.style.display === 'flex')) {
      if (typeof window.closeCampusChatModal === 'function') {
        window.closeCampusChatModal();
        return true;
      }
    }

    // 4. If App Updates modal is open, back closes it
    const updateModal = document.getElementById('placeaiUpdateModal');
    if (updateModal && (updateModal.classList.contains('active') || updateModal.style.display === 'flex')) {
      if (typeof window.closePlaceAIUpdateModal === 'function') {
        window.closePlaceAIUpdateModal();
        return true;
      }
    }

    // 5. If any custom table or vercel modal is open, close it
    const customModals = document.querySelectorAll('.community-chat-overlay');
    for (let m of customModals) {
      if (m.id !== 'communityChatModal' && m.style.display !== 'none' && m.style.display !== '') {
        m.style.display = 'none';
        return true;
      }
    }

    // 6. If on a subpage (code-practice, resume, etc.), go back to dashboard.html
    const pathname = window.location.pathname;
    if (pathname.includes('code-practice') || pathname.includes('resume-analyzer') || pathname.includes('mock-interview') || pathname.includes('career-recommendations') || pathname.includes('skill-analysis') || pathname.includes('learning-paths')) {
      window.location.href = 'dashboard.html';
      return true;
    }

    return false;
  }

  window.handleGlobalMobileBack = handleBack;

  // Listen to Capacitor native Android back button if available
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
    window.Capacitor.Plugins.App.addListener('backButton', function (state) {
      const handled = handleBack();
      if (!handled && !state.canGoBack) {
        window.Capacitor.Plugins.App.exitApp();
      }
    });
  }

  // Push state for browser history back navigation
  if (window.history && window.history.pushState) {
    window.addEventListener('popstate', function (e) {
      handleBack();
    });
  }
})();
