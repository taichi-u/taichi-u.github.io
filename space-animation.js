// Space-themed canvas animation with spacecraft elements
class SpaceAnimation {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.spaceObjects = [];
        this.stars = [];
        this.init();
    }
    
    init() {
        // Add canvas to particles-js container
        const particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
            this.canvas.id = 'space-canvas';
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '1';
            particlesContainer.appendChild(this.canvas);
            
            // Setup canvas size
            this.resize();
            window.addEventListener('resize', () => this.resize());
            
            // Create space objects
            this.createStars();
            this.createSpaceObjects();
            
            // Start animation loop
            this.animate();
        }
    }
    
    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        
        // Recreate stars when resizing
        this.stars = [];
        this.createStars();
        
        // Reposition space objects to keep them on screen
        if (this.spaceObjects.length > 0) {
            this.spaceObjects.forEach(obj => {
                obj.x = Math.random() * this.canvas.width;
                obj.y = Math.random() * this.canvas.height;
                obj.trail = []; // Reset trail when resizing
            });
        }
    }
    
    createStars() {
        // Create small background stars
        const areaMultiplier = this.canvas.width * this.canvas.height / 100000;
        const starCount = Math.min(200, Math.floor(areaMultiplier * 100));
        
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                twinkleDirection: Math.random() > 0.5 ? 1 : -1
            });
        }
    }
    
    createSpaceObjects() {
        // Create spacecraft, satellites, and rovers
        const objectTypes = ['spacecraft', 'satellite', 'rover'];
        const objectCount = 3 + Math.floor(Math.random() * 4); // 3-6 objects
        
        for (let i = 0; i < objectCount; i++) {
            const type = objectTypes[Math.floor(Math.random() * objectTypes.length)];
            const size = type === 'spacecraft' ? 30 : (type === 'satellite' ? 20 : 25);
            
            this.spaceObjects.push({
                type: type,
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: size,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: (Math.random() - 0.5) * 0.8,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                trail: []
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
        } else if (star.opacity <= 0.1) {
            star.twinkleDirection = 1;
        }
    }
    
    drawSpaceObject(obj) {
        // Update the position first so trail is correct
        obj.x += obj.speedX;
        obj.y += obj.speedY;
        obj.rotation += obj.rotationSpeed;
        
        // Wrap around canvas edges
        if (obj.x < -obj.size * 2) obj.x = this.canvas.width + obj.size;
        if (obj.x > this.canvas.width + obj.size * 2) obj.x = -obj.size;
        if (obj.y < -obj.size * 2) obj.y = this.canvas.height + obj.size;
        if (obj.y > this.canvas.height + obj.size * 2) obj.y = -obj.size;
        
        // Create a trail
        if (obj.trail.length > 15) obj.trail.shift();
        obj.trail.push({x: obj.x, y: obj.y});
        
        // Draw trail
        this.ctx.save();
        for (let i = 0; i < obj.trail.length - 1; i++) {
            const opacity = i / obj.trail.length;
            this.ctx.beginPath();
            this.ctx.moveTo(obj.trail[i].x, obj.trail[i].y);
            this.ctx.lineTo(obj.trail[i+1].x, obj.trail[i+1].y);
            this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`;
            this.ctx.lineWidth = opacity * 2;
            this.ctx.stroke();
        }
        this.ctx.restore();
        
        // Draw the object
        this.ctx.save();
        this.ctx.translate(obj.x, obj.y);
        this.ctx.rotate(obj.rotation);
        
        // Draw different space objects
        switch(obj.type) {
            case 'spacecraft':
                this.drawSpacecraft(obj.size);
                break;
            case 'satellite':
                this.drawSatellite(obj.size);
                break;
            case 'rover':
                this.drawRover(obj.size);
                break;
        }
        
        this.ctx.restore();
    }
    
    drawSpacecraft(size) {
        // Main body
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.beginPath();
        this.ctx.moveTo(size, 0);
        this.ctx.lineTo(size/2, -size/2);
        this.ctx.lineTo(-size/2, -size/3);
        this.ctx.lineTo(-size, 0);
        this.ctx.lineTo(-size/2, size/3);
        this.ctx.lineTo(size/2, size/2);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Cockpit
        this.ctx.fillStyle = '#64ffda'; // Changed to match secondary-color
        this.ctx.beginPath();
        this.ctx.arc(size/2, 0, size/4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Engine glow
        this.ctx.fillStyle = 'rgba(255, 165, 0, 0.7)';
        this.ctx.beginPath();
        this.ctx.moveTo(-size, -size/4);
        this.ctx.lineTo(-size * 1.5, 0);
        this.ctx.lineTo(-size, size/4);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Add highlights to spacecraft
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(size/2, -size/2);
        this.ctx.lineTo(size/2, size/2);
        this.ctx.stroke();
    }
    
    drawSatellite(size) {
        // Main body
        this.ctx.fillStyle = '#8b5cf6';
        this.ctx.fillRect(-size/4, -size/4, size/2, size/2);
        
        // Solar panels
        this.ctx.fillStyle = '#60a5fa';
        this.ctx.fillRect(-size, -size/8, size/2, size/4);
        this.ctx.fillRect(size/4, -size/8, size/2, size/4);
        
        // Panel details
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(-size, -size/8);
        this.ctx.lineTo(-size/2, -size/8);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(-size, size/8);
        this.ctx.lineTo(-size/2, size/8);
        this.ctx.stroke();
        
        // Antenna
        this.ctx.strokeStyle = '#f1f5f9';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -size/4);
        this.ctx.lineTo(0, -size/2);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(0, -size/2, size/6, 0, Math.PI, true);
        this.ctx.stroke();
    }
    
    drawRover(size) {
        // Body
        this.ctx.fillStyle = '#10b981';
        this.ctx.fillRect(-size/2, -size/4, size, size/2);
        
        // Wheels
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.fillRect(-size/2, size/4, size/4, size/4);
        this.ctx.fillRect(-size/8, size/4, size/4, size/4);
        this.ctx.fillRect(size/4, size/4, size/4, size/4);
        
        // Wheel details
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(-size/2 + size/8, size/4 + size/8, size/12, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(0, size/4 + size/8, size/12, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(size/2 - size/8, size/4 + size/8, size/12, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Antenna/Sensors
        this.ctx.fillStyle = '#64ffda'; // Changed to match secondary-color
        this.ctx.beginPath();
        this.ctx.moveTo(0, -size/4);
        this.ctx.lineTo(-size/4, -size/2);
        this.ctx.lineTo(size/4, -size/2);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.stars.forEach(star => this.drawStar(star));
        
        // Draw space objects
        this.spaceObjects.forEach(obj => this.drawSpaceObject(obj));
        
        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Give particles.js time to initialize first
    setTimeout(() => {
        const particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
            new SpaceAnimation();
            console.log('Space animation initialized');
        } else {
            console.warn('Particles container not found for space animation');
        }
    }, 500);
});

