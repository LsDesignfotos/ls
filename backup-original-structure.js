/**
 * LS DESIGN - Backup da Estrutura Original
 * Cria backup dos nomes originais antes da renomeação
 */

const fs = require('fs');
const path = require('path');

// Função para criar backup da estrutura
function createBackup() {
    const structure = {};
    
    function scanDirectory(dirPath, relativePath = '') {
        const items = fs.readdirSync(dirPath);
        
        items.forEach(item => {
            const fullPath = path.join(dirPath, item);
            const itemRelativePath = path.join(relativePath, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                structure[itemRelativePath] = {
                    type: 'directory',
                    size: 0,
                    children: []
                };
                
                // Escanear recursivamente
                const children = scanDirectory(fullPath, itemRelativePath);
                structure[itemRelativePath].children = Object.keys(children);
            } else {
                structure[itemRelativePath] = {
                    type: 'file',
                    size: stat.size,
                    extension: path.extname(item),
                    modified: stat.mtime.toISOString()
                };
            }
        });
        
        return structure;
    }
    
    console.log('📋 Criando backup da estrutura original...');
    
    const projectRoot = process.cwd();
    scanDirectory(projectRoot);
    
    // Salvar backup
    const backupData = {
        timestamp: new Date().toISOString(),
        projectRoot: projectRoot,
        structure: structure,
        totalFiles: Object.keys(structure).filter(key => structure[key].type === 'file').length,
        totalDirectories: Object.keys(structure).filter(key => structure[key].type === 'directory').length
    };
    
    fs.writeFileSync('original-structure-backup.json', JSON.stringify(backupData, null, 2));
    
    console.log(`✅ Backup criado: original-structure-backup.json`);
    console.log(`📁 ${backupData.totalDirectories} pastas`);
    console.log(`📄 ${backupData.totalFiles} arquivos`);
    
    return backupData;
}

// Executar se chamado diretamente
if (require.main === module) {
    createBackup();
}

module.exports = { createBackup };
