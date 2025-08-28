/**
 * LS DESIGN - Proteção Básica do Site
 * Proteção contra cópia de código e download de arquivos
 */

(function() {
    'use strict';
    
    // Configurações de segurança
    const SECURITY_CONFIG = {
        // Configurações de proteção
        enableDevToolsProtection: true,
        enableRightClickProtection: true,
        enableCopyProtection: true,
        enableImageProtection: true,
        enableFileProtection: true,
        
        // Mensagens
        messages: {
            devtools: '⚠️ Ferramentas de desenvolvedor bloqueadas!',
            copy: '📋 Cópia de conteúdo não permitida!',
            rightclick: '🖱️ Clique direito desabilitado!',
            download: '📥 Download não permitido!'
        }
    };


    // Proteção contra DevTools
    function protectDevTools() {
        if (!SECURITY_CONFIG.enableDevToolsProtection) return;
        
        // Detectar abertura do DevTools
        let devtools = {
            open: false,
            orientation: null
        };
        
        const threshold = 160;
        
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    console.clear();
                    console.warn(SECURITY_CONFIG.messages.devtools);
                    alert(SECURITY_CONFIG.messages.devtools);
                    // Redirecionar ou bloquear
                    window.location.href = 'about:blank';
                }
            } else {
                devtools.open = false;
            }
        }, 500);

        // Bloquear teclas de atalho
        document.addEventListener('keydown', function(e) {
            // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (e.keyCode === 123 || 
                (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
                (e.ctrlKey && e.keyCode === 85)) {
                e.preventDefault();
                e.stopPropagation();
                console.warn(SECURITY_CONFIG.messages.devtools);
                return false;
            }
        });
    }

    // Proteção contra clique direito
    function protectRightClick() {
        if (!SECURITY_CONFIG.enableRightClickProtection) return;
        
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            console.warn(SECURITY_CONFIG.messages.rightclick);
            showProtectionMessage(SECURITY_CONFIG.messages.rightclick);
            return false;
        });
    }

    // Proteção contra cópia
    function protectCopy() {
        if (!SECURITY_CONFIG.enableCopyProtection) return;
        
        // Desabilitar seleção de texto
        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Desabilitar arrastar
        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Bloquear Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+S
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && (e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 83)) {
                e.preventDefault();
                e.stopPropagation();
                console.warn(SECURITY_CONFIG.messages.copy);
                showProtectionMessage(SECURITY_CONFIG.messages.copy);
                return false;
            }
        });
    }

    // Proteção de imagens e arquivos
    function protectFiles() {
        if (!SECURITY_CONFIG.enableImageProtection && !SECURITY_CONFIG.enableFileProtection) return;
        
        // Proteger todas as imagens
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Desabilitar arrastar
            img.addEventListener('dragstart', function(e) {
                e.preventDefault();
                showProtectionMessage(SECURITY_CONFIG.messages.download);
                return false;
            });
            
            // Desabilitar salvar como
            img.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                showProtectionMessage(SECURITY_CONFIG.messages.rightclick);
                return false;
            });
        });
        
        // Proteger links de download
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.includes('.') && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel'))) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    showProtectionMessage(SECURITY_CONFIG.messages.download);
                    return false;
                });
            }
        });
    }


    // Mostrar mensagem de proteção
    function showProtectionMessage(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            z-index: 999999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Adicionar estilos para animações
    function addProtectionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            /* Proteção contra seleção */
            .protected-content {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
                -webkit-tap-highlight-color: transparent;
            }
            
            /* Desabilitar arrastar imagens */
            img {
                -webkit-user-drag: none;
                -khtml-user-drag: none;
                -moz-user-drag: none;
                -o-user-drag: none;
                user-drag: none;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }

    // Verificação de integridade
    function checkIntegrity() {
        const expectedElements = ['header', 'main', 'footer'];
        const missingElements = expectedElements.filter(tag => !document.querySelector(tag));
        
        if (missingElements.length > 0) {
            console.warn('⚠️ Estrutura do site modificada detectada!');
            return false;
        }
        
        return true;
    }

    // Monitoramento contínuo
    function startMonitoring() {
        // Verificar modificações no DOM
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // Verificar se elementos de proteção foram removidos
                    const protectedElements = document.querySelectorAll('[data-protected]');
                    if (protectedElements.length === 0) {
                        console.warn('🚫 Tentativa de remoção de proteção detectada!');
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Verificação periódica
        setInterval(() => {
            if (!checkIntegrity()) {
                console.warn('🚫 Integridade do site comprometida!');
            }
        }, 10000);
    }

    // Inicialização do sistema de proteção
    function initProtection() {
        // Aplicar todas as proteções
        addProtectionStyles();
        protectDevTools();
        protectRightClick();
        protectCopy();
        protectFiles();
        
        // Adicionar classe de proteção ao body
        document.body.classList.add('protected-content');
        
        console.log('🛡️ Proteção básica LS DESIGN ativada!');
    }

    // Executar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProtection);
    } else {
        initProtection();
    }

    // Proteção contra desabilitação do JavaScript
    window.addEventListener('beforeunload', function() {
        console.log('🛡️ Proteção LS DESIGN permanece ativa');
    });

})();
