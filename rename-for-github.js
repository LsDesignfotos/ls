/**
 * LS DESIGN - Script de Renomeação para GitHub
 * Renomeia arquivos e pastas fisicamente para nomes ofuscados
 * Node.js script - Execute com: node rename-for-github.js
 */

const fs = require('fs');
const path = require('path');

// Mapeamento de nomes originais para nomes ofuscados
const FILE_MAPPING = {
    // Pastas
    'assets': 'a7f3d9e2',
    'css': 'b8e4c1f6', 
    'js': 'c9d5a2b7',
    'images': 'd1f6e3c8',
    'antes-depois': 'e2a7f4d9',
    'portfolio': 'f3b8e5c1',
    'hero': 'a4c9d6f2',
    
    // Arquivos JavaScript
    'particles.js': 'x7y3z9w2.js',
    'before-after.js': 'y8x4a1z6.js',
    'faq.js': 'z9y5b2x7.js',
    'basic-protection.js': 'w1z6c3y8.js',
    'file-name-protection.js': 'v2w7d4z9.js',
    'advanced-image-protection.js': 'u3v8e5a1.js',
    'upload-handler.js': 't4u9f6b2.js',
    'image-optimizer.js': 's5t1g7c3.js',
    'debounce-helper.js': 'r6s2h8d4.js',
    'pwa-manager.js': 'q7r3i9e5.js',
    'performance-optimizer.js': 'p8q4j1f6.js',
    
    // Arquivos CSS
    'styles-extra.css': 'm1n5k2g7.css',
    'mobile-optimizations.css': 'l2m6l3h8.css',
    'pwa-styles.css': 'k3l7m4i9.css',
    'accessibility.css': 'j4k8n5j1.css',
    
    // Imagens - Hero
    'pizza-com-presunto-e-ovos.png': 'img_a1b2c3d4e5f6.png',
    
    // Imagens - Antes/Depois
    'FEIJOADAANTES.jpg': 'img_b2c3d4e5f6g7.jpg',
    'FEIJOADADEPOIS.png': 'img_c3d4e5f6g7h8.png',
    '1.png': 'img_d4e5f6g7h8i9.png',
    '2.png': 'img_e5f6g7h8i9j1.png',
    '3.png': 'img_f6g7h8i9j1k2.png',
    'Pizza Antes.jpeg': 'img_g7h8i9j1k2l3.jpeg',
    'pizza Depois.png': 'img_h8i9j1k2l3m4.png',
    'b537e1c6-17c2-4ad3-9402-29bbaeb9b4df.png': 'img_i9j1k2l3m4n5.png',
    
    // Imagens - Portfolio
    'chatgpt-image-21-de-ago.-de-2025-23_56_46.png': 'img_j1k2l3m4n5o6.png',
    'chatgpt-image-24-de-ago.-de-2025-09_19_57.png': 'img_k2l3m4n5o6p7.png',
    'chatgpt-image-26-de-ago.-de-2025-21_59_39.png': 'img_l3m4n5o6p7q8.png',
    
    // Outros arquivos
    'favicon.svg': 'ico_a7f3d9e2b8c1.svg',
    'site.webmanifest': 'app_b8e4c1f6a9d2.webmanifest',
    'sw.js': 'wrk_c9d5a2b7f3e8.js',
    'og-image.jpg': 'seo_d1f6e3c8a4b9.jpg',
    'icon-192.png': 'ico_e2a7f4d9b5c1.png',
    'icon-512.png': 'ico_f3b8e5c1d6a2.png'
};

// Função para renomear arquivo ou pasta
function renameItem(oldPath, newPath) {
    try {
        if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
            console.log(`✅ Renomeado: ${oldPath} → ${newPath}`);
            return true;
        } else {
            console.log(`⚠️  Não encontrado: ${oldPath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Erro ao renomear ${oldPath}:`, error.message);
        return false;
    }
}

// Função para renomear recursivamente
function renameRecursively(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    // Primeiro renomear arquivos
    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isFile() && FILE_MAPPING[item]) {
            const newPath = path.join(dirPath, FILE_MAPPING[item]);
            renameItem(fullPath, newPath);
        }
    });
    
    // Depois renomear pastas (para não quebrar os caminhos)
    const updatedItems = fs.readdirSync(dirPath);
    updatedItems.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && FILE_MAPPING[item]) {
            const newPath = path.join(dirPath, FILE_MAPPING[item]);
            renameItem(fullPath, newPath);
            
            // Continuar renomeando dentro da pasta renomeada
            renameRecursively(newPath);
        } else if (stat.isDirectory()) {
            // Continuar renomeando dentro de pastas não mapeadas
            renameRecursively(fullPath);
        }
    });
}

// Função principal
function main() {
    console.log('🔄 Iniciando renomeação de arquivos para GitHub...\n');
    
    const projectRoot = process.cwd();
    console.log(`📁 Diretório: ${projectRoot}\n`);
    
    // Verificar se já existem arquivos renomeados
    const items = fs.readdirSync(projectRoot);
    const alreadyRenamed = items.some(item => 
        Object.values(FILE_MAPPING).includes(item) || 
        item.startsWith('img_') || 
        item.startsWith('ico_') || 
        item.startsWith('app_') || 
        item.startsWith('wrk_')
    );
    
    if (alreadyRenamed) {
        console.log('⚠️  Alguns arquivos já foram renomeados anteriormente.');
        console.log('📋 Arquivos com nomes ofuscados encontrados:');
        items.forEach(item => {
            if (Object.values(FILE_MAPPING).includes(item) || 
                item.startsWith('img_') || 
                item.startsWith('ico_') || 
                item.startsWith('app_') || 
                item.startsWith('wrk_')) {
                console.log(`   ✅ ${item}`);
            }
        });
        console.log('\n✅ Sistema já configurado para GitHub!');
        return;
    }
    
    // Renomear recursivamente
    renameRecursively(projectRoot);
    
    console.log('\n✅ Renomeação concluída!');
    console.log('📝 Agora execute o script de mapeamento para atualizar as referências.');
}

// Executar se chamado diretamente
if (require.main === module) {
    main();
}

module.exports = { FILE_MAPPING, renameItem, renameRecursively };
