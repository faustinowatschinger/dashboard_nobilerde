// src/services/apiClient.js
import dayjs from 'dayjs';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
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

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value);
      }
    });

    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Método helper para formatear filtros de fecha
  formatDateFilters(filters) {
    const formatted = { ...filters };
    
    if (filters.dateRange) {
      // Asegurar que las fechas se formateen correctamente
      if (filters.dateRange.start && filters.dateRange.start.format) {
        formatted.startDate = filters.dateRange.start.format('YYYY-MM-DD');
      } else if (filters.dateRange.start) {
        formatted.startDate = dayjs(filters.dateRange.start).format('YYYY-MM-DD');
      }
      
      if (filters.dateRange.end && filters.dateRange.end.format) {
        formatted.endDate = filters.dateRange.end.format('YYYY-MM-DD');
      } else if (filters.dateRange.end) {
        formatted.endDate = dayjs(filters.dateRange.end).format('YYYY-MM-DD');
      }
      
      delete formatted.dateRange;
      
      console.log('📅 Filtros de fecha formateados:', {
        original: filters.dateRange,
        formatted: {
          startDate: formatted.startDate,
          endDate: formatted.endDate
        }
      });
    }
    
    // Incluir información del período para el backend
    if (filters.timePeriod) {
      formatted.timePeriod = filters.timePeriod;
    }
    if (filters.useCustomDates !== undefined) {
      formatted.useCustomDates = filters.useCustomDates;
    }
    
    console.log('🔧 Filtros finales enviados al backend:', formatted);
    
    return formatted;
  }
}

// Instancia singleton
const apiClient = new ApiClient();

export default apiClient;

export async function apiGet(path, params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  const query = searchParams.toString();
  const url = `${API_BASE_URL}${path}${query ? `?${query}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed with ${res.status}`);
  }
  return res.json();
}
