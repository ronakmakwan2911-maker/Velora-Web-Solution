/* ==========================================================================
   VELORA Web Solution - Theme Switcher Modules
   ========================================================================== */

(function() {
    window.activeTheme = 'dark'; // Global visual theme flag

    function initTheme() {
        const themeToggleBtn = document.getElementById('theme-toggle');
        const htmlElement = document.documentElement;

        const savedTheme = localStorage.getItem('velora-theme') || 'dark';
        htmlElement.setAttribute('data-theme', savedTheme);
        window.activeTheme = savedTheme;

        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                const currentTheme = htmlElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                htmlElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('velora-theme', newTheme);
                window.activeTheme = newTheme;
                
                // Fire globally registered update functions
                if (window.updateSvgGradientColors) {
                    window.updateSvgGradientColors(newTheme);
                }
            });
        }
    }

    // Run theme sync on document render
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();
