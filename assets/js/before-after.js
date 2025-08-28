// NOVA ESTRUTURA - Comparador de imagens SEM animações
function initImageCompare() {
  const comparators = document.querySelectorAll('.image-compare');
  
  comparators.forEach(comp => {
    const container = comp.querySelector('.compare-container');
    const afterImg = comp.querySelector('.after-img');
    const slider = comp.querySelector('.slider');
    const handle = comp.querySelector('.slider-handle');
    
    let isDragging = false;
    
    function updatePosition(x) {
      const rect = container.getBoundingClientRect();
      let percentage = ((x - rect.left) / rect.width) * 100;
      percentage = Math.max(5, Math.min(95, percentage));
      
      // Atualiza posições instantaneamente
      afterImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
      slider.style.left = percentage + '%';
    }
    
    function startDrag(e) {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
      
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('touchmove', onDrag, {passive: false});
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchend', stopDrag);
    }
    
    function onDrag(e) {
      if (!isDragging) return;
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    }
    
    function stopDrag() {
      isDragging = false;
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('touchmove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
    }
    
    // Event listeners
    slider.addEventListener('mousedown', startDrag);
    slider.addEventListener('touchstart', startDrag, {passive: true});
    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, {passive: true});
    
    // Clique direto no container
    container.addEventListener('click', (e) => {
      if (!isDragging) {
        updatePosition(e.clientX);
      }
    });
  });
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initImageCompare);