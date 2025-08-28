// Performance Optimizer para LS DESIGN
(function() {
  'use strict';

  // Lazy Loading de Imagens
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Otimização de scroll - MELHORADA
  let scrollTicking = false;
  let lastScrollY = 0;
  
  function optimizeScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        
        // Só processar se houve mudança significativa
        if (Math.abs(scrollY - lastScrollY) > 5) {
          const header = document.querySelector('header');
          
          if (header) {
            if (scrollY > 100) {
              header.classList.add('scrolled');
            } else {
              header.classList.remove('scrolled');
            }
          }
          
          lastScrollY = scrollY;
        }
        
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  // Preload de recursos críticos
  function preloadCriticalResources() {
    const criticalImages = [
      'assets/antes-depois/FEIJOADAANTES.jpg',
      'assets/antes-depois/FEIJOADADEPOIS.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Otimização de animações
  function optimizeAnimations() {
    // Reduzir animações em dispositivos com bateria baixa
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        if (battery.level < 0.2) {
          document.documentElement.classList.add('reduce-motion');
        }
      });
    }

    // Pausar animações quando a aba não está ativa
    document.addEventListener('visibilitychange', () => {
      const particles = document.getElementById('particles-canvas');
      if (particles) {
        if (document.hidden) {
          particles.style.display = 'none';
        } else {
          particles.style.display = 'block';
        }
      }
    });
  }

  // Otimização de recursos baseada na conexão
  function optimizeForConnection() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        // Desabilitar animações pesadas
        document.documentElement.classList.add('slow-connection');
        
        // Remover partículas em conexões lentas
        const particles = document.getElementById('particles-canvas');
        if (particles) {
          particles.remove();
        }
      }
    }
  }

  // Cache inteligente
  function setupIntelligentCaching() {
    if ('serviceWorker' in navigator) {
      // Registrar service worker se não estiver registrado
      navigator.serviceWorker.register('./sw.js').then(registration => {
        console.log('SW registrado com sucesso:', registration);
        
        // Atualizar cache quando houver nova versão
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nova versão disponível
              showUpdateNotification();
            }
          });
        });
      }).catch(error => {
        console.log('Falha ao registrar SW:', error);
      });
    }
  }

  // Notificação de atualização
  function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <span>Nova versão disponível!</span>
        <button onclick="window.location.reload()">Atualizar</button>
        <button onclick="this.parentElement.parentElement.remove()">Depois</button>
      </div>
    `;
    document.body.appendChild(notification);
  }

  // Otimização de formulários
  function optimizeForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      // Validação em tempo real
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          validateField(input);
        });
      });
    });
  }

  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    
    // Remover classes de erro anteriores
    field.classList.remove('error', 'valid');
    
    if (value === '') {
      if (field.required) {
        field.classList.add('error');
        return false;
      }
    } else {
      // Validações específicas por tipo
      if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) {
          field.classList.add('valid');
        } else {
          field.classList.add('error');
          return false;
        }
      }
      
      if (type === 'tel') {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        if (phoneRegex.test(value) && value.length >= 10) {
          field.classList.add('valid');
        } else {
          field.classList.add('error');
          return false;
        }
      }
    }
    
    return true;
  }

  // Otimização de imagens responsivas
  function setupResponsiveImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Adicionar decode async para melhor performance
      img.decoding = 'async';
    });
  }

  // Inicialização
  function init() {
    // Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Executar otimizações
    initLazyLoading();
    preloadCriticalResources();
    optimizeAnimations();
    optimizeForConnection();
    setupIntelligentCaching();
    optimizeForms();
    setupResponsiveImages();

    // Event listeners
    window.addEventListener('scroll', optimizeScroll, { passive: true });
    
    // Otimizações específicas para mobile
    if (window.innerWidth <= 768) {
      document.documentElement.classList.add('mobile-device');
      
      // Reduzir qualidade de animações em mobile
      const particles = document.getElementById('particles-canvas');
      if (particles) {
        const ctx = particles.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
        }
      }
    }

    console.log('Performance Optimizer inicializado');
  }

  // Auto-inicializar
  init();

})();
