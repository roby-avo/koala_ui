import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

const apiClient = axios.create({
  baseURL: API_URL
});

// Attach token to every request
apiClient.interceptors.request.use(config => {
  config.params = config.params || {};
  config.params['token'] = API_TOKEN;
  return config;
});

// Simple retry interceptor for specific status codes
apiClient.interceptors.response.use(null, async (error) => {
  const { config, response: { status } } = error;
  const maxRetries = 3;
  if (status >= 500 && config.retryCount < maxRetries) {
    config.retryCount = config.retryCount ? config.retryCount + 1 : 1;
    return apiClient(config);  // Retry the request with the updated config
  }
  return Promise.reject(error);
});

const getDatasets = async (page = 1) => {
  try {
    const response = await apiClient.get('/dataset', {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error retrieving datasets:', error);
    throw error;
  }
};

const getTables = async (datasetName) => {
  try {
    const response = await apiClient.get(`/dataset/${datasetName}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving tables:', error);
    throw error;
  }
};

export { getDatasets, getTables };
