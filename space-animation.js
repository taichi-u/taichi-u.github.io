// Space-themed canvas animation
class SpaceAnimation {
    constructor(elementId) {
        this.canvas = document.getElementById(elementId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.stars = [];
        this.spaceObjects = [];
        this.dimensions = { width: 0, height: 0 };
        
        // Space objects images
        this.objectTypes = [
            { type: 'satellite', probability: 0.3 },
            { type: 'rover', probability: 0.3 },
            { type: 'rocket', probability: 0.4 }
        ];
        
        this.images = {
            satellite: null,
            rover: null,
            rocket: null
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.loadImages();
        this.createStars();
        this.animate();
        
        window.addEventListener('resize', () => this.setupCanvas());
    }
    
    setupCanvas() {
        this.dimensions.width = window.innerWidth;
        this.dimensions.height = this.canvas.closest('section').offsetHeight;
        
        this.canvas.width = this.dimensions.width;
        this.canvas.height = this.dimensions.height;
        
        // Clear and recreate particles and objects when resizing
        if (this.particles.length > 0) {
            this.particles = [];
            this.stars = [];
            this.spaceObjects = [];
            this.createStars();
            this.createSpaceObjects();
        }
    }
    
    loadImages() {
        const loadImage = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.src = src;
            });
        };
        
        // Load SVG images for space objects
        Promise.all([
            loadImage('https://cdn.jsdelivr.net/gh/taichi-u/space-assets@main/satellite.svg'),
            loadImage('https://cdn.jsdelivr.net/gh/taichi-u/space-assets@main/rover.svg'),
            loadImage('https://cdn.jsdelivr.net/gh/taichi-u/space-assets@main/rocket.svg')
        ]).then(([satellite, rover, rocket]) => {
            this.images.satellite = satellite;
            this.images.rover = rover;
            this.images.rocket = rocket;
            this.createSpaceObjects();
        }).catch(err => {
            console.error("Error loading space images, using fallback objects", err);
            this.createSpaceObjects(true); // Use fallback shapes if images fail to load
        });
    }
    
    createStars() {
        // Create small star particles
        const starCount = Math.floor(this.dimensions.width * this.dimensions.height / 3000);
        
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.dimensions.width,
                y: Math.random() * this.dimensions.height,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                twinkleDirection: 1
            });
        }
    }
    
    createSpaceObjects(useFallback = false) {
        // Create 5-10 space objects
        const objectCount = Math.floor(Math.random() * 6) + 5;
        
        for (let i = 0; i < objectCount; i++) {
            // Select object type based on probability
            const rand = Math.random();
            let type = this.objectTypes[0].type;
            let cumProb = 0;
            
            for (const objType of this.objectTypes) {
                cumProb += objType.probability;
                if (rand <= cumProb) {
                    type = objType.type;
                    break;
                }
            }
            
            // Create space object
            const size = Math.random() * 30 + 20;
            this.spaceObjects.push({
                type: type,
                x: Math.random() * this.dimensions.width,
                y: Math.random() * this.dimensions.height,
                size: size,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                useFallback: useFallback
            });
        }
    }
    
    drawStar(star) {
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        this.ctx.fill();
        
        // Make stars twinkle
        star.opacity += star.twinkleSpeed * star.twinkleDirection;
        
        if (star.opacity >= 1) {
            star.twinkleDirection = -1;
        } else if (star.opacity <= 0.2) {
            star.twinkleDirection = 1;
        }
    }
    
    drawSpaceObject(obj) {
        this.ctx.save();
        this.ctx.translate(obj.x, obj.y);
        this.ctx.rotate(obj.rotation);
        
        if (obj.useFallback || !this.images[obj.type]) {
            // Draw fallback shapes if images aren't loaded
            this.ctx.fillStyle = '#3b82f6';
            
            if (obj.type === 'rocket') {
                // Draw triangular rocket
                this.ctx.beginPath();
                this.ctx.moveTo(0, -obj.size/2);
                this.ctx.lineTo(obj.size/2, obj.size/2);
                this.ctx.lineTo(-obj.size/2, obj.size/2);
                this.ctx.closePath();
                this.ctx.fill();
            } else if (obj.type === 'satellite') {
                // Draw satellite (rectangle with wings)
                this.ctx.fillRect(-obj.size/4, -obj.size/4, obj.size/2, obj.size/2);
                this.ctx.fillRect(-obj.size/2, 0, obj.size, obj.size/8);
            } else {
                // Draw rover (rectangle)
                this.ctx.fillRect(-obj.size/2, -obj.size/4, obj.size, obj.size/2);
                // Draw wheels
                this.ctx.fillStyle = '#8b5cf6';
                this.ctx.fillRect(-obj.size/2, obj.size/4, obj.size/4, obj.size/6);
                this.ctx.fillRect(obj.size/4, obj.size/4, obj.size/4, obj.size/6);
            }
        } else {
            // Draw the image
            this.ctx.drawImage(
                this.images[obj.type],
                -obj.size/2,
                -obj.size/2,
                obj.size,
                obj.size
            );
        }
        
        this.ctx.restore();
        
        // Update position for next frame
        obj.x += obj.speedX;
        obj.y += obj.speedY;
        obj.rotation += obj.rotationSpeed;
        
        // Wrap around canvas edges
        if (obj.x < -obj.size) obj.x = this.dimensions.width + obj.size;
        if (obj.x > this.dimensions.width + obj.size) obj.x = -obj.size;
        if (obj.y < -obj.size) obj.y = this.dimensions.height + obj.size;
        if (obj.y > this.dimensions.height + obj.size) obj.y = -obj.size;
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.stars.forEach(star => this.drawStar(star));
        
        // Draw space objects
        this.spaceObjects.forEach(obj => this.drawSpaceObject(obj));
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create canvas for space animation
    const heroSection = document.getElementById('particles-js');
    if (heroSection) {
        const canvas = document.createElement('canvas');
        canvas.id = 'space-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '0';
        heroSection.appendChild(canvas);
        
        // Initialize animation
        new SpaceAnimation('space-canvas');
    }
});