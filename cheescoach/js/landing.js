/* CheesCoach — navbar state, the mobile menu, and the scroll reveal that
   the setup and policy pages mark their sections with. The landing's own
   hero entrance is pure CSS, so it survives a slow script. */
(function () {
    'use strict';

    // --- Navbar background once the hero is behind you ---
    var navbar = document.querySelector('.navbar');
    if (navbar) {
        var onScroll = function () {
            navbar.classList.toggle('scrolled', window.scrollY > 24);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // --- Mobile menu ---
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            var open = navLinks.classList.toggle('open');
            hamburger.classList.toggle('open', open);
            hamburger.setAttribute('aria-expanded', String(open));
        });
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- Scroll reveal, used by the setup and policy pages ---
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        if (!('IntersectionObserver' in window)) {
            reveals.forEach(function (el) { el.classList.add('visible'); });
        } else {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        io.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
            reveals.forEach(function (el) { io.observe(el); });
        }
    }
})();
