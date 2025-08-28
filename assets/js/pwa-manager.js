// PWA Manager para LS DESIGN
(function() {
  'use strict';

  let deferredPrompt;
  let isInstalled = false;

  // Verificar se já está instalado
  function checkIfInstalled() {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      isInstalled = true;
      document.documentElement.classList.add('pwa-installed');
    }
  }

  // Criar botão de instalação
  function createInstallButton() {
    if (isInstalled) return;

    const installPrompt = document.createElement('div');
    installPrompt.className = 'install-prompt';
    installPrompt.innerHTML = `
      <div class="install-icon">📱</div>
      <div class="install-text">Instalar App</div>
      <button class="close-btn" aria-label="Fechar">&times;</button>
    `;

    document.body.appendChild(installPrompt);

    // Event listeners
    installPrompt.addEventListener('click', (e) => {
      if (e.target.classList.contains('close-btn')) {
        hideInstallPrompt();
        localStorage.setItem('installPromptDismissed', 'true');
      } else {
        installApp();
      }
    });

    return installPrompt;
  }

  // Mostrar prompt de instalação
  function showInstallPrompt() {
    if (isInstalled || localStorage.getItem('installPromptDismissed')) return;

    const installPrompt = document.querySelector('.install-prompt') || createInstallButton();
    
    setTimeout(() => {
      installPrompt.classList.add('show');
    }, 3000); // Mostrar após 3 segundos
  }

  // Ocultar prompt de instalação
  function hideInstallPrompt() {
    const installPrompt = document.querySelector('.install-prompt');
    if (installPrompt) {
      installPrompt.classList.remove('show');
    }
  }

  // Instalar aplicativo
  async function installApp() {
    if (!deferredPrompt) {
      // Fallback para navegadores que não suportam
      showManualInstallInstructions();
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA instalado com sucesso');
        hideInstallPrompt();
        showInstallSuccessMessage();
      } else {
        console.log('Instalação do PWA cancelada');
      }
      
      deferredPrompt = null;
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
    }
  }

  // Instruções de instalação manual
  function showManualInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let instructions = '';
    
    if (isIOS) {
      instructions = `
        <div class="manual-install">
          <h3>Instalar no iOS</h3>
          <ol>
            <li>Toque no botão de compartilhar <span style="font-size: 1.2em;">⬆️</span></li>
            <li>Role para baixo e toque em "Adicionar à Tela de Início"</li>
            <li>Toque em "Adicionar" no canto superior direito</li>
          </ol>
        </div>
      `;
    } else if (isAndroid) {
      instructions = `
        <div class="manual-install">
          <h3>Instalar no Android</h3>
          <ol>
            <li>Toque no menu do navegador <span style="font-size: 1.2em;">⋮</span></li>
            <li>Selecione "Adicionar à tela inicial" ou "Instalar app"</li>
            <li>Confirme tocando em "Adicionar" ou "Instalar"</li>
          </ol>
        </div>
      `;
    } else {
      instructions = `
        <div class="manual-install">
          <h3>Instalar no Desktop</h3>
          <ol>
            <li>Clique no ícone de instalação na barra de endereços</li>
            <li>Ou acesse o menu do navegador e selecione "Instalar LS DESIGN"</li>
            <li>Confirme a instalação</li>
          </ol>
        </div>
      `;
    }

    showModal(instructions);
  }

  // Mostrar modal
  function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'install-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        ${content}
        <button class="modal-close">Fechar</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
    });

    modal.querySelector('.modal-overlay').addEventListener('click', () => {
      modal.remove();
    });
  }

  // Mensagem de sucesso da instalação
  function showInstallSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'install-success';
    message.innerHTML = `
      <div class="success-content">
        <div class="success-icon">✅</div>
        <div class="success-text">App instalado com sucesso!</div>
        <div class="success-subtitle">Agora você pode acessar o LS DESIGN diretamente da sua tela inicial.</div>
      </div>
    `;

    document.body.appendChild(message);

    setTimeout(() => {
      message.classList.add('show');
    }, 100);

    setTimeout(() => {
      message.remove();
    }, 5000);
  }

  // Gerenciar atualizações do service worker
  function handleServiceWorkerUpdates() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateAvailable();
            }
          });
        });
      });
    }
  }

  // Mostrar notificação de atualização
  function showUpdateAvailable() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <div class="update-icon">🔄</div>
        <div class="update-text">
          <div class="update-title">Nova versão disponível!</div>
          <div class="update-subtitle">Atualize para ter acesso às melhorias mais recentes.</div>
        </div>
        <div class="update-actions">
          <button class="update-btn">Atualizar</button>
          <button class="dismiss-btn">Depois</button>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Event listeners
    notification.querySelector('.update-btn').addEventListener('click', () => {
      window.location.reload();
    });

    notification.querySelector('.dismiss-btn').addEventListener('click', () => {
      notification.remove();
    });

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
  }

  // Detectar modo offline
  function handleOfflineStatus() {
    const showOfflineIndicator = () => {
      let indicator = document.querySelector('.offline-indicator');
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'offline-indicator';
        indicator.textContent = '📡 Você está offline - Algumas funcionalidades podem estar limitadas';
        document.body.appendChild(indicator);
      }
      indicator.classList.add('show');
    };

    const hideOfflineIndicator = () => {
      const indicator = document.querySelector('.offline-indicator');
      if (indicator) {
        indicator.classList.remove('show');
        setTimeout(() => {
          if (indicator.parentNode) {
            indicator.remove();
          }
        }, 300);
      }
    };

    window.addEventListener('online', hideOfflineIndicator);
    window.addEventListener('offline', showOfflineIndicator);

    // Verificar status inicial
    if (!navigator.onLine) {
      showOfflineIndicator();
    }
  }

  // Splash screen
  function showSplashScreen() {
    if (isInstalled && !sessionStorage.getItem('splashShown')) {
      const splash = document.createElement('div');
      splash.className = 'splash-screen';
      splash.innerHTML = `
        <div class="splash-logo">LS</div>
        <div class="splash-text">LS DESIGN</div>
        <div class="splash-subtitle">Edição Profissional de Imagens</div>
        <div class="splash-loader"></div>
      `;

      document.body.appendChild(splash);

      setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => {
          splash.remove();
        }, 500);
      }, 2000);

      sessionStorage.setItem('splashShown', 'true');
    }
  }

  // Shortcuts do teclado para PWA
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + I para mostrar informações de instalação
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        if (!isInstalled) {
          showInstallPrompt();
        }
      }

      // Ctrl/Cmd + R para forçar atualização
      if ((e.ctrlKey || e.metaKey) && e.key === 'r' && e.shiftKey) {
        e.preventDefault();
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
              registration.unregister();
            });
            window.location.reload(true);
          });
        }
      }
    });
  }

  // Analytics para PWA
  function trackPWAUsage() {
    // Rastrear instalação
    window.addEventListener('beforeinstallprompt', () => {
      console.log('PWA install prompt shown');
    });

    // Rastrear uso em modo standalone
    if (isInstalled) {
      console.log('PWA launched in standalone mode');
    }

    // Rastrear orientação
    window.addEventListener('orientationchange', () => {
      console.log('Orientation changed to:', screen.orientation?.angle || 'unknown');
    });
  }

  // Event listeners principais
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPrompt();
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA foi instalado');
    hideInstallPrompt();
    showInstallSuccessMessage();
    isInstalled = true;
    document.documentElement.classList.add('pwa-installed');
  });

  // Inicialização
  function init() {
    checkIfInstalled();
    showSplashScreen();
    handleServiceWorkerUpdates();
    handleOfflineStatus();
    setupKeyboardShortcuts();
    trackPWAUsage();

    // Mostrar prompt de instalação após um tempo
    if (!isInstalled) {
      setTimeout(showInstallPrompt, 5000);
    }

    console.log('PWA Manager inicializado');
  }

  // Auto-inicializar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
