# Number Guessing Game — Python + HTML + CSS

This is a minimal Flask implementation of the Number Guessing Game converted from a Next.js/React page. It uses server-side sessions to store the secret number, attempts, and guess history, and renders accessible HTML templates with a small, clean CSS design.

## Run locally

1. Create a virtualenv (optional) and install dependencies:
   - pip install -r requirements.txt
2. Start the app:
   - python scripts/flask_app.py
3. Visit http://127.0.0.1:5000 in your browser.

Tip: set SECRET_KEY in your environment for production usage.

## Project structure

- scripts/flask_app.py — Flask app with routes and game logic
- templates/ — HTML templates (base + index)
- static/styles.css — CSS styles (no external dependencies)

## Features

- 1–100 number guessing with server-side validation
- Attempts counter, guess history, feedback (low/high/correct)
- Reset/New game, accessible forms, aria-live updates
