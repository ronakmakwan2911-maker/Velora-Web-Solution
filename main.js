/* ==========================================================================
   VELORA Web Solution - General Core Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Progress Bar (Sync scroll percent with bar width)
    initScrollProgressBar();

    function initScrollProgressBar() {
        const bar = document.getElementById('scroll-progress-bar');
        if (!bar) return;

        window.addEventListener('scroll', () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
            bar.style.width = `${scrollPercent}%`;
        });
    }

    // 2. Floating Back To Top Button
    initBackToTopButton();

    function initBackToTopButton() {
        const btt = document.getElementById('back-to-top');
        if (!btt) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btt.classList.add('visible');
            } else {
                btt.classList.remove('visible');
            }
        });

        btt.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 3. Compact Header & Scroll triggers
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Fullscreen Mobile Navigation Menu Overlay
    const menuToggle = document.getElementById('menu-toggle');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (menuToggle && mobileOverlay) {
        menuToggle.addEventListener('click', () => {
            const isActive = menuToggle.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';

            if (isActive && typeof gsap !== 'undefined') {
                gsap.fromTo('.mobile-nav-link', 
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power3.out', delay: 0.2 }
                );
            }
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 5. Capability Card Hover Glow Coordinate calculations
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 6. Dynamic Background Canvas Particles System
    initAmbientParticles();

    function initAmbientParticles() {
        const canvas = document.getElementById('ambient-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.2 - 0.1;
                this.speedY = Math.random() * 0.3 - 0.25; // Drift upward
                this.opacity = Math.random() * 0.25 + 0.05;
                this.maxOpacity = this.opacity;
                this.fadeSpeed = Math.random() * 0.003 + 0.001;
                this.fadeIn = true;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.fadeIn) {
                    this.opacity += this.fadeSpeed;
                    if (this.opacity >= this.maxOpacity) {
                        this.fadeIn = false;
                    }
                } else {
                    this.opacity -= this.fadeSpeed;
                    if (this.opacity <= 0.02) {
                        this.reset();
                    }
                }

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0) this.reset();
            }
            draw() {
                const isLight = window.activeTheme === 'light';
                const rgbColor = isLight ? '123, 44, 191' : '0, 240, 255';
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgbColor}, ${this.opacity})`;
                ctx.fill();
            }
        }

        const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        }
        animate();
    }

    // 7. AI Capability Card Particle Canvas
    initAIOrbParticles();

    function initAIOrbParticles() {
        const canvases = document.querySelectorAll('.card-particles-canvas');
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            let particles = [];

            class MiniParticle {
                constructor() {
                    this.reset();
                }
                reset() {
                    this.x = canvas.width / 2;
                    this.y = canvas.height / 2;
                    this.angle = Math.random() * Math.PI * 2;
                    this.speed = Math.random() * 0.8 + 0.2;
                    this.radius = Math.random() * 1.5 + 0.5;
                    this.opacity = Math.random() * 0.7 + 0.3;
                    this.life = Math.random() * 40 + 20;
                }
                update() {
                    this.x += Math.cos(this.angle) * this.speed;
                    this.y += Math.sin(this.angle) * this.speed;
                    this.opacity -= 0.015;
                    this.life--;
                    if (this.life <= 0 || this.opacity <= 0) {
                        this.reset();
                    }
                }
                draw() {
                    const isLight = window.activeTheme === 'light';
                    const rgb = isLight ? '123, 44, 191' : '0, 240, 255';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${rgb}, ${this.opacity})`;
                    ctx.fill();
                }
            }

            for (let i = 0; i < 15; i++) {
                particles.push(new MiniParticle());
            }

            function tick() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
                requestAnimationFrame(tick);
            }
            tick();
        });
    }

    // 8. Contact Form Submissions with Morphing Button State
    const contactForm = document.getElementById('velora-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitText = submitBtn.querySelector('.btn-text');
            
            submitText.textContent = 'Sending Details...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitText.textContent = 'Project Started ✓';
                submitBtn.style.background = 'linear-gradient(135deg, #0052ff, #7b2cbf)';
                submitBtn.style.color = '#ffffff';
                submitBtn.style.opacity = '1';
                
                contactForm.reset();

                // Revert morph after cool-down
                setTimeout(() => {
                    submitText.textContent = 'Start Your Project →';
                    submitBtn.style.background = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                }, 4000);
            }, 1500);
        });
    }

    // 9. Process Horizontal Timeline line progress filler
    initProcessProgressTimeline();

    function initProcessProgressTimeline() {
        const progressFill = document.getElementById('timeline-scroll-fill');
        const nodes = document.querySelectorAll('.timeline-node-locked');

        if (!progressFill || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const isMobile = window.innerWidth <= 991;

        gsap.to(progressFill, {
            scrollTrigger: {
                trigger: '.process-timeline-horizontal',
                start: 'top center+=100',
                end: 'bottom center-=50',
                scrub: true
            },
            width: isMobile ? '100%' : '100%',
            height: isMobile ? '100%' : '100%',
            ease: 'none'
        });

        nodes.forEach((node) => {
            ScrollTrigger.create({
                trigger: node,
                start: 'top center+=100',
                end: 'bottom center-=100',
                onEnter: () => node.classList.add('active'),
                onEnterBack: () => node.classList.add('active'),
                onLeaveBack: () => node.classList.remove('active')
            });
        });
    }

    // 10. Interactive 3D Parallax Logo
    initLogo3DParallax();

    function initLogo3DParallax() {
        const container = document.getElementById('logo-3d');
        const layers = document.querySelectorAll('.logo-layer');
        const scene = document.querySelector('.hero-right-visual');

        if (!container || !scene) return;

        scene.addEventListener('mousemove', (e) => {
            const rect = scene.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            
            // Calculate mouse position relative to center of visual area
            const mouseX = e.clientX - rect.left - width / 2;
            const mouseY = e.clientY - rect.top - height / 2;
            
            // Max rotation degrees
            const maxRotateX = 15;
            const maxRotateY = 15;
            
            const rotateX = -(mouseY / (height / 2)) * maxRotateX;
            const rotateY = (mouseX / (width / 2)) * maxRotateY;
            
            // Apply rotation to the container
            container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Apply parallax translations to layers based on depth
            layers.forEach(layer => {
                const depth = parseFloat(layer.getAttribute('data-depth')) || 0;
                const translateX = (mouseX / (width / 2)) * (depth * 60);
                const translateY = (mouseY / (height / 2)) * (depth * 60);
                
                // Get original translateZ from class styling
                let translateZ = 'translateZ(0px)';
                if (layer.classList.contains('layer-glow')) translateZ = 'translateZ(-50px)';
                else if (layer.classList.contains('layer-back')) translateZ = 'translateZ(-25px)';
                else if (layer.classList.contains('layer-mid')) translateZ = 'translateZ(0px)';
                else if (layer.classList.contains('layer-front')) translateZ = 'translateZ(25px)';
                
                layer.style.transform = `translateX(${translateX}px) translateY(${translateY}px) ${translateZ}`;
            });
        });

        scene.addEventListener('mouseleave', () => {
            // Smoothly reset transformations on mouse leave
            container.style.transform = 'rotateX(0deg) rotateY(0deg)';
            layers.forEach(layer => {
                let translateZ = 'translateZ(0px)';
                if (layer.classList.contains('layer-glow')) translateZ = 'translateZ(-50px)';
                else if (layer.classList.contains('layer-back')) translateZ = 'translateZ(-25px)';
                else if (layer.classList.contains('layer-mid')) translateZ = 'translateZ(0px)';
                else if (layer.classList.contains('layer-front')) translateZ = 'translateZ(25px)';
                
                layer.style.transform = `translateX(0px) translateY(0px) ${translateZ}`;
            });
        });
    }

    // 11. Project Command Center Logic
    initCommandCenter();

    function initCommandCenter() {
        const section = document.querySelector('.command-center-section');
        const mouseLight = document.getElementById('mouse-light');
        const form = document.getElementById('project-command-form');
        const loadingScreen = document.getElementById('loading-screen');
        const successScreen = document.getElementById('success-screen');
        const progressFill = document.getElementById('progress-bar-fill');
        const progressText = document.getElementById('progress-text');
        const dropZone = document.getElementById('file-drop-zone');
        const fileInput = document.getElementById('file-upload');
        const filesList = document.getElementById('files-list');

        // 1. Mouse Follow Light coordinates tracking
        if (section && mouseLight) {
            section.addEventListener('mousemove', (e) => {
                const rect = section.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                mouseLight.style.left = `${x}px`;
                mouseLight.style.top = `${y}px`;
            });
        }

        // 2. Drag & Drop File Upload Panel logic
        let uploadedFiles = [];
        if (dropZone && fileInput && filesList) {
            dropZone.addEventListener('click', (e) => {
                if (e.target.tagName !== 'SPAN' && !e.target.classList.contains('file-remove')) {
                    fileInput.click();
                }
            });

            fileInput.addEventListener('change', (e) => {
                handleFiles(e.target.files);
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    dropZone.classList.add('dragover');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    dropZone.classList.remove('dragover');
                }, false);
            });

            dropZone.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                handleFiles(files);
            });

            function handleFiles(files) {
                for (let i = 0; i < files.length; i++) {
                    uploadedFiles.push(files[i]);
                }
                renderFilesList();
            }

            function renderFilesList() {
                filesList.innerHTML = '';
                uploadedFiles.forEach((file, index) => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    fileItem.innerHTML = `
                        <span class="file-name">${file.name}</span>
                        <span class="file-remove" data-index="${index}">✕</span>
                    `;
                    filesList.appendChild(fileItem);
                });

                // Bind file item removal button click triggers
                const removeButtons = filesList.querySelectorAll('.file-remove');
                removeButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const index = parseInt(btn.getAttribute('data-index'));
                        uploadedFiles.splice(index, 1);
                        renderFilesList();
                    });
                });
            }
        }

        // 3. Project Initialization Progress Simulation on Submit
        if (form && loadingScreen && successScreen && progressFill && progressText) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                // Active Loading Screen Overlay
                loadingScreen.style.display = 'flex';
                successScreen.style.display = 'none';

                const progressObj = { val: 0 };
                
                // Run smooth progress bar fill simulation via GSAP
                gsap.to(progressObj, {
                    val: 100,
                    duration: 2.5,
                    ease: 'power1.inOut',
                    onUpdate: () => {
                        const percentage = Math.floor(progressObj.val);
                        progressFill.style.width = `${percentage}%`;
                        progressText.textContent = `${percentage}%`;
                    },
                    onComplete: () => {
                        // Switch to Success screen panel
                        loadingScreen.style.display = 'none';
                        successScreen.style.display = 'flex';
                        form.reset();
                        uploadedFiles = [];
                        if (filesList) filesList.innerHTML = '';
                    }
                });
            });
        }
    }
});

// 10. Global SVG color setter helper
window.updateSvgGradientColors = function(theme) {
    const stop1 = document.getElementById('stop-1');
    const stop2 = document.getElementById('stop-2');
    if (!stop1 || !stop2) return;

    if (theme === 'light') {
        stop1.setAttribute('stop-color', '#7b2cbf');
        stop2.setAttribute('stop-color', '#00f0ff');
    } else {
        stop1.setAttribute('stop-color', '#0052ff');
        stop2.setAttribute('stop-color', '#7b2cbf');
    }
};
