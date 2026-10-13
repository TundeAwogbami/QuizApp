/**
 * script.js
 * Application logic for Agentic Engineering 101 Quiz App.
 * 
 * Manages quiz session state, screen transitions, answer selections,
 * scoring calculations, review generation, and full resets.
 */

(function () {
  'use strict';

  // State Management
  const state = {
    currentQuestionIndex: 0,
    selectedAnswers: {}, // Map of question index -> selected option index
    isSubmitting: false,  // Guards against rapid duplicate clicks
    status: 'welcome',    // 'welcome' | 'in_progress' | 'completed'
    results: null
  };

  // DOM Elements Cache
  const screens = {
    welcome: document.getElementById('screen-welcome'),
    question: document.getElementById('screen-question'),
    results: document.getElementById('screen-results')
  };

  const controls = {
    startBtn: document.getElementById('start-quiz-btn'),
    nextBtn: document.getElementById('next-question-btn'),
    nextBtnText: document.getElementById('next-btn-text'),
    restartBtn: document.getElementById('restart-quiz-btn'),
    questionForm: document.getElementById('question-form')
  };

  const questionElements = {
    counter: document.getElementById('question-counter'),
    topic: document.getElementById('question-topic'),
    progressFill: document.getElementById('progress-fill'),
    progressBar: document.getElementById('quiz-progress-bar'),
    heading: document.getElementById('question-heading'),
    optionsContainer: document.getElementById('options-container')
  };

  const resultsElements = {
    categoryBadge: document.getElementById('results-category-badge'),
    scoreNum: document.getElementById('results-score-num'),
    scoreTotal: document.getElementById('results-score-total'),
    percentageTag: document.getElementById('results-percentage'),
    statCorrect: document.getElementById('results-stat-correct'),
    statIncorrect: document.getElementById('results-stat-incorrect'),
    feedbackText: document.getElementById('results-feedback-text'),
    reviewList: document.getElementById('review-list')
  };

  /**
   * Helper: Switches active screen safely with accessibility considerations
   * @param {'welcome' | 'question' | 'results'} screenName
   */
  function showScreen(screenName) {
    state.status = screenName;
    
    // Toggle hidden attribute on each screen
    Object.keys(screens).forEach((name) => {
      const el = screens[name];
      if (name === screenName) {
        el.removeAttribute('hidden');
      } else {
        el.setAttribute('hidden', '');
      }
    });

    // Move focus to current screen container or main header for accessibility
    const activeScreen = screens[screenName];
    if (activeScreen) {
      const heading = activeScreen.querySelector('h1, h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: false });
      }
    }
  }

  /**
   * Initialises the quiz application and binds event listeners
   */
  function initApp() {
    // Validate question data availability
    if (typeof QUIZ_QUESTIONS === 'undefined' || !Array.isArray(QUIZ_QUESTIONS) || QUIZ_QUESTIONS.length === 0) {
      console.error('QuizApp error: Question data is missing or empty.');
      return;
    }

    // Attach button listeners
    controls.startBtn.addEventListener('click', startQuiz);
    controls.nextBtn.addEventListener('click', goToNextQuestion);
    controls.restartBtn.addEventListener('click', restartQuiz);

    // Initialise display to Welcome Screen
    showScreen('welcome');
  }

  /**
   * Starts a fresh quiz session
   */
  function startQuiz() {
    state.currentQuestionIndex = 0;
    state.selectedAnswers = {};
    state.isSubmitting = false;
    state.results = null;

    renderQuestion(state.currentQuestionIndex);
    showScreen('question');
  }

  /**
   * Renders a question by its index in QUIZ_QUESTIONS
   * @param {number} index
   */
  function renderQuestion(index) {
    if (index < 0 || index >= QUIZ_QUESTIONS.length) {
      console.warn(`Question index out of bounds: ${index}`);
      return;
    }

    const questionData = QUIZ_QUESTIONS[index];
    const totalQuestions = QUIZ_QUESTIONS.length;
    const questionNumber = index + 1;
    const progressPercent = Math.round((questionNumber / totalQuestions) * 100);

    // Update Counter & Topic
    questionElements.counter.textContent = `Question ${questionNumber} of ${totalQuestions}`;
    questionElements.topic.textContent = questionData.topic || 'Agentic Software Engineering';

    // Update Progress Bar
    questionElements.progressFill.style.width = `${progressPercent}%`;
    questionElements.progressBar.setAttribute('aria-valuenow', questionNumber);
    questionElements.progressBar.setAttribute('aria-valuetext', `Question ${questionNumber} of ${totalQuestions}`);

    // Update Question Prompt
    questionElements.heading.textContent = questionData.question;

    // Clear Options Container
    questionElements.optionsContainer.innerHTML = '';

    // Letters for multiple choice badges
    const optionLetters = ['A', 'B', 'C', 'D'];

    // Check if an answer was already selected for this question
    const previouslySelected = state.selectedAnswers[index];

    // Populate Option Cards
    questionData.options.forEach((optText, optIndex) => {
      const optionCard = document.createElement('label');
      optionCard.className = 'option-card';
      optionCard.setAttribute('for', `opt-${index}-${optIndex}`);

      const isSelected = previouslySelected === optIndex;
      if (isSelected) {
        optionCard.classList.add('is-selected');
      }

      // Hidden native radio input for accessibility and form semantics
      const radioInput = document.createElement('input');
      radioInput.type = 'radio';
      radioInput.name = `quiz-question-${index}`;
      radioInput.id = `opt-${index}-${optIndex}`;
      radioInput.value = optIndex;
      radioInput.className = 'option-input';
      radioInput.checked = isSelected;

      // Letter Badge (A, B, C, D)
      const letterBadge = document.createElement('span');
      letterBadge.className = 'option-letter-badge';
      letterBadge.textContent = optionLetters[optIndex] || `${optIndex + 1}`;
      letterBadge.setAttribute('aria-hidden', 'true');

      // Option Text
      const textSpan = document.createElement('span');
      textSpan.className = 'option-text';
      textSpan.textContent = optText;

      // Event listener for radio change
      radioInput.addEventListener('change', () => {
        selectAnswer(optIndex);
      });

      // Keyboard support for Enter/Space on label if focused
      optionCard.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          radioInput.checked = true;
          selectAnswer(optIndex);
        }
      });

      optionCard.appendChild(radioInput);
      optionCard.appendChild(letterBadge);
      optionCard.appendChild(textSpan);
      questionElements.optionsContainer.appendChild(optionCard);
    });

    // Update Next Button State and Label
    const hasSelection = typeof previouslySelected === 'number';
    controls.nextBtn.disabled = !hasSelection;

    const isLastQuestion = index === totalQuestions - 1;
    controls.nextBtnText.textContent = isLastQuestion ? 'View Results' : 'Next Question';

    // Reset submission lock
    state.isSubmitting = false;
  }

  /**
   * Handles user selecting an answer option
   * @param {number} optionIndex
   */
  function selectAnswer(optionIndex) {
    state.selectedAnswers[state.currentQuestionIndex] = optionIndex;

    // Update visual styles on all option cards for current question
    const cards = questionElements.optionsContainer.querySelectorAll('.option-card');
    cards.forEach((card, idx) => {
      if (idx === optionIndex) {
        card.classList.add('is-selected');
      } else {
        card.classList.remove('is-selected');
      }
    });

    // Enable next button once an answer is chosen
    controls.nextBtn.disabled = false;
  }

  /**
   * Validates selection and advances to the next question or results screen
   */
  function goToNextQuestion() {
    // Guard against double clicks / rapid submissions
    if (state.isSubmitting) return;

    // Verify an answer has been selected
    const selected = state.selectedAnswers[state.currentQuestionIndex];
    if (typeof selected !== 'number') {
      return;
    }

    state.isSubmitting = true;

    const isLastQuestion = state.currentQuestionIndex === QUIZ_QUESTIONS.length - 1;

    if (!isLastQuestion) {
      state.currentQuestionIndex += 1;
      renderQuestion(state.currentQuestionIndex);
    } else {
      // Final question reached: Calculate score and show results
      const results = calculateResults();
      state.results = results;
      renderResults(results);
      showScreen('results');
    }
  }

  /**
   * Calculates overall quiz score and categorises performance
   * @returns {{ correctCount: number, totalQuestions: number, percentage: number, category: string, feedback: string, reviews: Array }}
   */
  function calculateResults() {
    let correctCount = 0;
    const totalQuestions = QUIZ_QUESTIONS.length;
    const reviews = [];

    QUIZ_QUESTIONS.forEach((qData, qIndex) => {
      const learnerAnswerIndex = state.selectedAnswers[qIndex];
      const isCorrect = learnerAnswerIndex === qData.correctIndex;
      if (isCorrect) {
        correctCount += 1;
      }

      reviews.push({
        id: qData.id,
        questionNumber: qIndex + 1,
        question: qData.question,
        learnerAnswerIndex: learnerAnswerIndex,
        learnerAnswerText: qData.options[learnerAnswerIndex] || 'No answer recorded',
        correctIndex: qData.correctIndex,
        correctAnswerText: qData.options[qData.correctIndex],
        isCorrect: isCorrect,
        explanation: qData.explanation,
        topic: qData.topic
      });
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);

    // Performance tiers defined in Section 5
    let category = '';
    let feedback = '';

    if (percentage >= 80) {
      category = 'Strong Understanding';
      feedback = 'Outstanding achievement! You demonstrate a solid grasp of agentic software engineering workflows, clear prompting principles, and verification techniques.';
    } else if (percentage >= 40) {
      category = 'Good Progress';
      feedback = 'Well done! You have a good foundational grasp of agentic coding concepts. Review the detailed explanations below to strengthen key areas.';
    } else {
      category = 'Keep Practising';
      feedback = 'A great start on your learning journey. Building software with AI agents takes practice—carefully review the explanations below to master the core principles.';
    }

    return {
      correctCount,
      incorrectCount: totalQuestions - correctCount,
      totalQuestions,
      percentage,
      category,
      feedback,
      reviews
    };
  }

  /**
   * Renders the Results Screen and Detailed Review
   * @param {Object} results
   */
  function renderResults(results) {
    // Score Summary Updates
    resultsElements.categoryBadge.textContent = results.category;
    resultsElements.scoreNum.textContent = results.correctCount;
    resultsElements.scoreTotal.textContent = results.totalQuestions;
    resultsElements.percentageTag.textContent = `${results.percentage}% Score`;
    resultsElements.statCorrect.textContent = `${results.correctCount} Correct`;
    resultsElements.statIncorrect.textContent = `${results.incorrectCount} Incorrect`;
    resultsElements.feedbackText.textContent = results.feedback;

    // Render Review List
    resultsElements.reviewList.innerHTML = '';

    results.reviews.forEach((review) => {
      const card = document.createElement('article');
      card.className = `review-card ${review.isCorrect ? 'status-correct' : 'status-incorrect'}`;

      // Card Header
      const topRow = document.createElement('div');
      topRow.className = 'review-card-top';

      const qNum = document.createElement('span');
      qNum.className = 'review-question-num';
      qNum.textContent = `Question ${review.questionNumber} • ${review.topic || 'Agentic Concept'}`;

      const badge = document.createElement('span');
      badge.className = `status-badge ${review.isCorrect ? 'badge-correct' : 'badge-incorrect'}`;
      badge.innerHTML = review.isCorrect
        ? '<span aria-hidden="true">&#10003;</span> Correct'
        : '<span aria-hidden="true">&#10007;</span> Incorrect';

      topRow.appendChild(qNum);
      topRow.appendChild(badge);

      // Question Prompt
      const qText = document.createElement('h4');
      qText.className = 'review-question-text';
      qText.textContent = review.question;

      // Answers Box
      const answersBox = document.createElement('div');
      answersBox.className = 'review-answers-box';

      // User Answer Row
      const userRow = document.createElement('div');
      userRow.className = 'review-answer-row';
      userRow.innerHTML = `
        <span class="answer-label label-user">Your Answer:</span>
        <span class="answer-text-user">${escapeHtml(review.learnerAnswerText)}</span>
      `;
      answersBox.appendChild(userRow);

      // If incorrect, also show correct answer prominently
      if (!review.isCorrect) {
        const correctRow = document.createElement('div');
        correctRow.className = 'review-answer-row';
        correctRow.innerHTML = `
          <span class="answer-label label-correct">Correct Answer:</span>
          <span class="answer-text-correct">${escapeHtml(review.correctAnswerText)}</span>
        `;
        answersBox.appendChild(correctRow);
      }

      // Explanation Box
      const expBox = document.createElement('div');
      expBox.className = 'review-explanation';
      expBox.innerHTML = `
        <span class="explanation-label">Key Takeaway</span>
        <p>${escapeHtml(review.explanation)}</p>
      `;

      card.appendChild(topRow);
      card.appendChild(qText);
      card.appendChild(answersBox);
      card.appendChild(expBox);

      resultsElements.reviewList.appendChild(card);
    });
  }

  /**
   * Resets the entire quiz state and returns to Welcome screen without browser reload
   */
  function restartQuiz() {
    // Reset state object
    state.currentQuestionIndex = 0;
    state.selectedAnswers = {};
    state.isSubmitting = false;
    state.status = 'welcome';
    state.results = null;

    // Reset input elements
    if (controls.nextBtn) {
      controls.nextBtn.disabled = true;
      controls.nextBtnText.textContent = 'Next Question';
    }

    // Reset screen to welcome
    showScreen('welcome');
  }

  /**
   * Utility to safely escape HTML strings
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Bootstraps application on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
