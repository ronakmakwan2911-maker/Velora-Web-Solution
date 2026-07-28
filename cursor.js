/* ==========================================================================
   VELORA Web Solution - Custom Cursor & Magnetic Physics Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Check if touchscreen device (accessibility check - disable on touch)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    // 1. Spawning Cursor Elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const follower = document.createElement('div');
    follower.className = 'custom-cursor-follower';
    
    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    // Interpolation factor (smooth trail)
    const lerpFactor = 0.12;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Move core point instantly
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    // Outer follower moves smoothly using linear interpolation (lerp) at 60 FPS
    function updateFollower() {
        followerX += (mouseX - followerX) * lerpFactor;
        followerY += (mouseY - followerY) * lerpFactor;

        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;

        requestAnimationFrame(updateFollower);
    }
    updateFollower();

    // 2. Cursor Hover Scaling states
    const expandTargets = document.querySelectorAll('a, button, .service-card, .project-item, .theme-toggle-btn');
    const shrinkTargets = document.querySelectorAll('h1, h2, h3, .about-story-text p');

    expandTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover-expand');
            follower.classList.add('hover-expand');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover-expand');
            follower.classList.remove('hover-expand');
        });
    });

    shrinkTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover-shrink');
            follower.classList.add('hover-shrink');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover-shrink');
            follower.classList.remove('hover-shrink');
        });
    });

    // 3. Click Ripple Animation
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        ripple.className = 'click-ripple-element';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);

        // Inject click animation styles directly
        gsap.fromTo(ripple, 
            { width: 0, height: 0, opacity: 0.8 },
            { 
                width: 50, 
                height: 50, 
                opacity: 0, 
                duration: 0.6, 
                ease: 'power2.out',
                onComplete: () => ripple.remove()
            }
        );
    });

    // 4. Magnetic Buttons physics attraction
    const magneticElements = document.querySelectorAll('.magnetic');

    magneticElements.forEach(el => {
        const strengthAttr = el.getAttribute('data-magnetic-strength');
        const strength = strengthAttr ? parseFloat(strengthAttr) : 0.2;

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            // Apply displacement force
            gsap.to(el, {
                x: deltaX * strength,
                y: deltaY * strength,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Scale outer follower on button close-up
            follower.style.width = '55px';
            follower.style.height = '55px';
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.3)' // Micro-bounce spec
            });
            
            follower.style.width = '';
            follower.style.height = '';
        });
    });
});
