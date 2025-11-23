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
  data?: Record<string, any>
): Promise<any> {
  const accessToken = getInstagramAccessToken();
  
  if (!accessToken) {
    throw new Error('Instagram API token not configured. Please set VITE_INSTAGRAM_ACCESS_TOKEN environment variable.');
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
 * Get user media from Instagram
 */
export async function getUserMedia(userId?: string): Promise<any> {
  try {
    // Use business account ID if available, otherwise use 'me'
    const accountId = userId || INSTAGRAM_API_CONFIG.businessAccountId || 'me';
    console.log('Fetching media for account:', accountId);
    const response = await makeInstagramRequest(`${accountId}?fields=id,name,media.limit(10){id,caption,media_type,media_url,thumbnail_url,timestamp}`);
    console.log('Instagram API response:', response);
    
    // Handle nested response format: response.media.data
    if (response.media && response.media.data) {
      console.log('Extracted media.data:', response.media.data);
      return response.media.data;
    }
    if (response.media) {
      return response.media;
    }
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    console.warn('Could not extract media from response:', response);
    return [];
  } catch (error) {
    console.error('Error fetching user media:', error);
    return [];
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
export async function getUserProfile(userId: string = 'me'): Promise<any> {
  try {
    const response = await makeInstagramRequest(`${userId}?fields=id,name,biography,website,profile_picture_url,followers_count,follows_count,media_count`);
    console.log('Profile response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export default INSTAGRAM_API_CONFIG;
