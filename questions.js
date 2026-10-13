/**
 * questions.js
 * Question data structure for Agentic Engineering 101.
 * 
 * Each question object contains:
 * - id: unique identifier
 * - question: the prompt / question text
 * - options: array of 4 multiple-choice options
 * - correctIndex: index of the correct option (0-based)
 * - explanation: concise explanation of the concept
 * - difficulty: difficulty level label
 * - topic: specific subject area
 */

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "What best describes agentic software engineering?",
    options: [
      "Using AI only to explain programming concepts.",
      "Using an AI agent to work toward a goal through planning, tool use, and iterative actions.",
      "Generating an entire application from one sentence without review.",
      "Replacing software testing with AI-generated code."
    ],
    correctIndex: 1, // Option B
    explanation: "An AI coding agent can plan steps, use available tools, inspect results, and adjust its approach toward a defined goal. Its work still requires appropriate human oversight and verification.",
    difficulty: "Beginner",
    topic: "Agentic Engineering Fundamentals"
  },
  {
    id: "q2",
    question: "Which prompt gives a coding agent the clearest implementation requirements?",
    options: [
      "\"Make me a quiz app.\"",
      "\"Build something impressive using JavaScript.\"",
      "\"Build a five-question quiz using vanilla JavaScript. Include answer selection, progress tracking, score calculation, restart functionality, and tests for the core interactions.\"",
      "\"Write as much code as possible and make it look modern.\""
    ],
    correctIndex: 2, // Option C
    explanation: "A strong implementation prompt communicates the task, technology, required functionality, and expected verification. These details reduce ambiguity and make the result easier to evaluate.",
    difficulty: "Beginner",
    topic: "Effective Prompt Writing"
  },
  {
    id: "q3",
    question: "What is the primary purpose of a project instruction file such as AGENTS.md?",
    options: [
      "To store all the application's source code in one file.",
      "To communicate project-specific instructions, conventions, and expectations to compatible coding agents.",
      "To guarantee that every generated feature will be bug-free.",
      "To replace the need for README documentation and software tests."
    ],
    correctIndex: 1, // Option B
    explanation: "Project instruction files provide relevant guidance to coding agents. They can explain project conventions, development workflows, constraints, and expectations, but they do not guarantee correct implementation.",
    difficulty: "Beginner",
    topic: "Project Instruction Files"
  },
  {
    id: "q4",
    question: "You want an AI coding agent to add a quiz, a scoring system, and an answer review screen to an existing application. What is the most reliable approach?",
    options: [
      "Ask the agent to change every file at once without a plan.",
      "Focus only on the visual design and postpone the functionality indefinitely.",
      "Break the work into manageable stages, define completion criteria, and verify important results as the agent progresses.",
      "Allow the agent to make unrelated changes whenever it encounters a problem."
    ],
    correctIndex: 2, // Option C
    explanation: "Breaking complex work into smaller, verifiable stages makes problems easier to isolate, reduces unnecessary changes, and helps keep implementation aligned with the intended outcome.",
    difficulty: "Beginner",
    topic: "Planning Agentic Work"
  },
  {
    id: "q5",
    question: "An AI coding agent reports that the quiz app is complete. What should you do before considering the work finished?",
    options: [
      "Trust the report and immediately publish the application.",
      "Review the code changes, run relevant tests, and manually verify important user flows.",
      "Assume that code without syntax errors cannot contain functional bugs.",
      "Add more features before checking the existing implementation."
    ],
    correctIndex: 1, // Option B
    explanation: "An agent's report is not proof that the implementation works. Reviewing changes, running tests, and checking real interactions provide evidence that the application meets its requirements.",
    difficulty: "Beginner",
    topic: "Testing AI-Generated Code"
  }
];

// Freeze to prevent accidental mutation during runtime
Object.freeze(QUIZ_QUESTIONS);
QUIZ_QUESTIONS.forEach(q => Object.freeze(q.options));
