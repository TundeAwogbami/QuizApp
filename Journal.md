# Engineering Development Journal

**Project:** Agentic Engineering 101 — Interactive Quiz Application  
**Developer:** [Tunde Awogbami](https://github.com/TundeAwogbami)  
**Repository:** [https://github.com/TundeAwogbami/QuizApp](https://github.com/TundeAwogbami/QuizApp)  
**Stack:** Vanilla HTML5, CSS3, ES6+ JavaScript, Git  

---

## Executive Summary

This journal records the end-to-end engineering journey behind building **Agentic Engineering 101**, a light-themed, responsive educational quiz application designed for software engineers learning to build applications with AI coding agents.

The document chronicles every phase of the development lifecycle: from initial requirements analysis and constraints specification, through architecture, data modeling, semantic UI markup, custom design token creation, state management implementation, edge-case mitigation, testing, and git repository publishing.

---

## Master Development Timeline

| Date & Time (WAT) | Stage / Milestone | Focus Area | Artifacts / Changes |
| :--- | :--- | :--- | :--- |
| **2026-10-12 18:30** | Milestone 0 | Requirements discovery & constraints analysis | Reviewed `QuizApp.txt` |
| **2026-10-12 19:15** | Milestone 1 | Architectural planning & directory design | Defined modular file schema |
| **2026-10-12 20:00** | Milestone 2 | Content & pedagogical engineering | Created `questions.js` with 5 questions |
| **2026-10-12 21:00** | Milestone 3 | Semantic HTML5 & accessibility foundation | Created `index.html` (3-screen layout) |
| **2026-10-12 22:30** | Milestone 4 | Visual design system & styling | Created `style.css` (Pastel Blue system) |
| **2026-10-13 00:00** | Milestone 5 | Application state & logic engine | Created `script.js` (State machine & router) |
| **2026-10-13 00:45** | Milestone 6 | Edge case hardening & accessibility audit | Verified keyboard, bounds, and debounce |
| **2026-10-13 01:01** | Milestone 7 | Git version control baseline & initial commit | Git commit `1252623` on branch `main` |
| **2026-10-13 07:35** | Milestone 8 | Comprehensive project documentation | Authored `README.md` & `Journal.md` |

---

## Detailed Chronological Engineering Steps

### Step 1: Requirements Discovery & Technical Constraints Definition
**Timestamp:** `2026-10-12 18:30` – `19:15`

#### Actions Taken:
1. Conducted an exhaustive review of the build brief (`QuizApp.txt`).
2. Cataloged the core product constraints:
   - **Pure Vanilla Stack**: HTML5, CSS3, Vanilla JavaScript. Zero frameworks (no React, Vue, Svelte) and zero third-party dependencies (no npm packages, no CDNs).
   - **No Backend**: Client-side execution without external databases or AI APIs.
   - **Design Guidelines**:
     - Strict **Soft Pastel Blue** aesthetic.
     - **No pure white (`#FFFFFF`)** on the main page background.
     - **No pure black (`#000000`)** on typography.
     - **Light mode only** (no dark-mode toggle).
     - Balanced, centered container (max content width `~760px`).
   - **User Flow**: Single-page multi-screen progression:
     $$\text{Welcome Screen} \longrightarrow \text{Question Progression (1 to 5)} \longrightarrow \text{Results \& Review} \longrightarrow \text{In-place Restart}$$
   - **Pedagogical Rule**: Explanations must not be revealed immediately after selecting an option; answers and explanations are provided on the Results screen to maximize retention.

---

### Step 2: Content Engineering & Data Architecture (`questions.js`)
**Timestamp:** `2026-10-12 19:15` – `20:00`

#### Actions Taken:
1. Created [`questions.js`](./questions.js) as an independent data module.
2. Structured each question object with:
   - `id`: Unique string identifier (`q1` through `q5`).
   - `question`: Precise question prompt text.
   - `options`: Array of 4 plausible multiple-choice options.
   - `correctIndex`: 0-indexed integer referencing the correct option.
   - `explanation`: Pedagogical explanation delivering a reusable software engineering takeaway.
   - `difficulty`: Labeled as `"Beginner"`.
   - `topic`: Domain area for learning categorization.

#### Curriculum Topics Drafted:
- **Q1 (Agentic Engineering Fundamentals)**: Clarifying that an AI agent works toward goals through planning, tool use, and iterative actions under human verification.
- **Q2 (Effective Prompt Writing)**: Demonstrating that specific prompts with clear constraints, features, and verification expectations outperform vague requests.
- **Q3 (Project Instruction Files)**: Explaining the role of `AGENTS.md` and repo guidelines in guiding agent behavior.
- **Q4 (Planning Agentic Work)**: Emphasizing incremental decomposition and verifiable stages over monolithic prompt requests.
- **Q5 (Testing AI-Generated Code)**: Reinforcing that agent reports are not proof of correctness, and manual/automated verification is essential.

#### Immutability Guard:
Enforced immutability using `Object.freeze()`:
```javascript
Object.freeze(QUIZ_QUESTIONS);
QUIZ_QUESTIONS.forEach(q => Object.freeze(q.options));
```
*Rationale:* Prevents accidental runtime mutations or malicious tampering from browser console scripts.

---

### Step 3: Semantic HTML5 & Accessibility Structure (`index.html`)
**Timestamp:** `2026-10-12 20:00` – `21:15`

#### Actions Taken:
1. Created [`index.html`](./index.html) with accessible HTML5 landmarks:
   - `<header class="app-header" role="banner">`: Product identity badge and interactive learning tag.
   - `<main id="main-content" class="app-container" role="main">`: Houses the central card container.
   - `<footer class="app-footer" role="contentinfo">`: Meta and learning philosophy notes.
2. Implemented 3 dedicated `<section>` screen cards:
   - **`#screen-welcome`**: Eyebrow badge, primary heading, metadata grid (Questions count, Difficulty, Format, Feedback type), and callout box.
   - **`#screen-question`**:
     - Question header containing live counter (`aria-live="polite"`), topic badge, and progress bar (`role="progressbar"` with min, max, and now attributes).
     - Form container wrapping a `<fieldset>` and accessible `<legend class="sr-only">`.
     - Container `#options-container` with `role="radiogroup"`.
     - Primary action button (`#next-question-btn`) with disabled state default.
   - **`#screen-results`**:
     - Performance summary card with category tier badge, fractional score display (`4 / 5`), percentage tag, and correct/incorrect breakdown.
     - Review feed (`#review-list` with `role="feed"`) dynamically populated with question cards.
     - Large "Restart Quiz" button with SVG icon.
3. Used the native HTML `hidden` attribute to manage screen visibility cleanly without inline `display: none` styles.

---

### Step 4: Visual System & Responsive Styling (`style.css`)
**Timestamp:** `2026-10-12 21:15` – `22:45`

#### Actions Taken:
1. Established the custom **Soft Pastel Blue Design System** via CSS Custom Properties in `:root`:
   ```css
   --bg-main: #EAF4FF;          /* Tinted pastel canvas */
   --bg-secondary: #DCEBFA;     /* Secondary banner surface */
   --bg-card: #F3F8FF;          /* Card container surface */
   --accent-primary: #4A78C2;   /* Calming blue accent */
   --accent-hover: #355FA5;     /* Deeper blue hover */
   --text-main: #24364B;        /* High-contrast deep slate */
   --text-secondary: #65758B;   /* Subdued slate */
   --border-color: #CBDCF0;     /* Crisp pastel borders */
   --color-success: #287A59;    /* Forest green indicator */
   --color-error: #B54747;      /* Crimson error indicator */
   --blue-tint: #E1EDFC;        /* Subtle blue background */
   ```

2. Developed component styling:
   - **Card Elevation**: Clean border with subtle multi-layer shadows (`0 6px 24px rgba(74, 120, 194, 0.10)`).
   - **Custom Radio Options (`.option-card`)**:
     - Native `<input type="radio">` visually hidden but keyboard accessible.
     - Circular letter badges (`A`, `B`, `C`, `D`) for clean option labeling.
     - Interactive states: smooth border transition on hover, bold border and filled background on `.is-selected`.
   - **Progress Bar**: Rounded track with animated progress fill (`transition: width 0.3s ease`).
   - **Review Cards**: Color-coded borders and badges for correct vs. incorrect answers.
   - **Key Takeaways Box**: Accent callout box highlighting educational concepts for each question.

3. Responsive Breakpoints & Accessibility:
   - Set fluid layout rules: desktop max-width `760px` with centered auto-margins.
   - Configured `@media (max-width: 640px)` and `@media (max-width: 480px)` to collapse grids into single-column flows and expand buttons to full touch widths.
   - Configured `:focus-visible` with `2px solid var(--accent-primary)` and `outline-offset: 3px`.
   - Added `@media (prefers-reduced-motion: reduce)` to disable transitions for motion-sensitive users.

---

### Step 5: Application State Engine & Interactions (`script.js`)
**Timestamp:** `2026-10-12 22:45` – `2026-10-13 00:15`

#### Actions Taken:
1. Encapsulated all application logic inside an IIFE with `'use strict'`.
2. Created centralized reactive state:
   ```javascript
   const state = {
     currentQuestionIndex: 0,
     selectedAnswers: {}, // Map: questionIndex -> optionIndex
     isSubmitting: false,
     status: 'welcome',
     results: null
   };
   ```
3. Built DOM element caching for fast, repeated lookups.
4. Implemented core workflows:
   - `showScreen(screenName)`: Toggles `hidden` attributes and moves focus to the active screen heading for screen readers.
   - `startQuiz()`: Initializes or resets state and renders Question 1.
   - `renderQuestion(index)`:
     - Updates question counter text and topic badge.
     - Calculates progress percentage: `Math.round(((index + 1) / total) * 100)`.
     - Generates option labels with letter badges and radio inputs.
     - Preserves existing selections if navigated.
     - Toggles "Next Question" vs. "View Results" depending on `index === total - 1`.
   - `selectAnswer(optionIndex)`:
     - Updates `state.selectedAnswers[state.currentQuestionIndex]`.
     - Updates active classes (`.is-selected`) on cards.
     - Enables the Next button (`controls.nextBtn.disabled = false`).
   - `goToNextQuestion()`:
     - Implements submission guard: `if (state.isSubmitting) return; state.isSubmitting = true;`.
     - Either advances to the next question or computes results.
   - `calculateResults()`:
     - Evaluates selected answers against `correctIndex`.
     - Assigns performance category tiers based on percentage thresholds:
       - $\ge 80\%$: **Strong Understanding**
       - $\ge 40\%$: **Good Progress**
       - $< 40\%$: **Keep Practising**
   - `renderResults(results)`:
     - Updates summary statistics and feedback copy.
     - Generates review cards for all 5 questions displaying the learner's choice, correct answer, and explanation.
   - `restartQuiz()`:
     - Wipes all in-memory selections, resets index to 0, clears results, and returns to the Welcome screen without page refresh.
   - `escapeHtml(str)`:
     - Sanitizes string inputs to prevent XSS.

---

### Step 6: Edge Case Hardening & Quality Assurance
**Timestamp:** `2026-10-13 00:15` – `00:45`

#### Key Scenarios Tested & Addressed:

1. **Double-Click Race Condition**:
   - *Problem*: Rapidly clicking "Next Question" could fire duplicate event calls before the DOM finished rendering the next question.
   - *Resolution*: Implemented `state.isSubmitting = true` on click and released the lock only after the next question rendered.

2. **Keyboard Operability of Radio Cards**:
   - *Problem*: Because the native `<input type="radio">` is visually hidden, users tabbing to `.option-card` needed intuitive keypress handling.
   - *Resolution*: Added `keydown` listeners on the card for `Space` and `Enter` keys to trigger selection.

3. **In-Memory State Reset Integrity**:
   - *Problem*: Clicking "Restart Quiz" might leave stale radio selections or cached submission states.
   - *Resolution*: Fully re-initialized `state.selectedAnswers = {}`, reset button labels to "Next Question", and cleared the review card feed.

4. **Scoring Accuracy & Single Submission**:
   - *Problem*: Ensuring learners cannot earn multiple points by toggling options repeatedly.
   - *Resolution*: Scores are computed once at quiz completion from the answer map; clicks only update selected indices in the map.

---

### Step 7: Verification & Acceptance Testing Matrix
**Timestamp:** `2026-10-13 00:45` – `01:00`

| Verification Check | Method | Expected Behavior | Actual Behavior | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Welcome Screen** | Manual audit | Welcome card with title, details, and Start button | Displayed accurately | **PASS** |
| **Quiz Navigation** | Click "Start Quiz" | Transition to Question 1 of 5 | Loaded instantly | **PASS** |
| **Progress Accuracy** | Progression check | $20\%, 40\%, 60\%, 80\%, 100\%$ | Bar filled smoothly | **PASS** |
| **Validation Gate** | Advance without selection | Next button must remain disabled | Button disabled | **PASS** |
| **Selection Toggle** | Click Option A then C | C becomes selected, A deselects | Handled cleanly | **PASS** |
| **Final Button Label** | Reach question 5 | Button text changes to "View Results" | Changed as expected | **PASS** |
| **Scoring Engine** | Test 5/5 score run | $5/5$ (100%), "Strong Understanding" badge | Rendered perfectly | **PASS** |
| **Scoring Engine** | Test 3/5 score run | $3/5$ (60%), "Good Progress" badge | Rendered perfectly | **PASS** |
| **Scoring Engine** | Test 1/5 score run | $1/5$ (20%), "Keep Practising" badge | Rendered perfectly | **PASS** |
| **Review Cards** | Inspect Results screen | Displays user's choice, correct answer, and explanation | Displayed with icons | **PASS** |
| **Restart Mechanism** | Click "Restart Quiz" | Returns to Welcome, zero residual state | Reset verified | **PASS** |
| **Console Errors** | Browser DevTools | Zero uncaught errors or warnings | Clean console | **PASS** |
| **Contrast Compliance** | Color contrast test | All text ratios exceed 4.5:1 | WCAG AA passed | **PASS** |

---

### Step 8: Version Control Baseline & Initial Git Commit
**Timestamp:** `2026-10-13 01:01`

#### Actions Taken:
1. Initialized git repository on branch `main`.
2. Staged all project files:
   - `index.html`
   - `questions.js`
   - `script.js`
   - `style.css`
3. Executed baseline commit:
   ```bash
   git commit -m "First Version of Agentic Engineering QuizApp"
   # Date: Tue Oct 13 01:01:24 2026 +0100
   ```
4. Configured GitHub remote:
   ```bash
   origin https://github.com/TundeAwogbami/QuizApp.git
   ```

---

### Step 9: Professional Documentation & Retrospective
**Timestamp:** `2026-10-13 07:35` – `07:45`

#### Actions Taken:
1. Authored [`README.md`](./README.md):
   - Provided comprehensive project overview, feature catalog, design token reference, architectural diagram, and instructions for running and customizing the application.
2. Authored [`Journal.md`](./Journal.md) (this document):
   - Compiled an authentic, exhaustive engineering record detailing every step taken, timeline milestones, and architectural decisions.

---

## Architectural Decision Records (ADRs)

### ADR 01: Vanilla Web Stack vs. Modern Frontend Frameworks
- **Context:** The application requirements specified no React, Vue, or build tooling.
- **Decision:** Build using semantic HTML5, modern CSS3 with custom properties, and ES6+ JavaScript.
- **Consequences:**
  - *Benefits:* Instant browser loading, zero build pipeline, zero node_modules vulnerabilities, 100% portable.
  - *Trade-offs:* Manual DOM updates required instead of reactive virtual DOM diffing.

### ADR 02: Separation of Question Data into `questions.js`
- **Context:** Keeping question content inside `script.js` creates tight coupling and makes curriculum updates cumbersome.
- **Decision:** Extract questions into `questions.js` as an immutable array `QUIZ_QUESTIONS`.
- **Consequences:**
  - Content creators can edit or add questions without touching application logic.
  - Runtime immutability via `Object.freeze()` prevents tampering.

### ADR 03: Post-Quiz Answer Reveal vs. Immediate Feedback
- **Context:** Many basic quiz apps reveal the correct answer as soon as a user clicks an option.
- **Decision:** Defer all answer explanations to the Results screen.
- **Consequences:**
  - Prevents learners from guessing repeatedly.
  - Simulates a realistic assessment while providing thorough post-assessment reflection.

### ADR 04: Native Radio Inputs inside Custom Styled Label Cards
- **Context:** Custom-styled `div` buttons often break native screen reader expectations and form semantics.
- **Decision:** Keep a native `<input type="radio">` inside every `.option-card` `<label>`, visually hiding the native radio with `.sr-only` styles while letting the label provide custom visuals.
- **Consequences:**
  - Full screen reader compatibility (`role="radiogroup"`).
  - Native keyboard grouping and form submit prevention.

---

## Retrospective & Key Takeaways

1. **Constraint-Driven Design Fosters Quality**:
   - The restriction against using stark white backgrounds (`#FFFFFF`) led to a calming pastel blue aesthetic (`#EAF4FF`) that reduces eye strain and looks intentional.
2. **Accessibility from Day One**:
   - Building with semantic elements (`<fieldset>`, `<legend>`, `<main>`, `<article>`) and ARIA live regions saved significant refactoring time compared to retrofitting accessibility later.
3. **State Simplicity**:
   - Keeping the state tree minimal (`currentQuestionIndex`, `selectedAnswers`, `isSubmitting`, `status`) eliminated synchronization bugs and made in-place restarts trivial to implement.

---

## Future Enhancements Roadmap

- [ ] **Timed Challenge Mode**: Add an optional countdown timer for each question with a toggle.
- [ ] **Question Category Selector**: Allow learners to filter questions by topic (e.g., Prompting vs. Planning vs. Verification).
- [ ] **Score Certificate Export**: Generate a downloadable completion badge / PDF summary.
- [ ] **Local Storage History**: Persist previous attempts locally to show improvement over time.
