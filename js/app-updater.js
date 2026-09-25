/**
 * PlaceAI Silent & Non-Intrusive Over-The-Air (OTA) Patch System
 * Alerts the user with a subtle top banner ONLY when a new build exists.
 * Once updated or dismissed, it will never show again for that version.
 */
(function () {
  const CURRENT_APP_VERSION = '2.2.7';
  const CURRENT_BUILD_TS = 1727295000000;
  const VERSION_CHECK_URL = 'https://www.firstplacewise.tech/version.json';
  const APK_FALLBACK_URL = 'https://github.com/parthd45/placeai/raw/main/PlaceAI.apk';

  function injectUpdaterStyles() {
    if (document.getElementById('placeai-updater-styles')) return;
    const style = document.createElement('style');
    style.id = 'placeai-updater-styles';
    style.textContent = `
      .placeai-update-banner {
        position: fixed;
        top: calc(env(safe-area-inset-top, 0px) + 8px);
        left: 50%;
        transform: translateX(-50%) translateY(-150%);
        width: calc(100% - 20px);
        max-width: 440px;
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.97) 0%, rgba(30, 41, 59, 0.98) 100%);
        border: 1.5px solid rgba(139, 92, 246, 0.5);
        border-radius: 14px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(124, 58, 237, 0.25);
        padding: 10px 12px;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
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
        width: 32px;
        height: 32px;
        min-width: 32px;
        border-radius: 8px;
        background: linear-gradient(135deg, #7c3aed, #6366f1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 14px;
      }
      .update-banner-text {
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .update-banner-title {
        font-size: 13px;
        font-weight: 700;
        color: #f8fafc;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .update-banner-sub {
        font-size: 11px;
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
        padding: 6px 11px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
      }
      .update-btn-close {
        background: rgba(255, 255, 255, 0.08);
        color: #94a3b8;
        border: 1px solid rgba(255, 255, 255, 0.1);
        width: 28px;
        height: 28px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 12px;
      }

      /* In-App Update Modal (Opened ONLY by clicking 'Updates' button) */
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
      }
      .placeai-update-modal-overlay.active {
        display: flex;
      }
      .placeai-update-modal-card {
        background: #0f172a;
        border: 1px solid rgba(139, 92, 246, 0.4);
        border-radius: 20px;
        width: 100%;
        max-width: 420px;
        padding: 22px 18px;
        color: #f8fafc;
        text-align: center;
      }
      .update-modal-title {
        font-size: 19px;
        font-weight: 800;
        margin-bottom: 6px;
      }
      .update-modal-desc {
        font-size: 13px;
        color: #94a3b8;
        margin-bottom: 16px;
      }
      .update-modal-btns {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .update-modal-btn-primary {
        background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
        color: #ffffff;
        border: none;
        height: 44px;
        border-radius: 10px;
        font-size: 14.5px;
        font-weight: 700;
        cursor: pointer;
      }
      .update-modal-btn-secondary {
        background: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(71, 85, 105, 0.5);
        color: #e2e8f0;
        height: 42px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        text-decoration: none;
      }
      .update-modal-btn-close {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 12.5px;
        cursor: pointer;
        padding: 4px 0;
      }
    `;
    document.head.appendChild(style);
  }

  let latestUpdateData = null;

  async function checkForUpdates(silent = true) {
    try {
      // Don't check or show banner if dismissed in current session
      if (silent && sessionStorage.getItem('placeai_update_banner_dismissed')) {
        return;
      }

      const url = VERSION_CHECK_URL + '?_t=' + Date.now();
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return;

      const data = await res.json();
      latestUpdateData = data;

      const lastAppliedTs = parseInt(localStorage.getItem('placeai_last_applied_ts') || '0', 10);
      const isNewer = data.buildTimestamp && data.buildTimestamp > Math.max(lastAppliedTs, CURRENT_BUILD_TS);

      if (isNewer) {
        showUpdateBanner(data);
      } else if (!silent) {
        openPlaceAIUpdateModal(true);
      }
    } catch (e) {
      if (!silent) {
        alert('Your app is running the latest build.');
      }
    }
  }

  function showUpdateBanner(data) {
    injectUpdaterStyles();

    let banner = document.getElementById('placeaiUpdateBanner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'placeaiUpdateBanner';
      banner.className = 'placeai-update-banner';
      banner.innerHTML = `
        <div class="update-banner-left">
          <div class="update-banner-icon"><i class="fas fa-sparkles"></i></div>
          <div class="update-banner-text">
            <span class="update-banner-title">Update Available (v${data.version || '2.2.6'})</span>
            <span class="update-banner-sub">Tap to apply latest mobile improvements</span>
          </div>
        </div>
        <div class="update-banner-actions">
          <button class="update-btn-apply" onclick="applyPlaceAIUpdate()">Update</button>
          <button class="update-btn-close" onclick="dismissUpdateBanner()" title="Dismiss">✕</button>
        </div>
      `;
      document.body.appendChild(banner);
    }

    setTimeout(() => {
      banner.classList.add('visible');
    }, 100);
  }

  window.dismissUpdateBanner = function () {
    const banner = document.getElementById('placeaiUpdateBanner');
    if (banner) {
      banner.classList.remove('visible');
    }
    sessionStorage.setItem('placeai_update_banner_dismissed', '1');
    if (latestUpdateData && latestUpdateData.buildTimestamp) {
      localStorage.setItem('placeai_last_applied_ts', String(latestUpdateData.buildTimestamp));
    }
  };

  window.applyPlaceAIUpdate = function () {
    if (latestUpdateData && latestUpdateData.buildTimestamp) {
      localStorage.setItem('placeai_last_applied_ts', String(latestUpdateData.buildTimestamp));
    } else {
      localStorage.setItem('placeai_last_applied_ts', String(Date.now()));
    }
    sessionStorage.setItem('placeai_update_banner_dismissed', '1');

    const banner = document.getElementById('placeaiUpdateBanner');
    if (banner) {
      banner.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;width:100%;justify-content:center;color:#fff;font-weight:700;font-size:12.5px;padding:3px 0;">
          <i class="fas fa-spinner fa-spin" style="color:#c084fc;"></i> Updating app...
        </div>
      `;
    }
    setTimeout(() => {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('_v', String(Date.now()));
      window.location.href = currentUrl.toString();
    }, 300);
  };

  window.openPlaceAIUpdateModal = function (isUpToDate = false) {
    injectUpdaterStyles();
    const data = latestUpdateData || {
      version: CURRENT_APP_VERSION,
      changelog: [
        'Streamlined mobile dashboard layout with quick section tabs',
        'Direct Sign In button on homepage header and hero',
        'WhatsApp-style Community & Peer Chat with Back navigation',
        'WebRTC Voice & Video call performance updates'
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

    modal.innerHTML = `
      <div class="placeai-update-modal-card">
        <h2 class="update-modal-title">PlaceAI Version ${data.version || CURRENT_APP_VERSION}</h2>
        <p class="update-modal-desc">
          ${isUpToDate ? 'You are running the latest streamlined mobile version.' : 'A new mobile patch is available.'}
        </p>

        <div class="update-modal-btns">
          <button class="update-modal-btn-primary" onclick="applyPlaceAIUpdate()">
            <i class="fas fa-sync-alt"></i> Apply Update & Refresh
          </button>
          <a class="update-modal-btn-secondary" href="${data.directDownloadUrl || data.apkUrl || APK_FALLBACK_URL}" download="PlaceAI.apk">
            <i class="fas fa-download"></i> Download Full APK Binary
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => checkForUpdates(true), 1500);
    });
  } else {
    setTimeout(() => checkForUpdates(true), 1500);
  }
})();
