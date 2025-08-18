// src/services/yerbaService.js
import apiClient from './apiClient.js';

const yerbaService = {
  async fetchYerbaStats() {
    try {
      const response = await apiClient.get('/api/metrics/yerbas');
      if (Array.isArray(response)) {
        return response;
      }
      if (response && Array.isArray(response.yerbas)) {
        return response.yerbas;
      }
      return [];
    } catch (error) {
      console.error('Error fetching yerba stats:', error);
      throw new Error(`Error obteniendo estadísticas de yerbas: ${error.message}`);
    }
  }
};

export default yerbaService;
