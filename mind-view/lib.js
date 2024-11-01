/**
 * This file contains the library of functions for the MindView project.
 */
// Define pairs of similar colors
const similarColors = [
    ["red", "pink"],
    ["red", "orange"],
    ["blue", "green"],
    ["blue", "lightblue"],
    ["blue", "teal"],
    ["orange", "brown"],
    ["orange", "yellow"],
    ["green", "lime"],
    ["green", "teal"],
    ["gray", "darkgray"],
    ["black", "gray"],
    ["yellow", "gold"],
];

// More advance similar colors
const similarColorsAdvanced = [
    ["teal", "turquoise"],
    ["orange", "coral"],
    ["purple", "violet"],
    ["brown", "sienna"],
];

// Randomize similar colors
function randomizeSimilarColors() {

    // Get random color pair
    let randomIndex = Math.floor(Math.random() * similarColors.length);
    let colorPair = similarColors[randomIndex];

    // Randomly swap the order
    if (Math.random() < 0.5) {
        colorPair = [colorPair[1], colorPair[0]];
    }
    return colorPair
}

// Show toast notification
function showToast(message, duration = 10000) {
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.setAttribute('aria-live', 'assertive');
    // Announce to screen readers
    toast.style.visibility = 'visible';

    setTimeout(() => {
        toast.style.opacity = '0';
        // Hide after transition
        setTimeout(() => {
            toast.style.visibility = 'hidden';
        }, 500);
    }, duration);
}

// Confetti Effect Implementation
class Confetti {
    constructor(width = window.innerWidth, height = window.innerHeight) {
        // Create and setup canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1000';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#FFC700', '#FF0000', '#2E3192', '#41BBC7'];
    }

    triggerConfetti() {
        for (let i = 0; i < 150; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                r: Math.random() * 6 + 1,
                d: Math.random() * 100,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                tilt: Math.floor(Math.random() * 10) - 10,
                tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
                tiltAngle: 0
            });
        }

        this.animate();
    }

    animate = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach((p, index) => {
            this.ctx.beginPath();
            this.ctx.lineWidth = p.r;
            this.ctx.strokeStyle = p.color;
            this.ctx.moveTo(p.x + p.tilt + p.r, p.y);
            this.ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
            this.ctx.stroke();
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
            p.x += Math.sin(p.d);
            p.tilt = Math.sin(p.tiltAngle) * 15;

            if (p.y > this.canvas.height) {
                this.particles.splice(index, 1);
            }
        });

        if (this.particles.length > 0) {
            requestAnimationFrame(this.animate);
        } else {
            // Remove canvas when animation is complete
            this.canvas.remove();
        }
    }
}

class Toaster {
    constructor(customStyles = {}) {
        // Create toast element
        this.toast = document.createElement('div');
        this.toast.setAttribute('role', 'alert');
        this.toast.setAttribute('aria-live', 'assertive');

        // Default styles
        const defaultStyles = {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '4px',
            fontSize: '16px',
            opacity: '0',
            transition: 'opacity 0.3s ease-in-out',
            zIndex: '1000',
            textAlign: 'center',
            maxWidth: '80%',
            wordWrap: 'break-word'
        };

        // Merge default and custom styles
        const finalStyles = { ...defaultStyles, ...customStyles };

        // Apply styles
        Object.assign(this.toast.style, finalStyles);

        // Add to document
        document.body.appendChild(this.toast);
    }

    // Variable to hold timeout
    timeoutObject;
    // Default timeout
    defaultTimeout = 17e3;

    /**
     * Show toast message
     * @param {string} message 
     */
    show(message) {
        // Cancel the timeout if exists
        if (this.timeoutObject) {
            clearTimeout(this.timeoutObject);
        }

        // Set message
        this.toast.textContent = message;

        // Show toast
        this.toast.style.opacity = '1';

        // Hide after 10 seconds
        this.timeoutObject = setTimeout(() => {
            // Fade out 
            this.toast.style.opacity = '0';
        }, this.defaultTimeout);
    }
}