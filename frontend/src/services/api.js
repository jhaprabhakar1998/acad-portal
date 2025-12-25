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
      credentials: 'include', // Include cookies for session management
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      // API returns errcode: 0 for success, errcode: 1 for error
      // Always return data, let caller check errcode
      return data;
    } catch (error) {
      // Network or parsing error
      throw new Error(error.message || 'Network error occurred');
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

  sendOtp: async (rollNumber, mobileNumber) => {
    const api = new ApiService(API_BASE_URL);
    return api.post('/students/send-otp', {
      roll_number: rollNumber,
      mobile_number: mobileNumber,
    });
  },

  verifyOtp: async (rollNumber, mobileNumber, otp) => {
    const api = new ApiService(API_BASE_URL);
    return api.post('/students/verify-otp', {
      roll_number: rollNumber,
      mobile_number: mobileNumber,
      otp: otp,
    });
  },
};

export default new ApiService(API_BASE_URL);

