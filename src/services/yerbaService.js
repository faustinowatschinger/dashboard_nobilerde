// src/services/yerbaService.js
import apiClient from './apiClient.js';

const yerbaService = {
  async fetchYerbaStats(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Agregar filtros como parámetros de consulta
      if (filters.periodo) {
        params.append('periodo', filters.periodo);
      }
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const queryString = params.toString();
      const url = `/api/metrics/yerbas${queryString ? `?${queryString}` : ''}`;
      
      console.log('📡 yerbaService - Fetching yerba stats:', url);
      console.log('📋 yerbaService - Filtros enviados:', filters);
      
      const response = await apiClient.get(url);
      console.log('📦 yerbaService - Respuesta recibida:', response);
      
      if (Array.isArray(response)) {
        console.log('✅ yerbaService - Devolviendo array con', response.length, 'yerbas');
        return response;
      }
      if (response && Array.isArray(response.yerbas)) {
        console.log('✅ yerbaService - Devolviendo response.yerbas con', response.yerbas.length, 'yerbas');
        return response.yerbas;
      }
      console.log('⚠️ yerbaService - Devolviendo array vacío');
      return [];
    } catch (error) {
      console.error('❌ yerbaService - Error fetching yerba stats:', error);
      throw new Error(`Error obteniendo estadísticas de yerbas: ${error.message}`);
    }
  }
};

export default yerbaService;
