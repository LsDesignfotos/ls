// FAQ Accordion Functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');
        
        if (question) {
            question.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherToggle = otherItem.querySelector('.faq-toggle');
                        if (otherToggle) otherToggle.textContent = '+';
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    if (toggle) toggle.textContent = '+';
                } else {
                    item.classList.add('active');
                    if (toggle) toggle.textContent = '−';
                }
            });
        }
    });
    
    // Close FAQ when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.faq-item')) {
            faqItems.forEach(item => {
                item.classList.remove('active');
                const toggle = item.querySelector('.faq-toggle');
                if (toggle) toggle.textContent = '+';
            });
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
} else {
    initFAQ();
}
