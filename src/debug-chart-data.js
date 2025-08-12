// Archivo de debug para verificar datos del gráfico
// Ejecutar en la consola del navegador para inspeccionar los datos

console.log('🔍 DEBUG: Verificando datos del gráfico de actividad por período');

// Función para inspeccionar datos del gráfico
function debugChartData() {
  // Obtener el store de filtros
  const filtersStore = window.filtersStore || window.__ZUSTAND_STORE__;
  
  if (filtersStore) {
    console.log('📊 Filtros actuales:', filtersStore.getState());
  } else {
    console.log('❌ No se pudo acceder al store de filtros');
  }
  
  // Buscar el componente TrendLineChart en el DOM
  const chartContainer = document.querySelector('[data-testid="trend-line-chart"]') || 
                        document.querySelector('.MuiPaper-root');
  
  if (chartContainer) {
    console.log('📈 Contenedor del gráfico encontrado:', chartContainer);
    
    // Intentar acceder a los datos del gráfico
    const chartData = chartContainer.__reactProps$ || chartContainer._reactInternalFiber;
    if (chartData) {
      console.log('📊 Datos del gráfico (props):', chartData);
    }
  }
  
  // Verificar si hay datos en localStorage o sessionStorage
  const cachedData = localStorage.getItem('dashboard-data') || sessionStorage.getItem('dashboard-data');
  if (cachedData) {
    console.log('💾 Datos en cache:', JSON.parse(cachedData));
  }
  
  // Verificar datos de la API
  console.log('🌐 Verificando llamadas a la API...');
  
  // Interceptar llamadas fetch para ver los datos
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    console.log('📡 Fetch request:', args);
    return originalFetch.apply(this, args).then(response => {
      console.log('📡 Fetch response:', response);
      return response;
    });
  };
}

// Función para simular datos de prueba
function generateTestData() {
  const now = new Date();
  const testData = [];
  
  // Generar datos para los últimos 7 días
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    testData.push({
      period: date.toISOString().split('T')[0], // Formato YYYY-MM-DD
      events: Math.floor(Math.random() * 50) + 10,
      start: date.toISOString(),
      end: new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      week: date.toISOString().split('T')[0]
    });
  }
  
  console.log('🧪 Datos de prueba generados:', testData);
  return testData;
}

// Función para verificar el formato de fechas
function validateDateFormat(data) {
  if (!Array.isArray(data)) {
    console.log('❌ Los datos no son un array:', typeof data);
    return false;
  }
  
  console.log('✅ Los datos son un array con', data.length, 'elementos');
  
  data.forEach((item, index) => {
    console.log(`📅 Elemento ${index}:`, item);
    
    if (!item.period) {
      console.log(`❌ Elemento ${index} no tiene campo 'period'`);
    } else {
      console.log(`✅ Elemento ${index} tiene periodo:`, item.period, 'tipo:', typeof item.period);
      
      // Verificar si es una fecha válida
      const date = new Date(item.period);
      if (isNaN(date.getTime())) {
        console.log(`❌ Elemento ${index} tiene periodo inválido:`, item.period);
      } else {
        console.log(`✅ Elemento ${index} tiene fecha válida:`, date.toISOString());
      }
    }
    
    if (!item.events) {
      console.log(`❌ Elemento ${index} no tiene campo 'events'`);
    } else {
      console.log(`✅ Elemento ${index} tiene eventos:`, item.events, 'tipo:', typeof item.events);
    }
  });
  
  return true;
}

// Función principal de debug
function runDebug() {
  console.log('🚀 Iniciando debug del gráfico...');
  
  // Esperar un poco para que la página se cargue
  setTimeout(() => {
    debugChartData();
    
    // Generar datos de prueba
    const testData = generateTestData();
    
    // Validar formato de fechas
    validateDateFormat(testData);
    
    console.log('✅ Debug completado. Revisa la consola para más detalles.');
  }, 2000);
}

// Ejecutar debug automáticamente
runDebug();

// Exportar funciones para uso manual
window.debugChartData = debugChartData;
window.generateTestData = generateTestData;
window.validateDateFormat = validateDateFormat;
window.runDebug = runDebug;

console.log('🔧 Funciones de debug disponibles:');
console.log('- debugChartData() - Inspecciona datos del gráfico');
console.log('- generateTestData() - Genera datos de prueba');
console.log('- validateDateFormat(data) - Valida formato de fechas');
console.log('- runDebug() - Ejecuta debug completo');
