/**
 * PlaceAI Instant In-App Auto-Update & Over-The-Air (OTA) Patch System
 * Automatically detects new patches, alerts the user, and enables 1-tap live update or APK download.
 */
(function () {
  const CURRENT_APP_VERSION = '2.2.0';
  const CURRENT_BUILD_TS = 1727273800000;
  const VERSION_CHECK_URL = 'https://www.firstplacewise.tech/version.json';
  const APK_FALLBACK_URL = 'https://github.com/parthd45/placeai/raw/main/PlaceAI.apk';

  // Inject Styles for Update Banner & Modal
  function injectUpdaterStyles() {
    if (document.getElementById('placeai-updater-styles')) return;
    const style = document.createElement('style');
    style.id = 'placeai-updater-styles';
    style.textContent = `
      /* Update Notification Banner */
      .placeai-update-banner {
        position: fixed;
        top: calc(env(safe-area-inset-top, 0px) + 12px);
        left: 50%;
        transform: translateX(-50%) translateY(-150%);
        width: calc(100% - 24px);
        max-width: 480px;
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.98) 100%);
        border: 1.5px solid rgba(139, 92, 246, 0.5);
        border-radius: 16px;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.7), 0 0 20px rgba(124, 58, 237, 0.3);
        padding: 12px 14px;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        opacity: 0;
        box-sizing: border-box;
      }
      .placeai-update-banner.visible {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
      .update-banner-left {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        min-width: 0;
      }
      .update-banner-icon {
        width: 36px;
        height: 36px;
        min-width: 36px;
        border-radius: 10px;
        background: linear-gradient(135deg, #7c3aed, #6366f1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 16px;
        box-shadow: 0 0 12px rgba(124, 58, 237, 0.5);
      }
      .update-banner-text {
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .update-banner-title {
        font-size: 13.5px;
        font-weight: 700;
        color: #f8fafc;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .update-banner-sub {
        font-size: 11.5px;
        color: #94a3b8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .update-banner-actions {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .update-btn-apply {
        background: linear-gradient(135deg, #7c3aed, #6366f1);
        color: #ffffff;
        border: none;
        padding: 7px 12px;
        border-radius: 10px;
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
        transition: transform 0.15s ease;
      }
      .update-btn-apply:active {
        transform: scale(0.95);
      }
      .update-btn-close {
        background: rgba(255, 255, 255, 0.08);
        color: #94a3b8;
        border: 1px solid rgba(255, 255, 255, 0.1);
        width: 30px;
        height: 30px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 13px;
      }

      /* In-App Update Modal */
      .placeai-update-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(8, 12, 22, 0.88);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        z-index: 1000000;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
        animation: updateFadeIn 0.25s ease-out;
      }
      .placeai-update-modal-overlay.active {
        display: flex;
      }
      @keyframes updateFadeIn {
        from { opacity: 0; transform: scale(0.96); }
        to { opacity: 1; transform: scale(1); }
      }
      .placeai-update-modal-card {
        background: #0f172a;
        border: 1px solid rgba(139, 92, 246, 0.4);
        border-radius: 24px;
        width: 100%;
        max-width: 440px;
        padding: 24px 20px;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 92, 246, 0.25);
        color: #f8fafc;
        position: relative;
        text-align: center;
      }
      .update-modal-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(124, 58, 237, 0.18);
        border: 1px solid rgba(139, 92, 246, 0.4);
        padding: 4px 12px;
        border-radius: 999px;
        color: #c084fc;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 12px;
      }
      .update-modal-title {
        font-size: 20px;
        font-weight: 800;
        margin-bottom: 6px;
        background: linear-gradient(135deg, #ffffff 40%, #c084fc 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .update-modal-desc {
        font-size: 13px;
        color: #94a3b8;
        line-height: 1.5;
        margin-bottom: 16px;
      }
      .update-modal-changelog {
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(51, 65, 85, 0.6);
        border-radius: 14px;
        padding: 12px 14px;
        text-align: left;
        margin-bottom: 20px;
        max-height: 160px;
        overflow-y: auto;
      }
      .update-modal-changelog ul {
        margin: 0;
        padding-left: 18px;
        font-size: 12.5px;
        color: #cbd5e1;
      }
      .update-modal-changelog li {
        margin-bottom: 6px;
      }
      .update-modal-btns {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .update-modal-btn-primary {
        background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
        color: #ffffff;
        border: none;
        height: 46px;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
      }
      .update-modal-btn-secondary {
        background: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(71, 85, 105, 0.5);
        color: #e2e8f0;
        height: 44px;
        border-radius: 12px;
        font-size: 13.5px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        text-decoration: none;
      }
      .update-modal-btn-close {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 13px;
        cursor: pointer;
        padding: 6px 0;
        margin-top: 4px;
      }
    `;
    document.head.appendChild(style);
  }

  let latestUpdateData = null;

  // Check server for updates
  async function checkForUpdates(silent = true) {
    try {
      const url = VERSION_CHECK_URL + '?_t=' + Date.now();
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return;

      const data = await res.json();
      latestUpdateData = data;

      const lastAppliedTs = parseInt(localStorage.getItem('placeai_last_applied_ts') || '0', 10);
      const isNewer = data.buildTimestamp && data.buildTimestamp > (lastAppliedTs || CURRENT_BUILD_TS);

      if (isNewer) {
        showUpdateBanner(data);
      } else if (!silent) {
        showUpdateModal(data, true);
      }
    } catch (e) {
      if (!silent) {
        alert('Unable to check for updates. Please verify your internet connection.');
      }
    }
  }

  // Show top banner
  function showUpdateBanner(data) {
    injectUpdaterStyles();

    let banner = document.getElementById('placeaiUpdateBanner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'placeaiUpdateBanner';
      banner.className = 'placeai-update-banner';
      banner.innerHTML = `
        <div class="update-banner-left" onclick="window.openPlaceAIUpdateModal()">
          <div class="update-banner-icon"><i class="fas fa-sparkles"></i></div>
          <div class="update-banner-text">
            <span class="update-banner-title">✨ New App Update Available</span>
            <span class="update-banner-sub">Version ${data.version || '2.2.0'} with latest fixes ready</span>
          </div>
        </div>
        <div class="update-banner-actions">
          <button class="update-btn-apply" onclick="applyPlaceAIUpdate()">Update Now</button>
          <button class="update-btn-close" onclick="dismissUpdateBanner()" title="Dismiss">✕</button>
        </div>
      `;
      document.body.appendChild(banner);
    }

    setTimeout(() => {
      banner.classList.add('visible');
    }, 100);
  }

  // Dismiss banner
  window.dismissUpdateBanner = function () {
    const banner = document.getElementById('placeaiUpdateBanner');
    if (banner) {
      banner.classList.remove('visible');
    }
  };

  // Apply update immediately
  window.applyPlaceAIUpdate = function () {
    if (latestUpdateData && latestUpdateData.buildTimestamp) {
      localStorage.setItem('placeai_last_applied_ts', String(latestUpdateData.buildTimestamp));
    } else {
      localStorage.setItem('placeai_last_applied_ts', String(Date.now()));
    }
    const banner = document.getElementById('placeaiUpdateBanner');
    if (banner) {
      banner.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;width:100%;justify-content:center;color:#fff;font-weight:700;font-size:13.5px;padding:4px 0;">
          <i class="fas fa-spinner fa-spin" style="color:#c084fc;"></i> Applying latest live update...
        </div>
      `;
    }
    setTimeout(() => {
      // Force reload by cache busting URL
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('_v', String(Date.now()));
      window.location.href = currentUrl.toString();
    }, 400);
  };

  // Open Full Update Modal
  window.openPlaceAIUpdateModal = function (isUpToDate = false) {
    injectUpdaterStyles();
    const data = latestUpdateData || {
      version: CURRENT_APP_VERSION,
      changelog: [
        'Complete mobile UI optimization for Login, Register & Dashboard',
        'WhatsApp-style single-pane Community Chat with Back button',
        'WebRTC Voice & Video calling enhancements',
        'Horizontal scroll fix for GitHub contribution heatmap',
        'Instant In-App Over-The-Air (OTA) automatic update system'
      ],
      apkUrl: APK_FALLBACK_URL,
      directDownloadUrl: 'https://www.firstplacewise.tech/PlaceAI.apk'
    };

    let modal = document.getElementById('placeaiUpdateModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'placeaiUpdateModal';
      modal.className = 'placeai-update-modal-overlay';
      modal.onclick = function (e) {
        if (e.target === modal) closePlaceAIUpdateModal();
      };
      document.body.appendChild(modal);
    }

    const changelogItems = (data.changelog || []).map(item => `<li>${item}</li>`).join('');

    modal.innerHTML = `
      <div class="placeai-update-modal-card">
        <div class="update-modal-badge">
          <i class="fas fa-bolt"></i> PlaceAI Mobile Updater
        </div>
        <h2 class="update-modal-title">PlaceAI Version ${data.version || CURRENT_APP_VERSION}</h2>
        <p class="update-modal-desc">
          ${isUpToDate ? 'Your app is fully up to date with the latest live features.' : 'A new mobile update with layout and calling fixes is ready to apply.'}
        </p>

        <div class="update-modal-changelog">
          <div style="font-weight:700;font-size:12px;color:#94a3b8;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">What\'s New in This Release:</div>
          <ul>
            ${changelogItems}
          </ul>
        </div>

        <div class="update-modal-btns">
          <button class="update-modal-btn-primary" onclick="applyPlaceAIUpdate()">
            <i class="fas fa-sync-alt"></i> Apply Live Update (Instant)
          </button>
          <a class="update-modal-btn-secondary" href="${data.directDownloadUrl || data.apkUrl || APK_FALLBACK_URL}" download="PlaceAI.apk" target="_blank">
            <i class="fas fa-download"></i> Download Latest APK Binary
          </a>
          <button class="update-modal-btn-close" onclick="closePlaceAIUpdateModal()">Close</button>
        </div>
      </div>
    `;

    modal.classList.add('active');
  };

  window.closePlaceAIUpdateModal = function () {
    const modal = document.getElementById('placeaiUpdateModal');
    if (modal) modal.classList.remove('active');
  };

  // Check automatically when page is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => checkForUpdates(true), 1200);
    });
  } else {
    setTimeout(() => checkForUpdates(true), 1200);
  }

  // Also check when app comes back to foreground
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkForUpdates(true);
    }
  });
})();
