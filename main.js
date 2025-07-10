document.addEventListener('DOMContentLoaded', function() {
    // Configurações do Carrossel
    const carousel = document.getElementById('carousel');
    const cards = document.querySelectorAll('.service-card');
    let currentPosition = 0;
    let isAnimating = false;
    
    // Calcula a largura do card incluindo margens
    const cardStyle = window.getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth + 
                    parseInt(cardStyle.marginLeft) + 
                    parseInt(cardStyle.marginRight);
    
    // Quantidade de cards visíveis
    const visibleCards = Math.floor(carousel.parentElement.offsetWidth / cardWidth);
    const maxScroll = -((cards.length - visibleCards) * cardWidth);

    // Funções de navegação
    window.nextCard = function() {
        if (isAnimating) return;
        
        if (currentPosition <= maxScroll) {
            goToPosition(0); // Volta para o primeiro
        } else {
            goToPosition(currentPosition - cardWidth); // Próximo card
        }
    };

    window.prevCard = function() {
        if (isAnimating) return;
        
        if (currentPosition >= 0) {
            goToPosition(maxScroll); // Vai para o último
        } else {
            goToPosition(currentPosition + cardWidth); // Card anterior
        }
    };

    // Função para animação suave
    function goToPosition(position) {
        isAnimating = true;
        currentPosition = position;
        
        carousel.style.transition = 'transform 0.5s ease-out';
        carousel.style.transform = `translateX(${currentPosition}px)`;
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    // Suporte para touch/swipe em mobile
    let startX, startScroll;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startScroll = currentPosition;
        carousel.style.transition = 'none';
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const x = e.touches[0].clientX;
        const diff = x - startX;
        carousel.style.transform = `translateX(${startScroll + diff}px)`;
    });
    
    carousel.addEventListener('touchend', (e) => {
        if (!startX) return;
        
        const x = e.changedTouches[0].clientX;
        const diff = x - startX;
        
        if (Math.abs(diff) > 50) { // Threshold para considerar swipe
            if (diff > 0) {
                prevCard();
            } else {
                nextCard();
            }
        } else {
            goToPosition(currentPosition);
        }
        
        startX = null;
    });
});
