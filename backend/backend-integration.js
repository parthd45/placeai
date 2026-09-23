/**
 * Backend Integration Script for PlaceAI
 * 
 * This script integrates the existing frontend forms with Supabase backend.
 * Include this file in your HTML pages AFTER including the auth-service.js and db-service.js
 * 
 * Usage:
 * 1. Include Supabase CDN in your HTML
 * 2. Include auth-service.js
 * 3. Include db-service.js
 * 4. Include this file
 * 5. Set window.SUPABASE_URL and window.SUPABASE_ANON_KEY
 */

(function () {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBackend);
  } else {
    initializeBackend();
  }

  function initializeBackend() {
    // Check if on login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      setupLoginForm(loginForm);
    }

    // Check if on register page
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      setupRegisterForm(registerForm);
    }

    // Check for authentication state on page load
    checkAuthState();
  }

  /**
   * Setup login form handlers
   */
  function setupLoginForm(form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const emailOrMobile = form.querySelector('#emailOrMobile').value.trim();
      const password = form.querySelector('#password').value;
      const rememberMe = form.querySelector('input[name="remember"]')?.checked || false;

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing In...';

      try {
        // Call authentication service
        const result = await window.AuthService.login(emailOrMobile, password);

        if (result.success) {
          // Store remember me preference
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }

          // Show success message
          showNotification('success', result.message);

          // Check if admin user (hidden from normal users)
          const adminEmail = 'admin@placewise.tech';
          const isAdmin = emailOrMobile.toLowerCase() === adminEmail;

          // Redirect based on user type
          setTimeout(() => {
            if (isAdmin) {
              window.location.href = 'admin-dashboard.html';
            } else {
              window.location.href = 'dashboard.html';
            }
          }, 1500);
        } else {
          // Show error message
          const errorMsg = result.error || 'Login failed. Please try again.';
          showNotification('error', errorMsg);

          // If email is not confirmed, prompt user to resend verification email
          if (errorMsg.toLowerCase().includes('not confirmed') || errorMsg.toLowerCase().includes('not verified')) {
            const isEmail = emailOrMobile.includes('@');
            if (isEmail) {
              const shouldResend = confirm(errorMsg + '\n\nWould you like us to resend the confirmation email to ' + emailOrMobile + '?');
              if (shouldResend) {
                const resendResult = await window.AuthService.resendConfirmationEmail(emailOrMobile);
                if (resendResult.success) {
                  showNotification('success', resendResult.message);
                } else {
                  showNotification('error', resendResult.error || 'Failed to resend confirmation email.');
                }
              }
            }
          }

          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      } catch (error) {
        console.error('Login error:', error);
        showNotification('error', 'An unexpected error occurred. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });

    // Social login buttons
    const googleBtn = document.querySelector('.social-btn[aria-label*="Google"]');
    if (googleBtn) {
      googleBtn.addEventListener('click', async function () {
        const result = await window.AuthService.loginWithGoogle();
        if (!result.success) {
          showNotification('error', result.error || 'Google login failed');
        }
      });
    }

    const facebookBtn = document.querySelector('.social-btn[aria-label*="Facebook"]');
    if (facebookBtn) {
      facebookBtn.addEventListener('click', async function () {
        const result = await window.AuthService.loginWithFacebook();
        if (!result.success) {
          showNotification('error', result.error || 'Facebook login failed');
        }
      });
    }

    const githubBtn = document.querySelector('.social-btn[aria-label*="GitHub"]');
    if (githubBtn) {
      githubBtn.addEventListener('click', async function () {
        const result = await window.AuthService.loginWithGithub();
        if (!result.success) {
          showNotification('error', result.error || 'GitHub login failed');
        }
      });
    }
  }

  /**
   * Setup register form handlers
   */
  function setupRegisterForm(form) {
    const mobileInput = document.getElementById('mobileInput');
    const mobileError = document.getElementById('mobileError');

    // Real-time 10-digit mobile number formatting & validation
    if (mobileInput) {
      const mobileValidIcon = document.getElementById('mobileValidIcon');
      mobileInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        // Auto-strip country code 91 if 12 digits, or leading 0 if 11 digits (e.g. from copy-paste)
        if (val.length === 12 && val.startsWith('91')) val = val.slice(2);
        else if (val.length === 11 && val.startsWith('0')) val = val.slice(1);
        val = val.slice(0, 10);
        e.target.value = val;

        const isValid = /^[6-9]\d{9}$/.test(val);
        if (mobileValidIcon) {
          mobileValidIcon.style.display = isValid ? 'block' : 'none';
        }

        if (mobileError) {
          if (val.length > 0 && !/^[6-9]/.test(val)) {
            mobileError.textContent = 'Mobile number must start with 6, 7, 8, or 9';
            mobileError.style.display = 'block';
          } else if (val.length > 0 && val.length < 10) {
            mobileError.textContent = `${10 - val.length} more digits needed (10-digit number)`;
            mobileError.style.display = 'block';
          } else {
            mobileError.style.display = 'none';
          }
        }
      });
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Get form values by ID
      const email = document.getElementById('emailInput').value.trim();
      const mobile = mobileInput ? mobileInput.value.trim() : '';
      const firstName = document.getElementById('firstNameInput').value.trim();
      const lastName = document.getElementById('lastNameInput').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      // Validate passwords match
      if (password !== confirmPassword) {
        showNotification('error', 'Passwords do not match');
        return;
      }

      // Validate password strength
      if (password.length < 8) {
        showNotification('error', 'Password must be at least 8 characters long');
        return;
      }

      // Validate email
      if (!email) {
        showNotification('error', 'Please enter a valid email address');
        return;
      }

      // Validate mobile number if entered
      let cleanMobile = null;
      if (mobile) {
        cleanMobile = mobile.replace(/\D/g, '');
        if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
          if (mobileError) {
            mobileError.textContent = 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.';
            mobileError.style.display = 'block';
          }
          showNotification('error', 'Please enter a valid 10-digit mobile number');
          if (mobileInput) mobileInput.focus();
          return;
        }
        if (mobileError) mobileError.style.display = 'none';
      }

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';

      try {
        const metadata = {
          firstName: firstName,
          lastName: lastName,
          mobile: cleanMobile || null
        };

        const result = await window.AuthService.registerWithEmail(email, password, metadata);

        if (result.success) {
          if (result.session) {
            // Auto-confirmed (mailer_autoconfirm is ON) - but we want OTP flow
            // Sign out the auto-session so user must verify first
            await window.AuthService.logout();
          }

          // Show OTP verification section on SAME SCREEN
          showNotification('success', 'Account created! Please check your email for the 8-digit verification code.');
          
          // Keep form visible on the same screen, lock fields while verifying
          const inputsToLock = form.querySelectorAll('input:not(.otp-input)');
          inputsToLock.forEach(inp => inp.disabled = true);
          submitBtn.disabled = true;
          submitBtn.textContent = '✓ Verification Code Sent!';

          // Show OTP section inline
          const otpSection = document.getElementById('otpSection');
          if (otpSection) {
            otpSection.style.display = 'block';
            document.getElementById('otpEmail').textContent = email;

            // Setup edit details button to unlock fields if needed
            const editBtn = document.getElementById('editFormBtn');
            if (editBtn) {
              editBtn.onclick = () => {
                inputsToLock.forEach(inp => inp.disabled = false);
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                otpSection.style.display = 'none';
                document.getElementById('emailInput').focus();
              };
            }

            // Smoothly scroll to the verification box on the same screen
            setTimeout(() => {
              otpSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);

            // Setup OTP inputs
            setupOtpInputs();

            // Setup verify button
            document.getElementById('verifyOtpBtn').onclick = async function () {
              const otpInputs = document.querySelectorAll('.otp-input');
              let otpCode = '';
              otpInputs.forEach(input => otpCode += input.value.trim());

              if (otpCode.length < 6) {
                document.getElementById('otpError').textContent = 'Please enter the complete verification code.';
                document.getElementById('otpError').style.display = 'block';
                document.getElementById('otpInputContainer').classList.add('otp-shake');
                setTimeout(() => document.getElementById('otpInputContainer').classList.remove('otp-shake'), 400);
                return;
              }

              const verifyBtn = this;
              verifyBtn.disabled = true;
              verifyBtn.textContent = 'Verifying...';

              const verifyResult = await window.AuthService.verifyEmailOTP(email, otpCode);

              if (verifyResult.success) {
                // Mark all inputs green
                otpInputs.forEach(input => { input.classList.remove('error'); input.classList.add('success'); });
                document.getElementById('otpError').style.display = 'none';
                showNotification('success', '✅ Email verified successfully! Redirecting to dashboard...');
                verifyBtn.textContent = 'Verified! Redirecting...';
                
                setTimeout(() => {
                  window.location.href = 'dashboard.html';
                }, 1500);
              } else {
                otpInputs.forEach(input => { input.classList.remove('success'); input.classList.add('error'); });
                document.getElementById('otpError').textContent = verifyResult.error;
                document.getElementById('otpError').style.display = 'block';
                document.getElementById('otpInputContainer').classList.add('otp-shake');
                setTimeout(() => document.getElementById('otpInputContainer').classList.remove('otp-shake'), 400);
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'Verify & Complete Account';
              }
            };

            // Setup resend button with 60s countdown
            startResendCountdown(email);
          }
        } else {
          // Show error message
          const errorMsg = result.error || 'Registration failed. Please try again.';

          // Check if user already exists
          if (errorMsg.includes('already registered')) {
            const resend = confirm(errorMsg + '\n\nDidn\'t receive verification email? Click OK to resend.');
            if (resend) {
              const resendResult = await window.AuthService.resendConfirmationEmail(email);
              if (resendResult.success) {
                showNotification('success', resendResult.message);
              } else {
                showNotification('error', 'Failed to resend email. Please try logging in.');
              }
            }
          } else {
            showNotification('error', errorMsg);
          }

          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      } catch (error) {
        console.error('Registration error:', error);
        showNotification('error', 'An unexpected error occurred. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  /**
   * Check authentication state and redirect if needed
   */
  async function checkAuthState() {
    // Skip auth check on login, register, dashboard, and index pages
    const currentPage = window.location.pathname;
    if (currentPage.includes('login.html') || currentPage.includes('register.html') || currentPage.includes('dashboard.html') || currentPage.includes('index.html') || currentPage === '/') {
      return;
    }

    try {
      const session = await window.AuthService.getCurrentSession();

      // No session check needed - let pages handle their own auth
    } catch (error) {
      console.error('Auth state check error:', error);
    }
  }

  /**
   * Show notification to user
   */
  function showNotification(type, message) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.id = 'notification-container';
      notificationContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99999;
        max-width: 400px;
      `;
      document.body.appendChild(notificationContainer);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease-out;
      display: flex;
      align-items: center;
      gap: 10px;
    `;

    const icon = type === 'success' ? '✓' : '✕';
    notification.innerHTML = `
      <span style="font-size: 20px; font-weight: bold;">${icon}</span>
      <span>${message}</span>
    `;

    notificationContainer.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }

  /**
   * Setup OTP input behavior (auto-focus next, paste support, backspace)
   */
  function setupOtpInputs() {
    const inputs = document.querySelectorAll('.otp-input');
    if (!inputs.length) return;

    // Focus first input
    inputs[0].focus();

    inputs.forEach((input, index) => {
      // On input, auto-focus next
      input.addEventListener('input', (e) => {
        const val = e.target.value;
        // Only allow digits
        e.target.value = val.replace(/[^0-9]/g, '');
        
        if (e.target.value && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }

        // Update filled style
        if (e.target.value) {
          e.target.classList.add('filled');
          e.target.classList.remove('error');
        } else {
          e.target.classList.remove('filled');
        }

        // Auto trigger when final digit is entered
        if (e.target.value && index === inputs.length - 1) {
          const verifyBtn = document.getElementById('verifyOtpBtn');
          if (verifyBtn) setTimeout(() => verifyBtn.click(), 150);
        }
      });

      // On backspace, go to previous input
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
          inputs[index - 1].focus();
          inputs[index - 1].value = '';
          inputs[index - 1].classList.remove('filled');
        }
        // Enter key triggers verify
        if (e.key === 'Enter') {
          document.getElementById('verifyOtpBtn').click();
        }
      });

      // Handle paste (paste 8-digit or 6-digit code)
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
        if (pastedData.length >= 6) {
          inputs.forEach((inp, i) => {
            inp.value = pastedData[i] || '';
            if (inp.value) inp.classList.add('filled');
          });
          const lastIdx = Math.min(pastedData.length - 1, inputs.length - 1);
          inputs[lastIdx].focus();
          const verifyBtn = document.getElementById('verifyOtpBtn');
          if (verifyBtn && (pastedData.length === 6 || pastedData.length >= 8)) {
            setTimeout(() => verifyBtn.click(), 200);
          }
        }
      });
    });
  }

  /**
   * Start 60-second countdown for resend OTP button
   */
  function startResendCountdown(email) {
    const resendBtn = document.getElementById('resendOtpBtn');
    const timerSpan = document.getElementById('resendTimer');
    if (!resendBtn || !timerSpan) return;

    let seconds = 60;
    resendBtn.disabled = true;
    timerSpan.textContent = seconds;
    resendBtn.innerHTML = 'Resend in <span id="resendTimer">' + seconds + '</span>s';

    const interval = setInterval(() => {
      seconds--;
      const timer = document.getElementById('resendTimer');
      if (timer) timer.textContent = seconds;

      if (seconds <= 0) {
        clearInterval(interval);
        resendBtn.disabled = false;
        resendBtn.innerHTML = 'Resend Code';
        resendBtn.onclick = async function () {
          resendBtn.disabled = true;
          resendBtn.innerHTML = 'Sending...';
          const resendResult = await window.AuthService.resendConfirmationEmail(email);
          if (resendResult.success) {
            showNotification('success', 'New verification code sent to ' + email);
          } else {
            showNotification('error', resendResult.error || 'Failed to resend code.');
          }
          // Restart countdown
          startResendCountdown(email);
        };
      }
    }, 1000);
  }

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  /**
   * Helper to handle 6-digit input auto-focus, arrow navigation, and clipboard auto-paste
   */
  function setupDigitInputs(inputs, triggerButton) {
    if (!inputs || !inputs.length) return;

    inputs.forEach((input, index) => {
      // Input event: only keep 1 digit and auto-advance
      input.addEventListener('input', (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = val ? val.slice(-1) : '';
        if (e.target.value) {
          input.classList.add('filled');
          input.classList.remove('error');
          if (index < inputs.length - 1) {
            inputs[index + 1].focus();
          } else {
            // Check if all are filled
            let allFilled = true;
            inputs.forEach(inp => { if (!inp.value) allFilled = false; });
            if (allFilled && triggerButton) {
              setTimeout(() => triggerButton.click(), 120);
            }
          }
        } else {
          input.classList.remove('filled');
        }
      });

      // Key navigation and backspace
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
          if (!input.value && index > 0) {
            inputs[index - 1].focus();
            inputs[index - 1].value = '';
            inputs[index - 1].classList.remove('filled');
          } else {
            input.value = '';
            input.classList.remove('filled');
          }
        } else if (e.key === 'ArrowLeft' && index > 0) {
          inputs[index - 1].focus();
        } else if (e.key === 'ArrowRight' && index < inputs.length - 1) {
          inputs[index + 1].focus();
        } else if (e.key === 'Enter' && triggerButton) {
          triggerButton.click();
        }
      });

      // Paste event: paste full 6-digit code anywhere to auto-fill all boxes
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const clipboard = e.clipboardData || window.clipboardData;
        const pasted = (clipboard ? clipboard.getData('text') : '').replace(/[^0-9]/g, '');
        if (pasted.length > 0) {
          const chars = pasted.split('');
          inputs.forEach((inp, i) => {
            if (chars[i]) {
              inp.value = chars[i];
              inp.classList.add('filled');
              inp.classList.remove('error');
            }
          });
          const lastFilledIdx = Math.min(chars.length, inputs.length) - 1;
          if (lastFilledIdx >= 0 && inputs[lastFilledIdx]) {
            inputs[lastFilledIdx].focus();
          }
          if (chars.length >= inputs.length && triggerButton) {
            setTimeout(() => triggerButton.click(), 150);
          }
        }
      });
    });
  }

  /**
   * Setup Mobile OTP verification for Registration page
   */
  function setupRegisterMobileOtp() {
    const sendOtpBtn = document.getElementById('sendMobileOtpBtn');
    const mobileInput = document.getElementById('mobileInput');
    const mobileOtpBox = document.getElementById('mobileOtpBox');
    const mobileOtpDisplay = document.getElementById('mobileOtpDisplay');
    const confirmOtpBtn = document.getElementById('confirmMobileOtpBtn');
    const cancelOtpBtn = document.getElementById('cancelMobileOtpBtn');
    const resendBtn = document.getElementById('resendMobileOtpBtn');
    const resendTimerSpan = document.getElementById('mobileResendTimer');
    const mobileVerifiedBadge = document.getElementById('mobileVerifiedBadge');
    const otpError = document.getElementById('mobileOtpError');
    const digitInputs = document.querySelectorAll('.mobile-digit');

    if (!sendOtpBtn || !mobileInput) return;

    let resendInterval = null;

    function startTimer(seconds = 60) {
      if (resendInterval) clearInterval(resendInterval);
      if (resendBtn) resendBtn.disabled = true;
      if (resendTimerSpan) resendTimerSpan.textContent = seconds;
      if (resendBtn) resendBtn.innerHTML = `Resend in <span id="mobileResendTimer">${seconds}</span>s`;

      resendInterval = setInterval(() => {
        seconds--;
        const curSpan = document.getElementById('mobileResendTimer');
        if (curSpan) curSpan.textContent = seconds;
        if (seconds <= 0) {
          clearInterval(resendInterval);
          if (resendBtn) {
            resendBtn.disabled = false;
            resendBtn.innerHTML = 'Resend Code';
          }
        }
      }, 1000);
    }

    setupDigitInputs(digitInputs, confirmOtpBtn);

    sendOtpBtn.addEventListener('click', async function () {
      const phone = mobileInput.value.trim();
      if (!phone) {
        showNotification('error', 'Please enter your mobile number first.');
        mobileInput.focus();
        return;
      }

      sendOtpBtn.disabled = true;
      sendOtpBtn.innerHTML = '<span>⏳</span> Sending OTP...';
      if (otpError) otpError.style.display = 'none';

      let result;
      // Primary: Firebase Phone SMS (Google carrier network, works for ALL numbers, no dedicated number needed)
      if (window.PhoneAuthService && window.isFirebaseConfigured && window.isFirebaseConfigured()) {
        console.log('Dispatching free SMS OTP via Firebase Phone Auth...');
        result = await window.PhoneAuthService.sendPhoneOTP(phone, 'recaptcha-container');
        // If Firebase quota or error occurs, try WhatsApp OTP as fallback
        if (!result.success && window.WhatsAppAuthService) {
          console.warn('Firebase SMS failed, falling back to WhatsApp OTP:', result.error);
          const waResult = await window.WhatsAppAuthService.sendWhatsAppOTP(phone);
          if (waResult.success) result = waResult;
        }
      } else if (window.WhatsAppAuthService) {
        result = await window.WhatsAppAuthService.sendWhatsAppOTP(phone);
      } else {
        result = { success: false, error: 'Phone verification service is unavailable.' };
      }

      if (result.success) {
        showNotification('success', result.message || 'OTP sent successfully!');
        if (mobileOtpDisplay) mobileOtpDisplay.textContent = result.formattedPhone || phone;
        if (mobileOtpBox) mobileOtpBox.style.display = 'block';
        digitInputs.forEach(input => { input.value = ''; input.classList.remove('error', 'success', 'filled'); });

        // Auto-fill dev code if returned
        const devCode = result.otpCode || result.demoCode;
        if (devCode && devCode.length === 6) {
          digitInputs.forEach((inp, idx) => {
            inp.value = devCode[idx];
            inp.classList.add('filled');
          });
        }

        if (digitInputs[0]) digitInputs[0].focus();
        startTimer(60);
      } else {
        showNotification('error', result.error || 'Failed to send OTP.');
      }
      sendOtpBtn.disabled = false;
      sendOtpBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff" style="vertical-align: middle;"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        <span>Verify via OTP</span>
      `;
    });

    if (cancelOtpBtn) {
      cancelOtpBtn.addEventListener('click', () => {
        if (mobileOtpBox) mobileOtpBox.style.display = 'none';
      });
    }

    if (resendBtn) {
      resendBtn.addEventListener('click', async function () {
        resendBtn.disabled = true;
        resendBtn.textContent = 'Sending...';
        const phone = mobileInput.value.trim();
        let result;
        if (window.PhoneAuthService && window.isFirebaseConfigured && window.isFirebaseConfigured()) {
          result = await window.PhoneAuthService.sendPhoneOTP(phone, 'recaptcha-container');
        } else if (window.WhatsAppAuthService) {
          result = await window.WhatsAppAuthService.sendWhatsAppOTP(phone);
        } else {
          result = { success: false, error: 'Service unavailable' };
        }
        if (result.success) {
          showNotification('success', 'New verification code sent!');
          startTimer(60);
        } else {
          showNotification('error', result.error || 'Failed to resend code.');
          resendBtn.disabled = false;
          resendBtn.textContent = 'Resend Code';
        }
      });
    }

    if (confirmOtpBtn) {
      confirmOtpBtn.addEventListener('click', async function () {
        let code = '';
        digitInputs.forEach(input => code += input.value);

        if (code.length !== 6) {
          if (otpError) {
            otpError.textContent = 'Please enter all 6 digits of the verification code.';
            otpError.style.display = 'block';
          }
          if (mobileOtpBox) {
            mobileOtpBox.classList.add('otp-shake');
            setTimeout(() => mobileOtpBox.classList.remove('otp-shake'), 400);
          }
          return;
        }

        confirmOtpBtn.disabled = true;
        confirmOtpBtn.textContent = 'Verifying...';
        if (otpError) otpError.style.display = 'none';

        let result;
        if (window.PhoneAuthService && window.PhoneAuthService.hasActiveSession && window.PhoneAuthService.hasActiveSession()) {
          result = await window.PhoneAuthService.verifyPhoneOTP(code);
        } else if (window.WhatsAppAuthService) {
          result = await window.WhatsAppAuthService.verifyWhatsAppOTP(code);
        } else if (window.PhoneAuthService) {
          result = await window.PhoneAuthService.verifyPhoneOTP(code);
        } else {
          result = { success: false, error: 'Verification service unavailable' };
        }
        if (result.success) {
          digitInputs.forEach(input => { input.classList.remove('error'); input.classList.add('success'); });
          showNotification('success', '✅ WhatsApp number verified successfully!');
          setTimeout(() => {
            if (mobileOtpBox) mobileOtpBox.style.display = 'none';
            if (sendOtpBtn) sendOtpBtn.style.display = 'none';
            if (mobileVerifiedBadge) {
              mobileVerifiedBadge.style.display = 'inline-flex';
              mobileVerifiedBadge.innerHTML = '✓ WhatsApp Verified';
            }
            mobileInput.readOnly = true;
            mobileInput.style.borderColor = '#25D366';
            mobileInput.dataset.verified = 'true';
            mobileInput.dataset.formattedPhone = result.phoneNumber || mobileInput.value;
          }, 600);
        } else {
          digitInputs.forEach(input => { input.classList.remove('success'); input.classList.add('error'); });
          if (otpError) {
            otpError.textContent = result.error || 'Invalid OTP code.';
            otpError.style.display = 'block';
          }
          if (mobileOtpBox) {
            mobileOtpBox.classList.add('otp-shake');
            setTimeout(() => mobileOtpBox.classList.remove('otp-shake'), 400);
          }
          confirmOtpBtn.disabled = false;
          confirmOtpBtn.textContent = 'Confirm OTP';
        }
      });
    }
  }

  /**
   * Setup Mobile OTP Login for Login page
   */
  function setupPhoneOtpLoginForm() {
    const tabPassword = document.getElementById('tabPasswordLogin');
    const tabPhone = document.getElementById('tabPhoneOtpLogin');
    const passwordForm = document.getElementById('loginForm');
    const phoneForm = document.getElementById('phoneOtpLoginForm');

    if (!tabPassword || !tabPhone || !passwordForm || !phoneForm) return;

    tabPassword.addEventListener('click', () => {
      tabPassword.classList.add('active');
      tabPhone.classList.remove('active');
      tabPassword.style.background = '#7c3aed';
      tabPassword.style.borderColor = '#7c3aed';
      tabPhone.style.background = 'transparent';
      tabPhone.style.borderColor = '#25D366';
      passwordForm.style.display = 'block';
      phoneForm.style.display = 'none';
    });

    tabPhone.addEventListener('click', () => {
      tabPhone.classList.add('active');
      tabPassword.classList.remove('active');
      tabPhone.style.background = '#25D366';
      tabPhone.style.borderColor = '#25D366';
      tabPassword.style.background = 'transparent';
      tabPassword.style.borderColor = '#7c3aed';
      passwordForm.style.display = 'none';
      phoneForm.style.display = 'block';
    });

    const phoneInput = document.getElementById('loginPhoneInput');
    const sendOtpBtn = document.getElementById('sendLoginPhoneOtpBtn');
    const verifySection = document.getElementById('loginOtpVerifySection');
    const phoneDisplay = document.getElementById('loginPhoneDisplay');
    const digitInputs = document.querySelectorAll('.login-digit');
    const verifyBtn = document.getElementById('verifyLoginPhoneOtpBtn');
    const resendBtn = document.getElementById('resendLoginOtpBtn');
    const resendTimerSpan = document.getElementById('loginResendTimer');
    const phoneError = document.getElementById('loginPhoneError');
    const codeError = document.getElementById('loginOtpCodeError');

    let resendInterval = null;

    function startTimer(seconds = 60) {
      if (resendInterval) clearInterval(resendInterval);
      if (resendBtn) resendBtn.disabled = true;
      if (resendTimerSpan) resendTimerSpan.textContent = seconds;
      if (resendBtn) resendBtn.innerHTML = `Resend in <span id="loginResendTimer">${seconds}</span>s`;

      resendInterval = setInterval(() => {
        seconds--;
        const curSpan = document.getElementById('loginResendTimer');
        if (curSpan) curSpan.textContent = seconds;
        if (seconds <= 0) {
          clearInterval(resendInterval);
          if (resendBtn) {
            resendBtn.disabled = false;
            resendBtn.innerHTML = 'Resend Code';
          }
        }
      }, 1000);
    }

    setupDigitInputs(digitInputs, verifyBtn);

    sendOtpBtn.addEventListener('click', async function () {
      const phone = phoneInput.value.trim();
      if (!phone) {
        if (phoneError) {
          phoneError.textContent = 'Please enter your mobile number.';
          phoneError.style.display = 'block';
        }
        phoneInput.focus();
        return;
      }
      if (phoneError) phoneError.style.display = 'none';

      sendOtpBtn.disabled = true;
      sendOtpBtn.innerHTML = '<span>⏳</span> Sending OTP...';

      let result;
      // Primary: Firebase Phone SMS (Google carrier network, works for ALL numbers, no dedicated number needed)
      if (window.PhoneAuthService && window.isFirebaseConfigured && window.isFirebaseConfigured()) {
        console.log('Dispatching free SMS OTP via Firebase Phone Auth...');
        result = await window.PhoneAuthService.sendPhoneOTP(phone, 'recaptcha-container');
        if (!result.success && window.WhatsAppAuthService) {
          console.warn('Firebase SMS failed, falling back to WhatsApp OTP:', result.error);
          const waResult = await window.WhatsAppAuthService.sendWhatsAppOTP(phone);
          if (waResult.success) result = waResult;
        }
      } else if (window.WhatsAppAuthService) {
        result = await window.WhatsAppAuthService.sendWhatsAppOTP(phone);
      } else {
        result = { success: false, error: 'Phone verification service is unavailable.' };
      }

      if (result.success) {
        showNotification('success', result.message || 'OTP sent successfully!');
        if (phoneDisplay) phoneDisplay.textContent = result.formattedPhone || phone;
        if (verifySection) verifySection.style.display = 'block';
        digitInputs.forEach(input => { input.value = ''; input.classList.remove('error', 'success', 'filled'); });

        // Auto-fill dev code if returned
        const devCode = result.otpCode || result.demoCode;
        if (devCode && devCode.length === 6) {
          digitInputs.forEach((inp, idx) => {
            inp.value = devCode[idx];
            inp.classList.add('filled');
          });
        }

        if (digitInputs[0]) digitInputs[0].focus();
        startTimer(60);
      } else {
        if (phoneError) {
          phoneError.textContent = result.error || 'Failed to send OTP.';
          phoneError.style.display = 'block';
        }
        showNotification('error', result.error || 'Failed to send OTP.');
      }
      sendOtpBtn.disabled = false;
      sendOtpBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff" style="vertical-align: middle;"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        <span>Send OTP</span>
      `;
    });

    if (resendBtn) {
      resendBtn.addEventListener('click', async function () {
        resendBtn.disabled = true;
        resendBtn.textContent = 'Sending...';
        const phone = phoneInput.value.trim();
        let result;
        if (window.PhoneAuthService && window.isFirebaseConfigured && window.isFirebaseConfigured()) {
          result = await window.PhoneAuthService.sendPhoneOTP(phone, 'recaptcha-container');
        } else if (window.WhatsAppAuthService) {
          result = await window.WhatsAppAuthService.sendWhatsAppOTP(phone);
        } else {
          result = { success: false, error: 'Service unavailable' };
        }
        if (result.success) {
          showNotification('success', 'New verification code sent!');
          startTimer(60);
        } else {
          showNotification('error', result.error || 'Failed to resend code.');
          resendBtn.disabled = false;
          resendBtn.textContent = 'Resend Code';
        }
      });
    }

    if (verifyBtn) {
      verifyBtn.addEventListener('click', async function () {
        let code = '';
        digitInputs.forEach(input => code += input.value);

        if (code.length !== 6) {
          if (codeError) {
            codeError.textContent = 'Please enter the complete 6-digit code.';
            codeError.style.display = 'block';
          }
          if (verifySection) {
            verifySection.classList.add('otp-shake');
            setTimeout(() => verifySection.classList.remove('otp-shake'), 400);
          }
          return;
        }

        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '<span>⏳</span> Verifying & Signing In...';
        if (codeError) codeError.style.display = 'none';

        let result;
        if (window.PhoneAuthService && window.PhoneAuthService.hasActiveSession && window.PhoneAuthService.hasActiveSession()) {
          result = await window.PhoneAuthService.verifyPhoneOTP(code);
        } else if (window.WhatsAppAuthService) {
          result = await window.WhatsAppAuthService.verifyWhatsAppOTP(code);
        } else if (window.PhoneAuthService) {
          result = await window.PhoneAuthService.verifyPhoneOTP(code);
        } else {
          result = { success: false, error: 'Verification service unavailable' };
        }
        if (result.success) {
          digitInputs.forEach(input => { input.classList.remove('error'); input.classList.add('success'); });
          showNotification('success', '✅ Verified! Logging you in...');

          // Connect with PlaceAI Supabase profile
          const formattedPhone = result.phoneNumber || phoneInput.value.trim();
          try {
            const supabase = window.supabaseClient || window.supabase.createClient(
              window.SUPABASE_URL,
              window.SUPABASE_ANON_KEY
            );

            // Look up existing profile with this mobile number
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .or(`mobile.eq.${formattedPhone},mobile.eq.${phoneInput.value.trim()}`)
              .maybeSingle();

            if (profile) {
              console.log('Found profile for phone user:', profile);
              localStorage.setItem('placeai_phone_user', JSON.stringify({
                phone: formattedPhone,
                profileId: profile.id,
                userId: profile.user_id,
                email: profile.email,
                name: profile.full_name || profile.first_name
              }));
            } else {
              console.log('No existing profile for phone, creating session entry...');
              localStorage.setItem('placeai_phone_user', JSON.stringify({
                phone: formattedPhone,
                firebaseUid: result.user?.uid
              }));
            }
          } catch (dbErr) {
            console.warn('Profile lookup warning:', dbErr);
          }

          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 900);
        } else {
          digitInputs.forEach(input => { input.classList.remove('success'); input.classList.add('error'); });
          if (codeError) {
            codeError.textContent = result.error || 'Invalid verification code.';
            codeError.style.display = 'block';
          }
          if (verifySection) {
            verifySection.classList.add('otp-shake');
            setTimeout(() => verifySection.classList.remove('otp-shake'), 400);
          }
          verifyBtn.disabled = false;
          verifyBtn.innerHTML = '<span>Verify & Sign In</span>';
        }
      });
    }
  }

  // Export for use in other scripts
  window.BackendIntegration = {
    checkAuthState,
    showNotification,
    setupOtpInputs,
    startResendCountdown,
    setupRegisterMobileOtp,
    setupPhoneOtpLoginForm
  };

})();
