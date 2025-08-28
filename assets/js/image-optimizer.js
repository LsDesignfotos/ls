// Image Optimizer para LS DESIGN
(function() {
  'use strict';

  // Configurações de otimização
  const config = {
    lazyLoadOffset: 100,
    webpSupport: false,
    avifSupport: false,
    compressionQuality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080
  };

  // Detectar suporte a formatos modernos
  function detectImageSupport() {
    // Detectar WebP
    const webpCanvas = document.createElement('canvas');
    webpCanvas.width = 1;
    webpCanvas.height = 1;
    config.webpSupport = webpCanvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

    // Detectar AVIF
    const avifImg = new Image();
    avifImg.onload = () => {
      config.avifSupport = true;
    };
    avifImg.onerror = () => {
      config.avifSupport = false;
    };
    avifImg.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  }

  // Lazy Loading com Intersection Observer
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: `${config.lazyLoadOffset}px`
      });

      images.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback para navegadores sem suporte
      images.forEach(img => loadImage(img));
    }
  }

  // Carregar imagem otimizada
  function loadImage(img) {
    const originalSrc = img.dataset.src || img.src;
    const optimizedSrc = getOptimizedImageSrc(originalSrc, img);
    
    // Criar nova imagem para pré-carregamento
    const newImg = new Image();
    
    newImg.onload = () => {
      img.src = optimizedSrc;
      img.classList.add('loaded');
      img.classList.remove('loading');
    };
    
    newImg.onerror = () => {
      // Fallback para imagem original
      img.src = originalSrc;
      img.classList.add('loaded');
      img.classList.remove('loading');
    };
    
    img.classList.add('loading');
    newImg.src = optimizedSrc;
  }

  // Obter URL otimizada da imagem
  function getOptimizedImageSrc(src, img) {
    // Se for uma URL externa, retornar como está
    if (src.startsWith('http') && !src.includes(window.location.hostname)) {
      return src;
    }

    const imgWidth = img.offsetWidth || img.getAttribute('width') || config.maxWidth;
    const imgHeight = img.offsetHeight || img.getAttribute('height') || config.maxHeight;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Calcular dimensões otimizadas
    const targetWidth = Math.min(imgWidth * devicePixelRatio, config.maxWidth);
    const targetHeight = Math.min(imgHeight * devicePixelRatio, config.maxHeight);
    
    // Determinar melhor formato
    let format = 'jpg';
    if (config.avifSupport) {
      format = 'avif';
    } else if (config.webpSupport) {
      format = 'webp';
    }
    
    // Para imagens locais, tentar versão otimizada
    const extension = src.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
      const baseName = src.replace(/\.[^/.]+$/, '');
      const optimizedSrc = `${baseName}_${targetWidth}x${targetHeight}.${format}`;
      
      // Verificar se existe versão otimizada
      return checkImageExists(optimizedSrc) ? optimizedSrc : src;
    }
    
    return src;
  }

  // Verificar se imagem existe
  function checkImageExists(src) {
    // Cache de verificações
    if (!window.imageExistsCache) {
      window.imageExistsCache = new Map();
    }
    
    if (window.imageExistsCache.has(src)) {
      return window.imageExistsCache.get(src);
    }
    
    // Verificação assíncrona (simplificada para este exemplo)
    return false; // Por padrão, usar imagem original
  }

  // Otimizar imagens de fundo
  function optimizeBackgroundImages() {
    const elements = document.querySelectorAll('[data-bg-src]');
    
    elements.forEach(element => {
      const bgSrc = element.dataset.bgSrc;
      const optimizedSrc = getOptimizedImageSrc(bgSrc, element);
      
      const img = new Image();
      img.onload = () => {
        element.style.backgroundImage = `url(${optimizedSrc})`;
        element.classList.add('bg-loaded');
      };
      img.src = optimizedSrc;
    });
  }

  // Responsive Images com srcset
  function setupResponsiveImages() {
    const images = document.querySelectorAll('img[data-responsive]');
    
    images.forEach(img => {
      const baseSrc = img.dataset.responsive;
      const sizes = [480, 768, 1024, 1440, 1920];
      
      let srcset = '';
      let sizesAttr = '';
      
      sizes.forEach((size, index) => {
        const format = config.webpSupport ? 'webp' : 'jpg';
        srcset += `${baseSrc}_${size}.${format} ${size}w`;
        if (index < sizes.length - 1) srcset += ', ';
      });
      
      sizesAttr = '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1440px) 1440px, 1920px';
      
      img.srcset = srcset;
      img.sizes = sizesAttr;
    });
  }

  // Compressão de imagens no upload
  function setupImageCompression() {
    const fileInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    
    fileInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        const compressedFiles = [];
        
        files.forEach(file => {
          if (file.type.startsWith('image/')) {
            compressImage(file).then(compressedFile => {
              compressedFiles.push(compressedFile);
              
              if (compressedFiles.length === files.length) {
                // Todos os arquivos foram processados
                updateFileInput(input, compressedFiles);
              }
            });
          } else {
            compressedFiles.push(file);
          }
        });
      });
    });
  }

  // Comprimir imagem
  function compressImage(file) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular dimensões otimizadas
        let { width, height } = img;
        
        if (width > config.maxWidth) {
          height = (height * config.maxWidth) / width;
          width = config.maxWidth;
        }
        
        if (height > config.maxHeight) {
          width = (width * config.maxHeight) / height;
          height = config.maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converter para blob comprimido
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        }, file.type, config.compressionQuality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Atualizar input de arquivo
  function updateFileInput(input, files) {
    const dt = new DataTransfer();
    files.forEach(file => dt.items.add(file));
    input.files = dt.files;
    
    // Disparar evento de mudança
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Preload de imagens críticas
  function preloadCriticalImages() {
    const criticalImages = [
      'assets/hero/pizza-com-presunto-e-ovos.png',
      'assets/antes-depois/FEIJOADAANTES.jpg',
      'assets/antes-depois/FEIJOADADEPOIS.png'
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Otimização baseada na conexão
  function optimizeForConnection() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        // Reduzir qualidade para conexões lentas
        config.compressionQuality = 0.6;
        config.maxWidth = 1024;
        config.maxHeight = 768;
        
        // Desabilitar preload de imagens não críticas
        const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
        prefetchLinks.forEach(link => link.remove());
      }
    }
  }

  // Progressive Enhancement para Picture element
  function setupPictureElements() {
    const pictures = document.querySelectorAll('picture[data-auto-format]');
    
    pictures.forEach(picture => {
      const img = picture.querySelector('img');
      const baseSrc = img.dataset.src || img.src;
      
      if (!baseSrc) return;
      
      const baseName = baseSrc.replace(/\.[^/.]+$/, '');
      const extension = baseSrc.split('.').pop();
      
      // Adicionar source para AVIF
      if (config.avifSupport) {
        const avifSource = document.createElement('source');
        avifSource.srcset = `${baseName}.avif`;
        avifSource.type = 'image/avif';
        picture.insertBefore(avifSource, img);
      }
      
      // Adicionar source para WebP
      if (config.webpSupport) {
        const webpSource = document.createElement('source');
        webpSource.srcset = `${baseName}.webp`;
        webpSource.type = 'image/webp';
        picture.insertBefore(webpSource, img);
      }
    });
  }

  // Monitorar performance de imagens
  function monitorImagePerformance() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.initiatorType === 'img') {
            console.log(`Imagem carregada: ${entry.name} - ${entry.duration}ms`);
            
            // Alertar sobre imagens lentas
            if (entry.duration > 1000) {
              console.warn(`Imagem lenta detectada: ${entry.name}`);
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  // Inicialização
  function init() {
    detectImageSupport();
    
    // Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initLazyLoading();
        optimizeBackgroundImages();
        setupResponsiveImages();
        setupImageCompression();
        setupPictureElements();
        preloadCriticalImages();
        optimizeForConnection();
        monitorImagePerformance();
      });
    } else {
      initLazyLoading();
      optimizeBackgroundImages();
      setupResponsiveImages();
      setupImageCompression();
      setupPictureElements();
      preloadCriticalImages();
      optimizeForConnection();
      monitorImagePerformance();
    }
    
    console.log('Image Optimizer inicializado');
  }

  // Auto-inicializar
  init();

})();
