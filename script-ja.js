document.addEventListener('DOMContentLoaded', function() {
    // Initialize typing animation
    initTypedText();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize show more/less buttons
    initShowMoreButtons();
    
    // Initialize particles.js
    initParticles();
    
    // Initialize header scroll effect
    initHeaderScroll();
});

// Typing animation for hero section (Japanese)
function initTypedText() {
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                '航空宇宙工学専攻',
                'JAXA ISAS ミッション設計研究',
                '宇宙ロボティクス研究者',
                '月面ロボットの強化学習',
                '中谷財団奨学生'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            smartBackspace: true
        });
    }
}

// Initialize scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "-50px"
    });
    
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

// Initialize mobile menu
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }
}

// Initialize show more/less buttons (Japanese)
function initShowMoreButtons() {
    const showMoreActivitiesBtn = document.getElementById('show-more-activities');
    const moreActivities = document.getElementById('more-activities');
    
    if (showMoreActivitiesBtn && moreActivities) {
        showMoreActivitiesBtn.addEventListener('click', () => {
            moreActivities.classList.toggle('visible');
            
            if (moreActivities.classList.contains('visible')) {
                showMoreActivitiesBtn.innerHTML = '閉じる <i class="fas fa-chevron-up"></i>';
            } else {
                showMoreActivitiesBtn.innerHTML = 'さらに表示 <i class="fas fa-chevron-down"></i>';
            }
        });
    }
    
    const showMoreAwardsBtn = document.getElementById('show-more-awards');
    const moreAwards = document.getElementById('more-awards');
    
    if (showMoreAwardsBtn && moreAwards) {
        showMoreAwardsBtn.addEventListener('click', () => {
            moreAwards.classList.toggle('visible');
            
            if (moreAwards.classList.contains('visible')) {
                showMoreAwardsBtn.innerHTML = '閉じる <i class="fas fa-chevron-up"></i>';
            } else {
                showMoreAwardsBtn.innerHTML = 'さらに表示 <i class="fas fa-chevron-down"></i>';
            }
        });
    }
}

// Initialize particles.js
function initParticles() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: ["#3b82f6", "#10b981", "#8b5cf6"] },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
                size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1 } },
                line_linked: { enable: true, distance: 150, color: "#60a5fa", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 1, direction: "none", random: true, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
                modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });
    }
}

// Initialize header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}
