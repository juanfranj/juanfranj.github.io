/**
 * CheesCoach - Interactive Chess Lesson Engine
 *
 * ES module class that powers all interactive exercises across the course.
 * Supports: explore, find-move, sequence, play-position exercise types.
 *
 * Dependencies:
 *   - chess.js (imported as ES module from CDN)
 *   - chessboard-element (Web Component, loaded via <script type="module">)
 */

import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm';

export class ChessLesson {
    /**
     * @param {Object} config
     * @param {string} config.boardContainerId - ID of the DOM container for the board
     * @param {Array}  config.exercises - Array of exercise data objects
     * @param {Function} [config.onComplete] - Called when all exercises are done
     * @param {Function} [config.onProgress] - Called with (completed, total) on each advance
     */
    constructor(config) {
        this.containerEl = document.getElementById(config.boardContainerId);
        if (!this.containerEl) {
            console.error(`ChessLesson: container #${config.boardContainerId} not found`);
            return;
        }
        this.exercises = config.exercises || [];
        this.currentExerciseIndex = 0;
        this.onComplete = config.onComplete || (() => {});
        this.onProgress = config.onProgress || (() => {});

        // State
        this.chess = null;
        this.boardEl = null;
        this.highlightStyleEl = null;
        this.wrongAttempts = 0;
        this.sequenceStep = 0;
        this.exerciseCompleted = false;
        this.isAutoPlaying = false;

        // Bound handlers (stored for removal)
        this._onDragStart = this._handleDragStart.bind(this);
        this._onDrop = this._handleDrop.bind(this);
        this._onSnapEnd = this._handleSnapEnd.bind(this);

        // Timers to clean up
        this._timers = [];
    }

    /* ============================================================
       INITIALIZATION
       ============================================================ */

    /**
     * Initialize the lesson: create the board, load first exercise.
     */
    init() {
        this._createBoard();
        if (this.exercises.length > 0) {
            // Ensure web component is ready before loading exercise
            if (typeof this.boardEl.setPosition === 'function') {
                this.loadExercise(0);
            } else {
                customElements.whenDefined('chess-board').then(() => {
                    this.loadExercise(0);
                });
            }
        }
        this.updateProgress();
    }

    /**
     * Create the <chess-board> element inside the container.
     */
    _createBoard() {
        // Create highlight style element
        this.highlightStyleEl = document.createElement('style');
        document.head.appendChild(this.highlightStyleEl);

        // Create chess-board element
        this.boardEl = document.createElement('chess-board');
        this.boardEl.setAttribute('draggable-pieces', '');
        this.boardEl.style.width = '100%';

        // Find the board area inside the exercise card or container
        const boardArea = this.containerEl.querySelector('.exercise-board-area') || this.containerEl;
        boardArea.prepend(this.boardEl);

        // Event listeners
        this.boardEl.addEventListener('drag-start', this._onDragStart);
        this.boardEl.addEventListener('drop', this._onDrop);
        this.boardEl.addEventListener('snap-end', this._onSnapEnd);
    }

    /* ============================================================
       EXERCISE LOADING
       ============================================================ */

    /**
     * Load a specific exercise by index.
     * @param {number} index
     */
    loadExercise(index) {
        if (index < 0 || index >= this.exercises.length) return;

        this.currentExerciseIndex = index;
        this.wrongAttempts = 0;
        this.sequenceStep = 0;
        this.exerciseCompleted = false;
        this.isAutoPlaying = false;
        this._clearTimers();

        const exercise = this.exercises[index];

        // Init chess.js from FEN
        try {
            this.chess = new Chess(exercise.fen);
        } catch (e) {
            console.error('ChessLesson: Invalid FEN:', exercise.fen, e);
            return;
        }

        // Set board orientation
        const orientation = exercise.orientation || this._getOrientationFromFen(exercise.fen);
        this.boardEl.setAttribute('orientation', orientation);

        // Set board position
        this.updateBoard(false);

        // Clear highlights and feedback
        this.clearHighlights();
        this._hideFeedback();
        this._hideExplanation();

        // Enable dragging for all exercise types
        this.boardEl.setAttribute('draggable-pieces', '');

        // Update UI elements
        this._updateExerciseUI(exercise);
        this.updateProgress();

        // For sequence exercises, show the first step info
        if (exercise.exerciseType === 'sequence') {
            this._showSequenceStepInfo();
        }
    }

    /**
     * Get board orientation based on whose turn it is in the FEN.
     */
    _getOrientationFromFen(fen) {
        const parts = fen.split(' ');
        return parts[1] === 'b' ? 'black' : 'white';
    }

    /**
     * Update the exercise card UI elements.
     */
    _updateExerciseUI(exercise) {
        const card = this.containerEl;

        // Mark active
        card.classList.add('active');
        card.classList.remove('completed-exercise');

        // Update instruction text
        const instructionEl = card.querySelector('.exercise-instruction');
        if (instructionEl && exercise.instruction) {
            instructionEl.textContent = exercise.instruction;
        }

        // Update badge
        const badgeEl = card.querySelector('.exercise-badge');
        if (badgeEl) {
            badgeEl.classList.remove('completed-badge');
        }

        // Reset buttons
        const hintBtn = card.querySelector('[data-action="hint"]');
        const resetBtn = card.querySelector('[data-action="reset"]');
        const nextBtn = card.querySelector('[data-action="next"]');

        if (hintBtn) hintBtn.style.display = exercise.exerciseType === 'explore' ? 'none' : '';
        if (resetBtn) resetBtn.style.display = '';
        if (nextBtn) nextBtn.style.display = 'none';
    }

    /* ============================================================
       DRAG & DROP HANDLERS
       ============================================================ */

    /**
     * Handle drag start: restrict to the correct color.
     */
    _handleDragStart(e) {
        if (this.exerciseCompleted || this.isAutoPlaying) {
            e.preventDefault();
            return;
        }

        const exercise = this.exercises[this.currentExerciseIndex];
        if (!exercise) return;

        // In explore mode, allow any piece
        if (exercise.exerciseType === 'explore') return;

        const { piece } = e.detail;
        const turn = this.chess.turn(); // 'w' or 'b'
        const pieceColor = piece.charAt(0); // 'w' or 'b'

        // Only allow moving pieces of the side to move
        if (pieceColor !== turn) {
            e.preventDefault();
            return;
        }
    }

    /**
     * Handle piece drop: validate the move.
     */
    _handleDrop(e) {
        if (this.exerciseCompleted || this.isAutoPlaying) {
            e.preventDefault();
            return;
        }

        const { source, target, piece, setAction } = e.detail;

        // Same square = cancel
        if (source === target) {
            setAction('snapback');
            return;
        }

        const exercise = this.exercises[this.currentExerciseIndex];
        if (!exercise) {
            setAction('snapback');
            return;
        }

        // Route to the appropriate handler
        switch (exercise.exerciseType) {
            case 'explore':
                this._handleExploreDrop(source, target, setAction);
                break;
            case 'find-move':
                this._handleFindMoveDrop(source, target, setAction, exercise);
                break;
            case 'sequence':
                this._handleSequenceDrop(source, target, setAction, exercise);
                break;
            case 'play-position':
                this._handlePlayPositionDrop(source, target, setAction, exercise);
                break;
            default:
                setAction('snapback');
        }
    }

    /**
     * Handle snap-end: sync board with chess.js state.
     */
    _handleSnapEnd() {
        this.updateBoard(false);
    }

    /* ============================================================
       EXPLORE MODE
       ============================================================ */

    _handleExploreDrop(source, target, setAction) {
        // Try the move; if illegal, try as other color
        const move = this.chess.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        if (move === null) {
            setAction('snapback');
            return;
        }

        // Valid move
        setAction('drop');
    }

    /* ============================================================
       FIND-MOVE MODE
       ============================================================ */

    _handleFindMoveDrop(source, target, setAction, exercise) {
        // Attempt the move in chess.js
        const move = this.chess.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        if (move === null) {
            // Illegal move: snap back immediately
            setAction('snapback');
            return;
        }

        // Legal move - check if it's one of the correct moves
        const isCorrect = exercise.correctMoves.some(
            cm => cm.from === source && cm.to === target
        );

        if (isCorrect) {
            setAction('drop');
            this._onCorrectMove(source, target, exercise);
        } else {
            // Legal but incorrect: undo, snap back, show feedback
            this.chess.undo();
            setAction('snapback');
            this._onIncorrectMove(exercise);
        }
    }

    /* ============================================================
       SEQUENCE MODE
       ============================================================ */

    _handleSequenceDrop(source, target, setAction, exercise) {
        const steps = exercise.steps || [];
        if (this.sequenceStep >= steps.length) {
            setAction('snapback');
            return;
        }

        const currentStep = steps[this.sequenceStep];
        const turn = this.chess.turn();
        const playerColor = exercise.orientation === 'black' ? 'b' : 'w';

        // If it's not the player's turn (shouldn't happen normally), snapback
        if (turn !== playerColor) {
            setAction('snapback');
            return;
        }

        // Attempt the move
        const move = this.chess.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        if (move === null) {
            setAction('snapback');
            return;
        }

        // Check if it matches the expected move
        // Compare SAN or from/to
        const expectedSan = currentStep.move;
        const isCorrect = this._movesMatch(move, expectedSan, currentStep);

        if (isCorrect) {
            setAction('drop');
            this.highlightSquares([source, target], 'green');

            // Show explanation for this step
            if (currentStep.explanation) {
                this.showFeedback('correct', currentStep.explanation);
            } else {
                this.showFeedback('correct', 'Correcto!');
            }

            this.sequenceStep++;
            this._updateSequenceStepInfo();

            // Check if there's an opponent move next
            const nextStep = steps[this.sequenceStep];
            if (nextStep && this.sequenceStep < steps.length) {
                // Auto-play opponent after delay
                this._scheduleTimer(() => {
                    this._hideFeedback();
                    this.clearHighlights();
                    this._autoPlaySequenceStep();
                }, 1200);
            } else {
                // All steps done
                this._scheduleTimer(() => {
                    this._completeExercise(exercise);
                }, 1500);
            }
        } else {
            // Incorrect: undo and show hint
            this.chess.undo();
            setAction('snapback');
            const hintSan = expectedSan;
            this.showFeedback('incorrect', `Intenta: ${hintSan}`);
        }
    }

    /**
     * Auto-play opponent moves in sequence mode.
     */
    _autoPlaySequenceStep() {
        const exercise = this.exercises[this.currentExerciseIndex];
        const steps = exercise.steps || [];

        if (this.sequenceStep >= steps.length) return;

        const currentStep = steps[this.sequenceStep];
        const turn = this.chess.turn();
        const playerColor = exercise.orientation === 'black' ? 'b' : 'w';

        // If it's opponent's turn, auto-play
        if (turn !== playerColor) {
            this.isAutoPlaying = true;
            this._scheduleTimer(() => {
                const move = this.chess.move(currentStep.move);
                if (move) {
                    this.updateBoard(true);
                    this.highlightSquares([move.from, move.to], 'yellow');

                    if (currentStep.explanation) {
                        this.showFeedback('info', currentStep.explanation);
                    }

                    this.sequenceStep++;
                    this._updateSequenceStepInfo();
                    this.isAutoPlaying = false;

                    // Check if sequence is done
                    if (this.sequenceStep >= steps.length) {
                        this._scheduleTimer(() => {
                            this._completeExercise(exercise);
                        }, 1500);
                    } else {
                        // Show next step hint after a moment
                        this._scheduleTimer(() => {
                            this._hideFeedback();
                            this.clearHighlights();
                            this._showSequenceStepInfo();
                        }, 1000);
                    }
                } else {
                    console.error('ChessLesson: Failed to auto-play:', currentStep.move);
                    this.isAutoPlaying = false;
                }
            }, 600);
        } else {
            // It's the player's turn - show step info
            this._showSequenceStepInfo();
        }
    }

    /**
     * Check if a played move matches an expected SAN string.
     */
    _movesMatch(move, expectedSan, step) {
        // Direct SAN match
        if (move.san === expectedSan) return true;

        // If step has from/to, use those
        if (step.from && step.to) {
            return move.from === step.from && move.to === step.to;
        }

        // Try normalizing (remove + and # from both)
        const normPlayed = move.san.replace(/[+#]/g, '');
        const normExpected = expectedSan.replace(/[+#]/g, '');
        return normPlayed === normExpected;
    }

    /**
     * Show sequence step info panel.
     */
    _showSequenceStepInfo() {
        const exercise = this.exercises[this.currentExerciseIndex];
        const steps = exercise.steps || [];
        const infoEl = this.containerEl.querySelector('.sequence-step-info');
        const counterEl = this.containerEl.querySelector('.sequence-move-counter');

        if (infoEl && this.sequenceStep < steps.length) {
            const step = steps[this.sequenceStep];
            const playerColor = exercise.orientation === 'black' ? 'b' : 'w';
            const turn = this.chess.turn();

            if (turn === playerColor && step.hint) {
                infoEl.innerHTML = `<strong>Tu turno:</strong> ${step.hint}`;
                infoEl.style.display = 'block';
            } else if (turn === playerColor) {
                infoEl.innerHTML = `<strong>Tu turno</strong>`;
                infoEl.style.display = 'block';
            } else {
                infoEl.style.display = 'none';
            }
        } else if (infoEl) {
            infoEl.style.display = 'none';
        }

        if (counterEl) {
            counterEl.textContent = `Paso ${this.sequenceStep + 1} de ${steps.length}`;
        }
    }

    _updateSequenceStepInfo() {
        this._showSequenceStepInfo();
    }

    /* ============================================================
       PLAY-POSITION MODE
       ============================================================ */

    _handlePlayPositionDrop(source, target, setAction, exercise) {
        // Similar to find-move but after correct move, opponent auto-responds
        const move = this.chess.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        if (move === null) {
            setAction('snapback');
            return;
        }

        const isCorrect = exercise.correctMoves.some(
            cm => cm.from === source && cm.to === target
        );

        if (isCorrect) {
            setAction('drop');
            this.highlightSquares([source, target], 'green');
            this.showFeedback('correct', exercise.successMessage || 'Correcto!');

            // If there's an opponent response, auto-play it
            if (exercise.opponentResponse) {
                this._scheduleTimer(() => {
                    this.clearHighlights();
                    this.autoPlayOpponent(exercise.opponentResponse, 600);
                    this._scheduleTimer(() => {
                        this._completeExercise(exercise);
                    }, 2000);
                }, 1200);
            } else {
                this._scheduleTimer(() => {
                    this._completeExercise(exercise);
                }, 1500);
            }
        } else {
            this.chess.undo();
            setAction('snapback');
            this._onIncorrectMove(exercise);
        }
    }

    /* ============================================================
       MOVE RESULT HANDLERS
       ============================================================ */

    _onCorrectMove(source, target, exercise) {
        this.highlightSquares([source, target], 'green');
        this.showFeedback('correct', exercise.successMessage || 'Excelente! Movimiento correcto.');

        // Show explanation if available
        if (exercise.explanation) {
            this._scheduleTimer(() => {
                this._showExplanation(exercise.explanation);
            }, 800);
        }

        // Complete exercise after delay
        this._scheduleTimer(() => {
            this._completeExercise(exercise);
        }, 1500);
    }

    _onIncorrectMove(exercise) {
        this.wrongAttempts++;

        if (this.wrongAttempts >= 2 && exercise.hintMessage) {
            // Show hint after 2 wrong attempts
            this.showFeedback('hint', exercise.hintMessage);
        } else {
            this.showFeedback('incorrect', 'No es ese movimiento. Intentalo de nuevo.');
        }

        // Clear feedback after a moment
        this._scheduleTimer(() => {
            // Only clear if still showing incorrect (not hint)
            if (this.wrongAttempts < 2) {
                this._hideFeedback();
            }
        }, 2000);
    }

    _completeExercise(exercise) {
        this.exerciseCompleted = true;

        const card = this.containerEl;
        card.classList.remove('active');
        card.classList.add('completed-exercise');

        const badgeEl = card.querySelector('.exercise-badge');
        if (badgeEl) {
            badgeEl.classList.add('completed-badge');
            badgeEl.textContent = 'Completado';
        }

        // Show next button
        const nextBtn = card.querySelector('[data-action="next"]');
        if (nextBtn) {
            nextBtn.style.display = '';
        }

        this.onProgress(this.currentExerciseIndex + 1, this.exercises.length);
        this.updateProgress();

        // Check if all exercises are done
        if (this.currentExerciseIndex >= this.exercises.length - 1) {
            this._scheduleTimer(() => {
                this.checkCompletion();
            }, 500);
        }
    }

    /* ============================================================
       PUBLIC API
       ============================================================ */

    /**
     * Show a hint: highlight the target square(s).
     */
    showHint() {
        const exercise = this.exercises[this.currentExerciseIndex];
        if (!exercise || this.exerciseCompleted) return;

        if (exercise.exerciseType === 'find-move' || exercise.exerciseType === 'play-position') {
            if (exercise.correctMoves && exercise.correctMoves.length > 0) {
                const firstCorrect = exercise.correctMoves[0];
                this.highlightSquares([firstCorrect.from], 'blue');
                this.highlightSquares([firstCorrect.to], 'yellow');
            }
            if (exercise.hintMessage) {
                this.showFeedback('hint', exercise.hintMessage);
            }
        } else if (exercise.exerciseType === 'sequence') {
            const steps = exercise.steps || [];
            if (this.sequenceStep < steps.length) {
                const step = steps[this.sequenceStep];
                this.showFeedback('hint', `Intenta: ${step.move}`);
            }
        }
    }

    /**
     * Reset the current exercise to its initial state.
     */
    reset() {
        this.loadExercise(this.currentExerciseIndex);
    }

    /**
     * Advance to the next exercise.
     */
    nextExercise() {
        if (this.currentExerciseIndex < this.exercises.length - 1) {
            this.loadExercise(this.currentExerciseIndex + 1);

            // Scroll the new exercise into view
            this._scheduleTimer(() => {
                this.containerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } else {
            this.checkCompletion();
        }
    }

    /**
     * Auto-play an opponent move with delay.
     * @param {Object} move - { from, to } or SAN string
     * @param {number} delay - milliseconds
     */
    autoPlayOpponent(move, delay = 600) {
        this.isAutoPlaying = true;
        this._scheduleTimer(() => {
            let result;
            if (typeof move === 'string') {
                result = this.chess.move(move);
            } else {
                result = this.chess.move({
                    from: move.from,
                    to: move.to,
                    promotion: move.promotion || 'q'
                });
            }

            if (result) {
                this.updateBoard(true);
                this.highlightSquares([result.from, result.to], 'yellow');
            }
            this.isAutoPlaying = false;
        }, delay);
    }

    /**
     * Update the board display from chess.js state.
     * @param {boolean} animate - whether to animate piece movement
     */
    updateBoard(animate = true) {
        if (!this.boardEl || !this.chess) return;

        const fen = this.chess.fen();
        if (animate) {
            this.boardEl.setPosition(fen, true);
        } else {
            this.boardEl.setPosition(fen, false);
        }
    }

    /**
     * Show a feedback message.
     * @param {'correct'|'incorrect'|'hint'|'info'} type
     * @param {string} message
     */
    showFeedback(type, message) {
        const feedbackEl = this.containerEl.querySelector('.exercise-feedback');
        if (!feedbackEl) return;

        // Remove old type classes
        feedbackEl.classList.remove('feedback-correct', 'feedback-incorrect', 'feedback-hint', 'feedback-info');

        // Add new type class
        feedbackEl.classList.add(`feedback-${type}`);
        feedbackEl.classList.add('visible');

        // Set content
        const iconEl = feedbackEl.querySelector('.feedback-icon');
        const textEl = feedbackEl.querySelector('.feedback-text');

        if (textEl) textEl.textContent = message;

        // Re-trigger animation
        feedbackEl.style.animation = 'none';
        feedbackEl.offsetHeight; // force reflow
        if (type === 'correct') {
            feedbackEl.style.animation = 'pulse 0.5s ease';
        } else if (type === 'incorrect') {
            feedbackEl.style.animation = 'shake 0.5s ease';
        } else {
            feedbackEl.style.animation = 'fadeIn 0.3s ease';
        }
    }

    /**
     * Hide feedback message.
     */
    _hideFeedback() {
        const feedbackEl = this.containerEl.querySelector('.exercise-feedback');
        if (feedbackEl) {
            feedbackEl.classList.remove('visible');
        }
    }

    /**
     * Show exercise explanation.
     */
    _showExplanation(text) {
        const explEl = this.containerEl.querySelector('.exercise-explanation');
        if (explEl) {
            explEl.textContent = text;
            explEl.classList.add('visible');
        }
    }

    /**
     * Hide exercise explanation.
     */
    _hideExplanation() {
        const explEl = this.containerEl.querySelector('.exercise-explanation');
        if (explEl) {
            explEl.classList.remove('visible');
        }
    }

    /**
     * Clear all square highlights from the board.
     */
    clearHighlights() {
        if (this.highlightStyleEl) {
            this.highlightStyleEl.textContent = '';
        }
    }

    /**
     * Highlight specific squares on the board.
     * @param {string[]} squares - Array of square names (e.g., ['e2', 'e4'])
     * @param {'green'|'red'|'yellow'|'blue'} color
     */
    highlightSquares(squares, color) {
        if (!this.highlightStyleEl || !this.boardEl) return;

        const colorMap = {
            green: 'rgba(255, 255, 0, 0.4)',
            red: 'rgba(239, 68, 68, 0.5)',
            yellow: 'rgba(255, 255, 0, 0.25)',
            blue: 'rgba(59, 130, 246, 0.45)'
        };

        const bgColor = colorMap[color] || colorMap.yellow;

        // Build CSS rules using ::part() selector
        let css = this.highlightStyleEl.textContent || '';
        for (const sq of squares) {
            // chess-board element uses part="square-{square}" for each square
            css += `chess-board::part(${sq}) { background-color: ${bgColor} !important; }\n`;
        }
        this.highlightStyleEl.textContent = css;
    }

    /**
     * Update the progress indicator UI.
     */
    updateProgress() {
        const completed = this.exercises.reduce((count, _, idx) => {
            // Count how many are at or before currentExerciseIndex and completed
            return count + (idx < this.currentExerciseIndex || (idx === this.currentExerciseIndex && this.exerciseCompleted) ? 1 : 0);
        }, 0);
        const total = this.exercises.length;

        // Update progress bar
        const progressFill = document.querySelector('.lesson-progress-fill');
        if (progressFill && total > 0) {
            const pct = (completed / total) * 100;
            progressFill.style.width = `${pct}%`;
        }

        // Update progress text
        const progressText = document.querySelector('.lesson-progress-text');
        if (progressText) {
            progressText.textContent = `${completed} de ${total} ejercicios`;
        }
    }

    /**
     * Check if all exercises are complete and trigger completion.
     */
    checkCompletion() {
        const allDone = this.currentExerciseIndex >= this.exercises.length - 1 && this.exerciseCompleted;
        if (allDone) {
            this.onComplete();
        }
    }

    /**
     * Destroy the lesson: remove elements and event listeners.
     */
    destroy() {
        this._clearTimers();

        if (this.boardEl) {
            this.boardEl.removeEventListener('drag-start', this._onDragStart);
            this.boardEl.removeEventListener('drop', this._onDrop);
            this.boardEl.removeEventListener('snap-end', this._onSnapEnd);
            this.boardEl.remove();
            this.boardEl = null;
        }

        if (this.highlightStyleEl) {
            this.highlightStyleEl.remove();
            this.highlightStyleEl = null;
        }

        this.chess = null;
    }

    /* ============================================================
       TIMER MANAGEMENT
       ============================================================ */

    _scheduleTimer(callback, delay) {
        const id = setTimeout(() => {
            this._timers = this._timers.filter(t => t !== id);
            callback();
        }, delay);
        this._timers.push(id);
        return id;
    }

    _clearTimers() {
        for (const id of this._timers) {
            clearTimeout(id);
        }
        this._timers = [];
    }
}

/* ============================================================
   LESSON PAGE CONTROLLER
   ============================================================
   Manages the full lesson page: sidebar, navigation, multiple
   exercise cards, progress, completion overlay, etc.
*/

export class LessonPageController {
    /**
     * @param {Object} config
     * @param {Object} [config.lessonData] - Single lesson data from COURSE_DATA
     * @param {number} [config.lessonIndex] - 0-based index of this lesson
     * @param {number} [config.totalLessons] - Total number of lessons
     * @param {Object} [config.courseData] - Full course data object
     * @param {number} [config.lessonId] - Lesson ID (1-based) to find in courseData
     * @param {string} [config.containerId] - DOM container ID for shell generation
     * @param {string} [config.courseIndexUrl] - URL to the course index page
     * @param {string} [config.landingUrl] - URL to the landing page
     * @param {Function} [config.onLessonComplete] - Callback when lesson is done
     */
    constructor(config) {
        // Support both API formats
        if (config.courseData && config.lessonId !== undefined) {
            this.courseData = config.courseData;
            const lessons = config.courseData.lessons;
            this.lessonData = lessons.find(l => l.id === config.lessonId);
            this.lessonIndex = lessons.findIndex(l => l.id === config.lessonId);
            this.totalLessons = lessons.length;
            this.containerId = config.containerId || 'lesson-app';
        } else {
            this.courseData = config.courseData || null;
            this.lessonData = config.lessonData;
            this.lessonIndex = config.lessonIndex;
            this.totalLessons = config.totalLessons;
            this.containerId = config.containerId || null;
        }
        this.courseIndexUrl = config.courseIndexUrl || 'index.html';
        this.landingUrl = config.landingUrl || '../index.html';
        this.onLessonComplete = config.onLessonComplete || (() => {});

        this.exerciseInstances = [];
        this.completedExercises = 0;
        this.totalExercises = 0;

        // Count total exercises
        if (this.lessonData) {
            this.totalExercises = this.lessonData.sections.filter(s => s.type === 'exercise').length;
        }
    }

    /**
     * Initialize the page: render content, create exercise instances.
     */
    init() {
        if (this.containerId) {
            this._buildShell();
        }
        this._renderSidebar();
        this._renderHeader();
        this._renderContent();
        this._initStaticBoards();
        this._setupNavigation();
        this._setupMobileMenu();
        this._initExercises();
        this._updateProgressBar();
    }

    /**
     * Build the full page shell inside the container div.
     * Called when containerId is provided (new HTML format).
     */
    _buildShell() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Build sidebar lesson links
        let sidebarLinks = '';
        if (this.courseData) {
            const slugs = [
                '01-tablero', '02-movimientos', '03-reglas', '04-jaque-mate',
                '05-valor-piezas', '06-apertura', '07-tacticas', '08-medio-juego',
                '09-finales', '10-practica'
            ];
            this.courseData.lessons.forEach((lesson, idx) => {
                const slug = slugs[idx] || `${String(idx + 1).padStart(2, '0')}`;
                const isCompleted = this._isLessonCompleted(idx);
                const isCurrent = idx === this.lessonIndex;
                let stateClass = '';
                let icon = `<span class="sidebar-num">${idx + 1}</span>`;
                if (isCompleted) {
                    stateClass = 'completed';
                    icon = '<span class="sidebar-check">\u2713</span>';
                } else if (isCurrent) {
                    stateClass = 'current';
                }
                sidebarLinks += `
                    <a href="leccion-${slug}.html"
                       class="sidebar-lesson-link ${stateClass}"
                       ${isCurrent ? 'aria-current="page"' : ''}>
                        ${icon}
                        <span class="sidebar-title">${lesson.shortTitle || lesson.title}</span>
                    </a>`;
            });
        }

        container.innerHTML = `
            <header class="lesson-header">
                <a href="${this.courseIndexUrl}" class="back-link">\u2190 Volver al curso</a>
                <span class="header-info">Leccion ${this.lessonIndex + 1} de ${this.totalLessons}</span>
                <button class="sidebar-toggle" aria-label="Menu de lecciones">\u2630</button>
            </header>
            <div class="lesson-progress">
                <div class="lesson-progress-fill" style="width: 0%"></div>
            </div>
            <div class="lesson-layout">
                <aside class="lesson-sidebar">
                    <div class="sidebar-header">
                        <h3>Lecciones</h3>
                    </div>
                    <nav class="sidebar-nav">
                        ${sidebarLinks}
                    </nav>
                </aside>
                <main class="lesson-content"></main>
            </div>
            <div class="lesson-complete-overlay" style="display:none;">
                <div class="completion-card">
                    <div class="completion-icon">\uD83C\uDFC6</div>
                    <h2>\u00A1Leccion Completada!</h2>
                    <p>Has completado todos los ejercicios de esta leccion.</p>
                    <div class="completion-actions">
                        <a href="${this.courseIndexUrl}" class="completion-btn secondary">Volver al curso</a>
                        <a href="#" class="completion-btn primary next-lesson-btn">Siguiente leccion \u2192</a>
                    </div>
                </div>
            </div>`;
    }

    /**
     * Render the sidebar navigation.
     * Updates active/completed states on links already in the DOM.
     */
    _renderSidebar() {
        const links = document.querySelectorAll('.sidebar-lesson-link');
        links.forEach((link, idx) => {
            link.classList.remove('current', 'completed');
            if (this._isLessonCompleted(idx)) {
                link.classList.add('completed');
            }
            if (idx === this.lessonIndex) {
                link.classList.add('current');
            }
        });
    }

    /**
     * Render the header with lesson info.
     */
    _renderHeader() {
        const infoEl = document.querySelector('.header-info');
        if (infoEl) {
            infoEl.innerHTML = `Leccion <strong>${this.lessonIndex + 1}</strong> de ${this.totalLessons}`;
        }
    }

    /**
     * Render all content sections.
     */
    _renderContent() {
        const contentEl = document.querySelector('.lesson-content');
        if (!contentEl) return;

        // Title section
        let html = `
            <div class="lesson-title-section">
                <h1 class="lesson-title">${this.lessonData.title}</h1>
                <p class="lesson-description">${this.lessonData.description}</p>
            </div>
        `;

        let exerciseCounter = 0;

        for (const section of this.lessonData.sections) {
            html += this._renderSection(section, exerciseCounter);
            if (section.type === 'exercise') {
                exerciseCounter++;
            }
        }

        // Navigation footer
        html += this._renderNavigationFooter();

        contentEl.innerHTML = html;
    }

    /**
     * Render a single section.
     */
    _renderSection(section, exerciseIndex) {
        switch (section.type) {
            case 'text':
                return `<div class="lesson-text">${section.content}</div>`;

            case 'subtitle':
                return `<h2 class="lesson-subtitle">${section.content}</h2>`;

            case 'small-heading':
                return `<h3 class="lesson-small-heading">${section.content}</h3>`;

            case 'board-static':
                return this._renderStaticBoard(section);

            case 'concept':
                return `
                    <div class="concept-box">
                        ${section.title ? `<div class="concept-box-title">${section.title}</div>` : ''}
                        <p>${section.content}</p>
                    </div>`;

            case 'tip':
                return `
                    <div class="tip-box">
                        <div class="tip-box-title">${section.title || 'Consejo'}</div>
                        <p>${section.content}</p>
                    </div>`;

            case 'warning':
                return `
                    <div class="warning-box">
                        <div class="warning-box-title">${section.title || 'Atencion'}</div>
                        <p>${section.content}</p>
                    </div>`;

            case 'divider':
                return '<div class="section-divider"></div>';

            case 'exercise':
                return this._renderExerciseCard(section, exerciseIndex);

            case 'cta':
                return `
                    <div class="cta-section">
                        <h3>${section.title}</h3>
                        <p>${section.content}</p>
                        ${section.buttonText ? `<a href="${section.buttonUrl || '#'}" class="cta-btn">${section.buttonText}</a>` : ''}
                    </div>`;

            case 'piece-values':
                return this._renderPieceValues(section);

            default:
                return '';
        }
    }

    /**
     * Render a static (non-interactive) chess board.
     */
    _renderStaticBoard(section) {
        const id = `static-board-${Math.random().toString(36).substr(2, 8)}`;
        const orientation = section.orientation || 'white';
        const fen = section.fen === 'start'
            ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
            : section.fen;

        // Store static board data for post-render initialization
        if (!this._staticBoards) this._staticBoards = [];
        this._staticBoards.push({ id, fen });

        return `
            <div class="board-container">
                <chess-board
                    id="${id}"
                    orientation="${orientation}"
                    style="width: 100%;"
                ></chess-board>
                ${section.caption ? `<p class="board-caption">${section.caption}</p>` : ''}
            </div>`;
    }

    /**
     * Render an exercise card with all UI elements.
     */
    _renderExerciseCard(section, exerciseIndex) {
        const cardId = `exercise-card-${exerciseIndex}`;
        const boardId = `exercise-board-${exerciseIndex}`;
        const isSequence = section.exerciseType === 'sequence';

        return `
            <div class="exercise-card" id="${cardId}" data-exercise-index="${exerciseIndex}">
                <span class="exercise-badge">Ejercicio ${exerciseIndex + 1}</span>
                <h3 class="exercise-title">${section.title || `Ejercicio ${exerciseIndex + 1}`}</h3>
                <p class="exercise-instruction">${section.instruction}</p>

                <div class="exercise-board-area" id="${boardId}">
                    <!-- chess-board will be created here by ChessLesson -->
                </div>

                ${isSequence ? `
                    <div class="sequence-step-info" style="display:none;"></div>
                    <div class="sequence-move-counter"></div>
                ` : ''}

                <div class="exercise-feedback">
                    <span class="feedback-icon"></span>
                    <span class="feedback-text"></span>
                </div>

                <div class="exercise-explanation"></div>

                <div class="exercise-buttons">
                    <button class="exercise-btn" data-action="hint" title="Pista">
                        <span class="btn-icon">💡</span> Pista
                    </button>
                    <button class="exercise-btn" data-action="reset" title="Reiniciar">
                        <span class="btn-icon">🔄</span> Reiniciar
                    </button>
                    <button class="exercise-btn exercise-btn-success" data-action="next" style="display:none;" title="Siguiente">
                        Siguiente <span class="btn-icon">→</span>
                    </button>
                </div>
            </div>`;
    }

    /**
     * Render piece values grid.
     */
    _renderPieceValues(section) {
        const items = section.pieces || [];
        let html = '<div class="piece-values">';
        for (const p of items) {
            html += `
                <div class="piece-value-item">
                    <span class="piece-icon">${p.icon}</span>
                    <span class="piece-name">${p.name}</span>
                    <span class="piece-pts">${p.value}</span>
                </div>`;
        }
        html += '</div>';
        return html;
    }

    /**
     * Render the navigation footer with proper slug-based links.
     */
    _renderNavigationFooter() {
        const slugs = [
            '01-tablero', '02-movimientos', '03-reglas', '04-jaque-mate',
            '05-valor-piezas', '06-apertura', '07-tacticas', '08-medio-juego',
            '09-finales', '10-practica'
        ];

        const prevIndex = this.lessonIndex - 1;
        const nextIndex = this.lessonIndex + 1;
        const prevDisabled = prevIndex < 0;
        const nextDisabled = nextIndex >= this.totalLessons;

        const prevTitle = !prevDisabled && this.courseData
            ? this.courseData.lessons[prevIndex].shortTitle || this.courseData.lessons[prevIndex].title
            : '';
        const nextTitle = !nextDisabled && this.courseData
            ? this.courseData.lessons[nextIndex].shortTitle || this.courseData.lessons[nextIndex].title
            : '';

        return `
            <div class="lesson-nav">
                <a href="${prevDisabled ? '#' : `leccion-${slugs[prevIndex]}.html`}"
                   class="lesson-nav-btn ${prevDisabled ? 'disabled' : ''}">
                    <span class="nav-arrow">\u2190</span>
                    <div>
                        <span class="lesson-nav-label">Anterior</span>
                        <span class="lesson-nav-title">${prevTitle}</span>
                    </div>
                </a>
                <a href="${nextDisabled ? '#' : `leccion-${slugs[nextIndex]}.html`}"
                   class="lesson-nav-btn primary ${nextDisabled ? 'disabled' : ''}">
                    <div>
                        <span class="lesson-nav-label">Siguiente</span>
                        <span class="lesson-nav-title">${nextTitle}</span>
                    </div>
                    <span class="nav-arrow">\u2192</span>
                </a>
            </div>`;
    }

    /**
     * Initialize static boards by calling setPosition with FEN.
     * The position attribute only accepts objects, not FEN strings.
     */
    _initStaticBoards() {
        if (!this._staticBoards) return;

        const initBoard = (boardData) => {
            const el = document.getElementById(boardData.id);
            if (el && typeof el.setPosition === 'function') {
                el.setPosition(boardData.fen, false);
            } else if (el) {
                // Web component not yet upgraded, wait and retry
                customElements.whenDefined('chess-board').then(() => {
                    el.setPosition(boardData.fen, false);
                });
            }
        };

        for (const boardData of this._staticBoards) {
            initBoard(boardData);
        }
    }

    /**
     * Initialize all exercise instances.
     */
    _initExercises() {
        const exerciseSections = this.lessonData.sections.filter(s => s.type === 'exercise');

        exerciseSections.forEach((exercise, idx) => {
            const cardId = `exercise-card-${idx}`;
            const boardId = `exercise-board-${idx}`;
            const cardEl = document.getElementById(cardId);

            if (!cardEl) return;

            const lesson = new ChessLesson({
                boardContainerId: boardId,
                exercises: [exercise],
                onComplete: () => {
                    this.completedExercises++;
                    this._updateProgressBar();

                    if (this.completedExercises >= this.totalExercises) {
                        this._scheduleTimer(() => {
                            this._showCompletionOverlay();
                        }, 1000);
                    }
                },
                onProgress: () => {
                    this._updateProgressBar();
                }
            });

            // Wire up buttons
            const hintBtn = cardEl.querySelector('[data-action="hint"]');
            const resetBtn = cardEl.querySelector('[data-action="reset"]');
            const nextBtn = cardEl.querySelector('[data-action="next"]');

            if (hintBtn) hintBtn.addEventListener('click', () => lesson.showHint());
            if (resetBtn) resetBtn.addEventListener('click', () => lesson.reset());
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    // Scroll to next exercise card
                    const nextCard = document.getElementById(`exercise-card-${idx + 1}`);
                    if (nextCard) {
                        nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
            }

            // Hide hint button for explore exercises
            if (exercise.exerciseType === 'explore' && hintBtn) {
                hintBtn.style.display = 'none';
            }

            lesson.init();
            this.exerciseInstances.push(lesson);
        });
    }

    /**
     * Set up the previous/next navigation buttons.
     */
    _setupNavigation() {
        // Navigation is rendered as links, no extra JS needed
    }

    /**
     * Set up mobile hamburger menu.
     */
    _setupMobileMenu() {
        const hamburger = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.lesson-sidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        if (!hamburger || !sidebar) return;

        const toggle = () => {
            sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('open');
        };

        hamburger.addEventListener('click', toggle);
        if (overlay) overlay.addEventListener('click', toggle);
    }

    /**
     * Update the top progress bar.
     */
    _updateProgressBar() {
        const progressFill = document.querySelector('.lesson-progress-fill');
        const progressText = document.querySelector('.lesson-progress-text');

        if (progressFill && this.totalExercises > 0) {
            const pct = (this.completedExercises / this.totalExercises) * 100;
            progressFill.style.width = `${pct}%`;
        }

        if (progressText) {
            progressText.textContent = `${this.completedExercises} de ${this.totalExercises} ejercicios`;
        }
    }

    /**
     * Show the lesson completion overlay with confetti.
     */
    _showCompletionOverlay() {
        // Mark lesson as completed in localStorage
        this._markLessonCompleted(this.lessonIndex);

        const overlay = document.querySelector('.lesson-complete-overlay');
        if (overlay) {
            overlay.classList.add('visible');
        }

        // Trigger confetti
        this._launchConfetti();

        // Notify callback
        this.onLessonComplete(this.lessonIndex);
    }

    /**
     * Create confetti particles.
     */
    _launchConfetti() {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#60a5fa'];

        for (let i = 0; i < 60; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.width = `${6 + Math.random() * 8}px`;
            piece.style.height = `${6 + Math.random() * 8}px`;
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.setProperty('--fall-duration', `${2 + Math.random() * 2}s`);
            piece.style.setProperty('--fall-delay', `${Math.random() * 1}s`);
            piece.style.setProperty('--drift', `${-100 + Math.random() * 200}px`);
            piece.style.setProperty('--spin', `${Math.random() * 1080}deg`);
            container.appendChild(piece);
        }

        // Clean up after animation
        setTimeout(() => container.remove(), 5000);
    }

    /* ============================================================
       LOCAL STORAGE HELPERS
       ============================================================ */

    _isLessonCompleted(index) {
        try {
            const data = JSON.parse(localStorage.getItem('cheescoach_course_progress') || '{}');
            return Array.isArray(data.completedLessons) && data.completedLessons.includes(index + 1);
        } catch {
            return false;
        }
    }

    _markLessonCompleted(index) {
        try {
            const data = JSON.parse(localStorage.getItem('cheescoach_course_progress') || '{}');
            if (!Array.isArray(data.completedLessons)) data.completedLessons = [];
            const lessonNum = index + 1;
            if (!data.completedLessons.includes(lessonNum)) {
                data.completedLessons.push(lessonNum);
            }
            data.currentLesson = Math.max(data.currentLesson || 1, lessonNum + 1);
            localStorage.setItem('cheescoach_course_progress', JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save progress:', e);
        }
    }

    _getLessonProgress() {
        try {
            const data = JSON.parse(localStorage.getItem('cheescoach_course_progress') || '{}');
            if (!Array.isArray(data.completedLessons)) data.completedLessons = [];
            return data;
        } catch {
            return { completedLessons: [], currentLesson: 1 };
        }
    }

    _scheduleTimer(callback, delay) {
        return setTimeout(callback, delay);
    }

    /**
     * Destroy all exercise instances.
     */
    destroy() {
        for (const instance of this.exerciseInstances) {
            instance.destroy();
        }
        this.exerciseInstances = [];
    }
}

export default ChessLesson;
