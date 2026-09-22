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
      setupPhoneOtpLoginForm();
    }

    // Check if on register page
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      setupRegisterForm(registerForm);
      setupRegisterMobileOtp();
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
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Get form values by ID
      const email = document.getElementById('emailInput').value.trim();
      const mobileInput = document.getElementById('mobileInput');
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

      // Check if mobile number is entered and verified
      const isMobileVerified = mobileInput && mobileInput.dataset.verified === 'true';

      if (mobile && !isMobileVerified) {
        const proceedWithoutVerification = confirm(
          `You entered mobile number "${mobile}", but it has not been verified with SMS OTP yet.\n\nClick OK to verify your mobile number first, or Cancel to proceed without mobile verification.`
        );
        if (proceedWithoutVerification) {
          const sendBtn = document.getElementById('sendMobileOtpBtn');
          if (sendBtn) sendBtn.click();
          return;
        }
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
          mobile: (mobileInput?.dataset?.formattedPhone || mobile) || null,
          mobile_verified: isMobileVerified
        };

        const result = await window.AuthService.registerWithEmail(email, password, metadata);

        if (result.success) {
          if (result.session) {
            // Auto-confirmed (mailer_autoconfirm is ON) - but we want OTP flow
            // Sign out the auto-session so user must verify first
            await window.AuthService.logout();
          }

          // Show OTP verification section
          showNotification('success', 'Account created! Please check your email for the 6-digit verification code.');
          
          // Hide the register form
          form.style.display = 'none';
          
          // Show OTP section
          const otpSection = document.getElementById('otpSection');
          if (otpSection) {
            otpSection.style.display = 'block';
            document.getElementById('otpEmail').textContent = email;

            // Setup OTP inputs
            setupOtpInputs();

            // Setup verify button
            document.getElementById('verifyOtpBtn').onclick = async function () {
              const otpInputs = document.querySelectorAll('.otp-input');
              let otpCode = '';
              otpInputs.forEach(input => otpCode += input.value);

              if (otpCode.length !== 8) {
                document.getElementById('otpError').textContent = 'Please enter the complete 8-digit code.';
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
                }, 2000);
              } else {
                otpInputs.forEach(input => { input.classList.remove('success'); input.classList.add('error'); });
                document.getElementById('otpError').textContent = verifyResult.error;
                document.getElementById('otpError').style.display = 'block';
                document.getElementById('otpInputContainer').classList.add('otp-shake');
                setTimeout(() => document.getElementById('otpInputContainer').classList.remove('otp-shake'), 400);
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'Verify & Continue';
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

      // Handle paste (paste full 8-digit code)
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
        if (pastedData.length >= 8) {
          inputs.forEach((inp, i) => {
            inp.value = pastedData[i] || '';
            if (inp.value) inp.classList.add('filled');
          });
          inputs[inputs.length - 1].focus();
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
   * Helper to handle 6-digit input auto-focus and paste
   */
  function setupDigitInputs(inputs, triggerButton) {
    if (!inputs || !inputs.length) return;

    inputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = val;
        if (val) {
          input.classList.add('filled');
          input.classList.remove('error');
          if (index < inputs.length - 1) {
            inputs[index + 1].focus();
          }
        } else {
          input.classList.remove('filled');
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
          inputs[index - 1].focus();
          inputs[index - 1].value = '';
          inputs[index - 1].classList.remove('filled');
        }
        if (e.key === 'Enter' && triggerButton) {
          triggerButton.click();
        }
      });

      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
        if (pasted.length >= inputs.length) {
          inputs.forEach((inp, i) => {
            inp.value = pasted[i] || '';
            if (inp.value) inp.classList.add('filled');
          });
          inputs[inputs.length - 1].focus();
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

    if (!sendOtpBtn || !mobileInput || !window.PhoneAuthService) return;

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
      sendOtpBtn.textContent = 'Sending OTP...';
      if (otpError) otpError.style.display = 'none';

      const result = window.WhatsAppAuthService
        ? await window.WhatsAppAuthService.sendWhatsAppOTP(phone)
        : await window.PhoneAuthService.sendPhoneOTP(phone, 'recaptcha-container');

      if (result.success) {
        showNotification('success', result.message || 'OTP sent successfully to your WhatsApp!');
        if (mobileOtpDisplay) mobileOtpDisplay.textContent = result.formattedPhone || phone;
        if (mobileOtpBox) mobileOtpBox.style.display = 'block';
        digitInputs.forEach(input => { input.value = ''; input.classList.remove('error', 'success', 'filled'); });
        if (digitInputs[0]) digitInputs[0].focus();
        startTimer(60);
      } else {
        showNotification('error', result.error || 'Failed to send OTP.');
      }
      sendOtpBtn.disabled = false;
      sendOtpBtn.textContent = 'Verify WhatsApp';
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
        const result = window.WhatsAppAuthService
          ? await window.WhatsAppAuthService.sendWhatsAppOTP(phone)
          : await window.PhoneAuthService.sendPhoneOTP(phone, 'recaptcha-container');
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

        const result = window.WhatsAppAuthService
          ? await window.WhatsAppAuthService.verifyWhatsAppOTP(code)
          : await window.PhoneAuthService.verifyPhoneOTP(code);
        if (result.success) {
          digitInputs.forEach(input => { input.classList.remove('error'); input.classList.add('success'); });
          showNotification('success', '✅ Mobile number verified successfully!');
          setTimeout(() => {
            if (mobileOtpBox) mobileOtpBox.style.display = 'none';
            if (sendOtpBtn) sendOtpBtn.style.display = 'none';
            if (mobileVerifiedBadge) mobileVerifiedBadge.style.display = 'inline-flex';
            mobileInput.readOnly = true;
            mobileInput.style.borderColor = '#10b981';
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
      tabPhone.style.background = 'transparent';
      passwordForm.style.display = 'block';
      phoneForm.style.display = 'none';
    });

    tabPhone.addEventListener('click', () => {
      tabPhone.classList.add('active');
      tabPassword.classList.remove('active');
      tabPhone.style.background = '#7c3aed';
      tabPassword.style.background = 'transparent';
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
            resendBtn.innerHTML = 'Resend SMS';
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
      sendOtpBtn.textContent = 'Sending...';

      const result = window.WhatsAppAuthService
        ? await window.WhatsAppAuthService.sendWhatsAppOTP(phone)
        : await window.PhoneAuthService.sendPhoneOTP(phone, 'recaptcha-container');

      if (result.success) {
        showNotification('success', result.message || 'OTP sent successfully!');
        if (phoneDisplay) phoneDisplay.textContent = result.formattedPhone || phone;
        if (verifySection) verifySection.style.display = 'block';
        digitInputs.forEach(input => { input.value = ''; input.classList.remove('error', 'success', 'filled'); });
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
      sendOtpBtn.textContent = 'Send OTP';
    });

    if (resendBtn) {
      resendBtn.addEventListener('click', async function () {
        resendBtn.disabled = true;
        resendBtn.textContent = 'Sending...';
        const phone = phoneInput.value.trim();
        const result = window.WhatsAppAuthService
          ? await window.WhatsAppAuthService.sendWhatsAppOTP(phone)
          : await window.PhoneAuthService.sendPhoneOTP(phone, 'recaptcha-container');
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
        verifyBtn.textContent = 'Verifying & Signing In...';
        if (codeError) codeError.style.display = 'none';

        const result = window.WhatsAppAuthService
          ? await window.WhatsAppAuthService.verifyWhatsAppOTP(code)
          : await window.PhoneAuthService.verifyPhoneOTP(code);
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
                userId: profile.user_id
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
          }, 1200);
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
          verifyBtn.textContent = 'Verify & Sign In';
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
