window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 500);
    }, 300);
});


try {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });

        const progressBar = document.querySelector('.scroll-progress');
        lenis.on('scroll', ({ scroll, limit }) => {
            const progress = (scroll / limit) * 100;
            if (progressBar) progressBar.style.width = progress + '%';
        });

        if (typeof gsap !== 'undefined') {
            
            if (typeof ScrollTrigger !== 'undefined') {
                lenis.on('scroll', ScrollTrigger.update);
            }
            gsap.ticker.add((time) => { lenis.raf(time * 1000); });
            gsap.ticker.lagSmoothing(0);
        } else {
            
            (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
        }
    }
} catch (e) {  }


document.addEventListener('DOMContentLoaded', () => {

    
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.addEventListener('click', (e) => {
            const dropBtn = e.target.closest('.dropbtn');
            if (dropBtn && window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                const dropdown = dropBtn.closest('.dropdown');
                if (dropdown) {
                    const isActive = dropdown.classList.contains('active');
                    navLinks.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
                    if (!isActive) dropdown.classList.add('active');
                }
                return;
            }
            if (e.target.tagName === 'A' && !e.target.classList.contains('dropbtn')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navLinks.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            }
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navLinks.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            }
        });
    }

    document.body.classList.add('js-ready');

    
    try {
        if (typeof gsap !== 'undefined') {
            if (typeof SplitText !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger, SplitText);
            } else if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
            }
        }
    } catch (e) { console.warn('GSAP plugin registration error:', e); }

    
    if (typeof gsap !== 'undefined') {
        document.querySelectorAll('.draw-path').forEach(path => {
            if (typeof path.getTotalLength !== 'function') return;
            try {
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
                gsap.to(path, {
                    scrollTrigger: { trigger: path, start: 'top 80%' },
                    strokeDashoffset: 0,
                    duration: 1.5,
                    ease: 'power2.out'
                });
            } catch (_) {}
        });
    }

    
    let currentSlide = 0;
    const slides      = document.querySelectorAll('.hero-slide');
    const dots        = document.querySelectorAll('.dot');
    const slider      = document.querySelector('.hero-slider');
    const totalSlides = slides.length;
    let autoPlayInterval;

    function goToSlide(index) {
        if (!slider || totalSlides === 0) return;
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        const prevSlide = currentSlide;
        currentSlide = index;

        if (typeof gsap !== 'undefined') {
            gsap.to(slider, { xPercent: -100 * currentSlide, duration: 1.2, ease: 'power3.inOut' });
        } else {
            slider.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        }

        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));

        if (typeof gsap !== 'undefined') {
            const prevText = slides[prevSlide] && slides[prevSlide].querySelector('.animate-me');
            if (prevText) gsap.set(prevText, { opacity: 0, y: 30 });
            const activeText = slides[currentSlide].querySelector('.animate-me');
            const activeImg  = slides[currentSlide].querySelector('.hero-image');
            if (activeText) gsap.fromTo(activeText, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' });
            if (activeImg)  gsap.fromTo(activeImg,  { opacity: 0, scale: 0.8, x: 50 }, { opacity: 1, scale: 1, x: 0, duration: 1.2, delay: 0.3, ease: 'power2.out' });
        }
    }

    function startAutoPlay() { stopAutoPlay(); autoPlayInterval = setInterval(() => goToSlide(currentSlide + 1), 5000); }
    function stopAutoPlay()  { if (autoPlayInterval) clearInterval(autoPlayInterval); }

    if (slider && totalSlides > 0) {
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goToSlide(parseInt(dot.getAttribute('data-index')));
                startAutoPlay();
            });
        });
        startAutoPlay();
    }

    
    if (typeof gsap !== 'undefined') {
        const revealConfigs = [
            { trigger: '.features',          target: '.feature-item',                   y: 30, stagger: 0.2 },
            { trigger: '.featured',          target: '.featured-header, .card',         y: 40, stagger: 0.1 },
            { trigger: '.featured-products', target: '.products-header, .product-card', y: 40, stagger: 0.1, ease: 'back.out(1.7)', filter: 'blur(10px)' },
            { trigger: '.promo-banners',     target: '.promo-card, .hotline-card',      x: 60, stagger: 0.2, filter: 'blur(5px)' },
            { trigger: '.cta-banner',        target: '.cta-content h2, .contact-btn',   y: 30, stagger: 0.2, scale: 0.95 },
            { trigger: '.recent-products',   target: '.products-header, .recent-card',  y: 30, stagger: 0.1 },
            { trigger: '.medical-solutions', target: '.ms-title, .ms-description',      y: 30, stagger: 0.2 },
            { trigger: '.why-us',            target: '.drawing-item',                   y: 40, stagger: 0.3 },
            { trigger: '.isometric-section', target: '.iso-card',                       y: 60, stagger: 0.2 },
            { trigger: '.integration-container', target: '.integration-container',      y: 0 },
            { trigger: '.reveal',            target: '.reveal',                         y: 30 },
            { trigger: '.reveal-zoom',       target: '.reveal-zoom',                    scale: 0.9, y: 20 },
            { trigger: '.reveal-left',       target: '.reveal-left',                    x: -40 },
            { trigger: '.reveal-stagger',    target: '.reveal-stagger > *',             y: 20, stagger: 0.1 },
            { trigger: '.medical-solutions', target: '.popup-element',                  scale: 0.5, y: 50, stagger: 0.15, ease: 'elastic.out(1, 0.7)', duration: 1.2 }
        ];

        revealConfigs.forEach(config => {
            document.querySelectorAll(config.trigger).forEach(triggerEl => {
                let targets = (config.trigger === config.target)
                    ? [triggerEl]
                    : Array.from(triggerEl.querySelectorAll(config.target));
                targets = targets.filter(t => !t.dataset.animated);
                if (!targets.length) return;
                targets.forEach(t => (t.dataset.animated = 'true'));

                const fromProps = {
                    opacity: 0,
                    y: config.y     !== undefined ? config.y     : 0,
                    x: config.x     !== undefined ? config.x     : 0,
                    scale: config.scale !== undefined ? config.scale : 1,
                    filter: config.filter || 'none'
                };
                gsap.fromTo(targets, fromProps, {
                    scrollTrigger: { trigger: triggerEl, start: 'top 85%', toggleActions: 'play none none none' },
                    opacity: 1, y: 0, x: 0, scale: 1, filter: 'none',
                    duration: config.duration || 1,
                    stagger: config.stagger || 0,
                    ease: config.ease || 'power2.out',
                    onComplete: () => {
                        triggerEl.classList.add('active');
                        gsap.set(targets, { clearProps: 'transform,filter' });
                    }
                });
            });
        });
    }

    function isInViewport(el) {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
    }

    function activateVisibleReveals() {
        document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
            if (isInViewport(el)) {
                el.classList.add('active');
                if (typeof gsap !== 'undefined') {
                    gsap.set(el, { opacity: 1, y: 0, x: 0 });
                    el.querySelectorAll('*').forEach(c => gsap.set(c, { opacity: 1, y: 0, x: 0 }));
                }
            }
        });
    }
    activateVisibleReveals();
    window.addEventListener('load', () => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        activateVisibleReveals();
    });

    
    if (typeof gsap !== 'undefined') {
        document.querySelectorAll('.counter').forEach(counter => {
            const target = +counter.getAttribute('data-target');
            gsap.to(counter, {
                scrollTrigger: { trigger: counter, start: 'top 90%' },
                innerText: target, duration: 2, snap: { innerText: 1 }, ease: 'power1.out',
                onUpdate: function () {
                    counter.innerText = Math.ceil(this.targets()[0].innerText).toLocaleString() + '+';
                }
            });
        });
    }

    
    document.querySelectorAll('.card, .product-card, .recent-card, .iso-card').forEach(card => {
        card.addEventListener('mouseenter', () => { if (!card.classList.contains('iso-card')) card.style.transform = 'translateY(-10px)'; });
        card.addEventListener('mouseleave', () => { if (!card.classList.contains('iso-card')) card.style.transform = 'translateY(0)'; });
    });

    
    document.querySelectorAll('.faq-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    
    if (typeof SplitText !== 'undefined' && typeof gsap !== 'undefined') {
        document.fonts.ready.then(() => {
            document.querySelectorAll('.animate-me').forEach(el => {
                if (!el.dataset.splitDone) {
                    gsap.set(el, { opacity: 1 });
                    const split = new SplitText(el, { type: 'words', aria: 'hidden' });
                    el.dataset.splitDone = 'true';
                    gsap.from(split.words, { opacity: 0, y: 20, duration: 1.5, ease: 'power2.out', stagger: 0.05 });
                }
            });
        });
    }

    
    const cartCountEls = document.querySelectorAll('.cart-count');

    function getCart() {
        try { return JSON.parse(localStorage.getItem('medical_cart')) || []; } catch (_) { return []; }
    }
    function saveCart(cart) {
        try { localStorage.setItem('medical_cart', JSON.stringify(cart)); } catch (_) {}
        updateCartCountDisplay();
    }
    function updateCartCountDisplay() {
        const total = getCart().reduce((s, i) => s + i.quantity, 0);
        cartCountEls.forEach(el => (el.textContent = total));
    }
    updateCartCountDisplay();

    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (!card) return;
            const priceRaw = card.querySelector('.price').textContent.replace(/[^0-9.]/g, '');
            const product = {
                id: card.querySelector('h4').textContent + '_' + card.querySelector('.price').textContent,
                name:  card.querySelector('h4').textContent,
                price: parseFloat(priceRaw) || 0,
                image: card.querySelector('img').src,
                quantity: parseInt(card.querySelector('.qty-input')?.value || 1)
            };
            let cart = getCart();
            const existing = cart.find(i => i.id === product.id);
            if (existing) existing.quantity += product.quantity;
            else cart.push(product);
            saveCart(cart);

            const orig = btn.textContent;
            btn.textContent = 'ADDED!';
            btn.style.backgroundColor = '#28a745';
            setTimeout(() => { btn.textContent = orig; btn.style.backgroundColor = ''; }, 1500);
        });
    });

    
    document.addEventListener('click', (e) => {
        const minus = e.target.closest('.minus-btn');
        const plus  = e.target.closest('.plus-btn');
        if (minus) {
            const input = minus.closest('.quantity-control')?.querySelector('.qty-input');
            if (input) { const v = parseInt(input.value) || 1; if (v > 1) { input.value = v - 1; const row = minus.closest('.cart-row'); if (row) updateCartItemQty(row, input.value); } }
        }
        if (plus) {
            const input = plus.closest('.quantity-control')?.querySelector('.qty-input');
            if (input) { input.value = (parseInt(input.value) || 1) + 1; const row = plus.closest('.cart-row'); if (row) updateCartItemQty(row, input.value); }
        }
    });
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('qty-input')) {
            let v = parseInt(e.target.value); if (isNaN(v) || v < 1) { v = 1; e.target.value = 1; }
            const row = e.target.closest('.cart-row'); if (row) updateCartItemQty(row, v);
        }
    });

    
    function updateCartItemQty(row, newQty) {
        const id = row.dataset.id; if (!id) return;
        let cart = getCart();
        const item = cart.find(i => i.id === id);
        if (item) { item.quantity = parseInt(newQty) || 1; saveCart(cart); if (typeof renderCart === 'function') renderCart(); }
    }

    
    const cartPage = document.querySelector('.cart-page');
    if (cartPage) {

        
        var renderCart = function () {
            const cart          = getCart();
            const tbody         = document.querySelector('.cart-table tbody');
            const cartContainer = document.querySelector('.cart-container');
            const emptyState    = document.querySelector('.empty-cart-state');
            if (!tbody) return;

            if (cart.length === 0) {
                if (cartContainer) cartContainer.style.display = 'none';
                if (emptyState) {
                    emptyState.style.display = 'block';
                    if (typeof gsap !== 'undefined') gsap.from(emptyState, { opacity: 0, y: 30, duration: 0.5 });
                }
                return;
            }

            if (cartContainer) cartContainer.style.display = 'flex';
            if (emptyState) emptyState.style.display = 'none';

            tbody.innerHTML = '';
            let subtotal = 0;
            cart.forEach(item => {
                const lineSub = item.price * item.quantity;
                subtotal += lineSub;
                const tr = document.createElement('tr');
                tr.className = 'cart-row';
                tr.dataset.id = item.id;
                tr.innerHTML = `
                    <td class="product-remove"><button type="button" class="remove-btn" aria-label="Remove item">×</button></td>
                    <td class="product-details">
                        <div class="cart-product">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="cart-product-info"><h4><a href="#">${item.name}</a></h4></div>
                        </div>
                    </td>
                    <td class="product-price" data-label="Price">$${item.price.toFixed(2)}</td>
                    <td class="product-quantity" data-label="Quantity">
                        <div class="quantity-control cart-qty">
                            <button type="button" class="qty-btn minus-btn">-</button>
                            <input type="number" class="qty-input" value="${item.quantity}" min="1">
                            <button type="button" class="qty-btn plus-btn">+</button>
                        </div>
                    </td>
                    <td class="product-subtotal" data-label="Subtotal">$${lineSub.toFixed(2)}</td>
                `;
                tbody.appendChild(tr);
            });

            bindCartRowEvents();
            updateCartSummary(subtotal);
        };

        function bindCartRowEvents() {
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const row = this.closest('.cart-row');
                    const id  = row.dataset.id;
                    const doRemove = () => { let c = getCart(); saveCart(c.filter(i => i.id !== id)); renderCart(); };
                    if (typeof gsap !== 'undefined') {
                        gsap.to(row, { opacity: 0, x: -50, duration: 0.4, ease: 'power2.in', onComplete: doRemove });
                    } else { doRemove(); }
                });
            });

            document.querySelectorAll('.cart-qty').forEach(ctrl => {
                const minus = ctrl.querySelector('.minus-btn');
                const plus  = ctrl.querySelector('.plus-btn');
                const input = ctrl.querySelector('.qty-input');
                const row   = ctrl.closest('.cart-row');

                minus.addEventListener('click', () => { let v = parseInt(input.value)||1; if(v>1){input.value=v-1; updateCartItemQty(row,input.value);} });
                plus.addEventListener( 'click', () => { input.value=(parseInt(input.value)||1)+1; updateCartItemQty(row,input.value); });
                input.addEventListener('change', () => { let v=parseInt(input.value); if(isNaN(v)||v<1)v=1; input.value=v; updateCartItemQty(row,v); });
            });
        }

        function updateCartSummary(subtotal) {
            const subEl = document.querySelector('.cart-subtotal-val');
            if (subEl) subEl.textContent = '$' + subtotal.toFixed(2);
            const sel  = document.querySelector('input[name="shipping"]:checked');
            const ship = sel ? parseFloat(sel.value) : 0;
            const totEl = document.querySelector('.cart-total-val');
            if (totEl) totEl.textContent = '$' + (subtotal + ship).toFixed(2);
        }

        document.querySelectorAll('input[name="shipping"]').forEach(r => {
            r.addEventListener('change', () => {
                const sub = getCart().reduce((s,i)=>s+i.price*i.quantity,0);
                updateCartSummary(sub);
            });
        });

        renderCart(); 
    }

    
    document.querySelectorAll('#loginForm, #signupForm, #contactForm').forEach(form => {
        form.setAttribute('novalidate', true);
        form.addEventListener('submit', (e) => {
            let valid = true;
            form.querySelectorAll('input[required], textarea[required]').forEach(inp => {
                if (!inp.value.trim()) { valid = false; showErr(inp, 'This field is required'); }
                else removeErr(inp);
            });
            if (!valid) {
                e.preventDefault();
                form.classList.add('error-shake');
                setTimeout(() => form.classList.remove('error-shake'), 500);
            }
        });
        form.querySelectorAll('input, textarea').forEach(inp => {
            inp.addEventListener('input', () => removeErr(inp));
            inp.addEventListener('focus', () => removeErr(inp));
        });
    });

    function showErr(input, msg) {
        const g = input.parentElement;
        if (!g.classList.contains('error')) {
            g.classList.add('error');
            const p = document.createElement('div'); p.className = 'error-popup'; p.textContent = msg;
            g.appendChild(p);
        }
    }
    function removeErr(input) {
        const g = input.parentElement;
        if (g.classList.contains('error')) {
            g.classList.remove('error');
            const p = g.querySelector('.error-popup'); if (p) p.remove();
        }
    }

}); 


document.addEventListener('click', (e) => {
    const question = e.target.closest('.faq-question');
    if (!question) return;
    const item   = question.parentElement;
    const answer = item.querySelector('.faq-answer');
    const wasActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
            other.classList.remove('active');
            const a = other.querySelector('.faq-answer');
            if (a && typeof gsap !== 'undefined') {
                gsap.to(a, { height: 0, paddingBottom: 0, duration: 0.3, display: 'none' });
            }
        }
    });

    item.classList.toggle('active');
    if (answer) {
        if (typeof gsap !== 'undefined') {
            if (!wasActive) gsap.fromTo(answer, { display:'none', height:0, paddingBottom:0 }, { display:'block', height:'auto', paddingBottom:25, duration:0.3 });
            else gsap.to(answer, { height:0, paddingBottom:0, duration:0.3, display:'none' });
        } else {
            answer.style.display = wasActive ? 'none' : 'block';
        }
    }
});


(function initShopFilters() {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;

    const cards      = () => Array.from(grid.querySelectorAll('.product-card'));
    const countEl    = document.getElementById('shop-results-count'); 
    const noResults  = document.getElementById('shop-no-results');
    const priceRange = document.getElementById('price-range');
    const priceLabel = document.getElementById('price-max-label');
    const inStockCb  = document.getElementById('filter-instock');
    const onSaleCb   = document.getElementById('filter-onsale');
    const sortSel    = document.getElementById('shop-sort');
    const catLinks   = document.querySelectorAll('.filter-list a[data-filter]');

    let activeCategory = 'all', maxPrice = 1000, onlyInStock = false, onlyOnSale = false, sortMode = 'default';

    function applyFilters() {
        let visible = [];
        cards().forEach(card => {
            const show =
                (activeCategory === 'all' || card.dataset.category === activeCategory) &&
                parseFloat(card.dataset.price) <= maxPrice &&
                (!onlyInStock || card.dataset.stock === 'true') &&
                (!onlyOnSale  || card.dataset.sale  === 'true');
            card.style.display = show ? '' : 'none';
            if (show) visible.push(card);
        });

        if (sortMode !== 'default') {
            visible.sort((a, b) => {
                if (sortMode === 'price-asc')  return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                if (sortMode === 'price-desc') return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                if (sortMode === 'name-asc')   return a.querySelector('h4').textContent.localeCompare(b.querySelector('h4').textContent);
                return 0;
            });
            visible.forEach(c => grid.appendChild(c));
        }

        if (countEl) countEl.textContent = 'Showing ' + visible.length + ' results';
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

    if (priceRange) priceRange.addEventListener('input', () => { maxPrice = parseInt(priceRange.value); if (priceLabel) priceLabel.textContent = '$' + maxPrice; applyFilters(); });
    if (inStockCb)  inStockCb.addEventListener('change', () => { onlyInStock = inStockCb.checked; applyFilters(); });
    if (onSaleCb)   onSaleCb.addEventListener('change',  () => { onlyOnSale  = onSaleCb.checked;  applyFilters(); });
    if (sortSel)    sortSel.addEventListener('change',   () => { sortMode    = sortSel.value;     applyFilters(); });

    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
        clearBtn.addEventListener('click', e => {
            e.preventDefault();
            activeCategory = 'all'; maxPrice = 1000; onlyInStock = false; onlyOnSale = false; sortMode = 'default';
            if (priceRange) priceRange.value = 1000;
            if (priceLabel) priceLabel.textContent = '$1000';
            if (inStockCb) inStockCb.checked = false;
            if (onSaleCb)  onSaleCb.checked  = false;
            if (sortSel)   sortSel.value     = 'default';
            catLinks.forEach(l => l.classList.remove('active'));
            const allLink = document.querySelector('.filter-list a[data-filter="all"]');
            if (allLink) allLink.classList.add('active');
            applyFilters();
        });
    }

    applyFilters();
})();
