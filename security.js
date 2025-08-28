// LS DESIGN - Client-side Security Enhancements
// Proteções adicionais contra ataques comuns

(function() {
    'use strict';
    
    // Disable right-click context menu (basic protection)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable F12, Ctrl+Shift+I, Ctrl+U (basic dev tools protection)
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
    });
    
    // Disable text selection (optional - can be removed if needed)
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            return false;
        }
    });
    
    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Console warning
    console.log('%c⚠️ AVISO DE SEGURANÇA', 'color: red; font-size: 20px; font-weight: bold;');
    console.log('%cEste site é protegido por medidas de segurança. Qualquer tentativa de acesso não autorizado será registrada.', 'color: orange; font-size: 14px;');
    console.log('%c© 2025 LS DESIGN - Todos os direitos reservados.', 'color: #666; font-size: 12px;');
    
    // Basic bot detection
    const startTime = Date.now();
    setTimeout(function() {
        const loadTime = Date.now() - startTime;
        if (loadTime < 100) {
            console.warn('Possível comportamento automatizado detectado');
        }
    }, 100);
    
    // Detect if DevTools is open (basic detection)
    let devtools = {open: false, orientation: null};
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
            if (!devtools.open) {
                devtools.open = true;
                console.clear();
                console.log('%c🛡️ Ferramentas de desenvolvedor detectadas', 'color: red; font-size: 16px;');
            }
        } else {
            devtools.open = false;
        }
    }, 500);
    
    // Sanitize any user inputs (if forms are added later)
    function sanitizeInput(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    // Export sanitize function globally
    window.sanitizeInput = sanitizeInput;
    
    // Prevent iframe embedding (additional protection)
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
    
})();
