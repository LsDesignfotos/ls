/**
 * LS DESIGN - Detector Anti-Roubo Avançado
 * Sistema de detecção de uso não autorizado e tentativas de bypass
 */

(function() {
    'use strict';
    
    const DETECTOR_CONFIG = {
        // Configurações de detecção
        checkInterval: 5000, // 5 segundos
        reportEndpoint: 'https://api.lsdesign.com.br/security/report',
        maxViolations: 3,
        currentViolations: 0,
        
        // Assinaturas únicas do LS DESIGN
        signatures: [
            'LS DESIGN',
            'lsdesign.com.br',
            'ls-design-security',
            'protected-by-ls-design'
        ],
        
        // Elementos que devem estar presentes
        requiredElements: [
            'data-protected',
            'data-licensed',
            'X-Protected-By',
            'security-protection.js'
        ]
    };

    // Detectar modificações suspeitas no código
    function detectCodeModification() {
        const violations = [];
        
        // Verificar se assinaturas foram removidas
        const htmlContent = document.documentElement.outerHTML;
        const missingSignatures = DETECTOR_CONFIG.signatures.filter(signature => 
            !htmlContent.toLowerCase().includes(signature.toLowerCase())
        );
        
        if (missingSignatures.length > 0) {
            violations.push({
                type: 'signature_removal',
                details: `Assinaturas removidas: ${missingSignatures.join(', ')}`,
                severity: 'high'
            });
        }
        
        // Verificar elementos de proteção
        const missingElements = DETECTOR_CONFIG.requiredElements.filter(element => {
            if (element.startsWith('data-')) {
                return !document.querySelector(`[${element}]`);
            } else if (element.startsWith('X-')) {
                // Verificar headers (simulado)
                return false; // Headers não podem ser verificados via JS
            } else {
                return !document.querySelector(`script[src*="${element}"]`);
            }
        });
        
        if (missingElements.length > 0) {
            violations.push({
                type: 'protection_removal',
                details: `Elementos de proteção removidos: ${missingElements.join(', ')}`,
                severity: 'critical'
            });
        }
        
        return violations;
    }

    // Detectar tentativas de bypass
    function detectBypassAttempts() {
        const violations = [];
        
        // Verificar se console foi limpo suspeitas vezes
        let consoleCleared = false;
        const originalClear = console.clear;
        console.clear = function() {
            consoleCleared = true;
            originalClear.apply(console, arguments);
        };
        
        // Detectar override de funções de segurança
        if (window.LS_LICENSE && typeof window.LS_LICENSE.verify !== 'function') {
            violations.push({
                type: 'function_override',
                details: 'Função de licença foi modificada',
                severity: 'critical'
            });
        }
        
        // Verificar modificações no localStorage
        try {
            const licenseData = localStorage.getItem('ls_design_license');
            if (licenseData) {
                const decoded = JSON.parse(atob(licenseData));
                if (!decoded.domain || decoded.domain !== window.location.hostname) {
                    violations.push({
                        type: 'license_tampering',
                        details: 'Dados de licença foram alterados',
                        severity: 'critical'
                    });
                }
            }
        } catch (error) {
            violations.push({
                type: 'license_corruption',
                details: 'Dados de licença corrompidos',
                severity: 'high'
            });
        }
        
        return violations;
    }

    // Detectar ferramentas de desenvolvedor avançadas
    function detectAdvancedDevTools() {
        const violations = [];
        
        // Detectar extensões de desenvolvedor
        if (window.devtools || window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
            violations.push({
                type: 'dev_tools_extension',
                details: 'Extensões de desenvolvedor detectadas',
                severity: 'medium'
            });
        }
        
        // Detectar debug mode
        if (window.location.search.includes('debug') || window.location.hash.includes('debug')) {
            violations.push({
                type: 'debug_mode',
                details: 'Modo debug ativado',
                severity: 'medium'
            });
        }
        
        // Detectar performance timing suspeito
        if (performance.now() > 10000) { // Mais de 10 segundos para carregar
            violations.push({
                type: 'suspicious_timing',
                details: 'Tempo de carregamento suspeito',
                severity: 'low'
            });
        }
        
        return violations;
    }

    // Detectar clonagem do site
    function detectSiteCloning() {
        const violations = [];
        
        // Verificar se há múltiplas instâncias
        if (window.LS_DESIGN_INSTANCES) {
            window.LS_DESIGN_INSTANCES++;
        } else {
            window.LS_DESIGN_INSTANCES = 1;
        }
        
        if (window.LS_DESIGN_INSTANCES > 1) {
            violations.push({
                type: 'multiple_instances',
                details: 'Múltiplas instâncias detectadas',
                severity: 'high'
            });
        }
        
        // Verificar estrutura de arquivos suspeita
        const scripts = Array.from(document.querySelectorAll('script[src]'));
        const localScripts = scripts.filter(script => 
            !script.src.startsWith('http') && script.src.includes('/')
        );
        
        if (localScripts.length === 0 && scripts.length > 0) {
            violations.push({
                type: 'suspicious_structure',
                details: 'Estrutura de arquivos suspeita',
                severity: 'medium'
            });
        }
        
        return violations;
    }

    // Coletar informações do ambiente
    function collectEnvironmentInfo() {
        return {
            domain: window.location.hostname,
            url: window.location.href,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookiesEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine,
            connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown'
        };
    }

    // Reportar violação
    function reportViolation(violations) {
        const report = {
            violations: violations,
            environment: collectEnvironmentInfo(),
            severity: violations.some(v => v.severity === 'critical') ? 'critical' : 
                     violations.some(v => v.severity === 'high') ? 'high' : 'medium',
            fingerprint: btoa(`${window.location.hostname}:${Date.now()}`),
            version: '1.0'
        };
        
        // Log local
        console.warn('🚨 VIOLAÇÃO DE SEGURANÇA DETECTADA:', report);
        
        // Simular envio para servidor (em produção, usar fetch real)
        if (DETECTOR_CONFIG.reportEndpoint) {
            console.log('📡 Enviando relatório de segurança...');
            // fetch(DETECTOR_CONFIG.reportEndpoint, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(report)
            // }).catch(console.error);
        }
        
        // Incrementar contador de violações
        DETECTOR_CONFIG.currentViolations++;
        
        // Ação baseada na severidade
        if (report.severity === 'critical' || DETECTOR_CONFIG.currentViolations >= DETECTOR_CONFIG.maxViolations) {
            triggerSecurityLockdown();
        } else {
            showSecurityWarning(violations);
        }
    }

    // Ativar bloqueio de segurança
    function triggerSecurityLockdown() {
        console.error('🔒 BLOQUEIO DE SEGURANÇA ATIVADO!');
        
        // Criar tela de bloqueio
        const lockdownScreen = document.createElement('div');
        lockdownScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #ff0000, #cc0000);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            font-family: 'Inter', monospace;
            color: white;
            text-align: center;
        `;
        
        lockdownScreen.innerHTML = `
            <div style="max-width: 600px; padding: 3rem;">
                <div style="font-size: 5rem; margin-bottom: 2rem; animation: pulse 1s infinite;">🚨</div>
                <h1 style="font-size: 3rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                    ACESSO BLOQUEADO
                </h1>
                <p style="font-size: 1.3rem; margin-bottom: 2rem; opacity: 0.9;">
                    Múltiplas violações de segurança detectadas.<br>
                    Este site é protegido por direitos autorais da LS DESIGN.
                </p>
                <div style="background: rgba(0,0,0,0.3); padding: 2rem; border-radius: 10px; margin: 2rem 0;">
                    <h3>📋 Violações Detectadas:</h3>
                    <p>• Modificação não autorizada do código</p>
                    <p>• Tentativa de bypass de proteção</p>
                    <p>• Uso em domínio não licenciado</p>
                </div>
                <p style="font-size: 1rem; opacity: 0.8;">
                    ID do Incidente: ${btoa(Date.now().toString()).substr(0, 8)}<br>
                    Timestamp: ${new Date().toLocaleString()}
                </p>
            </div>
            <style>
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            </style>
        `;
        
        document.body.innerHTML = '';
        document.body.appendChild(lockdownScreen);
        
        // Bloquear funcionalidades
        document.body.style.overflow = 'hidden';
        window.onbeforeunload = () => 'Site bloqueado por violação de segurança';
    }

    // Mostrar aviso de segurança
    function showSecurityWarning(violations) {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ff9500, #ff6b00);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            z-index: 999999;
            box-shadow: 0 10px 30px rgba(255, 149, 0, 0.3);
            animation: slideDown 0.3s ease-out;
            max-width: 90vw;
            text-align: center;
        `;
        
        warning.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 1.5rem;">⚠️</span>
                <div>
                    <div style="font-weight: 700;">Atividade Suspeita Detectada</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">${violations.length} violação(ões) de segurança</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(warning);
        
        setTimeout(() => {
            if (document.body.contains(warning)) {
                warning.style.animation = 'slideUp 0.3s ease-in';
                setTimeout(() => {
                    document.body.removeChild(warning);
                }, 300);
            }
        }, 5000);
    }

    // Adicionar estilos de animação
    function addDetectorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateX(-50%) translateY(0); opacity: 1; }
                to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Executar detecção completa
    function runSecurityScan() {
        const allViolations = [
            ...detectCodeModification(),
            ...detectBypassAttempts(),
            ...detectAdvancedDevTools(),
            ...detectSiteCloning()
        ];
        
        if (allViolations.length > 0) {
            reportViolation(allViolations);
        }
        
        return allViolations;
    }

    // Inicializar detector
    function initAntiTheftDetector() {
        console.log('🕵️ Iniciando detector anti-roubo LS DESIGN...');
        
        addDetectorStyles();
        
        // Executar primeira verificação
        setTimeout(() => {
            runSecurityScan();
        }, 2000);
        
        // Verificações periódicas
        setInterval(() => {
            runSecurityScan();
        }, DETECTOR_CONFIG.checkInterval);
        
        // Monitorar eventos suspeitos
        document.addEventListener('keydown', function(e) {
            // Detectar combinações suspeitas
            if (e.ctrlKey && e.shiftKey && e.altKey) {
                reportViolation([{
                    type: 'suspicious_keypress',
                    details: 'Combinação de teclas suspeita detectada',
                    severity: 'medium'
                }]);
            }
        });
        
        // Monitorar mudanças no foco
        let focusLostCount = 0;
        window.addEventListener('blur', () => {
            focusLostCount++;
            if (focusLostCount > 5) {
                reportViolation([{
                    type: 'excessive_focus_loss',
                    details: 'Perda excessiva de foco detectada',
                    severity: 'low'
                }]);
            }
        });
        
        console.log('✅ Detector anti-roubo ativo');
    }

    // Executar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAntiTheftDetector);
    } else {
        initAntiTheftDetector();
    }

    // Expor para debug (apenas em desenvolvimento)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.LS_DETECTOR = {
            scan: runSecurityScan,
            violations: () => DETECTOR_CONFIG.currentViolations,
            lockdown: triggerSecurityLockdown
        };
    }

})();
