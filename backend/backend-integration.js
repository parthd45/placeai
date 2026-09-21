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
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Get form values by ID
      const email = document.getElementById('emailInput').value.trim();
      const mobile = document.getElementById('mobileInput').value.trim();
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

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';

      try {
        const metadata = {
          firstName: firstName,
          lastName: lastName,
          mobile: mobile || null
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

              if (otpCode.length !== 6) {
                document.getElementById('otpError').textContent = 'Please enter the complete 6-digit code.';
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

      // Handle paste (paste full 6-digit code)
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
        if (pastedData.length >= 6) {
          inputs.forEach((inp, i) => {
            inp.value = pastedData[i] || '';
            if (inp.value) inp.classList.add('filled');
          });
          inputs[5].focus();
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

  // Export for use in other scripts
  window.BackendIntegration = {
    checkAuthState,
    showNotification,
    setupOtpInputs,
    startResendCountdown
  };

})();
