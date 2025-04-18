// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTypeAnimation();
    initScrollAnimations();
    initParticles();
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initFormHandling();
    animateSkillBars();
});

// Typing animation for hero section
function initTypeAnimation() {
    const options = {
        strings: [
            'Aerospace Engineering Student',
            'Robotics Enthusiast',
            'Space Tech Innovator',
            'Problem Solver'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true
    };
    
    new Typed('#typed-text', options);
}

// Scroll animations for sections
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // For skill bars, also animate them when they come into view
                if (entry.target.classList.contains('skills')) {
                    animateSkillBars();
                }
            }
        });
    }, { threshold: 0.1 });
    
    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Also observe the skills section
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) observer.observe(skillsSection);
}

// Animate skill bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        bar.style.transform = 'scaleX(' + (bar.style.width || '0') + ')';
    });
}

// Particle background for hero section
function initParticles() {
    // This function is now handled by space-animation.js
    // Keep this function empty to avoid errors, since it's called in DOMContentLoaded
}

// Mobile menu toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Offset for header
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Form submission handling
function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // In a real application, you would send the form data to a backend
            // For demo purposes, we'll just show an alert
            alert('Thanks for your message! In a real application, this would be sent to a server.');
            contactForm.reset();
        });
    }
}