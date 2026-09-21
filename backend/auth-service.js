/**
 * Authentication Service for PlaceAI
 * 
 * This service handles all authentication operations with Supabase
 * including email/password auth, social auth, and session management.
 */

/**
 * Get Supabase client (uses pre-configured session-only storage)
 * @returns {Object} Supabase client instance
 */
function getSupabaseClient() {
  // Use the pre-configured client from supabase-init.js
  // This client uses sessionStorage instead of localStorage
  return window.supabaseClient || window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );
}

/**
 * Register a new user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {Object} metadata - Additional user data (firstName, lastName, etc.)
 * @returns {Promise<Object>} Authentication result
 */
async function registerWithEmail(email, password, metadata = {}) {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: metadata.firstName || '',
          last_name: metadata.lastName || '',
          full_name: `${metadata.firstName || ''} ${metadata.lastName || ''}`.trim()
        },
        emailRedirectTo: 'https://firstplacewise.tech/dashboard.html'
      }
    });

    if (error) throw error;

    // Check if user was created or already exists
    if (data.user) {
      // Check if this is a new user or existing unconfirmed user
      // New users will have identities, existing unconfirmed users won't
      const isNewUser = data.user.identities && data.user.identities.length > 0;

      console.log('User signup result:', {
        userId: data.user.id,
        isNewUser: isNewUser,
        hasIdentities: data.user.identities ? data.user.identities.length : 0
      });

      // Always try to create/update profile
      const profileResult = await createUserProfile(data.user.id, {
        email: email,
        first_name: metadata.firstName,
        last_name: metadata.lastName,
        mobile: metadata.mobile || null
      });

      if (!profileResult.success) {
        console.error('Profile creation failed:', profileResult.error);
      } else {
        console.log('Profile created/updated successfully');
      }

      // If user already existed (no new identity created), resend confirmation
      if (!isNewUser) {
        console.log('Existing unconfirmed user detected, resending confirmation email');
        try {
          const resendResult = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
              emailRedirectTo: 'https://firstplacewise.tech/dashboard.html'
            }
          });

          if (resendResult.error) {
            console.error('Resend error:', resendResult.error);
          } else {
            console.log('Confirmation email resent successfully');
          }
        } catch (resendError) {
          console.error('Error resending confirmation:', resendError);
        }

        return {
          success: true,
          user: data.user,
          session: data.session,
          message: 'A confirmation email has been sent to your inbox. Please verify your email to continue.'
        };
      }
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
      message: 'Registration successful! Please check your email to verify your account.'
    };
  } catch (error) {
    console.error('Registration error:', error);

    // Handle case where user already exists
    if (error.message && error.message.includes('already registered')) {
      return {
        success: false,
        error: 'This email is already registered. Please login or use password reset if you forgot your password.'
      };
    }

    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Register a new user with mobile number
 * @param {string} mobile - User's mobile number (with country code)
 * @param {string} password - User's password
 * @param {Object} metadata - Additional user data
 * @returns {Promise<Object>} Authentication result
 */
async function registerWithMobile(mobile, password, metadata = {}) {
  try {
    const supabase = getSupabaseClient();

    // Create a virtual email from mobile number for authentication
    // Format: mobile number without + and special chars @ placeai.app
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    const virtualEmail = `${cleanMobile}@placeai.app`;

    const { data, error } = await supabase.auth.signUp({
      email: virtualEmail,
      password: password,
      options: {
        data: {
          first_name: metadata.firstName || '',
          last_name: metadata.lastName || '',
          full_name: `${metadata.firstName || ''} ${metadata.lastName || ''}`.trim(),
          mobile: mobile,
          is_mobile_user: true
        },
        emailRedirectTo: window.location.origin + '/dashboard.html',
        // Disable email confirmation for mobile users
        data: {
          email_confirmed: true
        }
      }
    });

    if (error) throw error;

    // Create user profile
    if (data.user) {
      console.log('Creating user profile for mobile user:', data.user.id);
      const profileResult = await createUserProfile(data.user.id, {
        mobile: mobile,
        first_name: metadata.firstName,
        last_name: metadata.lastName,
        email: virtualEmail
      });

      if (!profileResult.success) {
        console.error('Profile creation failed:', profileResult.error);
      } else {
        console.log('Profile created successfully:', profileResult.profile);
      }
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
      message: data.session ? 'Registration successful! Redirecting to dashboard...' : 'Registration successful! Please check your email to verify your account.'
    };
  } catch (error) {
    console.error('Mobile registration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Login with email or mobile and password
 * @param {string} identifier - Email address or mobile number
 * @param {string} password - User's password
 * @returns {Promise<Object>} Authentication result
 */
async function login(identifier, password) {
  try {
    const supabase = getSupabaseClient();

    // Check if identifier is email or mobile
    const isEmail = identifier.includes('@');

    let authResult;
    let loginEmail = identifier;

    if (!isEmail) {
      // It's a mobile number - look up the email from database
      const profileResult = await getUserProfileByMobile(identifier);

      if (!profileResult.success || !profileResult.profile) {
        throw new Error('No account found with this mobile number');
      }

      loginEmail = profileResult.profile.email;
    }

    authResult = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: password
    });

    const { data, error } = authResult;

    if (error) throw error;

    return {
      success: true,
      user: data.user,
      session: data.session,
      message: 'Login successful!'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || 'Invalid credentials'
    };
  }
}

/**
 * Resend confirmation email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Result
 */
async function resendConfirmationEmail(email) {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: 'https://firstplacewise.tech/dashboard.html'
      }
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Confirmation email sent! Please check your inbox.'
    };
  } catch (error) {
    console.error('Resend confirmation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Login with Google OAuth
 * @returns {Promise<Object>} Authentication result
 */
async function loginWithGoogle() {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard.html`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Redirecting to Google...'
    };
  } catch (error) {
    console.error('Google login error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Login with Facebook OAuth
 * @returns {Promise<Object>} Authentication result
 */
async function loginWithFacebook() {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/dashboard.html`
      }
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Redirecting to Facebook...'
    };
  } catch (error) {
    console.error('Facebook login error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Login with GitHub OAuth
 * @returns {Promise<Object>} Authentication result
 */
async function loginWithGithub() {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'https://firstplacewise.tech/dashboard.html'
      }
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Redirecting to GitHub...'
    };
  } catch (error) {
    console.error('GitHub login error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Logout current user
 * @returns {Promise<Object>} Logout result
 */
async function logout() {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get current session
 * @returns {Promise<Object>} Current session data
 */
async function getCurrentSession() {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    console.log('getCurrentSession result:', { hasSession: !!data.session, session: data.session });

    return {
      success: true,
      session: data.session
    };
  } catch (error) {
    console.error('Session error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get current user
 * @returns {Promise<Object>} Current user data
 */
async function getCurrentUser() {
  try {
    const supabase = getSupabaseClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;

    return {
      success: true,
      user: user
    };
  } catch (error) {
    console.error('Get user error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Reset result
 */
async function resetPassword(email) {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://firstplacewise.tech/reset-password.html'
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password reset email sent! Please check your inbox.'
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Update result
 */
async function updatePassword(newPassword) {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password updated successfully!'
    };
  } catch (error) {
    console.error('Password update error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create user profile in database
 * @param {string} userId - User ID from auth
 * @param {Object} profileData - Profile information
 * @returns {Promise<Object>} Profile creation result
 */
async function createUserProfile(userId, profileData) {
  try {
    const supabase = getSupabaseClient();

    // First check if profile already exists
    const { data: existing } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      console.log('Profile already exists for user:', userId);
      // Update the existing profile with new data
      const { data: updated, error: updateError } = await supabase
        .from('user_profiles')
        .update({
          email: profileData.email,
          mobile: profileData.mobile,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select();

      if (updateError) {
        console.error('Profile update error:', updateError);
      }

      return { success: true, profile: updated ? updated[0] : existing };
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: userId,
          email: profileData.email,
          mobile: profileData.mobile,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Detailed insert error:', error);
      throw error;
    }

    return {
      success: true,
      profile: data[0]
    };
  } catch (error) {
    console.error('Profile creation error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return {
      success: false,
      error: error.message
    };
  }
}

// Export functions for use in other files
if (typeof window !== 'undefined') {
  window.AuthService = {
    registerWithEmail,
    registerWithMobile,
    login,
    loginWithGoogle,
    loginWithFacebook,
    loginWithGithub,
    logout,
    getCurrentSession,
    getCurrentUser,
    resetPassword,
    updatePassword,
    resendConfirmationEmail,
    createUserProfile
  };
}
