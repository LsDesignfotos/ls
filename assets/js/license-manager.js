/**
 * LS DESIGN - Sistema de Licenciamento
 * Gerenciamento de licenças e autenticação de uso
 */

(function() {
    'use strict';
    
    const LICENSE_CONFIG = {
        // Configurações do sistema de licença
        apiEndpoint: 'https://api.lsdesign.com.br/license/verify', // Endpoint fictício
        licenseKey: null,
        domainFingerprint: null,
        lastVerification: null,
        verificationInterval: 24 * 60 * 60 * 1000, // 24 horas
        
        // Configurações de segurança
        encryptionKey: 'LS_DESIGN_2024_SECURE_KEY',
        allowedDomains: [
            'lsdesign.com.br',
            'www.lsdesign.com.br',
            'localhost',
            '127.0.0.1',
            'github.io'
        ]
    };

    // Gerar fingerprint único do domínio
    function generateDomainFingerprint() {
        const domain = window.location.hostname;
        const protocol = window.location.protocol;
        const port = window.location.port || (protocol === 'https:' ? '443' : '80');
        
        const fingerprint = btoa(`${domain}:${port}:${Date.now()}`);
        LICENSE_CONFIG.domainFingerprint = fingerprint;
        
        return fingerprint;
    }

    // Verificar licença local
    function checkLocalLicense() {
        try {
            const storedLicense = localStorage.getItem('ls_design_license');
            const storedVerification = localStorage.getItem('ls_design_last_verification');
            
            if (!storedLicense || !storedVerification) {
                return false;
            }
            
            const lastVerification = parseInt(storedVerification);
            const now = Date.now();
            
            // Verificar se a licença não expirou (24 horas)
            if (now - lastVerification > LICENSE_CONFIG.verificationInterval) {
                return false;
            }
            
            // Decodificar e verificar licença
            const licenseData = JSON.parse(atob(storedLicense));
            const currentDomain = window.location.hostname;
            
            return licenseData.domain === currentDomain && licenseData.valid === true;
            
        } catch (error) {
            console.warn('Erro ao verificar licença local:', error);
            return false;
        }
    }

    // Simular verificação de licença online (para demonstração)
    function verifyLicenseOnline(domain) {
        return new Promise((resolve) => {
            // Simular delay de rede
            setTimeout(() => {
                // Para demonstração, considerar domínios autorizados como válidos
                const isAuthorized = LICENSE_CONFIG.allowedDomains.some(allowedDomain => 
                    domain === allowedDomain || domain.endsWith('.' + allowedDomain)
                );
                
                if (isAuthorized) {
                    const licenseData = {
                        domain: domain,
                        valid: true,
                        expires: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 dias
                        features: ['full_access', 'pwa_enabled', 'custom_domain'],
                        licensee: 'LS DESIGN',
                        version: '1.0'
                    };
                    
                    resolve({ success: true, data: licenseData });
                } else {
                    resolve({ 
                        success: false, 
                        error: 'Domínio não autorizado',
                        message: 'Este domínio não possui licença válida para usar este template.'
                    });
                }
            }, 1000);
        });
    }

    // Salvar licença localmente
    function saveLicense(licenseData) {
        try {
            const encodedLicense = btoa(JSON.stringify(licenseData));
            localStorage.setItem('ls_design_license', encodedLicense);
            localStorage.setItem('ls_design_last_verification', Date.now().toString());
            
            LICENSE_CONFIG.licenseKey = encodedLicense;
            LICENSE_CONFIG.lastVerification = Date.now();
            
            return true;
        } catch (error) {
            console.error('Erro ao salvar licença:', error);
            return false;
        }
    }

    // Mostrar tela de licença inválida
    function showLicenseError(message) {
        const errorScreen = document.createElement('div');
        errorScreen.id = 'license-error-screen';
        errorScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: white;
            text-align: center;
        `;
        
        errorScreen.innerHTML = `
            <div style="max-width: 600px; padding: 3rem; background: rgba(255,255,255,0.1); border-radius: 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
                <div style="font-size: 4rem; margin-bottom: 2rem;">🔐</div>
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem; font-weight: 700;">Licença Necessária</h1>
                <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; line-height: 1.6;">
                    ${message || 'Este template é propriedade da LS DESIGN e requer uma licença válida para uso.'}
                </p>
                
                <div style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 15px; margin: 2rem 0; border-left: 4px solid #FFD700;">
                    <h3 style="margin-bottom: 1rem; color: #FFD700;">💡 Como Obter uma Licença?</h3>
                    <ul style="text-align: left; margin: 0; padding-left: 1.5rem; line-height: 1.8;">
                        <li>Entre em contato conosco via WhatsApp</li>
                        <li>Informe o domínio onde será usado</li>
                        <li>Receba sua licença personalizada</li>
                        <li>Suporte técnico incluso</li>
                    </ul>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem;">
                    <a href="https://wa.me/556198574343?text=Preciso%20de%20uma%20licen%C3%A7a%20para%20o%20template%20LS%20DESIGN" 
                       target="_blank"
                       style="
                           background: linear-gradient(135deg, #25D366, #128C7E);
                           color: white;
                           padding: 1rem 2rem;
                           border-radius: 50px;
                           text-decoration: none;
                           font-weight: 600;
                           font-size: 1.1rem;
                           display: inline-flex;
                           align-items: center;
                           gap: 0.5rem;
                           transition: all 0.3s ease;
                           box-shadow: 0 10px 30px rgba(37, 211, 102, 0.3);
                       "
                       onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 15px 40px rgba(37, 211, 102, 0.4)'"
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(37, 211, 102, 0.3)'">
                        💬 Solicitar Licença
                    </a>
                    
                    <a href="mailto:contato@lsdesign.com.br?subject=Licença%20Template%20LS%20DESIGN" 
                       style="
                           background: rgba(255,255,255,0.2);
                           color: white;
                           padding: 1rem 2rem;
                           border-radius: 50px;
                           text-decoration: none;
                           font-weight: 600;
                           font-size: 1.1rem;
                           display: inline-flex;
                           align-items: center;
                           gap: 0.5rem;
                           transition: all 0.3s ease;
                           border: 2px solid rgba(255,255,255,0.3);
                       "
                       onmouseover="this.style.background='rgba(255,255,255,0.3)'"
                       onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                        📧 E-mail
                    </a>
                </div>
                
                <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.2); opacity: 0.7;">
                    <p style="font-size: 0.9rem; margin: 0;">
                        Domínio atual: <strong>${window.location.hostname}</strong><br>
                        Fingerprint: <strong>${LICENSE_CONFIG.domainFingerprint || 'N/A'}</strong>
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(errorScreen);
        
        // Bloquear scroll
        document.body.style.overflow = 'hidden';
    }

    // Mostrar indicador de licença válida
    function showLicenseValid() {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00C851, #007E33);
            color: white;
            padding: 0.75rem 1rem;
            border-radius: 25px;
            font-family: 'Inter', sans-serif;
            font-size: 0.8rem;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0, 200, 81, 0.3);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        indicator.innerHTML = '🛡️ Licenciado por LS DESIGN';
        document.body.appendChild(indicator);
        
        // Fade in
        setTimeout(() => {
            indicator.style.opacity = '1';
        }, 100);
        
        // Auto hide após 5 segundos
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(indicator)) {
                    document.body.removeChild(indicator);
                }
            }, 300);
        }, 5000);
    }

    // Verificação principal de licença
    async function verifyLicense() {
        const currentDomain = window.location.hostname;
        
        // Gerar fingerprint
        generateDomainFingerprint();
        
        // Verificar licença local primeiro
        if (checkLocalLicense()) {
            console.log('✅ Licença local válida');
            showLicenseValid();
            return true;
        }
        
        console.log('🔍 Verificando licença online...');
        
        try {
            // Verificar licença online
            const result = await verifyLicenseOnline(currentDomain);
            
            if (result.success) {
                // Salvar licença válida
                saveLicense(result.data);
                console.log('✅ Licença online verificada e salva');
                showLicenseValid();
                return true;
            } else {
                console.warn('❌ Licença inválida:', result.error);
                showLicenseError(result.message);
                return false;
            }
            
        } catch (error) {
            console.error('❌ Erro na verificação de licença:', error);
            
            // Em caso de erro de rede, verificar se há licença local válida
            const hasValidLocal = checkLocalLicense();
            if (!hasValidLocal) {
                showLicenseError('Não foi possível verificar a licença. Verifique sua conexão com a internet.');
                return false;
            }
            
            return true;
        }
    }

    // Monitoramento de tentativas de bypass
    function startLicenseMonitoring() {
        // Verificar se elementos de licença foram removidos
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    const errorScreen = document.getElementById('license-error-screen');
                    if (!errorScreen && !checkLocalLicense()) {
                        console.warn('🚫 Tentativa de bypass de licença detectada!');
                        verifyLicense();
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
            if (!checkLocalLicense()) {
                console.warn('🔄 Reverificando licença...');
                verifyLicense();
            }
        }, 60000); // Verificar a cada minuto
    }

    // Inicializar sistema de licenciamento
    function initLicenseSystem() {
        console.log('🔐 Iniciando sistema de licenciamento LS DESIGN...');
        
        // Verificar licença imediatamente
        verifyLicense().then(isValid => {
            if (isValid) {
                // Iniciar monitoramento
                startLicenseMonitoring();
                
                // Adicionar marca de licença válida
                document.documentElement.setAttribute('data-licensed', 'ls-design-valid');
                
                console.log('✅ Sistema de licenciamento ativo');
            } else {
                console.warn('❌ Licença inválida - site bloqueado');
            }
        });
    }

    // Executar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLicenseSystem);
    } else {
        initLicenseSystem();
    }

    // Expor função para verificação manual (apenas para debug)
    window.LS_LICENSE = {
        verify: verifyLicense,
        check: checkLocalLicense,
        domain: () => window.location.hostname,
        fingerprint: () => LICENSE_CONFIG.domainFingerprint
    };

})();
