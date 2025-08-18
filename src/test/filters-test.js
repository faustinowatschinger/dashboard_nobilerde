// Test para verificar funcionalidad de filtros
// Este archivo puede ser ejecutado en la consola del navegador

const testFilters = () => {
  console.log('🧪 Iniciando test de filtros...');
  
  // Test 1: Verificar que el store de filtros existe
  try {
    const _filtersStoreModule = window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.rendererInterfaces?.get(1)?.getCurrentFiber()?.return?.memoizedProps;
    console.log('✅ Test 1 - Store verificado', _filtersStoreModule ? 'encontrado' : 'no encontrado');
  } catch (error) {
    console.log('❌ Test 1 - Error:', error.message);
  }
  
  // Test 2: Verificar elementos de filtros en el DOM
  const filterElements = {
    timePeriodSelect: document.querySelector('[data-testid="time-period-select"]') || 
                     document.querySelector('select') ||
                     document.querySelector('.MuiSelect-root'),
    filtersContainer: document.querySelector('[data-testid="filters-container"]') ||
                     document.querySelector('[class*="filter"]'),
    dateRangeInput: document.querySelector('[data-testid="date-range"]') ||
                   document.querySelector('.MuiDatePicker-root')
  };
  
  console.log('🔍 Test 2 - Elementos de filtros encontrados:');
  Object.entries(filterElements).forEach(([key, element]) => {
    if (element) {
      console.log(`✅ ${key}: Encontrado`);
    } else {
      console.log(`❌ ${key}: No encontrado`);
    }
  });
  
  // Test 3: Verificar que los cambios en filtros generan eventos
  const testFilterChange = () => {
    console.log('🔄 Test 3 - Probando cambios en filtros...');
    
    // Interceptar console.log para capturar mensajes de cambio
    const originalLog = console.log;
    const logs = [];
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };
    
    // Simular click en un botón de período de tiempo
    const timePeriodButtons = document.querySelectorAll('button, .MuiButton-root, [role="button"]');
    console.log(`📊 Encontrados ${timePeriodButtons.length} botones posibles`);
    
    // Buscar botón que contenga texto relacionado con períodos
    const periodButton = Array.from(timePeriodButtons).find(btn => 
      btn.textContent?.includes('día') || 
      btn.textContent?.includes('semana') || 
      btn.textContent?.includes('mes') ||
      btn.textContent?.includes('Hoy') ||
      btn.textContent?.includes('Últimos')
    );
    
    if (periodButton) {
      console.log('🎯 Encontrado botón de período:', periodButton.textContent);
      periodButton.click();
      
      // Verificar si se generaron logs de cambio
      setTimeout(() => {
        const changeLogs = logs.filter(log => 
          log.includes('setTimePeriod') || 
          log.includes('handleTimePeriodChange') ||
          log.includes('dateRange')
        );
        
        if (changeLogs.length > 0) {
          console.log('✅ Test 3 - Filtros responden a cambios:');
          changeLogs.forEach(log => console.log(`  📋 ${log}`));
        } else {
          console.log('❌ Test 3 - No se detectaron cambios en filtros');
        }
        
        // Restaurar console.log original
        console.log = originalLog;
      }, 500);
    } else {
      console.log('❌ Test 3 - No se encontró botón de período para probar');
      console.log = originalLog;
    }
  };
  
  testFilterChange();
  
  // Test 4: Verificar llamadas a backend
  const testBackendCalls = () => {
    console.log('🌐 Test 4 - Monitoreando llamadas a backend...');
    
    // Interceptar fetch para monitorear llamadas
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options] = args;
      console.log('📡 Llamada a backend detectada:', url);
      
      if (typeof url === 'string' && (url.includes('api') || url.includes('metrics'))) {
        console.log('✅ Llamada relevante a API:', {
          url,
          method: options?.method || 'GET',
          body: options?.body ? JSON.parse(options.body) : null
        });
      }
      
      const response = await originalFetch(...args);
      return response;
    };
    
    // Restaurar fetch original después de 10 segundos
    setTimeout(() => {
      window.fetch = originalFetch;
      console.log('🔄 Monitoreo de backend completado');
    }, 10000);
  };
  
  testBackendCalls();
  
  console.log('🏁 Test de filtros completado. Revisa los resultados arriba.');
};

// Función para verificar errores en consola
const checkConsoleErrors = () => {
  console.log('🔍 Verificando errores en consola...');
  
  // Interceptar console.error
  const originalError = console.error;
  const errors = [];
  
  console.error = (...args) => {
    errors.push(args);
    originalError(...args);
  };
  
  // Reportar errores después de 5 segundos
  setTimeout(() => {
    if (errors.length > 0) {
      console.log('❌ Errores encontrados en consola:');
      errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.join(' ')}`);
      });
    } else {
      console.log('✅ No se encontraron errores en consola');
    }
    
    console.error = originalError;
  }, 5000);
};

// Exportar funciones para uso en consola
if (typeof window !== 'undefined') {
  window.testFilters = testFilters;
  window.checkConsoleErrors = checkConsoleErrors;
}

export { testFilters, checkConsoleErrors };
