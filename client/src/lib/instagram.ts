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
export async function getUserMedia(userId: string = 'me'): Promise<any> {
  try {
    const response = await makeInstagramRequest(`${userId}/media`);
    return response.data || [];
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

export default INSTAGRAM_API_CONFIG;
