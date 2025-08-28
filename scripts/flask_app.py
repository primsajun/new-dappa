import os
import random
from flask import Flask, render_template, request, redirect, url_for, session

def create_app():
    app = Flask(__name__)
    # Use env var in production; fallback for local dev
    app.secret_key = os.getenv("SECRET_KEY", "dev-secret-change-me")

    def new_game():
        session["target"] = random.randint(1, 100)
        session["attempts"] = 0
        session["max_attempts"] = 10
        session["history"] = []  # list of {"guess": int, "result": "low|high|correct"}
        session["status"] = "playing"  # "playing" | "won" | "lost"
        session["message"] = "I am thinking of a number between 1 and 100."

    @app.route("/", methods=["GET", "POST"])
    def index():
        if "target" not in session:
            new_game()

        message = session.get("message", "I am thinking of a number between 1 and 100.")
        status = session.get("status", "playing")
        error = None

        if request.method == "POST" and status == "playing":
            guess_raw = request.form.get("guess", "").strip()
            # Input validation
            if not guess_raw.isdigit():
                error = "Please enter a valid whole number between 1 and 100."
            else:
                guess = int(guess_raw)
                if not (1 <= guess <= 100):
                    error = "Your guess must be between 1 and 100."
                else:
                    session["attempts"] += 1
                    target = session["target"]
                    result = "correct" if guess == target else ("low" if guess < target else "high")
                    session["history"].append({"guess": guess, "result": result})

                    if result == "correct":
                        message = f"Correct! {guess} is the number."
                        status = "won"
                    else:
                        remaining = session["max_attempts"] - session["attempts"]
                        if remaining <= 0:
                            message = f"No more attempts. The number was {target}."
                            status = "lost"
                        else:
                            message = "Too low." if result == "low" else "Too high."
                    session["message"] = message
                    session["status"] = status

        context = {
            "message": session.get("message"),
            "status": session.get("status"),
            "attempts": session.get("attempts"),
            "max_attempts": session.get("max_attempts"),
            "remaining": session.get("max_attempts") - session.get("attempts"),
            "history": session.get("history"),
            "error": error,
        }
        return render_template("index.html", **context)

    @app.route("/reset", methods=["POST"])
    def reset():
        # Clear only game-related keys
        for k in ["target", "attempts", "max_attempts", "history", "status", "message"]:
            session.pop(k, None)
        new_game()
        return redirect(url_for("index"))

    return app

if __name__ == "__main__":
    # Local run: python scripts/flask_app.py
    app = create_app()
    app.run(host="127.0.0.1", port=5000, debug=True)
