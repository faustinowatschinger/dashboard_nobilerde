// src/services/metricsService.js
import apiClient, { apiGet } from './apiClient.js';
import dayjs from 'dayjs';

/**
 * Servicio para obtener métricas del dashboard
 */
export const metricsService = {
  /**
   * Obtiene los datos del overview con comparación vs período anterior
   * @param {Object} filters - Filtros aplicados
   * @returns {Promise<Object>} Datos del overview con comparación
   */
  async fetchOverviewWithComparison(filters = {}) {
    try {
      // Calcular período actual y anterior
      const { currentPeriod, previousPeriod } = metricsService.calculatePeriods(filters);
      
      console.log('📊 Períodos calculados:', {
        current: currentPeriod,
        previous: previousPeriod
      });
      
      // Formatear filtros para ambos períodos
      const currentFilters = apiClient.formatDateFilters({
        ...filters,
        dateRange: currentPeriod
      });
      
      const previousFilters = apiClient.formatDateFilters({
        ...filters,
        dateRange: previousPeriod
      });
      
      // Hacer requests en paralelo
      const [currentData, previousData] = await Promise.all([
        apiClient.get('/api/dashboard/overview', currentFilters),
        apiClient.get('/api/dashboard/overview', previousFilters)
      ]);
      
      // Validar respuestas
      if (!currentData || typeof currentData !== 'object') {
        throw new Error('Formato de respuesta inválido del servidor para período actual');
      }
      if (!previousData || typeof previousData !== 'object') {
        throw new Error('Formato de respuesta inválido del servidor para período anterior');
      }
      
      // Calcular deltas
      const deltas = metricsService.calculateDeltas(currentData, previousData);
      
      return {
        current: {
          // Métricas principales
          usersWithTasting30d: currentData.usersWithTasting30d || 0,
          discoveryRate: currentData.discoveryRate || 0,
          discoveryDeltaPp: currentData.discoveryDeltaPp || null,
          
          // Actividad temporal
          weeklyActivity: Array.isArray(currentData.weeklyActivity) ? currentData.weeklyActivity : [],
          temporalActivity: currentData.temporalActivity || { data: [], granularity: 'week' },
          
          // Distribución por tipos
          typeBreakdown: Array.isArray(currentData.typeBreakdown) ? currentData.typeBreakdown : [],
          
          // Top movers
          topMovers: Array.isArray(currentData.topMovers) ? currentData.topMovers : [],
          
          // Información de muestra
          sample: currentData.sample || { nUsers: 0, nEvents: 0 },
          
          // Metadatos del cache
          _meta: currentData._meta || { cached: false, source: 'unknown' }
        },
        previous: {
          // Métricas principales
          usersWithTasting30d: previousData.usersWithTasting30d || 0,
          discoveryRate: previousData.discoveryRate || 0,
          discoveryDeltaPp: previousData.discoveryDeltaPp || null,
          
          // Actividad temporal
          weeklyActivity: Array.isArray(previousData.weeklyActivity) ? previousData.weeklyActivity : [],
          temporalActivity: previousData.temporalActivity || { data: [], granularity: 'week' },
          
          // Información de muestra
          sample: previousData.sample || { nUsers: 0, nEvents: 0 }
        },
        deltas,
        periods: {
          current: currentPeriod,
          previous: previousPeriod
        }
      };
    } catch (error) {
      console.error('Error fetching overview data with comparison:', error);
      throw new Error(`Error cargando datos del overview con comparación: ${error.message}`);
    }
  },

  /**
   * Obtiene las notas sensoriales top del período con comparación vs período anterior
   * @param {Object} filters - Filtros aplicados
   * @returns {Promise<Object>} Datos de notas top con comparación
   */
  async fetchNotesTopWithComparison(filters = {}) {
    try {
      // Calcular período actual y anterior
      const { currentPeriod, previousPeriod } = metricsService.calculatePeriods(filters);
      
      console.log('📊 Períodos para notas top:', {
        current: currentPeriod,
        previous: previousPeriod
      });
      
      // Formatear filtros para ambos períodos
      const currentFilters = apiClient.formatDateFilters({
        ...filters,
        dateRange: currentPeriod
      });
      
      // 🔍 DEBUG: Imprimir exactamente qué se está enviando al backend
      console.log('🔍 DEBUG - Filtros enviados al backend para notas top:', {
        currentFilters,
        url: '/api/metrics/notes-top',
        dates: {
          startDate: currentFilters.startDate,
          endDate: currentFilters.endDate
        }
      });
      
      const previousFilters = apiClient.formatDateFilters({
        ...filters,
        dateRange: previousPeriod
      });

      // Hacer requests en paralelo
      const [currentData, previousData] = await Promise.all([
        apiClient.get('/api/metrics/notes-top', currentFilters),
        apiClient.get('/api/metrics/notes-top', previousFilters)
      ]);
      
      // 🔍 DEBUG: Imprimir qué datos se recibieron del backend
      console.log('🔍 DEBUG - Datos recibidos del backend:', {
        currentData: {
          notes: currentData?.notes?.length || 0,
          sample: currentData?.sample
        },
        currentDataFull: currentData
      });

      // Validar respuestas
      if (!currentData || typeof currentData !== 'object') {
        throw new Error('Formato de respuesta inválido del servidor para período actual');
      }
      if (!previousData || typeof previousData !== 'object') {
        throw new Error('Formato de respuesta inválido del servidor para período anterior');
      }
      
      // Extraer datos principales
      const currentNotes = Array.isArray(currentData.notes) ? currentData.notes : [];
      const currentSample = currentData.sample || { nEvents: 0, nRatings: 0, kAnonymityOk: false };
      
      // Para comentarios, no necesitamos comparar con período anterior como las notas sensoriales
      // Solo retornamos los datos actuales tal como vienen del backend
      console.log('📝 Datos de comentarios procesados:', {
        notesCount: currentNotes.length,
        sample: currentSample,
        firstNote: currentNotes[0]
      });
      
      return {
        notes: currentNotes, // Retornar los comentarios tal como vienen del backend
        sample: currentSample,
        periods: {
          current: currentPeriod,
          previous: previousPeriod
        },
        _meta: currentData._meta || { cached: false, source: 'comments_interaction' }
      };
      
    } catch (error) {
      console.error('Error fetching notes top with comparison:', error);
      throw new Error(`Error cargando notas sensoriales top con comparación: ${error.message}`);
    }
  },

  /**
   * Calcula los períodos actual y anterior basándose en los filtros
   * @param {Object} filters - Filtros aplicados
   * @returns {Object} Objeto con currentPeriod y previousPeriod
   */
  calculatePeriods(filters) {
    let currentStart, currentEnd;
    
    // Si se usan fechas personalizadas
    if (filters.useCustomDates && filters.dateRange) {
      currentStart = dayjs(filters.dateRange.start);
      currentEnd = dayjs(filters.dateRange.end);
    } else {
      // Usar período predefinido
      currentEnd = dayjs();
      
      switch (filters.timePeriod) {
        case 'dia':
          // Para el día actual, desde las 00:00:00 hasta ahora
          currentStart = currentEnd.startOf('day');
          break;
        case 'semana':
          currentStart = currentEnd.subtract(7, 'days');
          break;
        case 'mes':
          currentStart = currentEnd.subtract(30, 'days');
          break;
        case 'trimestre':
          currentStart = currentEnd.subtract(90, 'days');
          break;
        case 'año':
          currentStart = currentEnd.subtract(365, 'days');
          break;
        default:
          currentStart = currentEnd.subtract(30, 'days'); // Default a mes
      }
    }
    
    // Calcular duración del período
    const duration = currentEnd.diff(currentStart, 'days');
    
    // Calcular período anterior
    const previousEnd = currentStart;
    const previousStart = previousEnd.subtract(duration, 'days');
    
    return {
      currentPeriod: {
        start: currentStart,
        end: currentEnd
      },
      previousPeriod: {
        start: previousStart,
        end: previousEnd
      }
    };
  },

  /**
   * Calcula los deltas entre período actual y anterior
   * @param {Object} currentData - Datos del período actual
   * @param {Object} previousData - Datos del período anterior
   * @returns {Object} Objeto con los deltas calculados
   */
  calculateDeltas(currentData, previousData) {
    // Helper para calcular delta absoluto y porcentual
    const calculateDelta = (current, previous) => {
      const abs = current - previous;
      const pct = previous > 0 ? (abs / previous) * 100 : (current > 0 ? 100 : 0);
      return { abs, pct };
    };
    
    // Helper para calcular total de eventos
    const getTotalEvents = (data) => {
      if (data.temporalActivity?.data) {
        return data.temporalActivity.data.reduce((sum, period) => sum + (period.events || 0), 0);
      }
      if (data.weeklyActivity) {
        return data.weeklyActivity.reduce((sum, week) => sum + (week.events || 0), 0);
      }
      return 0;
    };
    
    const currentUsers = currentData.usersWithTasting30d || 0;
    const previousUsers = previousData.usersWithTasting30d || 0;
    
    const currentDiscoveryRate = (currentData.discoveryRate || 0) * 100;
    const previousDiscoveryRate = (previousData.discoveryRate || 0) * 100;
    
    const currentEvents = getTotalEvents(currentData);
    const previousEvents = getTotalEvents(previousData);
    
    const currentActiveUsers = currentData.sample?.activeUsers || currentData.activeUsers || 0;
    const previousActiveUsers = previousData.sample?.activeUsers || previousData.activeUsers || 0;
    
    return {
      usersWithTasting30d: calculateDelta(currentUsers, previousUsers),
      discoveryRatePp: currentDiscoveryRate - previousDiscoveryRate, // Diferencia en puntos porcentuales
      eventsTotal: calculateDelta(currentEvents, previousEvents),
      activeUsers: calculateDelta(currentActiveUsers, previousActiveUsers)
    };
  },

  /**
   * Obtiene los datos del overview del dashboard (desde cache)
   * @param {Object} filters - Filtros aplicados
   * @returns {Promise<Object>} Datos del overview
   */
  async fetchOverview(filters = {}) {
    try {
      // Formatear filtros de fecha para la API
      const formattedFilters = apiClient.formatDateFilters(filters);
      
      const data = await apiClient.get('/api/dashboard/overview', formattedFilters);
      
      // Validar estructura de respuesta
      if (!data || typeof data !== 'object') {
        throw new Error('Formato de respuesta inválido del servidor');
      }
      
      return {
        // Métricas principales
        usersWithTasting30d: data.usersWithTasting30d || 0,
        discoveryRate: data.discoveryRate || 0,
        discoveryDeltaPp: data.discoveryDeltaPp || null,
        
        // Actividad semanal (mantener por compatibilidad)
        weeklyActivity: Array.isArray(data.weeklyActivity) ? data.weeklyActivity : [],
        
        // Actividad temporal con granularidad dinámica
        temporalActivity: data.temporalActivity || { data: [], granularity: 'week' },
        
        // Distribución por tipos
        typeBreakdown: Array.isArray(data.typeBreakdown) ? data.typeBreakdown : [],
        
        // Top movers
        topMovers: Array.isArray(data.topMovers) ? data.topMovers : [],
        
        // Información de muestra
        sample: data.sample || { nUsers: 0, nEvents: 0 },
        
        // Metadatos del cache
        _meta: data._meta || { cached: false, source: 'unknown' }
      };
    } catch (error) {
      console.error('Error fetching overview data:', error);
      throw new Error(`Error cargando datos del overview: ${error.message}`);
    }
  },

  /**
   * Fuerza la actualización de métricas del overview
   * @param {Object} filters - Filtros aplicados
   * @returns {Promise<Object>} Datos del overview actualizados
   */
  async refreshOverview(filters = {}) {
    try {
      // Formatear filtros de fecha para la API
      const formattedFilters = apiClient.formatDateFilters(filters);
      
      const data = await apiClient.post('/api/dashboard/overview/refresh', formattedFilters);
      
      // Validar estructura de respuesta
      if (!data || typeof data !== 'object') {
        throw new Error('Formato de respuesta inválido del servidor');
      }
      
      return {
        // Métricas principales
        usersWithTasting30d: data.usersWithTasting30d || 0,
        discoveryRate: data.discoveryRate || 0,
        discoveryDeltaPp: data.discoveryDeltaPp || null,
        
        // Actividad semanal (mantener por compatibilidad)
        weeklyActivity: Array.isArray(data.weeklyActivity) ? data.weeklyActivity : [],
        
        // Actividad temporal con granularidad dinámica
        temporalActivity: data.temporalActivity || { data: [], granularity: 'week' },
        
        // Distribución por tipos
        typeBreakdown: Array.isArray(data.typeBreakdown) ? data.typeBreakdown : [],
        
        // Top movers
        topMovers: Array.isArray(data.topMovers) ? data.topMovers : [],
        
        // Información de muestra
        sample: data.sample || { nUsers: 0, nEvents: 0 },
        
        // Metadatos del cache
        _meta: data._meta || { cached: false, source: 'unknown' }
      };
    } catch (error) {
      console.error('Error refreshing overview data:', error);
      throw new Error(`Error refrescando datos del overview: ${error.message}`);
    }
  },

  /**
   * Obtiene las opciones disponibles para los filtros
   * @param {string} filterType - Tipo de filtro (countries, marcas, etc.)
   * @returns {Promise<Array>} Lista de opciones
   */
  async fetchFilterOptions(filterType) {
    try {
      const data = await apiClient.get(`/api/dashboard/filters/${filterType}`);
      
      if (!Array.isArray(data)) {
        console.warn(`Filter options for ${filterType} is not an array:`, data);
        return [];
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching filter options for ${filterType}:`, error);
      // Retornar array vacío en lugar de lanzar error para no romper la UI
      return [];
    }
  },

  /**
   * Obtiene datos de tendencias de mercado
   * @param {Object} filters - Filtros aplicados
   * @returns {Promise<Object>} Datos de tendencias
   */
  async fetchMarketTrends(filters = {}) {
    try {
      const formattedFilters = apiClient.formatDateFilters(filters);
      const data = await apiClient.get('/api/dashboard/market-trends', formattedFilters);
      
      return {
        trends: Array.isArray(data.trends) ? data.trends : [],
        growth: data.growth || 0,
        sample: data.sample || { nUsers: 0, nEvents: 0 }
      };
    } catch (error) {
      console.error('Error fetching market trends:', error);
      throw new Error(`Error cargando tendencias de mercado: ${error.message}`);
    }
  },

  /**
   * Obtiene análisis de sabores
   * @param {Object} filters - Filtros aplicados
   * @returns {Promise<Object>} Datos de análisis de sabores
   */
  async fetchFlavorAnalysis(filters = {}) {
    try {
      const formattedFilters = apiClient.formatDateFilters(filters);
      const data = await apiClient.get('/api/dashboard/flavors', formattedFilters);
      
      return {
        flavorProfiles: Array.isArray(data.flavorProfiles) ? data.flavorProfiles : [],
        preferences: Array.isArray(data.preferences) ? data.preferences : [],
        sample: data.sample || { nUsers: 0, nEvents: 0 }
      };
    } catch (error) {
      console.error('Error fetching flavor analysis:', error);
      throw new Error(`Error cargando análisis de sabores: ${error.message}`);
    }
  },

  /**
   * Obtiene tendencias
   * @param {Object} params
   * @returns {Promise<Object>} Datos de tendencias
   */
  async fetchTrends(params = {}) {
    try {
      const data = await apiGet('/api/metrics/trends', params);
      return {
        kAnonymityOk: data.kAnonymityOk,
        sample: data.sample || {},
        series: Array.isArray(data.series) ? data.series : [],
        bucket: data.bucket || 'day',
      };
    } catch (error) {
      console.error('Error fetching trends:', error);
      throw new Error(`Error cargando tendencias: ${error.message}`);
    }
  },
  /**
   * Obtiene estadísticas del cache de métricas
   * @returns {Promise<Object>} Estadísticas del cache
   */
  async fetchCacheStats() {
    try {
      const data = await apiClient.get('/api/dashboard/cache/stats');
      return data;
    } catch (error) {
      console.error('Error fetching cache stats:', error);
      throw new Error(`Error obteniendo estadísticas del cache: ${error.message}`);
    }
  },

  /**
   * Limpia el cache de métricas
   * @returns {Promise<Object>} Resultado de la operación
   */
  async clearCache() {
    try {
      const data = await apiClient.post('/api/dashboard/cache/clear');
      return data;
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw new Error(`Error limpiando cache: ${error.message}`);
    }
  },

  /**
   * Obtiene entidades disponibles por tipo desde el backend
   * @param {string} entityType - Tipo de entidad (tipo, marca, origen, etc.)
   * @returns {Promise<Array>} Lista de entidades disponibles
   */
  async fetchAvailableEntities(entityType) {
    try {
      console.log(`🔍 Obteniendo entidades disponibles para tipo: ${entityType}`);
      
      const queryParams = new URLSearchParams();
      queryParams.append('type', entityType);
      
      const url = `/api/metrics/entities?${queryParams.toString()}`;
      console.log('🌐 URL de entidades:', url);
      
      const response = await apiClient.get(url);
      
      if (!response || !Array.isArray(response.entities)) {
        throw new Error('Formato de respuesta inválido del servidor');
      }
      
      console.log(`✅ Entidades obtenidas para ${entityType}:`, response.entities);
      
      return response.entities;
    } catch (error) {
      console.error(`❌ Error fetching available entities for ${entityType}:`, error);
      throw new Error(`Error obteniendo entidades disponibles: ${error.message}`);
    }
  },

  /**
   * Obtiene datos de tendencias comparativas calculando cambios porcentuales
   * @param {Object} filters - Filtros aplicados
   * @returns {Promise<Object>} Tendencias con porcentajes de cambio
   */
  async fetchTrendsComparison(filters = {}) {
    try {
      console.log('📈 Obteniendo tendencias comparativas con filtros:', filters);
      
      // Convertir filtros del store al formato del backend
      const queryParams = new URLSearchParams();
      
      // Filtros temporales - formatear fechas correctamente
      if (filters.dateRange?.start && filters.dateRange?.end) {
        const startDate = dayjs(filters.dateRange.start).format('YYYY-MM-DD');
        const endDate = dayjs(filters.dateRange.end).format('YYYY-MM-DD');
        queryParams.append('startDate', startDate);
        queryParams.append('endDate', endDate);
      }
      
      if (filters.timePeriod) {
        queryParams.append('timePeriod', filters.timePeriod);
      }
      
      // Filtros demográficos
      if (filters.country && filters.country !== 'ALL') {
        queryParams.append('country', filters.country);
      }
      if (filters.ageBucket && filters.ageBucket !== 'ALL') {
        queryParams.append('ageBucket', filters.ageBucket);
      }
      if (filters.gender && filters.gender !== 'ALL') {
        queryParams.append('gender', filters.gender);
      }
      
      // Filtros de yerba
      if (filters.tipoYerba && filters.tipoYerba !== 'ALL') {
        queryParams.append('tipoYerba', filters.tipoYerba);
      }
      if (filters.marca && filters.marca !== 'ALL') {
        queryParams.append('marca', filters.marca);
      }
      if (filters.origen && filters.origen !== 'ALL') {
        queryParams.append('origen', filters.origen);
      }
      
      // Filtros de tendencias específicos
      if (filters.metric) {
        queryParams.append('metric', filters.metric);
      }
      if (filters.entityType) {
        queryParams.append('entityType', filters.entityType);
      }
      if (filters.entities && filters.entities.length > 0) {
        queryParams.append('entities', filters.entities.join(','));
      }
      
      const url = `/api/metrics/trends-comparison?${queryParams.toString()}`;
      console.log('🌐 URL de tendencias comparativas:', url);
      
      const response = await apiClient.get(url);
      
      if (!response || !response.trends) {
        throw new Error('Formato de respuesta inválido del servidor');
      }
      
      console.log('✅ Tendencias comparativas obtenidas:', {
        entitiesCount: response.trends.length,
        kAnonymityOk: response.kAnonymityOk,
        avgTendency: response.trends.reduce((sum, t) => sum + Math.abs(t.tendencyPercent), 0) / response.trends.length,
        firstTrend: response.trends[0],
        allTrendsData: response.trends.slice(0, 3) // Mostrar las primeras 3 para debug
      });
      
      return response;
    } catch (error) {
      console.error('❌ Error fetching trends comparison:', error);
      throw new Error(`Error obteniendo tendencias comparativas: ${error.message}`);
    }
  },



  /**
   * Mapea período de tiempo a bucket para el backend
   */
  mapTimePeriodToBucket(timePeriod) {
    switch (timePeriod) {
      case 'dia': return 'hour';
      case 'semana': return 'day';
      case 'mes': return 'week';
      case 'año': return 'month';
      default: return 'day';
    }
  },

};

export default metricsService;
