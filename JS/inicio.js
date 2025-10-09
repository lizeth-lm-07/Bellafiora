class AutoCarousel {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.currentSlide = 0;
        this.intervalTime = 4000;
        this.intervalId = null;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.startAutoPlay();
        this.addHoverPause();
        this.addIndicatorEvents();
    }
    
    startAutoPlay() {
        this.intervalId = setInterval(() => {
            this.nextSlide();
        }, this.intervalTime);
    }
    
    stopAutoPlay() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
    
    nextSlide() {
        this.goToSlide((this.currentSlide + 1) % this.slides.length);
    }
    
    goToSlide(slideIndex) {
        // Remover active del slide e indicador actual
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');
        
        // Actualizar slide actual
        this.currentSlide = slideIndex;
        
        // Agregar active al nuevo slide e indicador
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
    }
    
    addHoverPause() {
        const carousel = document.querySelector('.carousel-background');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
            });
            
            carousel.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        }
    }
    
    addIndicatorEvents() {
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.stopAutoPlay();
                this.goToSlide(index);
                this.startAutoPlay();
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AutoCarousel();
});

// Agrega esto a tu carrusel.js o donde tengas el JS
document.addEventListener('DOMContentLoaded', function() {
  const dropdowns = document.querySelectorAll('.dropdown');
  
  // Para móviles - toggle al hacer click
  dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.dropdown-btn');
    
    btn.addEventListener('click', function(e) {
      if (window.innerWidth <= 1060) {
        e.preventDefault();
        e.stopPropagation();
        
        // Cerrar otros dropdowns abiertos
        dropdowns.forEach(otherDropdown => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('active');
          }
        });
        
        // Abrir/cerrar el dropdown actual
        dropdown.classList.toggle('active');
      }
    });
  });
  
  // Cerrar dropdowns al hacer click fuera
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 1060) {
      if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      }
    }
  });
  
  // Cerrar dropdowns al redimensionar la ventana
  window.addEventListener('resize', function() {
    if (window.innerWidth > 1060) {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
});