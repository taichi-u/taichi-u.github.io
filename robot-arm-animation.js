// Robot Arm Tracking Animation
class RobotArmAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Animation properties
        this.animationFrame = null;
        this.angle = 0;
        this.trackingComplete = false;
        this.trackingAngle = 0;
        
        // Satellite properties
        this.satelliteOrbitRadius = this.width * 0.25;
        this.satelliteCenter = {
            x: this.width * 0.6,
            y: this.height * 0.5
        };
        this.satelliteSize = 15;
        
        // Robot arm properties
        this.basePosition = {
            x: this.width * 0.2,
            y: this.height * 0.7
        };
        
        // 7 segments for 7-DOF arm
        this.segments = [
            { length: 40, angle: -Math.PI/4, color: '#3b82f6' },
            { length: 50, angle: Math.PI/6, color: '#3b82f6' },
            { length: 45, angle: Math.PI/6, color: '#3b82f6' },
            { length: 40, angle: Math.PI/8, color: '#60a5fa' },
            { length: 35, angle: Math.PI/8, color: '#60a5fa' },
            { length: 30, angle: Math.PI/10, color: '#93c5fd' },
            { length: 25, angle: 0, color: '#93c5fd' }
        ];
        
        // Initialize arm joint positions
        this.jointPositions = [];
        this.calculateJointPositions();
    }
    
    calculateJointPositions() {
        this.jointPositions = [];
        let currentX = this.basePosition.x;
        let currentY = this.basePosition.y;
        this.jointPositions.push({x: currentX, y: currentY});
        
        let cumulativeAngle = 0;
        
        for (let i = 0; i < this.segments.length; i++) {
            cumulativeAngle += this.segments[i].angle;
            currentX += this.segments[i].length * Math.cos(cumulativeAngle);
            currentY += this.segments[i].length * Math.sin(cumulativeAngle);
            this.jointPositions.push({x: currentX, y: currentY});
        }
    }
    
    getSatellitePosition() {
        // Calculate satellite position based on orbit and angle
        const x = this.satelliteCenter.x + this.satelliteOrbitRadius * Math.cos(this.angle);
        const y = this.satelliteCenter.y + this.satelliteOrbitRadius * Math.sin(this.angle);
        return {x, y};
    }
    
    updateArmAngles() {
        if (this.trackingComplete) return;
        
        // Get current satellite position
        const targetPos = this.getSatellitePosition();
        
        // Simple inverse kinematics for demonstration
        // This is a simplified approach - real inverse kinematics for a 7-DOF arm would be much more complex
        
        // Adjust the segments to try reaching the target
        for (let i = this.segments.length - 1; i >= 0; i--) {
            // Get current end effector position
            const endEffector = this.jointPositions[this.segments.length];
            
            // Get current joint position
            const joint = this.jointPositions[i];
            
            // Calculate vectors
            const toEndEffector = {
                x: endEffector.x - joint.x,
                y: endEffector.y - joint.y
            };
            
            const toTarget = {
                x: targetPos.x - joint.x,
                y: targetPos.y - joint.y
            };
            
            // Calculate angles
            const currentAngle = Math.atan2(toEndEffector.y, toEndEffector.x);
            const targetAngle = Math.atan2(toTarget.y, toTarget.x);
            
            // Find the angle difference
            let deltaAngle = targetAngle - currentAngle;
            
            // Normalize the angle
            while (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
            while (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;
            
            // Limit the rotation speed
            const maxRotation = 0.02;
            deltaAngle = Math.max(-maxRotation, Math.min(maxRotation, deltaAngle));
            
            // Adjust the joint angle
            let cumulativeAngle = 0;
            for (let j = 0; j < i; j++) {
                cumulativeAngle += this.segments[j].angle;
            }
            
            this.segments[i].angle += deltaAngle;
            
            // Recalculate all joint positions
            this.calculateJointPositions();
        }
    }
    
    drawSatellite() {
        const pos = this.getSatellitePosition();
        
        // Draw satellite orbit path
        this.ctx.beginPath();
        this.ctx.arc(this.satelliteCenter.x, this.satelliteCenter.y, this.satelliteOrbitRadius, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.setLineDash([5, 5]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw tracking arc - the portion we're focused on tracking (now 180° instead of 90°)
        this.ctx.beginPath();
        this.ctx.arc(this.satelliteCenter.x, this.satelliteCenter.y, this.satelliteOrbitRadius, 
                    0, Math.PI, false);
        this.ctx.strokeStyle = 'rgba(100, 255, 218, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.lineWidth = 1;
        
        // Draw satellite
        this.ctx.fillStyle = '#64ffda';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, this.satelliteSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw satellite details (solar panels)
        this.ctx.fillStyle = '#60a5fa';
        this.ctx.fillRect(pos.x - this.satelliteSize * 2, pos.y - this.satelliteSize * 0.4, 
                        this.satelliteSize * 1.5, this.satelliteSize * 0.8);
        this.ctx.fillRect(pos.x + this.satelliteSize * 0.5, pos.y - this.satelliteSize * 0.4, 
                        this.satelliteSize * 1.5, this.satelliteSize * 0.8);
        
        // Draw satellite body outline
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, this.satelliteSize, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    drawRobotBase() {
        // Draw the platform/base
        this.ctx.fillStyle = '#1e3a8a';
        this.ctx.beginPath();
        this.ctx.rect(this.basePosition.x - 30, this.basePosition.y - 5, 60, 20);
        this.ctx.fill();
        
        // Draw base details
        this.ctx.fillStyle = '#1e40af';
        this.ctx.beginPath();
        this.ctx.rect(this.basePosition.x - 20, this.basePosition.y - 15, 40, 10);
        this.ctx.fill();
    }
    
    drawRobotArm() {
        // Draw each segment of the arm
        for (let i = 0; i < this.segments.length; i++) {
            const start = this.jointPositions[i];
            const end = this.jointPositions[i + 1];
            
            // Draw segment
            this.ctx.strokeStyle = this.segments[i].color;
            this.ctx.lineWidth = 10 - i;
            this.ctx.beginPath();
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.stroke();
            
            // Draw joint
            this.ctx.fillStyle = '#3b82f6';
            this.ctx.beginPath();
            this.ctx.arc(start.x, start.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw end effector (gripper)
        const endEffector = this.jointPositions[this.segments.length];
        this.ctx.fillStyle = '#64ffda';
        this.ctx.beginPath();
        this.ctx.arc(endEffector.x, endEffector.y, 7, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw gripper details
        this.ctx.strokeStyle = '#64ffda';
        this.ctx.lineWidth = 2;
        
        // Left gripper part
        this.ctx.beginPath();
        this.ctx.moveTo(endEffector.x, endEffector.y);
        this.ctx.lineTo(endEffector.x - 8, endEffector.y + 10);
        this.ctx.stroke();
        
        // Right gripper part
        this.ctx.beginPath();
        this.ctx.moveTo(endEffector.x, endEffector.y);
        this.ctx.lineTo(endEffector.x + 8, endEffector.y + 10);
        this.ctx.stroke();
    }
    
    drawStatusInfo() {
        // Draw tracking status information
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        
        // Display tracking angle progress (now out of 180° instead of 90°)
        const trackingAngleInDegrees = Math.round(this.trackingAngle * (180 / Math.PI));
        this.ctx.fillText(`Tracking Progress: ${trackingAngleInDegrees}° / 180°`, 20, 25);
        
        // Draw progress bar
        const progressBarWidth = 120;
        const progressBarHeight = 10;
        const progressX = 160;
        const progressY = 20;
        
        // Background
        this.ctx.fillStyle = 'rgba(255,255,255,0.2)';
        this.ctx.fillRect(progressX, progressY - progressBarHeight/2, progressBarWidth, progressBarHeight);
        
        // Progress fill (now divided by PI instead of PI/2)
        const completionRatio = Math.min(1, this.trackingAngle / Math.PI);
        this.ctx.fillStyle = '#64ffda';
        this.ctx.fillRect(progressX, progressY - progressBarHeight/2, progressBarWidth * completionRatio, progressBarHeight);
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Set background
        this.ctx.fillStyle = '#0f172a'; // Dark background
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw some stars in background
        this.drawStars();
        
        // Draw robot base first
        this.drawRobotBase();
        
        // Draw satellite and its orbit
        this.drawSatellite();
        
        // Draw the robot arm
        this.drawRobotArm();
        
        // Draw status information
        this.drawStatusInfo();
        
        // Draw connection line between end effector and satellite
        const endEffector = this.jointPositions[this.segments.length];
        const satellitePos = this.getSatellitePosition();
        const distance = Math.sqrt(
            Math.pow(endEffector.x - satellitePos.x, 2) + 
            Math.pow(endEffector.y - satellitePos.y, 2)
        );
        
        // Only draw tracking line if somewhat close
        if (distance < 100) {
            this.ctx.strokeStyle = 'rgba(100, 255, 218, 0.3)';
            this.ctx.setLineDash([2, 2]);
            this.ctx.beginPath();
            this.ctx.moveTo(endEffector.x, endEffector.y);
            this.ctx.lineTo(satellitePos.x, satellitePos.y);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }
    
    drawStars() {
        // Draw small stars in the background
        this.ctx.fillStyle = 'white';
        for (let i = 0; i < 50; i++) {
            const size = Math.random() * 2;
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const opacity = Math.random() * 0.8 + 0.2;
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    update() {
        // Update satellite position (move in circular path)
        if (!this.trackingComplete) {
            this.angle += 0.01;
            this.trackingAngle += 0.01;
            
            // End tracking after 180 degrees instead of 90
            if (this.trackingAngle >= Math.PI) {
                this.trackingComplete = true;
                this.trackingAngle = Math.PI; // Ensure it stops exactly at 180 degrees
            }
        }
        
        // Update arm segments to track the satellite
        this.updateArmAngles();
    }
    
    animate() {
        this.update();
        this.draw();
        
        // Always continue animation
        if (this.trackingComplete && !this.endDelay) {
            this.endDelay = true;
            setTimeout(() => {
                // Reset animation
                this.angle = 0;
                this.trackingAngle = 0;
                this.trackingComplete = false;
                this.endDelay = false;
                
                // Reset arm positions
                this.segments = [
                    { length: 40, angle: -Math.PI/4, color: '#3b82f6' },
                    { length: 50, angle: Math.PI/6, color: '#3b82f6' },
                    { length: 45, angle: Math.PI/6, color: '#3b82f6' },
                    { length: 40, angle: Math.PI/8, color: '#60a5fa' },
                    { length: 35, angle: Math.PI/8, color: '#60a5fa' },
                    { length: 30, angle: Math.PI/10, color: '#93c5fd' },
                    { length: 25, angle: 0, color: '#93c5fd' }
                ];
                this.calculateJointPositions();
            }, 1000); // Reduced delay to 1 second for quicker restart
        }
        
        // Always continue the animation loop
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }
    
    start() {
        if (this.canvas) {
            this.animate();
        }
    }
    
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
}

// Initialize the animation when the popup is opened
document.addEventListener('DOMContentLoaded', function() {
    // Get all research popup buttons
    const researchButtons = document.querySelectorAll('.details-btn');
    let robotArmAnimation = null;
    
    researchButtons.forEach(button => {
        button.addEventListener('click', () => {
            const popupId = button.getAttribute('data-popup');
            
            // Check if this is the robot arm research popup
            if (popupId === 'research6') {
                // Initialize animation after a short delay to ensure the popup is visible
                setTimeout(() => {
                    if (!robotArmAnimation) {
                        robotArmAnimation = new RobotArmAnimation('robotArmCanvas');
                    }
                    robotArmAnimation.start();
                }, 300);
            }
        });
    });
    
    // Stop animation when popup is closed
    document.querySelectorAll('.close-popup').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            if (robotArmAnimation) {
                robotArmAnimation.stop();
            }
        });
    });
    
    // Also stop when clicking outside the popup
    document.querySelectorAll('.popup-overlay').forEach(popup => {
        popup.addEventListener('click', (e) => {
            if (e.target === popup && robotArmAnimation) {
                robotArmAnimation.stop();
            }
        });
    });
});