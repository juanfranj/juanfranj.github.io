/* ============================================================
   CheesCoach Landing Page — JavaScript (IIFE)
   Works with file:// protocol — no ES modules required
   Chess demo uses dynamic import (graceful degradation)
   ============================================================ */

(function () {
    'use strict';

    // ---- Navbar scroll effect ----
    var navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // ---- Mobile menu toggle ----
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            var isOpen = hamburger.classList.toggle('open');
            navLinks.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            var targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- Intersection Observer for .reveal elements ----
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0 && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        reveals.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show everything immediately
        reveals.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ---- Screenshots carousel arrows ----
    var track = document.getElementById('screenshots-track');
    var arrowLeft = document.getElementById('scroll-left');
    var arrowRight = document.getElementById('scroll-right');

    if (track && arrowLeft && arrowRight) {
        var firstCard = track.querySelector('.screenshot-card');
        var scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 304;

        arrowLeft.addEventListener('click', function () {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        arrowRight.addEventListener('click', function () {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // ---- Chess Demo Board ----
    // Uses dynamic import for chess.js (ES module)
    // chessboard-element is loaded via <script type="module"> in HTML

    var boardEl = document.getElementById('demo-board');
    var statusEl = document.getElementById('demo-status');
    var resetBtn = document.getElementById('demo-reset');

    if (boardEl) {
        initChessDemo();
    }

    function initChessDemo() {
        var Chess = null;
        var game = null;

        // Wait for the chess-board custom element to be defined
        function waitForBoard() {
            if (typeof customElements === 'undefined') {
                showFallbackMessage();
                return;
            }

            if (customElements.get('chess-board')) {
                loadChessJs();
            } else {
                customElements.whenDefined('chess-board').then(loadChessJs).catch(showFallbackMessage);
            }
        }

        function loadChessJs() {
            // Dynamic import of chess.js
            import('https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm')
                .then(function (module) {
                    Chess = module.Chess;
                    game = new Chess();
                    setupBoard();
                })
                .catch(function (err) {
                    console.warn('chess.js not available:', err);
                    showFallbackMessage();
                });
        }

        function getLang() {
            return document.documentElement.lang || 'en';
        }

        function showFallbackMessage() {
            if (statusEl) {
                var lang = getLang();
                statusEl.textContent = lang === 'es'
                    ? 'Abre desde un servidor web para el tablero interactivo'
                    : 'Open from a web server for the interactive board';
                var mutedColor = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#5a6d8a';
                statusEl.style.color = mutedColor;
            }
        }

        function setupBoard() {
            boardEl.setAttribute('position', 'start');

            // Restrict dragging to white pieces on white's turn
            boardEl.addEventListener('drag-start', function (e) {
                var piece = e.detail.piece;
                if (game.isGameOver() || game.turn() !== 'w' || piece.startsWith('b')) {
                    e.preventDefault();
                }
            });

            // Handle drop
            boardEl.addEventListener('drop', function (e) {
                var source = e.detail.source;
                var target = e.detail.target;
                var setAction = e.detail.setAction;

                var move = null;
                try {
                    move = game.move({ from: source, to: target, promotion: 'q' });
                } catch (err) {
                    // Invalid move
                }

                if (!move) {
                    if (setAction) setAction('snapback');
                    return;
                }

                updateStatus();

                if (!game.isGameOver()) {
                    setTimeout(makeBlackMove, 500);
                }
            });

            // Sync board position after snap animation
            boardEl.addEventListener('snap-end', function () {
                boardEl.setPosition(game.fen());
            });

            updateStatus();
        }

        function makeBlackMove() {
            if (!game || game.isGameOver() || game.turn() !== 'b') return;

            var moves = game.moves();
            if (moves.length === 0) return;

            var randomMove = moves[Math.floor(Math.random() * moves.length)];
            game.move(randomMove);
            boardEl.setPosition(game.fen());
            updateStatus();
        }

        function updateStatus() {
            if (!statusEl || !game) return;

            var lang = getLang();

            // Read CSS custom property values from computed styles
            var styles = getComputedStyle(document.documentElement);
            var colorSuccess = styles.getPropertyValue('--success').trim() || '#34d399';
            var colorWarning = styles.getPropertyValue('--warning').trim() || '#fbbf24';
            var colorError = styles.getPropertyValue('--error').trim() || '#f87171';
            var colorAccent = styles.getPropertyValue('--accent-bright').trim() || '#6ea8ff';
            var colorMuted = styles.getPropertyValue('--text-secondary').trim() || '#8b9dc3';

            if (game.isCheckmate()) {
                var winner = game.turn() === 'w'
                    ? (lang === 'es' ? 'Negras' : 'Black')
                    : (lang === 'es' ? 'Blancas' : 'White');
                statusEl.textContent = lang === 'es'
                    ? 'Jaque mate - ' + winner + ' ganan'
                    : 'Checkmate - ' + winner + ' wins';
                statusEl.style.color = colorSuccess;
            } else if (game.isDraw() || game.isStalemate()) {
                if (game.isStalemate()) {
                    statusEl.textContent = lang === 'es' ? 'Ahogado - Tablas' : 'Stalemate - Draw';
                } else {
                    statusEl.textContent = lang === 'es' ? 'Tablas' : 'Draw';
                }
                statusEl.style.color = colorWarning;
            } else if (game.inCheck()) {
                var turn = game.turn() === 'w'
                    ? (lang === 'es' ? 'Blancas' : 'White')
                    : (lang === 'es' ? 'Negras' : 'Black');
                statusEl.textContent = lang === 'es'
                    ? 'Jaque - Turno de ' + turn
                    : 'Check - ' + turn + "'s turn";
                statusEl.style.color = colorError;
            } else {
                if (game.turn() === 'w') {
                    statusEl.textContent = lang === 'es'
                        ? 'Tu turno - Mueve las blancas'
                        : 'Your turn - Move white';
                    statusEl.style.color = colorAccent;
                } else {
                    statusEl.textContent = lang === 'es' ? 'Pensando...' : 'Thinking...';
                    statusEl.style.color = colorMuted;
                }
            }
        }

        // Reset button
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                if (!game || !Chess) return;
                game = new Chess();
                boardEl.setPosition('start');
                updateStatus();
            });
        }

        waitForBoard();
    }

})();
