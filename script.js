document.addEventListener('DOMContentLoaded', function() {
    // Initialize typing animation
    initTypedText();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize tab system
    initTabs();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize show more/less buttons
    initShowMoreButtons();
    
    // Initialize activity popup details
    initActivityPopups();
    
    // Initialize particles.js
    initParticles();
    
    // Initialize header scroll effect
    initHeaderScroll();
});

// Typing animation for hero section
function initTypedText() {
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                'Aerospace Engineering Student',
                'Mission Design Researcher @ JAXA',
                'Space Robotics Researcher',
                'Reinforcement Learning for Lunar Robots',
                'Nakatani Foundation Scholar'
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
    // Create the Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the element is in the viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        root: null, // Use the viewport as the root
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "-50px" // Trigger a bit before the element enters the viewport
    });
    
    // Observe all elements with the fade-in class
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

// Initialize tabs
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and tab panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Initialize mobile menu
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });
}

// Initialize show more/less buttons
function initShowMoreButtons() {
    // Show more activities
    const showMoreActivitiesBtn = document.getElementById('show-more-activities');
    const moreActivities = document.getElementById('more-activities');
    
    if (showMoreActivitiesBtn && moreActivities) {
        showMoreActivitiesBtn.addEventListener('click', () => {
            moreActivities.classList.toggle('visible');
            
            if (moreActivities.classList.contains('visible')) {
                showMoreActivitiesBtn.innerHTML = 'Show Less Activities <i class="fas fa-chevron-up"></i>';
            } else {
                showMoreActivitiesBtn.innerHTML = 'Show More Activities <i class="fas fa-chevron-down"></i>';
            }
        });
    }
    
    // Show more awards
    const showMoreAwardsBtn = document.getElementById('show-more-awards');
    const moreAwards = document.getElementById('more-awards');
    
    if (showMoreAwardsBtn && moreAwards) {
        showMoreAwardsBtn.addEventListener('click', () => {
            moreAwards.classList.toggle('visible');
            
            if (moreAwards.classList.contains('visible')) {
                showMoreAwardsBtn.innerHTML = 'Show Less Awards <i class="fas fa-chevron-up"></i>';
            } else {
                showMoreAwardsBtn.innerHTML = 'Show More Awards <i class="fas fa-chevron-down"></i>';
            }
        });
    }
}

// Initialize activity popup details
function initActivityPopups() {
    // Setup click listeners for all activity details buttons
    document.querySelectorAll('.activity-details-btn').forEach(button => {
        button.addEventListener('click', () => {
            const activityId = button.getAttribute('data-activity-id');
            const popup = document.getElementById(`${activityId}-details`);
            
            if (popup) {
                popup.style.display = 'flex';
            }
        });
    });
    
    // Setup close buttons for all popups
    document.querySelectorAll('.close-popup').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.activity-details-popup').style.display = 'none';
        });
    });
    
    // Close popup when clicking outside content
    document.querySelectorAll('.activity-details-popup').forEach(popup => {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.style.display = 'none';
            }
        });
    });
}

// Initialize particles.js
function initParticles() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 100,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ["#3b82f6", "#10b981", "#8b5cf6"]
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#60a5fa",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}

// Initialize header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}