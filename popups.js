document.addEventListener('DOMContentLoaded', function() {
    // Initialize research popups
    initPopups();
    
    // Initialize activity popups (reusing existing function)
    initActivityPopups();
});

// Initialize general popup system
function initPopups() {
    // Research detail popup buttons
    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', () => {
            const popupId = button.getAttribute('data-popup');
            const popup = document.getElementById(popupId);
            
            if (popup) {
                popup.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });
    
    // Close buttons for all popups
    document.querySelectorAll('.close-popup').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const popup = closeBtn.closest('.popup-overlay');
            if (popup) {
                popup.classList.remove('active');
                document.body.style.overflow = ''; // Allow scrolling again
            }
        });
    });
    
    // Close popup when clicking outside content
    document.querySelectorAll('.popup-overlay').forEach(popup => {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('active');
                document.body.style.overflow = ''; // Allow scrolling again
            }
        });
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.popup-overlay.active').forEach(popup => {
                popup.classList.remove('active');
                document.body.style.overflow = ''; // Allow scrolling again
            });
        }
    });
}