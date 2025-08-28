// Upload Handler com Drag & Drop e WhatsApp Integration
class UploadHandler {
  constructor() {
    this.uploadArea = document.getElementById('uploadArea');
    this.fileInput = document.getElementById('fileInput');
    this.uploadPreview = document.getElementById('uploadPreview');
    this.previewGrid = document.getElementById('previewGrid');
    this.sendButton = document.getElementById('sendToWhatsApp');
    this.selectedFiles = [];
    this.customerName = '';
    this.customerPhone = '';
    
    this.init();
  }
  
  init() {
    // Drag & Drop events
    this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
    this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
    this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
    
    // File input change
    this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
    
    // WhatsApp send button
    this.sendButton.addEventListener('click', this.sendToWhatsApp.bind(this));
  }
  
  handleDragOver(e) {
    e.preventDefault();
    this.uploadArea.classList.add('dragover');
  }
  
  handleDragLeave(e) {
    e.preventDefault();
    this.uploadArea.classList.remove('dragover');
  }
  
  handleDrop(e) {
    e.preventDefault();
    this.uploadArea.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    this.processFiles(files);
  }
  
  handleFileSelect(e) {
    const files = Array.from(e.target.files);
    this.processFiles(files);
  }
  
  processFiles(files) {
    // Filtrar apenas imagens
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      this.showNotification('Por favor, selecione apenas arquivos de imagem (JPG, PNG, etc.)', 'error');
      return;
    }
    
    this.selectedFiles = [...this.selectedFiles, ...imageFiles];
    this.displayPreview();
    this.showPreviewSection();
    this.showNotification(`${imageFiles.length} imagem(ns) adicionada(s) com sucesso!`, 'success');
  }
  
  displayPreview() {
    this.previewGrid.innerHTML = '';
    
    this.selectedFiles.forEach((file, index) => {
      const previewItem = document.createElement('div');
      previewItem.className = 'preview-item';
      previewItem.dataset.index = index;
      
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        img.style.cssText = `
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
          transition: transform 0.2s ease;
        `;
        img.onload = () => URL.revokeObjectURL(img.src); // Limpar memória
        previewItem.appendChild(img);
        
        // Nome do arquivo
        const fileName = document.createElement('div');
        fileName.className = 'file-name';
        fileName.textContent = file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name;
        fileName.style.cssText = `
          font-size: 0.8rem;
          color: var(--muted);
          margin-top: 0.5rem;
          text-align: center;
        `;
        previewItem.appendChild(fileName);
        
        // Tamanho do arquivo
        const fileSize = document.createElement('div');
        fileSize.className = 'file-size';
        fileSize.textContent = this.formatFileSize(file.size);
        fileSize.style.cssText = `
          font-size: 0.7rem;
          color: var(--muted);
          text-align: center;
          opacity: 0.8;
        `;
        previewItem.appendChild(fileSize);
      }
      
      // Botão de remover
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.innerHTML = '×';
      removeBtn.title = 'Remover imagem';
      removeBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: rgba(239, 68, 68, 0.9);
        color: white;
        border: none;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      `;
      removeBtn.addEventListener('click', () => this.removeFile(index));
      removeBtn.addEventListener('mouseenter', () => {
        removeBtn.style.background = 'rgba(239, 68, 68, 1)';
        removeBtn.style.transform = 'scale(1.1)';
      });
      removeBtn.addEventListener('mouseleave', () => {
        removeBtn.style.background = 'rgba(239, 68, 68, 0.9)';
        removeBtn.style.transform = 'scale(1)';
      });
      previewItem.appendChild(removeBtn);
      
      // Estilo do item de preview
      previewItem.style.cssText = `
        position: relative;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
      `;
      
      this.previewGrid.appendChild(previewItem);
    });
    
    // Esconder preview se não houver arquivos
    if (this.selectedFiles.length === 0) {
      this.uploadPreview.style.display = 'none';
    }
  }
  
  removeFile(index) {
    // Remover arquivo da lista
    this.selectedFiles.splice(index, 1);
    
    // Atualizar preview
    this.displayPreview();
    
    // Limpar input file para permitir re-seleção dos mesmos arquivos
    this.fileInput.value = '';
    
    // Feedback visual
    this.showNotification('Imagem removida com sucesso!', 'info');
  }
  
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
      success: 'linear-gradient(135deg, #22c55e, #16a34a)',
      error: 'linear-gradient(135deg, #ef4444, #dc2626)',
      info: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      warning: 'linear-gradient(135deg, #f59e0b, #d97706)'
    };
    
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️'
    };
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
    `;
    notification.innerHTML = `${icons[type]} ${message}`;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
  
  showCustomerForm() {
    const modal = document.createElement('div');
    modal.className = 'customer-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(5px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: var(--bg1);
      border-radius: 16px;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `;
    
    modalContent.innerHTML = `
      <h3 style="color: var(--text); margin-bottom: 1.5rem; text-align: center;">
        📝 Dados para Organização
      </h3>
      <p style="color: var(--muted); margin-bottom: 1.5rem; text-align: center; font-size: 0.9rem;">
        Para organizar melhor suas imagens, precisamos de algumas informações:
      </p>
      <form id="customerForm">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; color: var(--text); margin-bottom: 0.5rem; font-weight: 600;">
            Nome Completo *
          </label>
          <input type="text" id="customerNameInput" required 
                 style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); 
                        background: rgba(255,255,255,0.05); color: var(--text); font-size: 1rem;">
        </div>
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; color: var(--text); margin-bottom: 0.5rem; font-weight: 600;">
            WhatsApp (opcional)
          </label>
          <input type="tel" id="customerPhoneInput" placeholder="(61) 99999-9999"
                 style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); 
                        background: rgba(255,255,255,0.05); color: var(--text); font-size: 1rem;">
        </div>
        <div style="display: flex; gap: 1rem;">
          <button type="button" id="cancelForm" 
                  style="flex: 1; padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.3); 
                         background: transparent; color: var(--text); cursor: pointer; font-weight: 600;">
            Cancelar
          </button>
          <button type="submit" 
                  style="flex: 1; padding: 0.75rem; border-radius: 8px; border: none; 
                         background: linear-gradient(135deg, var(--accent-1), var(--accent-2)); 
                         color: white; cursor: pointer; font-weight: 600;">
            Continuar
          </button>
        </div>
      </form>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Event listeners
    const form = modal.querySelector('#customerForm');
    const nameInput = modal.querySelector('#customerNameInput');
    const phoneInput = modal.querySelector('#customerPhoneInput');
    const cancelBtn = modal.querySelector('#cancelForm');
    
    // Focar no campo nome
    setTimeout(() => nameInput.focus(), 100);
    
    // Máscara para telefone
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        if (value.length < 14) {
          value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
      }
      e.target.value = value;
    });
    
    // Cancelar
    cancelBtn.addEventListener('click', () => {
      modal.remove();
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modal.remove();
      }
    });
    
    // Submit do formulário
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      
      if (!name) {
        this.showNotification('Por favor, preencha o nome completo', 'error');
        nameInput.focus();
        return;
      }
      
      this.customerName = name;
      this.customerPhone = phone;
      modal.remove();
      
      this.showNotification(`Dados salvos! Organizando imagens para ${name}`, 'success');
      this.proceedToWhatsApp();
    });
  }
  
  showPreviewSection() {
    this.uploadPreview.style.display = 'block';
    this.uploadPreview.scrollIntoView({ behavior: 'smooth' });
  }
  
  getWhatsAppMessage(fileCount) {
    const messages = {
      1: `Olá! Gostaria de solicitar a edição de 1 imagem. Poderia me enviar um orçamento? 📸`,
      2: `Olá! Tenho 2 imagens que precisam de edição profissional. Qual seria o valor? 📸📸`,
      3: `Olá! Preciso editar 3 imagens. Poderia me passar um orçamento detalhado? 📸📸📸`,
      4: `Olá! Tenho 4 imagens para edição. Qual seria o melhor plano para mim? 📸📸📸📸`,
      5: `Olá! Tenho 5 imagens para editar. Gostaria do Pacote Básico (R$ 50). Podemos fechar? 📸📸📸📸📸`,
      10: `Olá! Tenho 10 imagens para editar. Gostaria do Pacote Profissional (R$ 100 + 2 de brinde). Vamos fechar? 📸✨`,
      15: `Olá! Tenho 15 imagens para editar. Gostaria do Pacote Premium (R$ 150 + 3 de brinde). Podemos conversar? 📸✨`,
      'many': `Olá! Tenho ${fileCount} imagens para edição profissional. Poderia me enviar um orçamento especial baseado nos seus pacotes? 📸✨`
    };
    
    // Sugerir pacotes baseados na quantidade
    if (fileCount >= 6 && fileCount <= 9) {
      return `Olá! Tenho ${fileCount} imagens para editar. Qual seria o melhor pacote para essa quantidade? Talvez o Profissional? 📸✨`;
    }
    if (fileCount >= 11 && fileCount <= 14) {
      return `Olá! Tenho ${fileCount} imagens para editar. Estou pensando no Pacote Premium. Podemos conversar sobre o valor? 📸✨`;
    }
    
    return messages[fileCount] || messages['many'];
  }
  
  sendToWhatsApp() {
    if (this.selectedFiles.length === 0) {
      this.showNotification('Nenhum arquivo selecionado!', 'error');
      return;
    }
    
    // Mostrar formulário para coletar dados do cliente
    this.showCustomerForm();
  }
  
  proceedToWhatsApp() {
    const fileCount = this.selectedFiles.length;
    const message = this.getWhatsAppMessage(fileCount);
    const whatsappNumber = '556198574343';
    
    // Criar lista de nomes dos arquivos
    const fileNames = this.selectedFiles.map(file => file.name).join(', ');
    
    // Mensagem personalizada com dados do cliente
    let fullMessage = `${message}\n\n`;
    fullMessage += `👤 Cliente: ${this.customerName}\n`;
    if (this.customerPhone) {
      fullMessage += `📱 WhatsApp: ${this.customerPhone}\n`;
    }
    fullMessage += `📁 Total de imagens: ${fileCount}\n`;
    fullMessage += `📋 Arquivos: ${fileNames}\n\n`;
    fullMessage += `🗂️ *PASTA DE ORGANIZAÇÃO: ${this.customerName.toUpperCase().replace(/\s+/g, '_')}*\n\n`;
    fullMessage += `Por favor, organize as imagens na pasta com o nome do cliente para facilitar o trabalho! 📂`;
    
    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(fullMessage);
    
    // Abrir WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Feedback visual
    this.showSuccessMessage();
    
    // Simular organização das imagens
    this.simulateFileOrganization();
  }
  
  simulateFileOrganization() {
    // Mostrar progresso de organização
    const progressModal = document.createElement('div');
    progressModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      backdrop-filter: blur(10px);
    `;
    
    const progressContent = document.createElement('div');
    progressContent.style.cssText = `
      background: var(--bg1);
      border-radius: 16px;
      padding: 2rem;
      max-width: 500px;
      width: 90%;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    progressContent.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 1rem;">📂</div>
      <h3 style="color: var(--text); margin-bottom: 1rem;">Organizando Imagens</h3>
      <p style="color: var(--muted); margin-bottom: 1.5rem;">
        Criando pasta: <strong style="color: var(--accent-1);">${this.customerName.toUpperCase().replace(/\s+/g, '_')}</strong>
      </p>
      <div class="progress-bar" style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-bottom: 1rem;">
        <div class="progress-fill" style="height: 100%; background: linear-gradient(90deg, var(--accent-1), var(--accent-2)); width: 0%; transition: width 0.3s ease;"></div>
      </div>
      <div id="progressText" style="color: var(--muted); font-size: 0.9rem;">Preparando...</div>
    `;
    
    progressModal.appendChild(progressContent);
    document.body.appendChild(progressModal);
    
    const progressFill = progressContent.querySelector('.progress-fill');
    const progressText = progressContent.querySelector('#progressText');
    
    // Simular progresso
    const steps = [
      { progress: 20, text: 'Criando pasta do cliente...' },
      { progress: 40, text: 'Verificando formatos de imagem...' },
      { progress: 60, text: 'Organizando arquivos...' },
      { progress: 80, text: 'Preparando para envio...' },
      { progress: 100, text: 'Organização concluída!' }
    ];
    
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        progressFill.style.width = step.progress + '%';
        progressText.textContent = step.text;
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          progressModal.remove();
          this.showOrganizationSummary();
        }, 1000);
      }
    }, 800);
  }
  
  showOrganizationSummary() {
    const summaryModal = document.createElement('div');
    summaryModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      backdrop-filter: blur(5px);
    `;
    
    const summaryContent = document.createElement('div');
    summaryContent.style.cssText = `
      background: var(--bg1);
      border-radius: 16px;
      padding: 2rem;
      max-width: 500px;
      width: 90%;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    const folderName = this.customerName.toUpperCase().replace(/\s+/g, '_');
    const fileList = this.selectedFiles.map(file => `• ${file.name}`).join('\n');
    
    summaryContent.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
      <h3 style="color: var(--text); margin-bottom: 1rem;">Imagens Organizadas!</h3>
      <div style="background: rgba(124, 58, 237, 0.1); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid rgba(124, 58, 237, 0.3);">
        <h4 style="color: var(--accent-1); margin-bottom: 1rem;">📁 Pasta Criada:</h4>
        <p style="color: var(--text); font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;">${folderName}</p>
        <div style="text-align: left; color: var(--muted); font-size: 0.9rem; max-height: 150px; overflow-y: auto;">
          <strong style="color: var(--text);">Arquivos (${this.selectedFiles.length}):</strong><br>
          ${fileList}
        </div>
      </div>
      <p style="color: var(--muted); margin-bottom: 1.5rem; font-size: 0.9rem;">
        As imagens foram organizadas e enviadas via WhatsApp com todas as informações necessárias para o atendimento.
      </p>
      <button id="closeSummary" style="padding: 0.75rem 2rem; border-radius: 8px; border: none; background: linear-gradient(135deg, var(--accent-1), var(--accent-2)); color: white; cursor: pointer; font-weight: 600;">
        Fechar
      </button>
    `;
    
    summaryModal.appendChild(summaryContent);
    document.body.appendChild(summaryModal);
    
    // Fechar modal
    summaryContent.querySelector('#closeSummary').addEventListener('click', () => {
      summaryModal.remove();
      this.resetUpload();
    });
    
    // Fechar com clique fora
    summaryModal.addEventListener('click', (e) => {
      if (e.target === summaryModal) {
        summaryModal.remove();
        this.resetUpload();
      }
    });
  }
  
  resetUpload() {
    this.selectedFiles = [];
    this.customerName = '';
    this.customerPhone = '';
    this.uploadPreview.style.display = 'none';
    this.fileInput.value = '';
    this.previewGrid.innerHTML = '';
  }
  
  showSuccessMessage() {
    const originalText = this.sendButton.innerHTML;
    this.sendButton.innerHTML = '✅ Enviado!';
    this.sendButton.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    
    setTimeout(() => {
      this.sendButton.innerHTML = originalText;
      this.sendButton.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';
    }, 3000);
  }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  new UploadHandler();
});
