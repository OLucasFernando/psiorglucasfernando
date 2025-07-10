// Substitua o JavaScript atual do carrossel por este código melhorado
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('carousel');
    const cards = carousel.children;
    let currentPosition = 0;
    let isAnimating = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let touchStartTime;
    
    // Configurações ajustáveis
    const config = {
        transitionSpeed: 300,
        swipeThreshold: 50,
        swipeTimeThreshold: 500
    };
    
    // Calcula a largura do card baseado no primeiro elemento
    const cardWidth = cards[0].offsetWidth + 
                     parseInt(window.getComputedStyle(cards[0]).marginLeft) + 
                     parseInt(window.getComputedStyle(cards[0]).marginRight);
    
    // Calcula quantos cards são visíveis
    const visibleCards = Math.floor(carousel.parentElement.offsetWidth / cardWidth);
    const maxScroll = -((cards.length - visibleCards) * cardWidth);
    
    // Adiciona eventos de toque/arrastar para mobile
    carousel.addEventListener('touchstart', touchStart);
    carousel.addEventListener('touchend', touchEnd);
    carousel.addEventListener('touchmove', touchMove);
    
    // Adiciona eventos de mouse para desktop
    carousel.addEventListener('mousedown', touchStart);
    carousel.addEventListener('mouseup', touchEnd);
    carousel.addEventListener('mouseleave', touchEnd);
    carousel.addEventListener('mousemove', touchMove);
    
    // Funções de navegação
    window.nextCard = function() {
        if (isAnimating) return;
        
        if (currentPosition <= maxScroll) {
            goToPosition(0);
        } else {
            goToPosition(currentPosition - cardWidth);
        }
    };
    
    window.prevCard = function() {
        if (isAnimating) return;
        
        if (currentPosition >= 0) {
            goToPosition(maxScroll);
        } else {
            goToPosition(currentPosition + cardWidth);
        }
    };
    
    // Função para ir para uma posição específica com animação suave
    function goToPosition(position) {
        isAnimating = true;
        currentPosition = position;
        
        carousel.style.transition = `transform ${config.transitionSpeed}ms ease-out`;
        carousel.style.transform = `translateX(${currentPosition}px)`;
        
        // Remove a classe de transição após a animação
        setTimeout(() => {
            carousel.style.transition = 'none';
            isAnimating = false;
        }, config.transitionSpeed);
    }
    
    // Funções para suporte a touch/swipe
    function touchStart(e) {
        if (isAnimating) return;
        
        // Para evitar conflitos entre touch e mouse
        if (e.type === 'mousedown') {
            e.preventDefault();
        }
        
        touchStartTime = Date.now();
        startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        prevTranslate = currentPosition;
        
        // Remove qualquer transição ativa
        carousel.style.transition = 'none';
    }
    
    function touchMove(e) {
        if (!startX) return;
        
        const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const diff = currentX - startX;
        
        // Atualiza a posição durante o arrasto
        currentTranslate = prevTranslate + diff;
        
        // Limita o movimento para não passar dos limites
        if (currentTranslate > 0) {
            currentTranslate = 0;
        } else if (currentTranslate < maxScroll) {
            currentTranslate = maxScroll;
        }
        
        // Aplica o movimento
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function touchEnd() {
        if (!startX) return;
        
        const touchDuration = Date.now() - touchStartTime;
        const currentDiff = currentTranslate - prevTranslate;
        
        // Determina se foi um swipe rápido (deve mudar o card)
        if (Math.abs(currentDiff) > config.swipeThreshold && 
            touchDuration < config.swipeTimeThreshold) {
            
            if (currentDiff > 0) {
                // Swipe para a direita - card anterior
                prevCard();
            } else {
                // Swipe para a esquerda - próximo card
                nextCard();
            }
        } else {
            // Se não foi um swipe rápido, volta para a posição atual ou vai para o card mais próximo
            const cardIndex = Math.round(Math.abs(currentTranslate) / cardWidth);
            goToPosition(-(cardIndex * cardWidth));
        }
        
        // Reseta as variáveis
        startX = 0;
    }
    
    // Ajusta o carrossel quando a janela é redimensionada
    window.addEventListener('resize', function() {
        const newCardWidth = cards[0].offsetWidth + 
                            parseInt(window.getComputedStyle(cards[0]).marginLeft) + 
                            parseInt(window.getComputedStyle(cards[0]).marginRight);
        
        if (newCardWidth !== cardWidth) {
            // Recalcula a posição com base na nova largura
            const cardIndex = Math.round(Math.abs(currentPosition) / cardWidth);
            currentPosition = -(cardIndex * newCardWidth);
            carousel.style.transform = `translateX(${currentPosition}px)`;
        }
    });
});
