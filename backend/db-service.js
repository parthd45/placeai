/**
 * Database Service for PlaceAI
 * 
 * This service handles all database operations with Supabase
 * including user profiles, placements, training, and other data.
 */

/**
 * Get user profile by user ID
 * @param {string} userId - User's unique ID
 * @returns {Promise<Object>} User profile data
 */
async function getUserProfile(userId) {
  try {
    const supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return {
      success: true,
      profile: data
    };
  } catch (error) {
    console.error('Get profile error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get user profile by mobile number
 * @param {string} mobile - User's mobile number
 * @returns {Promise<Object>} User profile data
 */
async function getUserProfileByMobile(mobile) {
  try {
    const supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('mobile', mobile)
      .single();

    if (error) throw error;

    return {
      success: true,
      profile: data
    };
  } catch (error) {
    console.error('Get profile by mobile error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create user profile in database
 * @param {string} userId - User's unique ID
 * @param {Object} profileData - Initial profile data
 * @returns {Promise<Object>} Creation result
 */
async function createUserProfile(userId, profileData) {
  try {
    const supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: userId,
          email: profileData.email || null,
          mobile: profileData.mobile || null,
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      profile: data[0]
    };
  } catch (error) {
    console.error('Create profile error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Update user profile
 * @param {string} userId - User's unique ID
 * @param {Object} updates - Profile fields to update
 * @returns {Promise<Object>} Update result
 */
async function updateUserProfile(userId, updates) {
  try {
    const supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select();

    if (error) throw error;

    return {
      success: true,
      profile: data[0],
      message: 'Profile updated successfully'
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create a new training record
 * @param {Object} trainingData - Training information
 * @returns {Promise<Object>} Creation result
 */
async function createTraining(trainingData) {
  try {
    const supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('trainings')
      .insert([
        {
          user_id: trainingData.userId,
          title: trainingData.title,
          description: trainingData.description,
          category: trainingData.category,
          duration: trainingData.duration,
          status: trainingData.status || 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      training: data[0],
      message: 'Training record created successfully'
    };
  } catch (error) {
    console.error('Create training error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get user's training records
 * @param {string} userId - User's unique ID
 * @returns {Promise<Object>} Training records
 */
async function getUserTrainings(userId) {
  try {
    const supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('trainings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      trainings: data
    };
  } catch (error) {
    console.error('Get trainings error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create a new placement record
 * @param {Object} placementData - Placement information
 * @returns {Promise<Object>} Creation result
 */
async function createPlacement(placementData) {
  try {
    const supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('placements')
      .insert([
        {
          user_id: placementData.userId,
          company_name: placementData.companyName,
          position: placementData.position,
          salary: placementData.salary,
          location: placementData.location,
          status: placementData.status || 'applied',
          applied_date: placementData.appliedDate || new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      placement: data[0],
      message: 'Placement record created successfully'
    };
  } catch (error) {
    console.error('Create placement error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get user's placement records
 * @param {string} userId - User's unique ID
 * @returns {Promise<Object>} Placement records
 */
async function getUserPlacements(userId) {
  try {
    const supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('placements')
      .select('*')
      .eq('user_id', userId)
      .order('applied_date', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      placements: data
    };
  } catch (error) {
    console.error('Get placements error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Update placement status
 * @param {string} placementId - Placement record ID
 * @param {string} status - New status (applied, interview, offered, accepted, rejected)
 * @returns {Promise<Object>} Update result
 */
async function updatePlacementStatus(placementId, status) {
  try {
    const supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('placements')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', placementId)
      .select();

    if (error) throw error;

    return {
      success: true,
      placement: data[0],
      message: 'Placement status updated successfully'
    };
  } catch (error) {
    console.error('Update placement error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create AI interaction log
 * @param {Object} interactionData - AI interaction information
 * @returns {Promise<Object>} Creation result
 */
async function createAIInteraction(interactionData) {
  try {
    const supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('ai_interactions')
      .insert([
        {
          user_id: interactionData.userId,
          interaction_type: interactionData.type,
          query: interactionData.query,
          response: interactionData.response,
          metadata: interactionData.metadata || {},
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      interaction: data[0]
    };
  } catch (error) {
    console.error('Create AI interaction error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get user's AI interaction history
 * @param {string} userId - User's unique ID
 * @param {number} limit - Number of records to retrieve
 * @returns {Promise<Object>} Interaction history
 */
async function getAIInteractionHistory(userId, limit = 50) {
  try {
    const supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('ai_interactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return {
      success: true,
      interactions: data
    };
  } catch (error) {
    console.error('Get AI interactions error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Store user's resume/CV
 * @param {string} userId - User's unique ID
 * @param {File} file - Resume file
 * @returns {Promise<Object>} Upload result
 */
async function uploadResume(userId, file) {
  try {
    const supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    const fileExt = file.name.split('.').pop();
    const fileName = `resume_${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-documents')
      .upload(filePath, file, {
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL (bucket is now public)
    const { data } = supabase.storage
      .from('user-documents')
      .getPublicUrl(filePath);

    const resumeUrl = data.publicUrl;

    // Update user profile with resume URL
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        resume_url: resumeUrl,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    return {
      success: true,
      url: resumeUrl,
      message: 'Resume uploaded successfully'
    };
  } catch (error) {
    console.error('Upload resume error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Upload profile picture
 * @param {string} userId - User's unique ID
 * @param {File} file - Profile image file
 * @returns {Promise<Object>} Upload result
 */
async function uploadProfilePicture(userId, file) {
  try {
    const supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    const fileExt = file.name.split('.').pop();
    const fileName = `profile_${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, {
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL (bucket is public)
    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    const imageUrl = data.publicUrl;

    // Update user profile with image URL
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        profile_image_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    return {
      success: true,
      url: imageUrl,
      message: 'Profile picture uploaded successfully'
    };
  } catch (error) {
    console.error('Upload profile picture error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Remove profile picture
 * @param {string} userId - User's unique ID
 * @returns {Promise<Object>} Removal result
 */
async function removeProfilePicture(userId) {
  try {
    const supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    // Get current profile to find the image URL
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('profile_image_url')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    // If there's a profile image, delete it from storage
    if (profile && profile.profile_image_url) {
      // Extract file path from URL
      const url = new URL(profile.profile_image_url);
      const pathParts = url.pathname.split('/profile-images/');
      if (pathParts.length > 1) {
        const filePath = pathParts[1];
        
        // Delete from storage
        const { error: deleteError } = await supabase.storage
          .from('profile-images')
          .remove([filePath]);

        // Don't throw error if file doesn't exist in storage
        if (deleteError && !deleteError.message.includes('not found')) {
          console.warn('Storage deletion warning:', deleteError);
        }
      }
    }

    // Update user profile to remove image URL
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        profile_image_url: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    return {
      success: true,
      message: 'Profile picture removed successfully'
    };
  } catch (error) {
    console.error('Remove profile picture error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get statistics for dashboard
 * @param {string} userId - User's unique ID
 * @returns {Promise<Object>} User statistics
 */
async function getUserStatistics(userId) {
  try {
    const supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    // Get counts in parallel
    const [trainingsResult, placementsResult, interactionsResult] = await Promise.all([
      supabase.from('trainings').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('placements').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('ai_interactions').select('*', { count: 'exact', head: true }).eq('user_id', userId)
    ]);

    return {
      success: true,
      statistics: {
        totalTrainings: trainingsResult.count || 0,
        totalPlacements: placementsResult.count || 0,
        totalInteractions: interactionsResult.count || 0
      }
    };
  } catch (error) {
    console.error('Get statistics error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export functions for use in other files
if (typeof window !== 'undefined') {
  window.DBService = {
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    createTraining,
    getUserTrainings,
    createPlacement,
    getUserPlacements,
    updatePlacementStatus,
    createAIInteraction,
    getAIInteractionHistory,
    uploadResume,
    uploadProfilePicture,
    removeProfilePicture,
    getUserStatistics
  };
}
