/* ============================
   500 Sesiones de Boxeo
   Sales Page JavaScript
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===========================
    // DYNAMIC DATE (discount bar)
    // ===========================
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        dateEl.textContent = `${day}/${month}/${year}`;
    }

    // ===========================
    // SMOOTH SCROLL
    // ===========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 20;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===========================
    // COUNTDOWN TIMER (15 minutes)
    // ===========================
    const TIMER_KEY = 'boxingTimer_endTime';
    const timerMinEl = document.getElementById('timer-min');
    const timerSecEl = document.getElementById('timer-sec');

    function getEndTime() {
        let endTime = localStorage.getItem(TIMER_KEY);
        if (!endTime || parseInt(endTime) <= Date.now()) {
            endTime = Date.now() + (15 * 60 * 1000);
            localStorage.setItem(TIMER_KEY, endTime.toString());
        }
        return parseInt(endTime);
    }

    const endTime = getEndTime();

    function updateTimer() {
        const now = Date.now();
        const diff = endTime - now;

        if (diff <= 0) {
            timerMinEl.textContent = '00';
            timerSecEl.textContent = '00';
            timerMinEl.classList.add('timer-expired');
            timerSecEl.classList.add('timer-expired');
            return;
        }

        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        timerMinEl.textContent = minutes.toString().padStart(2, '0');
        timerSecEl.textContent = seconds.toString().padStart(2, '0');

        // Urgency color when less than 3 minutes
        if (minutes < 3) {
            timerMinEl.classList.add('timer-low');
            timerSecEl.classList.add('timer-low');
        } else {
            timerMinEl.classList.remove('timer-low');
            timerSecEl.classList.remove('timer-low');
        }

        requestAnimationFrame(updateTimer);
    }

    updateTimer();

    // ===========================
    // CAROUSEL
    // ===========================
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselDotsContainer = document.getElementById('carouselDots');
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let autoSlideInterval;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        carouselDotsContainer.appendChild(dot);
    }

    function goToSlide(index) {
        currentSlide = index;
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update dots
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });

        resetAutoSlide();
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % totalSlides);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }

    carouselNext.addEventListener('click', nextSlide);
    carouselPrev.addEventListener('click', prevSlide);

    // Auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();

    // Touch support for carousel
    let touchStartX = 0;
    let touchEndX = 0;

    const carousel = document.getElementById('carousel');

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }, { passive: true });

    // ===========================
    // FAQ ACCORDION
    // ===========================
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ===========================
    // SCROLL ANIMATIONS
    // ===========================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add staggered delays to grouped elements
    document.querySelectorAll('.cards-grid, .bonos-grid, .testimonials-grid, .pricing-grid').forEach(grid => {
        grid.querySelectorAll('[data-animate]').forEach((el, i) => {
            el.dataset.delay = i * 120;
        });
    });

    document.querySelectorAll('.faq-container [data-animate]').forEach((el, i) => {
        el.dataset.delay = i * 80;
    });

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });

    // ===========================
    // HERO PARTICLES
    // ===========================
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero-particle');
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.width = `${2 + Math.random() * 4}px`;
            particle.style.height = particle.style.width;
            particle.style.opacity = `${0.1 + Math.random() * 0.3}`;
            particle.style.animationDuration = `${4 + Math.random() * 6}s`;
            particle.style.animationDelay = `${Math.random() * 4}s`;

            const colors = [
                'rgba(255, 214, 0, 0.3)',
                'rgba(198, 40, 40, 0.3)',
                'rgba(229, 57, 53, 0.2)',
                'rgba(255, 255, 255, 0.15)'
            ];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            particlesContainer.appendChild(particle);
        }
    }

    // ===========================
    // CTA BUTTON RIPPLE EFFECT
    // ===========================
    document.querySelectorAll('.btn-cta').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation keyframes
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ===========================
    // COUNTER ANIMATION (for numbers)
    // ===========================
    function animateValue(el, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + range * eased);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

});
