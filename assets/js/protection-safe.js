/**
 * LS DESIGN - Proteção Segura (Sem Bloquear Imagens)
 * Sistema de proteção que não interfere no carregamento de imagens
 */

(function() {
    'use strict';
    
    // Aguardar carregamento completo das imagens antes de aplicar proteções
    function waitForImages() {
        return new Promise((resolve) => {
            const images = document.querySelectorAll('img');
            let loadedCount = 0;
            const totalImages = images.length;
            
            if (totalImages === 0) {
                resolve();
                return;
            }
            
            function checkComplete() {
                loadedCount++;
                if (loadedCount >= totalImages) {
                    setTimeout(resolve, 500); // Aguardar mais um pouco
                }
            }
            
            images.forEach(img => {
                if (img.complete) {
                    checkComplete();
                } else {
                    img.addEventListener('load', checkComplete);
                    img.addEventListener('error', checkComplete);
                }
            });
            
            // Timeout de segurança
            setTimeout(resolve, 3000);
        });
    }
    
    // Proteção básica contra cópia
    function applyBasicProtection() {
        // Desabilitar clique direito
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
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
        
        // Desabilitar teclas de atalho
        document.addEventListener('keydown', function(e) {
            // Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+S, Ctrl+U, F12
            if (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 's' || e.key === 'u')) {
                e.preventDefault();
                return false;
            }
            
            // F12 (DevTools)
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }
        });
        
        console.log('🛡️ Proteção básica ativada (sem bloquear imagens)');
    }
    
    // Proteção específica para imagens (após carregamento)
    function protectImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Desabilitar clique direito apenas nas imagens
            img.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
            
            // Desabilitar arrastar imagens
            img.addEventListener('dragstart', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
            
            // Adicionar atributo para prevenir salvamento
            img.setAttribute('draggable', 'false');
            img.style.userSelect = 'none';
            img.style.webkitUserSelect = 'none';
            img.style.mozUserSelect = 'none';
            img.style.msUserSelect = 'none';
        });
        
        console.log(`🖼️ ${images.length} imagens protegidas`);
    }
    
    // Adicionar estilos de proteção
    function addProtectionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Proteção geral */
            * {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            
            /* Permitir seleção em inputs */
            input, textarea, [contenteditable="true"] {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
            
            /* Proteção extra para imagens */
            img {
                pointer-events: auto;
                -webkit-user-drag: none;
                -khtml-user-drag: none;
                -moz-user-drag: none;
                -o-user-drag: none;
                user-drag: none;
            }
            
            /* Desabilitar print screen */
            @media print {
                img { display: none !important; }
                .hide-print { display: none !important; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Console warnings
    function addConsoleWarnings() {
        console.clear();
        console.log('%c🛡️ LS DESIGN - Sistema de Proteção Ativo', 'color: #7c3aed; font-size: 16px; font-weight: bold;');
        console.log('%c⚠️ Este conteúdo é protegido por direitos autorais', 'color: #ef4444; font-size: 14px;');
        console.log('%c📧 Para uso comercial, entre em contato: contato@lsdesign.com.br', 'color: #22c55e; font-size: 12px;');
        
        // Limpar console periodicamente
        setInterval(() => {
            console.clear();
            console.log('%c🛡️ Conteúdo Protegido - LS DESIGN', 'color: #7c3aed; font-weight: bold;');
        }, 5000);
    }
    
    // Inicialização principal
    async function initSafeProtection() {
        console.log('🔄 Iniciando proteção segura...');
        
        // Aguardar imagens carregarem
        await waitForImages();
        console.log('✅ Imagens carregadas, aplicando proteções...');
        
        // Aplicar proteções
        addProtectionStyles();
        applyBasicProtection();
        protectImages();
        addConsoleWarnings();
        
        console.log('🛡️ Sistema de proteção segura ativo!');
    }
    
    // Executar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSafeProtection);
    } else {
        initSafeProtection();
    }
    
})();
