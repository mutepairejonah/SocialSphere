/**
 * Instagram API Configuration
 * 
 * SECURITY NOTE: API keys are stored in environment variables, not in code.
 * Never hardcode secrets in JavaScript files.
 */

const INSTAGRAM_API_CONFIG = {
  accessToken: import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN || '',
  businessAccountId: import.meta.env.VITE_INSTAGRAM_BUSINESS_ACCOUNT_ID || '',
  apiVersion: 'v18.0',
  apiBaseUrl: 'https://graph.instagram.com'
};

/**
 * Get Instagram API access token
 */
export function getInstagramAccessToken(): string {
  if (!INSTAGRAM_API_CONFIG.accessToken) {
    console.warn('Instagram API token not configured');
    return '';
  }
  return INSTAGRAM_API_CONFIG.accessToken;
}

/**
 * Get Instagram business account ID
 */
export function getInstagramBusinessAccountId(): string {
  if (!INSTAGRAM_API_CONFIG.businessAccountId) {
    console.warn('Instagram business account ID not configured');
    return '';
  }
  return INSTAGRAM_API_CONFIG.businessAccountId;
}

/**
 * Make authenticated request to Instagram API
 */
export async function makeInstagramRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  data?: Record<string, any>,
  userToken?: string
): Promise<any> {
  const accessToken = userToken || getInstagramAccessToken();
  
  if (!accessToken) {
    throw new Error('Instagram API token not configured. Please connect your Instagram account.');
  }

  const url = new URL(`${INSTAGRAM_API_CONFIG.apiBaseUrl}/${INSTAGRAM_API_CONFIG.apiVersion}/${endpoint}`);
  url.searchParams.append('access_token', accessToken);

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url.toString(), options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Instagram API Error: ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Instagram API request failed:', error);
    throw error;
  }
}

/**
 * Get user media from Instagram with engagement metrics
 */
export async function getUserMedia(userId?: string, userToken?: string): Promise<any> {
  try {
    // Use business account ID if available, otherwise use 'me'
    const accountId = userId || INSTAGRAM_API_CONFIG.businessAccountId || 'me';
    
    // Fetch media with engagement metrics using the correct endpoint format
    const response = await makeInstagramRequest(
      `${accountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count`,
      'GET',
      undefined,
      userToken
    );
    
    // Handle response format: response.data contains the media array
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  } catch (error) {
    console.error('Error fetching user media:', error);
    return [];
  }
}

/**
 * Get media insights for engagement data
 */
export async function getMediaInsights(mediaId: string): Promise<any> {
  try {
    const response = await makeInstagramRequest(
      `${mediaId}?fields=like_count,comments_count,engagement,impressions,reach`
    );
    return response;
  } catch (error) {
    console.error('Error fetching media insights:', error);
    return null;
  }
}

/**
 * Get user insights
 */
export async function getUserInsights(userId: string = 'me'): Promise<any> {
  try {
    const response = await makeInstagramRequest(`${userId}/insights?metric=impressions,reach,profile_views`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user insights:', error);
    return [];
  }
}

/**
 * Get user profile data
 */
export async function getUserProfile(userId: string = 'me', userToken?: string): Promise<any> {
  try {
    const response = await makeInstagramRequest(
      `${userId}?fields=id,name,biography,website,profile_picture_url,followers_count,follows_count,media_count,username`,
      'GET',
      undefined,
      userToken
    );
    return response;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Get users that you follow - tries multiple endpoints
 */
export async function getUserFollowing(userId: string = 'me'): Promise<any[]> {
  try {
    // Try the standard endpoint first
    const response = await makeInstagramRequest(
      `${userId}/ig_followed_users?fields=id,name,username,profile_picture_url,biography,website`
    );
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    if (response.error) {
      console.error('Instagram API error:', response.error);
      throw new Error(response.error.message || 'Failed to fetch following list');
    }
    return [];
  } catch (error) {
    console.error('Error fetching following list:', error);
    throw error;
  }
}

/**
 * Get media for a specific user
 */
export async function getUserMediaById(userId: string): Promise<any[]> {
  try {
    const response = await makeInstagramRequest(
      `${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count`
    );
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching media for user ${userId}:`, error);
    return [];
  }
}

/**
 * Get comments on a specific media post
 */
export async function getMediaComments(mediaId: string): Promise<any[]> {
  try {
    const response = await makeInstagramRequest(
      `${mediaId}/comments?fields=id,text,timestamp,username,from{id,username}`
    );
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching comments for media ${mediaId}:`, error);
    return [];
  }
}

/**
 * Search for hashtags
 */
export async function searchHashtags(hashtagName: string): Promise<any[]> {
  try {
    const businessAccountId = getInstagramBusinessAccountId();
    if (!businessAccountId) {
      console.warn('Business account ID not configured for hashtag search');
      return [];
    }
    
    const response = await makeInstagramRequest(
      `ig_hashtag_search?user_id=${businessAccountId}&fields=id,name&search_string=${encodeURIComponent(hashtagName)}`
    );
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error(`Error searching hashtags:`, error);
    return [];
  }
}

/**
 * Get recent media posts by hashtag
 */
export async function getHashtagMedia(hashtagId: string): Promise<any[]> {
  try {
    const response = await makeInstagramRequest(
      `${hashtagId}/recent_media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,username`
    );
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching hashtag media:`, error);
    return [];
  }
}

/**
 * Get top posts by hashtag
 */
export async function getHashtagTopPosts(hashtagId: string): Promise<any[]> {
  try {
    const response = await makeInstagramRequest(
      `${hashtagId}/top_media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count`
    );
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching top hashtag posts:`, error);
    return [];
  }
}

/**
 * Get media details (caption, type, engagement, etc.)
 */
export async function getMediaDetails(mediaId: string): Promise<any> {
  try {
    const response = await makeInstagramRequest(
      `${mediaId}?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,username,owner`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching media details:`, error);
    return null;
  }
}

/**
 * Get account information
 */
export async function getAccountInfo(userId: string = 'me'): Promise<any> {
  try {
    const response = await makeInstagramRequest(
      `${userId}?fields=id,name,username,biography,website,profile_picture_url,followers_count,follows_count,media_count,ig_id`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching account info:`, error);
    return null;
  }
}

/**
 * Get account analytics/insights
 */
export async function getAccountAnalytics(userId: string = 'me'): Promise<any> {
  try {
    const response = await makeInstagramRequest(
      `${userId}/insights?metric=impressions,reach,profile_views,website_clicks,email_contacts`
    );
    
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching account analytics:`, error);
    return [];
  }
}

/**
 * Get media analytics
 */
export async function getMediaAnalytics(mediaId: string): Promise<any> {
  try {
    const response = await makeInstagramRequest(
      `${mediaId}/insights?metric=engagement,impressions,reach,saved,video_views`
    );
    
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching media analytics:`, error);
    return [];
  }
}

/**
 * Get recently used hashtags
 */
export async function getRecentlyUsedHashtags(): Promise<any[]> {
  try {
    const businessAccountId = getInstagramBusinessAccountId();
    if (!businessAccountId) {
      console.warn('Business account ID not configured');
      return [];
    }
    
    const response = await makeInstagramRequest(
      `${businessAccountId}/ig_hashtag_search?fields=id,name`
    );
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching recently used hashtags:`, error);
    return [];
  }
}

/**
 * Get media by specific ID with all available fields
 */
export async function getFullMediaDetails(mediaId: string): Promise<any> {
  try {
    const response = await makeInstagramRequest(
      `${mediaId}?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,username,from{id,username},ig_id,permalink`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching full media details:`, error);
    return null;
  }
}

/**
 * Get user stories
 */
export async function getUserStories(userId: string = 'me'): Promise<any[]> {
  try {
    const response = await makeInstagramRequest(
      `${userId}/stories?fields=id,media_type,media_url,timestamp,like_count`
    );
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching user stories:`, error);
    return [];
  }
}

/**
 * Get all account media with advanced fields
 */
export async function getAllAccountMedia(userId: string = 'me'): Promise<any[]> {
  try {
    const response = await makeInstagramRequest(
      `${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,permalink,ig_id,owner{id,username}`
    );
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching all account media:`, error);
    return [];
  }
}

/**
 * Search for Instagram users
 */
export async function searchInstagramUsers(username: string): Promise<any[]> {
  try {
    // Note: This endpoint may not be available for all tokens
    const response = await makeInstagramRequest(
      `ig_search_user?user_id=${getInstagramBusinessAccountId()}&fields=id,username,name,profile_picture_url&search_string=${encodeURIComponent(username)}`
    );
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error(`Error searching for users:`, error);
    return [];
  }
}

export default INSTAGRAM_API_CONFIG;
