# 🔐 Sistema de Proteção de Arquivos para GitHub - LS DESIGN

## 📋 Como Usar

### 1️⃣ **Antes de Enviar para o GitHub**

Execute o script de renomeação para ofuscar todos os arquivos:

```bash
node rename-for-github.js
```

**O que acontece:**
- ✅ Pastas renomeadas: `assets` → `a7f3d9e2`
- ✅ Arquivos JS: `particles.js` → `x7y3z9w2.js`  
- ✅ Arquivos CSS: `styles-extra.css` → `m1n5k2g7.css`
- ✅ Imagens: `pizza-com-presunto-e-ovos.png` → `img_a1b2c3d4e5f6.png`

### 2️⃣ **Resultado no GitHub**

Outras pessoas verão nomes "bugados":
```
📁 a7f3d9e2/
  📁 c9d5a2b7/
    📄 x7y3z9w2.js
    📄 y8x4a1z6.js
  📁 b8e4c1f6/
    📄 m1n5k2g7.css
  📄 img_a1b2c3d4e5f6.png
```

### 3️⃣ **No Seu Site (Funciona Normal)**

O mapeador converte automaticamente:
- 🌐 **Site mostra**: `assets/js/particles.js`
- 💾 **GitHub tem**: `a7f3d9e2/c9d5a2b7/x7y3z9w2.js`
- ✅ **Funciona perfeitamente** para visitantes

## 🛡️ Proteções Ativas

### **Nomes Ofuscados**
- Pastas com códigos aleatórios
- Arquivos com nomes embaralhados  
- Impossível identificar conteúdo pelos nomes

### **Mapeamento Inteligente**
- Conversão automática de URLs
- Site funciona com nomes originais
- Interceptação de todas as requisições

### **Proteção Adicional**
- Clique direito bloqueado
- Cópia de código impedida
- Download de imagens bloqueado
- DevTools com blur nas imagens

## 📂 Estrutura de Arquivos

```
📁 Projeto/
├── 📄 rename-for-github.js          # Script de renomeação
├── 📄 backup-original-structure.js  # Backup da estrutura
├── 📄 package.json                  # Configuração Node.js
├── 📄 INSTRUCOES-GITHUB.md         # Este arquivo
└── 📁 a7f3d9e2/                    # assets/ renomeada
    ├── 📁 c9d5a2b7/                # js/ renomeada  
    │   ├── 📄 x7y3z9w2.js          # particles.js
    │   ├── 📄 github-file-mapper.js # Mapeador (nome real)
    │   └── 📄 w1z6c3y8.js          # basic-protection.js
    └── 📁 b8e4c1f6/                # css/ renomeada
        └── 📄 m1n5k2g7.css         # styles-extra.css
```

## ⚙️ Scripts Disponíveis

```bash
# Renomear arquivos para GitHub
npm run rename-files

# Criar backup da estrutura original  
npm run backup-original

# Restaurar nomes originais (futuro)
npm run restore-files
```

## 🚀 Fluxo de Trabalho

1. **Desenvolvimento Local**: Use nomes originais normalmente
2. **Antes do GitHub**: Execute `node rename-for-github.js`
3. **Commit & Push**: Envie arquivos com nomes ofuscados
4. **Site Online**: Funciona automaticamente com mapeador

## 🔍 Debug (Apenas Localhost)

No localhost, você verá:
- 🗺️ Contador de mapeamentos ativos
- 📊 Relatório de conversões no console
- 🔄 Log de URLs convertidas

## ⚠️ Importante

- ✅ **Sempre execute o backup** antes da renomeação
- ✅ **Teste localmente** antes de enviar ao GitHub  
- ✅ **Mantenha o mapeador** sempre primeiro nos scripts
- ❌ **Não edite** o mapeamento manualmente
- ❌ **Não remova** o `github-file-mapper.js`

## 🎯 Resultado Final

**Para você**: Site funciona normalmente com nomes legíveis
**Para outros**: Arquivos com nomes incompreensíveis no GitHub
**Proteção**: Dificulta cópia, identificação e uso não autorizado

---
*Sistema desenvolvido para LS DESIGN - Proteção inteligente de assets*
