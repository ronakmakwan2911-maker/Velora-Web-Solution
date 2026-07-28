/* ==========================================================================
   VELORA Web Solution - Handcrafted Page Loader Animation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    runPagePreloader();

    function runPagePreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;

        // Animate preloader timeline using GSAP
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline({
                onComplete: () => {
                    // Fade out loader panel
                    preloader.classList.add('fade-out');
                    
                    // Trigger Hero staggered animation sequence
                    if (window.runHeroGSAPTimeline) {
                        window.runHeroGSAPTimeline();
                    }
                }
            });

            // GSAP builds the loader visual stages
            tl.to('.loader-progress-bar', { width: '100%', duration: 1.6, ease: 'power2.inOut' })
              .to('.loader-glow-spot', { opacity: 1, scale: 1.1, duration: 0.8, ease: 'power2.out' }, '-=0.8')
              .to(preloader, { 
                  opacity: 0, 
                  duration: 0.6, 
                  ease: 'power3.inOut'
              });
        } else {
            // Standard fallback timeout if GSAP fails to load
            setTimeout(() => {
                preloader.classList.add('fade-out');
                if (window.runHeroGSAPTimeline) {
                    window.runHeroGSAPTimeline();
                }
            }, 1800);
        }
    }
});
