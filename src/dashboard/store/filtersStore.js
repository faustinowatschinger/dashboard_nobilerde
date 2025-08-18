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
  tipoMatero: '',
  tipoMate: '',
  termosDia: '',
  tipoYerba: '',
  marca: '',
  establecimiento: '',
  origen: '',
  paisProd: '',
  secado: '',
  leafCut: '',
  tipoEstacionamiento: '',
  produccion: '',
  containsPalo: '',

  // Opciones para los selectores (se llenan dinámicamente)
  options: {
    countries: [],
    ageBuckets: ['18-25', '26-35', '36-45', '46-55', '56+'],
    genders: ['M', 'F', 'Otro'],
    tiposMatero: [],
    tiposMate: [],
    termosDia: [],
    tiposYerba: [],
    marcas: [],
    establecimientos: [],
    origenes: [],
    paisesProd: [],
    tiposSecado: [],
    leafCuts: [],
    tiposEstacionamiento: [],
    producciones: [],
    containsPalo: []
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
    tipoMatero: '',
    tipoMate: '',
    termosDia: '',
    tipoYerba: '',
    marca: '',
    establecimiento: '',
    origen: '',
    paisProd: '',
    secado: '',
    leafCut: '',
    tipoEstacionamiento: '',
    produccion: '',
    containsPalo: ''
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
    if (state.tipoMatero) filters.tipoMatero = state.tipoMatero;
    if (state.tipoMate) filters.tipoMate = state.tipoMate;
    if (state.termosDia) filters.termosDia = state.termosDia;
    if (state.tipoYerba) filters.tipoYerba = state.tipoYerba;
    if (state.marca) filters.marca = state.marca;
    if (state.establecimiento) filters.establecimiento = state.establecimiento;
    if (state.origen) filters.origen = state.origen;
    if (state.paisProd) filters.paisProd = state.paisProd;
    if (state.secado) filters.secado = state.secado;
    if (state.leafCut) filters.leafCut = state.leafCut;
    if (state.tipoEstacionamiento) filters.tipoEstacionamiento = state.tipoEstacionamiento;
    if (state.produccion) filters.produccion = state.produccion;
    if (state.containsPalo) filters.containsPalo = state.containsPalo;
    
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
      console.log('🔄 Cargando opciones de filtros desde nuevos endpoints...');
      
      // Cargar opciones reales desde los nuevos endpoints
      const [userFiltersRes, yerbaFiltersRes] = await Promise.all([
        fetch('/api/dashboard/filters/usuarios').then(r => r.json()).catch(err => {
          console.error('Error fetching user filters:', err);
          return [];
        }),
        fetch('/api/dashboard/filters/yerbas').then(r => r.json()).catch(err => {
          console.error('Error fetching yerba filters:', err);
          return [];
        })
      ]);

      console.log('📊 User filters response:', userFiltersRes);
      console.log('📊 Yerba filters response:', yerbaFiltersRes);

      // Los nuevos endpoints devuelven arrays directamente
      const userFilters = Array.isArray(userFiltersRes) ? userFiltersRes : [];
      const yerbaFilters = Array.isArray(yerbaFiltersRes) ? yerbaFiltersRes : [];
      
      console.log('🔍 Parsed user filters:', userFilters);
      console.log('🔍 Parsed yerba filters:', yerbaFilters);

      // Extraer opciones únicas de los datos
      const realOptions = {
        countries: [...new Set(userFilters.map(u => u.nacionalidad).filter(Boolean))],
        ageBuckets: [...new Set(userFilters.map(u => u.ageBucket).filter(Boolean))],
        genders: [...new Set(userFilters.map(u => u.genero).filter(Boolean))],
        tiposMatero: [...new Set(userFilters.map(u => u.tipoMatero).filter(Boolean))],
        tiposMate: [...new Set(userFilters.map(u => u.tipoMate).filter(Boolean))],
        termosDia: [...new Set(userFilters.map(u => u.termosDia).filter(Boolean))],
        tiposYerba: [...new Set(yerbaFilters.map(y => y.tipo).filter(Boolean))],
        marcas: [...new Set(yerbaFilters.map(y => y.marca).filter(Boolean))],
        establecimientos: [...new Set(yerbaFilters.map(y => y.establecimiento).filter(Boolean))],
        origenes: [...new Set(yerbaFilters.map(y => y.origen).filter(Boolean))],
        paisesProd: [...new Set(yerbaFilters.map(y => y.paisProd).filter(Boolean))],
        tiposSecado: [...new Set(yerbaFilters.map(y => y.secado).filter(Boolean))],
        leafCuts: [...new Set(yerbaFilters.map(y => y.leafCut).filter(Boolean))],
        tiposEstacionamiento: [...new Set(yerbaFilters.map(y => y.tipoEstacionamiento).filter(Boolean))],
        producciones: [...new Set(yerbaFilters.map(y => y.produccion).filter(Boolean))],
        containsPalo: [...new Set(yerbaFilters.map(y => y.containsPalo).filter(Boolean))]
      };

      console.log('🔄 Opciones transformadas para el store:', realOptions);
      console.log('🎯 Opciones extraídas:');
      console.log('  - Países:', realOptions.countries);
      console.log('  - Edades:', realOptions.ageBuckets);
      console.log('  - Géneros:', realOptions.genders);
      console.log('  - Tipos Matero:', realOptions.tiposMatero);
      console.log('  - Tipos Mate:', realOptions.tiposMate);
      console.log('  - Termos/Día:', realOptions.termosDia);

      set((state) => ({
        options: {
          ...state.options,
          ...realOptions
        },
        loading: false
      }));
    } catch (error) {
      console.error('Error loading filter options from backend:', error);
      
      // Fallback a datos mock si falla la API
      const mockOptions = {
        countries: ['Argentina', 'Uruguay', 'Brasil', 'Paraguay'],
        ageBuckets: ['18-25', '26-35', '36-45', '46-55', '56+'],
        genders: ['M', 'F', 'Otro'],
        tiposMatero: ['Calabaza', 'Madera', 'Silicón', 'Cerámica', 'Vidrio', 'Acero'],
        tiposMate: ['Amargo', 'Dulce', 'Con hierbas'],
        termosDia: ['1', '2', '3', '4', '5+'],
        tiposYerba: ['Tradicional', 'Suave', 'Despalada', 'Premium/Selección', 'Barbacuá', 'Compuesta'],
        marcas: ['La Merced', 'Taragui', 'Amanda', 'Union', 'Rosamonte', 'Kalena', 'Baldo', 'Sara'],
        origenes: ['Misiones', 'Corrientes', 'Entre Ríos'],
        paisesProd: ['Argentina', 'Brasil', 'Paraguay'],
        tiposSecado: ['Natural', 'Barbacuá', 'Mixto']
      };

      set((state) => ({
        options: {
          ...state.options,
          ...mockOptions
        },
        loading: false, 
        error: error.message || 'Error cargando opciones de filtros (usando datos por defecto)'
      }));
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
      // Filtros de usuario
      paisesUsuario: transformOptions(state.options.countries),
      edades: transformOptions(state.options.ageBuckets),
      generos: transformOptions(state.options.genders),
      tiposMatero: transformOptions(state.options.tiposMatero),
      tiposMate: transformOptions(state.options.tiposMate),
      termosDia: transformOptions(state.options.termosDia),
      
      // Filtros de yerba  
      tipos: transformOptions(state.options.tiposYerba),
      marcas: transformOptions(state.options.marcas),
      establecimientos: transformOptions(state.options.establecimientos),
      origenes: transformOptions(state.options.origenes),
      paisesProd: transformOptions(state.options.paisesProd),
      secados: transformOptions(state.options.tiposSecado),
      leafCuts: transformOptions(state.options.leafCuts),
      tiposEstacionamiento: transformOptions(state.options.tiposEstacionamiento),
      producciones: transformOptions(state.options.producciones),
      containsPalo: transformOptions(state.options.containsPalo)
    };
  }
}));

export default useFiltersStore;
