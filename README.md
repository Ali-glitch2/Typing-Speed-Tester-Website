# Typing-Speed-Tester-Website
A clean, minimal typing speed tester built with vanilla HTML, CSS, and JavaScript
<img width="2555" height="1306" alt="image" src="https://github.com/user-attachments/assets/70dbde40-7bce-493d-bbc5-f7cafdb2c80d" />

## ✨ Features

- ⏱ **60-second countdown** that starts automatically on first keystroke
- 🟢 **Live character highlighting** — green for correct, red for incorrect
- 📊 **Real-time WPM & Accuracy** updates every second
- 🔴 **Urgent mode** — timer pulses red in the last 10 seconds
- 📋 **Results screen** with WPM, accuracy, total chars, and correct chars
- 🔄 **Restart** resets everything instantly
- 📱 **Fully responsive** — works on mobile

## 🧮 How it Calculates

| Metric | Formula |
|---|---|
| Words | total characters typed ÷ 5 |
| WPM | (words ÷ elapsed seconds) × 60 |
| Accuracy | (correct chars ÷ total typed) × 100% |

## 🛠 Run Locally

Just open `index.html` in your browser — no build step needed.

Or serve it with Python:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000
