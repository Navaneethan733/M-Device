window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 700);
    }, 600);
});

document.addEventListener('DOMContentLoaded', () => {

    document.body.classList.add('js-ready');

    try {
        if (typeof SplitText !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger, SplitText);
        } else {
            gsap.registerPlugin(ScrollTrigger);
        }
    } catch (e) {
        console.warn('GSAP plugin registration error:', e);
    }

    document.querySelectorAll('.draw-path').forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;

        gsap.to(path, {
            scrollTrigger: {
                trigger: path,
                start: "top 80%",
            },
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.out"
        });
    });

    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const slider = document.querySelector('.hero-slider');
    const totalSlides = slides.length;
    let autoPlayInterval;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        currentSlide = index;

        gsap.to(slider, {
            xPercent: -100 * currentSlide,
            duration: 1,
            ease: "power2.inOut"
        });

        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentSlide].classList.add('active');

        const activeSlideText = slides[currentSlide].querySelector('.animate-me');
        if (activeSlideText) {
            gsap.set(activeSlideText, { opacity: 1 });

            const words = activeSlideText.querySelectorAll('div'); // fixed selector
            if (words.length > 0) {
                gsap.fromTo(words, {
                    opacity: 0,
                    y: 20
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    stagger: 0.05
                });
            }
        }
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    }

    if (slider) {

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'));
                goToSlide(index);
                startAutoPlay(); // Reset timer
            });
        });

        startAutoPlay();
    }

    const revealConfigs = [
        { trigger: ".features", target: ".feature-item", y: 30, stagger: 0.2 },
        { trigger: ".featured", target: ".featured-header, .card", y: 40, stagger: 0.1 },
        { trigger: ".featured-products", target: ".products-header, .product-card", y: 40, stagger: 0.1 },
        { trigger: ".promo-banners", target: ".promo-card, .hotline-card", y: 40, stagger: 0.2 },
        { trigger: ".cta-banner", target: ".cta-content h2, .contact-btn", y: 30, stagger: 0.2 },
        { trigger: ".recent-products", target: ".products-header, .recent-card", y: 30, stagger: 0.1 },
        { trigger: ".why-us", target: ".drawing-item", y: 40, stagger: 0.3 },
        { trigger: ".isometric-section", target: ".iso-card", y: 60, stagger: 0.2 },
        { trigger: ".timeline-container", target: ".timeline-item", y: 40, stagger: 0.5 },
        { trigger: ".integration-container", target: ".integration-container", y: 0, opacity: 1 },
        { trigger: ".reveal", target: ".reveal", y: 30, stagger: 0 },
        { trigger: ".reveal-stagger", target: ".reveal-stagger > *", y: 20, stagger: 0.1 }
    ];

    revealConfigs.forEach(config => {
        const triggerEls = document.querySelectorAll(config.trigger);
        triggerEls.forEach(triggerEl => {
            let targets;
            if (config.trigger === config.target) {
                targets = [triggerEl];
            } else {
                targets = triggerEl.querySelectorAll(config.target);
            }

            targets = Array.from(targets).filter(t => !t.dataset.animated);

            if (targets.length > 0) {
                targets.forEach(t => t.dataset.animated = "true");
                
                gsap.to(targets, {
                    scrollTrigger: {
                        trigger: triggerEl,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    },
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: config.stagger || 0,
                    ease: "power2.out",
                    onComplete: () => {
                        triggerEl.classList.add('active');
                    }
                });
            }
        });
    });

    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    function activateVisibleReveals() {
        document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
            if (isInViewport(el)) {
                el.classList.add('active');
                gsap.set(el, { opacity: 1, y: 0, x: 0 });
                el.querySelectorAll('*').forEach(child => {
                    gsap.set(child, { opacity: 1, y: 0, x: 0 });
                });
            }
        });
    }

    activateVisibleReveals();

    window.addEventListener('load', () => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        activateVisibleReveals();
    });


    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            gsap.to(counter, {
                scrollTrigger: {
                    trigger: counter,
                    start: "top 90%"
                },
                innerText: target,
                duration: 2,
                snap: { innerText: 1 },
                ease: "power1.out",
                onUpdate: function() {
                    counter.innerText = Math.ceil(this.targets()[0].innerText).toLocaleString() + "+";
                }
            });
        });
    }

    document.querySelectorAll('.card, .product-card, .recent-card, .iso-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('iso-card')) {
                card.style.transform = 'translateY(-10px)';
            }
        });
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('iso-card')) {
                card.style.transform = 'translateY(0)';
            }
        });
    });

    const faqHeaders = document.querySelectorAll('.faq-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        gsap.to(marqueeContent, {
            xPercent: -50,
            repeat: -1,
            duration: 20,
            ease: "none"
        });
    }

    if (typeof SplitText !== "undefined") {
        
        
        document.fonts.ready.then(() => {
            const animateMe = document.querySelectorAll(".animate-me");
            animateMe.forEach(el => {
                if (!el.dataset.splitDone) {
                    gsap.set(el, { opacity: 1 });
                    const split = new SplitText(el, { type: "words", aria: "hidden" });
                    el.dataset.splitDone = "true";

                    gsap.from(split.words, {
                        opacity: 0,
                        y: 20,
                        duration: 1.5,
                        ease: "power2.out",
                        stagger: 0.05
                    });
                }
            });
        });
    }

    const cartCountElements = document.querySelectorAll('.cart-count');
    
    function getCart() {
        return JSON.parse(localStorage.getItem('medical_cart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('medical_cart', JSON.stringify(cart));
        updateCartCountDisplay();
    }

    function updateCartCountDisplay() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElements.forEach(el => el.textContent = totalItems);
    }

    updateCartCountDisplay();

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (!card) return;

            const product = {
                id: card.querySelector('h4').textContent + '_' + card.querySelector('.price').textContent,
                name: card.querySelector('h4').textContent,
                price: parseFloat(card.querySelector('.price').textContent.replace('$', '').split(' ').pop()),
                image: card.querySelector('img').src,
                quantity: parseInt(card.querySelector('.qty-input')?.value || 1)
            };

            let cart = getCart();
            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += product.quantity;
            } else {
                cart.push(product);
            }

            saveCart(cart);

            const originalText = btn.textContent;
            btn.textContent = 'ADDED!';
            btn.style.backgroundColor = '#28a745';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
            }, 1500);
        });
    });

    document.querySelectorAll('.quantity-control').forEach(control => {
        const minusBtn = control.querySelector('.minus-btn');
        const plusBtn = control.querySelector('.plus-btn');
        const input = control.querySelector('.qty-input');

        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', () => {
                let currentValue = parseInt(input.value) || 1;
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    if (control.closest('.cart-row')) {
                        updateCartItemQuantity(control.closest('.cart-row'), input.value);
                    }
                }
            });

            plusBtn.addEventListener('click', () => {
                let currentValue = parseInt(input.value) || 1;
                input.value = currentValue + 1;
                if (control.closest('.cart-row')) {
                    updateCartItemQuantity(control.closest('.cart-row'), input.value);
                }
            });

            input.addEventListener('change', () => {
                let currentValue = parseInt(input.value);
                if (isNaN(currentValue) || currentValue < 1) {
                    input.value = 1;
                }
                if (control.closest('.cart-row')) {
                    updateCartItemQuantity(control.closest('.cart-row'), input.value);
                }
            });
        }
    });

    function updateCartItemQuantity(row, newQty) {
        const productId = row.dataset.id;
        let cart = getCart();
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity = parseInt(newQty);
            saveCart(cart);
            renderCartPage(); // Re-render to update totals
        }
    }

    const cartPage = document.querySelector('.cart-page');
    if (cartPage) {
        renderCartPage();

        function renderCartPage() {
            const cart = getCart();
            const tbody = document.querySelector('.cart-table tbody');
            const cartContainer = document.querySelector('.cart-container');
            const emptyState = document.querySelector('.empty-cart-state');

            if (!tbody) return;

            if (cart.length === 0) {
                if (cartContainer) cartContainer.style.display = 'none';
                if (emptyState) {
                    emptyState.style.display = 'block';
                    gsap.from(emptyState, {opacity: 0, y: 30, duration: 0.5});
                }
                return;
            }

            if (cartContainer) cartContainer.style.display = 'flex';
            if (emptyState) emptyState.style.display = 'none';

            tbody.innerHTML = '';
            let subtotal = 0;

            cart.forEach(item => {
                const lineSubtotal = item.price * item.quantity;
                subtotal += lineSubtotal;

                const tr = document.createElement('tr');
                tr.className = 'cart-row';
                tr.dataset.id = item.id;
                tr.innerHTML = `
                    <td class="product-remove">
                        <button type="button" class="remove-btn" aria-label="Remove item">×</button>
                    </td>
                    <td class="product-details">
                        <div class="cart-product">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="cart-product-info">
                                <h4><a href="#">${item.name}</a></h4>
                            </div>
                        </div>
                    </td>
                    <td class="product-price">$${item.price.toFixed(2)}</td>
                    <td class="product-quantity">
                        <div class="quantity-control cart-qty">
                            <button type="button" class="qty-btn minus-btn">-</button>
                            <input type="number" class="qty-input" value="${item.quantity}" min="1">
                            <button type="button" class="qty-btn plus-btn">+</button>
                        </div>
                    </td>
                    <td class="product-subtotal">$${lineSubtotal.toFixed(2)}</td>
                `;
                tbody.appendChild(tr);
            });

            bindCartEvents();
            updateCartSummary(subtotal);
        }

        function bindCartEvents() {

            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const row = this.closest('.cart-row');
                    const productId = row.dataset.id;
                    
                    gsap.to(row, {
                        opacity: 0,
                        x: -50,
                        duration: 0.4,
                        ease: "power2.in",
                        onComplete: () => {
                            let cart = getCart();
                            cart = cart.filter(item => item.id !== productId);
                            saveCart(cart);
                            renderCartPage();
                        }
                    });
                });
            });

            document.querySelectorAll('.cart-qty').forEach(control => {
                const minusBtn = control.querySelector('.minus-btn');
                const plusBtn = control.querySelector('.plus-btn');
                const input = control.querySelector('.qty-input');
                const row = control.closest('.cart-row');

                minusBtn.addEventListener('click', () => {
                    let val = parseInt(input.value) || 1;
                    if (val > 1) {
                        input.value = val - 1;
                        updateCartItemQuantity(row, input.value);
                    }
                });

                plusBtn.addEventListener('click', () => {
                    let val = parseInt(input.value) || 1;
                    input.value = val + 1;
                    updateCartItemQuantity(row, input.value);
                });

                input.addEventListener('change', () => {
                    let val = parseInt(input.value);
                    if (isNaN(val) || val < 1) val = 1;
                    input.value = val;
                    updateCartItemQuantity(row, input.value);
                });
            });
        }

        function updateCartSummary(subtotal) {
            const subtotalVal = document.querySelector('.cart-subtotal-val');
            if (subtotalVal) subtotalVal.textContent = '$' + subtotal.toFixed(2);

            let shippingCost = 0;
            const selectedShipping = document.querySelector('input[name="shipping"]:checked');
            if (selectedShipping) {
                shippingCost = parseFloat(selectedShipping.value);
            }

            const totalVal = document.querySelector('.cart-total-val');
            if (totalVal) {
                const total = subtotal + shippingCost;
                totalVal.textContent = '$' + total.toFixed(2);
            }
        }

        const shippingRadios = document.querySelectorAll('input[name="shipping"]');
        shippingRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const cart = getCart();
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                updateCartSummary(subtotal);
            });
        });
    }

    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // Close all dropdowns when menu is toggled
            if (!isActive) {
                navLinks.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            }
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                navLinks.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const isMobile = window.innerWidth <= 1024; // Increased threshold for broader tablet support
                const isDropdownTrigger = link.classList.contains('dropbtn') || link.closest('.dropdown > a');
                const hasDropdown = link.nextElementSibling && link.nextElementSibling.classList.contains('dropdown-content');

                if (isMobile && hasDropdown) {
                    e.preventDefault();
                    e.stopPropagation();
                    const dropdown = link.parentElement;
                    dropdown.classList.toggle('active');
                    return;
                }

                // For normal links or sub-menu links
                if (!link.classList.contains('dropbtn')) {
                    navLinks.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    navLinks.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
                }
            });
        });
    }

});

document.addEventListener('click', (e) => {
    if (e.target.closest('.faq-question')) {
        const button = e.target.closest('.faq-question');
        const item = button.parentElement;
        const answer = item.querySelector('.faq-answer');
        const isActive = item.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                gsap.to(otherItem.querySelector('.faq-answer'), { height: 0, paddingBottom: 0, duration: 0.3, display: 'none' });
            }
        });

        item.classList.toggle('active');
        if (!isActive) {
            gsap.fromTo(answer, { display: 'none', height: 0, paddingBottom: 0 }, { display: 'block', height: 'auto', paddingBottom: 25, duration: 0.3 });
        } else {
            gsap.to(answer, { height: 0, paddingBottom: 0, duration: 0.3, display: 'none' });
        }
    }
});

(function initShopFilters() {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;

    const cards = () => Array.from(grid.querySelectorAll('.product-card'));
    const countEl = document.getElementById('shop-visible-count');
    const noResults = document.getElementById('shop-no-results');
    const priceRange = document.getElementById('price-range');
    const priceLabel = document.getElementById('price-max-label');
    const inStockCb = document.getElementById('filter-instock');
    const onSaleCb = document.getElementById('filter-onsale');
    const sortSel = document.getElementById('shop-sort');
    const catLinks = document.querySelectorAll('.filter-list a[data-filter]');

    let activeCategory = 'all';
    let maxPrice = 1000;
    let onlyInStock = false;
    let onlyOnSale = false;
    let sortMode = 'default';

    function applyFilters() {
        let all = cards();
        let visible = [];

        all.forEach(card => {
            const cat = card.dataset.category;
            const price = parseFloat(card.dataset.price);
            const sale = card.dataset.sale === 'true';
            const stock = card.dataset.stock === 'true';

            const matchCat = activeCategory === 'all' || cat === activeCategory;
            const matchPrice = price <= maxPrice;
            const matchStock = !onlyInStock || stock;
            const matchSale = !onlyOnSale || sale;

            if (matchCat && matchPrice && matchStock && matchSale) {
                card.style.display = '';
                visible.push(card);
            } else {
                card.style.display = 'none';
            }
        });

        if (sortMode !== 'default') {
            visible.sort((a, b) => {
                const pa = parseFloat(a.dataset.price);
                const pb = parseFloat(b.dataset.price);
                const na = a.querySelector('h4').textContent;
                const nb = b.querySelector('h4').textContent;
                if (sortMode === 'price-asc') return pa - pb;
                if (sortMode === 'price-desc') return pb - pa;
                if (sortMode === 'name-asc') return na.localeCompare(nb);
                return 0;
            });
            visible.forEach(card => grid.appendChild(card));
        }

        if (countEl) countEl.textContent = visible.length;
        if (noResults) noResults.style.display = visible.length === 0 ? 'block' : 'none';
    }

    catLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            catLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            activeCategory = link.dataset.filter;
            applyFilters();
        });
    });

    if (priceRange) {
        priceRange.addEventListener('input', () => {
            maxPrice = parseInt(priceRange.value);
            if (priceLabel) priceLabel.textContent = '$' + maxPrice;
            applyFilters();
        });
    }

    if (inStockCb) inStockCb.addEventListener('change', () => { onlyInStock = inStockCb.checked; applyFilters(); });
    if (onSaleCb) onSaleCb.addEventListener('change', () => { onlyOnSale = onSaleCb.checked; applyFilters(); });
    if (sortSel) sortSel.addEventListener('change', () => { sortMode = sortSel.value; applyFilters(); });

    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
        clearBtn.addEventListener('click', e => {
            e.preventDefault();
            activeCategory = 'all';
            maxPrice = 1000;
            onlyInStock = false;
            onlyOnSale = false;
            sortMode = 'default';
            if (priceRange) { priceRange.value = 1000; }
            if (priceLabel) priceLabel.textContent = '$1000';
            if (inStockCb) inStockCb.checked = false;
            if (onSaleCb) onSaleCb.checked = false;
            if (sortSel) sortSel.value = 'default';
            catLinks.forEach(l => l.classList.remove('active'));
            const allLink = document.querySelector('.filter-list a[data-filter="all"]');
            if (allLink) allLink.classList.add('active');
            applyFilters();
        });
    }

    // Custom Form Validation logic
    const forms = document.querySelectorAll('#loginForm, #signupForm');
    
    forms.forEach(form => {
        form.setAttribute('novalidate', true);
        
        form.addEventListener('submit', (e) => {
            let isValid = true;
            const inputs = form.querySelectorAll('input[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    showError(input, 'This field is required');
                } else {
                    removeError(input);
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                form.classList.add('error-shake');
                setTimeout(() => form.classList.remove('error-shake'), 500);
            }
        });
        
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => removeError(input));
            input.addEventListener('focus', () => removeError(input));
        });
    });

    function showError(input, message) {
        const group = input.parentElement;
        if (!group.classList.contains('error')) {
            group.classList.add('error');
            const popup = document.createElement('div');
            popup.className = 'error-popup';
            popup.textContent = message;
            group.appendChild(popup);
        }
    }

    function removeError(input) {
        const group = input.parentElement;
        if (group.classList.contains('error')) {
            group.classList.remove('error');
            const popup = group.querySelector('.error-popup');
            if (popup) popup.remove();
        }
    }

    applyFilters();
})();
