

// Navegação mobile
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });

    // Smooth scroll para links internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animações de scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animateElements = document.querySelectorAll('.product-card, .feature, .contact-item, .testimonial-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Funcionalidade de compra direta
    const buyNowButtons = document.querySelectorAll('.buy-now-btn');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            // Rastrear evento de interesse no produto
            if (typeof fbq !== 'undefined') {
                fbq('track', 'ViewContent', {
                    content_name: productName,
                    content_category: 'Fita Adesiva',
                    value: 488,
                    currency: 'MZN'
                });
            }
            
            // Mostrar notificação de redirecionamento
            showNotification(`Redirecionando para WhatsApp para comprar ${productName}!`);
        });
    });

    // Funcionalidade do formulário de contato
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Simular envio
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Rastrear evento de lead
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_category: 'Contato',
                        value: 0,
                        currency: 'MZN'
                    });
                }
                
                showNotification('Mensagem enviada com sucesso!');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Funcionalidade de visualização de produtos
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productDescription = productCard.querySelector('.product-description').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            // Rastrear visualização do produto
            if (typeof fbq !== 'undefined') {
                fbq('track', 'ViewContent', {
                    content_name: productName,
                    content_category: 'Fita Adesiva',
                    value: 488,
                    currency: 'MZN'
                });
            }
            
            showProductModal(productName, productDescription, productPrice);
        });
    });

    // Lazy loading para imagens
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

         images.forEach(img => imageObserver.observe(img));
     
     // Funcionalidade do FAQ
     const faqItems = document.querySelectorAll('.faq-item');
     faqItems.forEach(item => {
         const question = item.querySelector('.faq-question');
         const answer = item.querySelector('.faq-answer');
         
         question.addEventListener('click', function() {
             const isOpen = item.classList.contains('active');
             
             // Fechar todos os outros itens
             faqItems.forEach(otherItem => {
                 otherItem.classList.remove('active');
             });
             
             // Abrir/fechar o item clicado
             if (!isOpen) {
                 item.classList.add('active');
             }
         });
     });
 });

// Função para mostrar notificações
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1e3a8a, #3b82f6);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Função para mostrar modal do produto
function showProductModal(name, description, price) {
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${name}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                                 <div class="product-image">
                     <img src="produto.jpeg" alt="${name}" style="width: 100%; height: 350px; object-fit: contain; border-radius: 10px; background: #f8fafc; border: 2px solid #e2e8f0;">
                 </div>
                <div class="product-details">
                    <p class="description">${description}</p>
                                         <div class="specs">
                         <h4>Características ULTRA FORTE:</h4>
                         <ul>
                             <li><strong>Super fixação:</strong> Segura até objetos pesados</li>
                             <li><strong>Resistente à água:</strong> Não perde aderência</li>
                             <li><strong>4 METROS:</strong> De aderência poderosa</li>
                             <li><strong>Fácil aplicação:</strong> Sem complicações</li>
                             <li><strong>Sem danos:</strong> Remove sem deixar marcas</li>
                             <li><strong>Versátil:</strong> Para qualquer superfície</li>
                         </ul>
                     </div>
                     <div class="price-section">
                         <span class="price">MZN 488</span>
                         <span class="original-price">Antes: MZN 600</span>
                         <span class="discount">Poupe 112!</span>
                     </div>
                                                                        <div class="product-actions">
                              <a href="#" class="buy-now-whatsapp" onclick="showDataModal('${name}'); return false;">
                                  <i class="fab fa-whatsapp"></i>
                                  QUERO!
                              </a>
                          </div>
                </div>
            </div>
        </div>
    `;
    
    // Estilos do modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalContent = modal.querySelector('.modal-content');
    const closeBtn = modal.querySelector('.close-modal');
    
    // Estilos do overlay
    modalOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
    `;
    
         // Estilos do conteúdo do modal
     modalContent.style.cssText = `
         background: white;
         border-radius: 20px;
         max-width: 700px;
         width: 95%;
         max-height: 95vh;
         overflow-y: auto;
         position: relative;
         z-index: 1;
         box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
         transform: scale(0.7);
         opacity: 0;
         transition: all 0.3s ease;
     `;
    
    // Estilos do header do modal
    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #e2e8f0;
    `;
    
    const modalTitle = modal.querySelector('.modal-header h3');
    modalTitle.style.cssText = `
        margin: 0;
        color: #1e293b;
        font-size: 1.5rem;
        font-weight: 600;
    `;
    
    // Estilos do botão de fechar
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #64748b;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    `;
    
    closeBtn.addEventListener('mouseenter', function() {
        this.style.background = '#f1f5f9';
        this.style.color = '#1e293b';
    });
    
    closeBtn.addEventListener('mouseleave', function() {
        this.style.background = 'none';
        this.style.color = '#64748b';
    });
    
    // Estilos do body do modal
    const modalBody = modal.querySelector('.modal-body');
    modalBody.style.cssText = `
        padding: 20px;
    `;
    
    const productDetails = modal.querySelector('.product-details');
    productDetails.style.cssText = `
        margin-top: 20px;
    `;
    
    const descriptionEl = modal.querySelector('.description');
    descriptionEl.style.cssText = `
        color: #64748b;
        line-height: 1.6;
        margin-bottom: 20px;
    `;
    
    const specsEl = modal.querySelector('.specs');
    specsEl.style.cssText = `
        margin-bottom: 20px;
        padding: 15px;
        background: #f8fafc;
        border-radius: 10px;
        border-left: 4px solid #3b82f6;
    `;
    
    const specsTitle = modal.querySelector('.specs h4');
    specsTitle.style.cssText = `
        margin: 0 0 15px 0;
        color: #1e293b;
        font-size: 1.1rem;
        font-weight: 600;
    `;
    
    const specsList = modal.querySelector('.specs ul');
    specsList.style.cssText = `
        margin: 0;
        padding-left: 20px;
        list-style: none;
    `;
    
    const specsItems = modal.querySelectorAll('.specs li');
    specsItems.forEach(item => {
        item.style.cssText = `
            margin-bottom: 8px;
            color: #64748b;
            line-height: 1.5;
        `;
    });
    
    const priceSection = modal.querySelector('.price-section');
    priceSection.style.cssText = `
        margin-bottom: 20px;
        text-align: center;
    `;
    
         const priceEl = modal.querySelector('.price');
     priceEl.style.cssText = `
         font-size: 2rem;
         font-weight: 700;
         color: #059669;
         display: block;
         margin-bottom: 5px;
     `;
     
     const originalPriceEl = modal.querySelector('.original-price');
     if (originalPriceEl) {
         originalPriceEl.style.cssText = `
             font-size: 1.1rem;
             color: #94a3b8;
             text-decoration: line-through;
             display: block;
             margin-bottom: 5px;
         `;
     }
     
     const discountEl = modal.querySelector('.discount');
     if (discountEl) {
         discountEl.style.cssText = `
             font-size: 1rem;
             color: #dc2626;
             font-weight: 600;
             background: rgba(220, 38, 38, 0.1);
             padding: 0.25rem 0.75rem;
             border-radius: 15px;
             display: inline-block;
         `;
     }
    
    const productActions = modal.querySelector('.product-actions');
    productActions.style.cssText = `
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    `;
    
    const buyNowWhatsappBtn = modal.querySelector('.buy-now-whatsapp');
    
    buyNowWhatsappBtn.style.cssText = `
        width: 100%;
        padding: 18px;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        background: linear-gradient(135deg, #25d366, #128c7e);
        color: white;
        text-decoration: none;
        font-size: 1.1rem;
    `;
    
    // Evento do botão
    buyNowWhatsappBtn.addEventListener('click', function() {
        // Rastrear evento de compra
        if (typeof fbq !== 'undefined') {
            fbq('track', 'InitiateCheckout', {
                content_name: name,
                content_category: 'Fita Adesiva',
                value: 488,
                currency: 'MZN'
            });
        }
        
        showNotification('Redirecionando para WhatsApp...');
    });
    
    // Fechar modal
    function closeModal() {
        modalContent.style.transform = 'scale(0.7)';
        modalContent.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Adicionar ao DOM
    document.body.appendChild(modal);
    
    // Animar entrada
    setTimeout(() => {
        modalContent.style.transform = 'scale(1)';
        modalContent.style.opacity = '1';
    }, 100);
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Adicionar estilos CSS para animações
const style = document.createElement('style');
style.textContent = `
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 2rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .header.scroll-down {
        transform: translateY(-100%);
    }
    
    .header.scroll-up {
        transform: translateY(0);
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
        
        .nav-menu.active {
            display: flex !important;
        }
    }
`;

document.head.appendChild(style);

// Função para mostrar modal de coleta de dados
function showDataModal(productName) {
    const modal = document.getElementById('dataModal');
    const modalContent = modal.querySelector('.data-modal-content');
    
    // Rastrear evento de interesse no produto
    if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
            content_name: productName,
            content_category: 'Fita Adesiva',
            value: 488,
            currency: 'MZN'
        });
    }
    
    // Mostrar modal
    modal.classList.add('active');
    
    // Animar entrada
    setTimeout(() => {
        modalContent.style.transform = 'scale(1)';
        modalContent.style.opacity = '1';
    }, 100);
    
    // Focar no primeiro campo
    setTimeout(() => {
        document.getElementById('customerName').focus();
    }, 300);
}

// Função para fechar modal de dados
function closeDataModal() {
    const modal = document.getElementById('dataModal');
    const modalContent = modal.querySelector('.data-modal-content');
    
    modalContent.style.transform = 'scale(0.8)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modal.classList.remove('active');
    }, 300);
}

// Event listeners para o modal de dados
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('dataModal');
    const closeBtn = modal.querySelector('.close-data-modal');
    const overlay = modal.querySelector('.data-modal-overlay');
    const form = document.getElementById('deliveryForm');
    
    // Fechar modal
    closeBtn.addEventListener('click', closeDataModal);
    overlay.addEventListener('click', closeDataModal);
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeDataModal();
        }
    });
    
    // Submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const customerName = formData.get('customerName');
        const deliveryTime = formData.get('deliveryTime');
        const deliveryLocation = formData.get('deliveryLocation');
        const customerPhone = formData.get('customerPhone');
        
        // Rastrear evento de lead no Facebook
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Formulário de Entrega',
                content_category: 'Fita Adesiva',
                value: 488,
                currency: 'MZN'
            });
        }
        
        // Criar mensagem para WhatsApp
        const whatsappMessage = `🛒 *NOVO PEDIDO - Fita Dupla Face ULTRA FORTE*

👤 *Cliente:* ${customerName}
📱 *Telefone:* ${customerPhone}
📅 *Data/Hora:* ${deliveryTime}
📍 *Localização:* ${deliveryLocation}
💰 *Produto:* Fita Dupla Face ULTRA FORTE
💵 *Preço:* MZN 488
🚚 *Entrega:* GRÁTIS
💳 *Pagamento:* Na entrega

✅ Cliente confirmou interesse!`;
        
        // Abrir WhatsApp com mensagem preenchida
        const whatsappUrl = `https://wa.me/258872568371?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        
        // Mostrar notificação de sucesso
        showNotification('✅ Dados enviados! Redirecionando para WhatsApp...');
        
        // Fechar modal
        closeDataModal();
        
        // Resetar formulário
        form.reset();
    });
    
    // Configurar data/hora mínima para hoje
    const dateTimeInput = document.getElementById('deliveryTime');
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9:00 AM amanhã
    
    const minDateTime = tomorrow.toISOString().slice(0, 16);
    dateTimeInput.min = minDateTime;
    dateTimeInput.value = minDateTime;
});
