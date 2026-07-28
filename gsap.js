/* ==========================================================================
   VELORA Web Solution - GSAP Timelines & ScrollTrigger Core
   ========================================================================== */

// Make timelines globally callable
window.runHeroGSAPTimeline = null;

document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // 1. Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // 2. Page Intro Entrance Timeline (triggered from loader.js on finish)
    window.runHeroGSAPTimeline = function() {
        gsap.set([
            '.glass-nav', '.hero-badge', '.hero-title', '.hero-description',
            '.btn-hero-primary', '.btn-hero-secondary', '.hero-trust',
            '.logo-3d-scene', '.vertical-light-beam', '#ambient-canvas',
            '.hero-scroll-indicator'
        ], { opacity: 0 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });

        tl.to('.glass-nav', { opacity: 1, y: 0, startAt: { y: -45 }, duration: 1 })
          .to('.hero-badge', { opacity: 1, y: 0, startAt: { y: 15 }, duration: 0.5 }, '-=0.4')
          .to('.hero-title', { opacity: 1, y: 0, startAt: { y: 30 }, duration: 0.8 }, '-=0.4')
          .to('.hero-description', { opacity: 1, y: 0, startAt: { y: 15 }, duration: 0.6 }, '-=0.5')
          .to('.btn-hero-primary', { opacity: 1, x: 0, startAt: { x: -15 }, duration: 0.5 }, '-=0.4')
          .to('.btn-hero-secondary', { opacity: 1, x: 0, startAt: { x: 15 }, duration: 0.5 }, '-=0.5')
          .to('.hero-trust', { opacity: 1, y: 0, startAt: { y: 15 }, duration: 0.5 }, '-=0.3')
          .to('.logo-3d-scene', { opacity: 1, scale: 1, startAt: { scale: 0.88 }, duration: 1 }, '-=0.5')
          .to('.vertical-light-beam', { opacity: 1, scaleY: 1, startAt: { scaleY: 0 }, duration: 0.7 }, '-=0.6')
          .to('#ambient-canvas', { opacity: 1, duration: 1.2 }, '-=0.8')
          .to('.hero-scroll-indicator', { opacity: 0.85, y: 0, startAt: { y: 15 }, duration: 0.5, onComplete: () => {
              runProjectCounter();
          }}, '-=0.3');
    };

    // 3. Hero Trust statistics counters
    function runProjectCounter() {
        const counterEl = document.getElementById('project-counter');
        if (!counterEl) return;

        const countTarget = 180;
        const countObj = { val: 0 };

        gsap.to(countObj, {
            val: countTarget,
            duration: 2.5,
            ease: 'power2.out',
            onUpdate: () => {
                counterEl.textContent = Math.floor(countObj.val);
            }
        });
    }

    // 4. Section Scroll Reveals (GSAP ScrollTriggers)
    
    // Services Grid
    gsap.from('.reveal-services-item', {
        scrollTrigger: {
            trigger: '.reveal-trigger-services',
            start: 'top center+=180',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
    });

    // Project Cards
    gsap.from('.reveal-project-item', {
        scrollTrigger: {
            trigger: '.reveal-trigger-projects',
            start: 'top center+=180',
        },
        opacity: 0,
        y: 50,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // About lines reveal
    gsap.from('.reveal-about-line', {
        scrollTrigger: {
            trigger: '.about-story-col',
            start: 'top center+=180'
        },
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
    });

    // Founders Cards reveal
    gsap.from('.reveal-founder-card', {
        scrollTrigger: {
            trigger: '.reveal-trigger-founders',
            start: 'top center+=180'
        },
        opacity: 0,
        y: 35,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // Why Choose Us cards (diverse transitions)
    const whyCards = document.querySelectorAll('.reveal-why-item');
    whyCards.forEach(card => {
        const anim = card.getAttribute('data-anim-type');
        let startProps = { opacity: 0 };

        if (anim === 'slide-left') startProps.x = -40;
        else if (anim === 'slide-right') startProps.x = 40;
        else if (anim === 'scale') startProps.scale = 0.85;
        else if (anim === 'slide-up') startProps.y = 40;
        else startProps.y = 20;

        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=50',
            },
            ...startProps,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // Stats Counters
    const statProjs = { val: 0 }, statClients = { val: 0 }, statResp = { val: 0 }, statSat = { val: 0 };

    gsap.timeline({
        scrollTrigger: {
            trigger: '.reveal-trigger-stats',
            start: 'top center+=220',
        }
    })
    .to(statProjs, { val: 180, duration: 2, ease: 'power2.out', onUpdate: () => {
        document.getElementById('stat-count-projects').textContent = Math.floor(statProjs.val);
    }}, 0)
    .to(statClients, { val: 90, duration: 2, ease: 'power2.out', onUpdate: () => {
        document.getElementById('stat-count-clients').textContent = Math.floor(statClients.val);
    }}, 0)
    .to(statResp, { val: 2, duration: 1.5, ease: 'power2.out', onUpdate: () => {
        document.getElementById('stat-count-response').textContent = Math.floor(statResp.val);
    }}, 0)
    .to(statSat, { val: 99, duration: 2, ease: 'power2.out', onUpdate: () => {
        document.getElementById('stat-count-sat').textContent = Math.floor(statSat.val);
    }}, 0);

    // 5. FAQ Accordion Height transition
    initFaqAccordion();

    function initFaqAccordion() {
        const accordionItems = document.querySelectorAll('.faq-accordion-item');

        accordionItems.forEach(item => {
            const btn = item.querySelector('.faq-header-btn');
            const body = item.querySelector('.faq-body-content');

            if (!btn || !body) return;

            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Collapse all other panels
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherBody = otherItem.querySelector('.faq-body-content');
                    if (otherBody) {
                        gsap.to(otherBody, { height: 0, duration: 0.4, ease: 'power2.out' });
                    }
                });

                // Expand current clicked panel if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                    // Add 24px layout spacing offset
                    gsap.to(body, { height: body.scrollHeight + 24, duration: 0.4, ease: 'power2.out' });
                }
            });
        });
    }

    // 6. About Section Visual hover orbits
    gsap.to('.about-floating-card', {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
    gsap.to('.about-glow-orb', {
        scale: 1.1,
        opacity: 0.85,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
});
