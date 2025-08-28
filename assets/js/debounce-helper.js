// Debounce Helper para evitar travamentos
(function() {
  'use strict';

  // Debounce function
  window.debounce = function(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  };

  // Throttle function
  window.throttle = function(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // RequestAnimationFrame throttle
  window.rafThrottle = function(func) {
    let ticking = false;
    return function(...args) {
      if (!ticking) {
        requestAnimationFrame(() => {
          func.apply(this, args);
          ticking = false;
        });
        ticking = true;
      }
    };
  };

  // Cleanup function para event listeners
  window.cleanupEventListeners = function() {
    // Remover listeners duplicados
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      if (el._eventListeners) {
        Object.keys(el._eventListeners).forEach(event => {
          el._eventListeners[event].forEach(listener => {
            el.removeEventListener(event, listener);
          });
        });
        delete el._eventListeners;
      }
    });
  };

  // Safe event listener adder
  window.safeAddEventListener = function(element, event, handler, options = {}) {
    if (!element || !event || !handler) return;
    
    // Evitar listeners duplicados
    if (!element._eventListeners) {
      element._eventListeners = {};
    }
    
    if (!element._eventListeners[event]) {
      element._eventListeners[event] = [];
    }
    
    // Verificar se já existe
    const exists = element._eventListeners[event].some(listener => 
      listener.toString() === handler.toString()
    );
    
    if (!exists) {
      element.addEventListener(event, handler, options);
      element._eventListeners[event].push(handler);
    }
  };

  // Memory cleanup
  window.cleanupMemory = function() {
    // Limpar URLs de objetos
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.src && img.src.startsWith('blob:')) {
        URL.revokeObjectURL(img.src);
      }
    });

    // Forçar garbage collection se disponível
    if (window.gc) {
      window.gc();
    }
  };

  // Performance monitor
  window.performanceMonitor = {
    start: function(name) {
      if (performance.mark) {
        performance.mark(`${name}-start`);
      }
    },
    
    end: function(name) {
      if (performance.mark && performance.measure) {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        const measure = performance.getEntriesByName(name)[0];
        if (measure && measure.duration > 100) {
          console.warn(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
        }
      }
    }
  };

  // Error boundary
  window.safeExecute = function(func, fallback = () => {}) {
    try {
      return func();
    } catch (error) {
      console.error('Safe execute error:', error);
      return fallback();
    }
  };

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    cleanupEventListeners();
    cleanupMemory();
  });

  console.log('Debounce Helper carregado');
})();
