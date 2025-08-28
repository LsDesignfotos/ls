(function() {
  'use strict';
  
  // Verificar se já existe canvas
  let canvas = document.getElementById('particles-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  let animationId;
  let isVisible = !document.hidden;

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particle system
  const particles = [];
  const maxParticles = Math.min(25, Math.floor((window.innerWidth * window.innerHeight) / 25000));

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.size = Math.random() * 1.2 + 0.3;
      this.opacity = Math.random() * 0.3 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124, 58, 237, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Initialize particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  // Animation loop - OTIMIZADO
  let lastTime = 0;
  const targetFPS = 24;
  const frameInterval = 1000 / targetFPS;

  function animate(currentTime = 0) {
    if (!isVisible) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    if (currentTime - lastTime >= frameInterval) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Draw connections - MUITO REDUZIDO para performance
      if (particles.length > 5) {
        for (let i = 0; i < particles.length; i += 3) {
          for (let j = i + 3; j < particles.length; j += 3) {
            const particle = particles[i];
            const otherParticle = particles[j];
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 60) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(124, 58, 237, ${0.05 * (1 - distance / 60)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }
      
      lastTime = currentTime;
    }
    
    animationId = requestAnimationFrame(animate);
  }

  // Pausar animação quando não visível
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  // Reduzir partículas em dispositivos móveis
  if (window.innerWidth <= 768) {
    particles.splice(Math.floor(maxParticles / 2));
  }

  // Pausar em conexões lentas
  if ('connection' in navigator && navigator.connection.effectiveType === 'slow-2g') {
    return; // Não iniciar animação
  }

  animate();
})();
