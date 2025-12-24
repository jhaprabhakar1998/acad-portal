/**
 * API Service
 * Centralized API communication layer
 */

const API_BASE_URL ='http://localhost:30000/api/v1';

class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'An error occurred');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data,
    });
  }
}

// Student API endpoints
export const studentApi = {
  getMobileForOtp: async (rollNumber) => {
    const api = new ApiService(API_BASE_URL);
    return api.post('/students/get-mobile-for-otp', { roll_number: rollNumber });
  },
};

export default new ApiService(API_BASE_URL);

