// src/dashboard/store/filtersStore.js
import { create } from 'zustand';
import dayjs from 'dayjs';

const useFiltersStore = create((set, get) => ({
  // Estados de los filtros
  dateRange: {
    start: dayjs().subtract(30, 'day'),
    end: dayjs()
  },
  // Período de tiempo seleccionado
  timePeriod: 'mes', // 'dia', 'semana', 'mes', 'año'
  useCustomDates: false, // si usa fechas personalizadas o períodos
  
  country: '',
  ageBucket: '',
  gender: '',
  tipoYerba: '',
  marca: '',
  origen: '',
  paisProd: '',
  secado: '',

  // Opciones para los selectores (se llenan dinámicamente)
  options: {
    countries: [],
    ageBuckets: ['18-25', '26-35', '36-45', '46-55', '56+'],
    genders: ['M', 'F', 'Otro'],
    tiposYerba: [],
    marcas: [],
    origenes: [],
    paisesProd: [],
    tiposSecado: []
  },

  // Loading state para las opciones
  optionsLoading: {
    countries: false,
    tiposYerba: false,
    marcas: false,
    origenes: false,
    paisesProd: false,
    tiposSecado: false
  },

  // Estados adicionales
  loading: false,
  error: null,

  // Acciones
  setDateRange: (dateRange) => set({ dateRange }),
  
  setTimePeriod: (timePeriod) => {
    console.log('🔄 setTimePeriod llamado con:', timePeriod);
    
    const state = get();
    let updates = { timePeriod };
    
    // Actualizar automáticamente el dateRange cuando cambie el período
    if (!state.useCustomDates) {
      const now = dayjs();
      let start;
      
      switch (timePeriod) {
        case 'dia':
          // Para período de día, usar el día completo de hoy
          start = now.startOf('day');
          break;
        case 'semana':
          // Para período de semana, usar los últimos 7 días
          start = now.subtract(7, 'day');
          break;
        case 'mes':
          // Para período de mes, usar las últimas 4 semanas (28 días)
          start = now.subtract(28, 'day');
          break;
        case 'año':
          // Para período de año, usar los últimos 12 meses
          start = now.subtract(1, 'year');
          break;
        default:
          start = now.subtract(28, 'day');
      }
      
      const newDateRange = { 
        start: start.startOf('day'), 
        end: now.endOf('day') 
      };
      
      console.log('📅 Actualizando dateRange automáticamente desde setTimePeriod:', {
        timePeriod,
        newDateRange: {
          start: newDateRange.start.format('YYYY-MM-DD HH:mm:ss'),
          end: newDateRange.end.format('YYYY-MM-DD HH:mm:ss')
        }
      });
      
      updates.dateRange = newDateRange;
    } else {
      console.log('⚠️ No se actualiza dateRange porque useCustomDates está activo');
    }
    
    // Actualizar todo de una vez
    set(updates);
  },
  setUseCustomDates: (useCustomDates) => set({ useCustomDates }),
  
  // Función para calcular dateRange basado en timePeriod
  updateDateRangeFromPeriod: () => {
    const state = get();
    if (state.useCustomDates) return;
    
    const now = dayjs();
    let start;
    
    switch (state.timePeriod) {
      case 'dia':
        // Para período de día, usar el día completo de hoy
        start = now.startOf('day');
        break;
      case 'semana':
        // Para período de semana, usar los últimos 7 días
        start = now.subtract(7, 'day');
        break;
      case 'mes':
        // Para período de mes, usar las últimas 4 semanas (28 días)
        start = now.subtract(28, 'day');
        break;
      case 'año':
        // Para período de año, usar los últimos 12 meses
        start = now.subtract(1, 'year');
        break;
      default:
        start = now.subtract(28, 'day');
    }
    
    const newDateRange = { 
      start: start.startOf('day'), 
      end: now.endOf('day') 
    };
    
    console.log('📅 Actualizando dateRange desde período:', {
      timePeriod: state.timePeriod,
      newDateRange: {
        start: newDateRange.start.format('YYYY-MM-DD'),
        end: newDateRange.end.format('YYYY-MM-DD')
      }
    });
    
    set({ dateRange: newDateRange });
  },
  
  setFilter: (filterName, value) => set((state) => ({
    ...state,
    [filterName]: value
  })),

  resetFilters: () => set({
    dateRange: {
      start: dayjs().subtract(30, 'day'),
      end: dayjs()
    },
    timePeriod: 'mes',
    useCustomDates: false,
    country: '',
    ageBucket: '',
    gender: '',
    tipoYerba: '',
    marca: '',
    origen: '',
    paisProd: '',
    secado: ''
  }),

  // Actualizar opciones disponibles
  setOptions: (optionType, options) => set((state) => ({
    options: {
      ...state.options,
      [optionType]: options
    }
  })),

  setOptionsLoading: (optionType, loading) => set((state) => ({
    optionsLoading: {
      ...state.optionsLoading,
      [optionType]: loading
    }
  })),

  // Obtener filtros activos (no vacíos)
  getActiveFilters: () => {
    const state = get();
    const filters = {};
    
    if (state.dateRange.start && state.dateRange.end) {
      filters.dateRange = state.dateRange;
    }
    if (state.country) filters.country = state.country;
    if (state.ageBucket) filters.ageBucket = state.ageBucket;
    if (state.gender) filters.gender = state.gender;
    if (state.tipoYerba) filters.tipoYerba = state.tipoYerba;
    if (state.marca) filters.marca = state.marca;
    if (state.origen) filters.origen = state.origen;
    if (state.paisProd) filters.paisProd = state.paisProd;
    if (state.secado) filters.secado = state.secado;
    
    return filters;
  },

  // Contar filtros activos
  getActiveFiltersCount: () => {
    const activeFilters = get().getActiveFilters();
    // No contar dateRange como filtro activo ya que siempre está presente
    const { dateRange: _dateRange, ...otherFilters } = activeFilters;
    return Object.keys(otherFilters).length;
  },

  // Cargar opciones de filtros desde la API
  loadFilterOptions: async () => {
    set({ loading: true, error: null });
    
    try {
      // Por ahora usar datos mock hasta que la API esté lista
      const mockOptions = {
        countries: ['Argentina', 'Uruguay', 'Brasil', 'Paraguay'],
        tiposYerba: ['Tradicional', 'Con palo', 'Sin palo', 'Suave', 'Orgánica'],
        marcas: ['La Merced', 'Taragui', 'Amanda', 'Union', 'Rosamonte'],
        origenes: ['Misiones', 'Corrientes', 'Entre Ríos'],
        paisesProd: ['Argentina', 'Brasil', 'Paraguay'],
        tiposSecado: ['Natural', 'Barbacuá', 'Mixto']
      };

      set((state) => ({
        options: {
          ...state.options,
          ...mockOptions
        },
        loading: false
      }));
    } catch (error) {
      console.error('Error loading filter options:', error);
      set({ 
        loading: false, 
        error: error.message || 'Error cargando opciones de filtros' 
      });
    }
  },

  // Alias para compatibilidad
  get filterOptions() {
    const state = get();
    
    // Función helper para transformar arrays simples en objetos con value/label
    const transformOptions = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr.map(item => 
        typeof item === 'string' 
          ? { value: item, label: item }
          : item
      );
    };

    return {
      paisesUsuario: transformOptions(state.options.countries),
      edades: transformOptions(state.options.ageBuckets),
      generos: transformOptions(state.options.genders),
      tipos: transformOptions(state.options.tiposYerba),
      marcas: transformOptions(state.options.marcas),
      origenes: transformOptions(state.options.origenes),
      paisesProd: transformOptions(state.options.paisesProd),
      secados: transformOptions(state.options.tiposSecado)
    };
  }
}));

export default useFiltersStore;
