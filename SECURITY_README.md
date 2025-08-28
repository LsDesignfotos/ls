# 🛡️ LS DESIGN - Sistema de Proteção de Código

## Visão Geral

Este sistema implementa múltiplas camadas de proteção para evitar o uso não autorizado do código do site LS DESIGN. O sistema é especialmente importante quando hospedado no GitHub Pages ou outros serviços públicos.

## 🔐 Componentes de Segurança

### 1. **Security Protection** (`security-protection.js`)
- **Verificação de domínio autorizado**: Bloqueia o site se executado em domínios não autorizados
- **Proteção contra DevTools**: Detecta e bloqueia ferramentas de desenvolvedor
- **Proteção contra clique direito**: Desabilita menu de contexto
- **Proteção contra cópia**: Impede seleção e cópia de texto
- **Ofuscação de código fonte**: Adiciona marcas d'água invisíveis

### 2. **License Manager** (`license-manager.js`)
- **Sistema de licenciamento**: Verifica licenças válidas para domínios
- **Verificação online/offline**: Sistema híbrido de verificação
- **Tela de bloqueio**: Interface profissional para domínios não licenciados
- **Armazenamento seguro**: Licenças criptografadas no localStorage

### 3. **Anti-Theft Detector** (`anti-theft-detector.js`)
- **Detecção de modificações**: Monitora alterações no código
- **Detecção de bypass**: Identifica tentativas de contornar proteções
- **Monitoramento contínuo**: Verificações periódicas de integridade
- **Sistema de relatórios**: Log de violações de segurança

### 4. **Proteção de Servidor** (`.htaccess`)
- **Proteção contra hotlinking**: Impede uso de imagens em outros sites
- **Bloqueio de bots**: Bloqueia ferramentas de scraping
- **Headers de segurança**: Configurações avançadas de segurança
- **Rate limiting**: Proteção contra ataques DDoS

## ⚙️ Configuração

### Domínios Autorizados
Para adicionar novos domínios autorizados, edite os arquivos:

```javascript
// Em security-protection.js
authorizedDomains: [
    'lsdesign.com.br',
    'www.lsdesign.com.br',
    'seudominio.com.br',  // Adicione aqui
    'localhost',
    '127.0.0.1',
    'github.io'
]
```

### Chaves de Licença
Altere as chaves padrão para suas próprias chaves únicas:

```javascript
// Em license-manager.js
licenseKey: 'SUA_CHAVE_UNICA_AQUI_2024',
encryptionKey: 'SUA_CHAVE_DE_CRIPTOGRAFIA_AQUI'
```

## 🚨 Níveis de Proteção

### **Nível 1 - Básico**
- Verificação de domínio
- Proteção contra clique direito
- Desabilitação de DevTools

### **Nível 2 - Intermediário**
- Sistema de licenciamento
- Detecção de modificações
- Proteção contra cópia

### **Nível 3 - Avançado**
- Monitoramento contínuo
- Sistema de relatórios
- Bloqueio automático

### **Nível 4 - Crítico**
- Lockdown completo do site
- Tela de bloqueio permanente
- Log de incidentes de segurança

## 📋 Como Funciona

1. **Carregamento**: Scripts de segurança carregam primeiro
2. **Verificação**: Sistema verifica domínio e licença
3. **Monitoramento**: Detecção contínua de atividades suspeitas
4. **Ação**: Bloqueio automático em caso de violação

## 🔧 Personalização

### Mensagens de Erro
Edite as mensagens em cada arquivo de configuração:

```javascript
messages: {
    unauthorized: 'Sua mensagem personalizada aqui',
    devtools: 'Sua mensagem para DevTools',
    // ... outras mensagens
}
```

### Intervalos de Verificação
Ajuste a frequência das verificações:

```javascript
verificationInterval: 24 * 60 * 60 * 1000, // 24 horas
checkInterval: 5000, // 5 segundos
```

## 🌐 Hospedagem no GitHub

### GitHub Pages
O sistema está configurado para funcionar no GitHub Pages:

```javascript
authorizedDomains: [
    'github.io',  // Permite GitHub Pages
    'seuusuario.github.io'
]
```

### Configuração do Repositório
1. Mantenha o repositório **privado** se possível
2. Use GitHub Actions para build automático
3. Configure branch protection rules
4. Ative GitHub Security Advisories

## ⚠️ Limitações

### O que NÃO pode ser protegido 100%:
- **Código JavaScript**: Sempre visível no navegador
- **Arquivos estáticos**: CSS, imagens podem ser baixados
- **Usuários avançados**: Podem desabilitar JavaScript

### O que É efetivamente protegido:
- **Uso casual**: Impede cópia simples do código
- **Bots e scrapers**: Bloqueados pelo .htaccess
- **Hotlinking**: Imagens protegidas contra uso externo
- **Domínios não autorizados**: Site não funciona fora dos domínios permitidos

## 🛠️ Manutenção

### Verificações Regulares
- Monitore logs de segurança
- Atualize listas de domínios autorizados
- Renove licenças quando necessário

### Atualizações
- Mantenha as chaves de segurança atualizadas
- Revise configurações periodicamente
- Teste em diferentes ambientes

## 📞 Suporte

Para questões sobre licenciamento ou configuração:

- **WhatsApp**: +55 61 98574343
- **E-mail**: contato@lsdesign.com.br
- **Site**: https://lsdesign.com.br

## 📄 Licença

Este sistema de proteção é propriedade da **LS DESIGN** e está protegido por direitos autorais. O uso não autorizado é proibido.

---

**⚠️ IMPORTANTE**: Este sistema oferece proteção contra uso casual e não autorizado, mas não é 100% inviolável. Para proteção máxima, considere soluções server-side adicionais.
