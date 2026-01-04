document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    const body = document.body;

    if (mobileBtn && mobileNav) {
        mobileBtn.addEventListener('click', () => {
            const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true' || false;
            mobileBtn.setAttribute('aria-expanded', !isExpanded);

            mobileNav.classList.toggle('active');

            // Toggle icon between bars and close
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                if (mobileNav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                    body.style.overflow = 'hidden'; // Prevent background scrolling
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                    body.style.overflow = '';
                }
            }
        });

        // Close menu when clicking a link
        const navLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
                body.style.overflow = '';
            });
        });
    }
});
