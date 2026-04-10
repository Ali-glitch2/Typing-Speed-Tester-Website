/* ============================================================
   script.js – Typing Speed Tester
   ============================================================ */

// ── Sample Text ──────────────────────────────────────────────
const SAMPLE_TEXT =
  "The quick brown fox jumps over the lazy dog. " +
  "Programming is the art of telling another human what one wants the computer to do. " +
  "Practice makes perfect, and every keystroke brings you one step closer to mastery.";

// ── DOM References ────────────────────────────────────────────
const textDisplay   = document.getElementById("text-display");
const inputArea     = document.getElementById("input-area");
const timerEl       = document.getElementById("timer");
const timerBox      = document.getElementById("timer-box");
const wpmEl         = document.getElementById("wpm");
const accuracyEl    = document.getElementById("accuracy");
const restartBtn    = document.getElementById("restart-btn");
const resultsEl     = document.getElementById("results");
const resultWpm     = document.getElementById("result-wpm");
const resultAcc     = document.getElementById("result-accuracy");
const resultChars   = document.getElementById("result-chars");
const resultCorrect = document.getElementById("result-correct");

// ── State ─────────────────────────────────────────────────────
const TOTAL_TIME = 60; // seconds
let timerInterval = null;
let timeLeft      = TOTAL_TIME;
let started       = false;   // becomes true on first keypress

// ── Init ──────────────────────────────────────────────────────

/**
 * Render the sample text as individual <span> elements.
 * Each span gets class "char" and a data-index attribute.
 */
function renderText() {
  textDisplay.innerHTML = "";
  for (let i = 0; i < SAMPLE_TEXT.length; i++) {
    const span = document.createElement("span");
    span.classList.add("char");
    span.dataset.index = i;
    // Preserve whitespace characters visually
    span.textContent = SAMPLE_TEXT[i];
    textDisplay.appendChild(span);
  }
  // Mark the first character as the cursor position
  updateCursor(0);
}

/** Move the blinking cursor highlight to the given index. */
function updateCursor(index) {
  // Remove cursor from all spans
  document.querySelectorAll(".char.cursor").forEach(el => el.classList.remove("cursor"));
  const target = document.querySelector(`.char[data-index="${index}"]`);
  if (target) target.classList.add("cursor");
}

// ── Timer ─────────────────────────────────────────────────────

/** Begin the countdown timer. */
function startTimer() {
  if (timerInterval) return; // already running
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    // Live WPM update every second
    updateLiveStats();

    // Urgent styling in last 10 seconds
    if (timeLeft <= 10) {
      timerBox.classList.add("urgent");
    }

    if (timeLeft <= 0) {
      endTest();
    }
  }, 1000);
}

/** Stop the countdown timer. */
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// ── Core Typing Logic ─────────────────────────────────────────

/**
 * Called on every keystroke in the textarea.
 * Compares each typed character to the sample text and applies
 * "correct" / "incorrect" CSS classes to the matching <span>.
 */
function handleInput() {
  const typed = inputArea.value;

  // Start timer on the very first character
  if (!started && typed.length > 0) {
    started = true;
    startTimer();
  }

  // Iterate over every character span and classify it
  const chars = document.querySelectorAll(".char");
  chars.forEach((span, i) => {
    if (i < typed.length) {
      // Character has been typed – check if correct
      if (typed[i] === SAMPLE_TEXT[i]) {
        span.classList.add("correct");
        span.classList.remove("incorrect");
      } else {
        span.classList.add("incorrect");
        span.classList.remove("correct");
      }
    } else {
      // Not yet typed – reset to pending state
      span.classList.remove("correct", "incorrect");
    }
  });

  // Move cursor to the next untyped position
  updateCursor(typed.length);

  // Update live stats in the stats bar
  updateLiveStats();
}

// ── Stat Calculations ─────────────────────────────────────────

/**
 * Count how many of the typed characters match the sample text.
 * @param {string} typed - the current textarea value
 * @returns {{ correct: number, total: number }}
 */
function countCharacters(typed) {
  let correct = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === SAMPLE_TEXT[i]) correct++;
  }
  return { correct, total: typed.length };
}

/**
 * Calculate WPM.
 * Formula: (total characters typed / 5) / (elapsed seconds / 60)
 * Words = chars / 5  (standard industry definition of one "word")
 */
function calcWPM(totalCharsTyped, elapsedSeconds) {
  if (elapsedSeconds === 0 || totalCharsTyped === 0) return 0;
  const words = totalCharsTyped / 5;
  return Math.round((words / elapsedSeconds) * 60);
}

/**
 * Calculate accuracy as a percentage.
 * Accuracy = (correct characters / total typed) * 100
 */
function calcAccuracy(correct, total) {
  if (total === 0) return 100; // nothing typed yet – show 100 to avoid NaN
  return Math.round((correct / total) * 100);
}

/** Refresh the live WPM and Accuracy displays in the stats bar. */
function updateLiveStats() {
  const typed = inputArea.value;
  const elapsed = TOTAL_TIME - timeLeft;

  const { correct, total } = countCharacters(typed);
  const wpm      = calcWPM(total, elapsed);
  const accuracy = calcAccuracy(correct, total);

  wpmEl.textContent      = started ? wpm      : "—";
  accuracyEl.textContent = started ? accuracy + "%" : "—";
}

// ── End of Test ───────────────────────────────────────────────

/** Called when the timer hits 0. Disables input and shows results. */
function endTest() {
  stopTimer();
  inputArea.disabled = true; // prevent further typing

  const typed = inputArea.value;
  const { correct, total } = countCharacters(typed);
  const wpm      = calcWPM(total, TOTAL_TIME); // full 60s elapsed
  const accuracy = calcAccuracy(correct, total);

  // Populate the results section
  resultWpm.textContent     = wpm;
  resultAcc.textContent     = accuracy + "%";
  resultChars.textContent   = total;
  resultCorrect.textContent = correct;

  // Show results with animation
  resultsEl.classList.add("visible");

  // Scroll to results smoothly
  resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Reset ─────────────────────────────────────────────────────

/** Reset everything to the initial state. */
function resetTest() {
  // Stop any running timer
  stopTimer();

  // Reset state
  timeLeft = TOTAL_TIME;
  started  = false;

  // Reset UI
  timerEl.textContent    = TOTAL_TIME;
  wpmEl.textContent      = "—";
  accuracyEl.textContent = "—";
  timerBox.classList.remove("urgent");

  // Clear and re-enable input
  inputArea.value    = "";
  inputArea.disabled = false;

  // Hide results section
  resultsEl.classList.remove("visible");

  // Re-render sample text spans
  renderText();

  // Focus input so the user can start immediately
  inputArea.focus();
}

// ── Event Listeners ───────────────────────────────────────────

// Compare input to sample text on every keystroke
inputArea.addEventListener("input", handleInput);

// Restart button
restartBtn.addEventListener("click", resetTest);

// ── Bootstrap ─────────────────────────────────────────────────

// Build the initial character display on page load
renderText();
