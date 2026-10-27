from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

JUDGE0_URL = os.getenv(
    "JUDGE0_URL",
    "https://ce.judge0.com"
)

@app.route("/")
def home():
    return jsonify({
        "message": "DeployForge Compiler API is running"
    })

@app.route("/languages")
def languages():
    try:
        response = requests.get(
            f"{JUDGE0_URL}/languages/",
            timeout=15
        )
        response.raise_for_status()
        data = response.json()

        allowed = {"Python", "C", "C++"}
        result = [
            {"id": item["id"], "name": item["name"]}
            for item in data
            if any(
                name in item["name"]
                for name in allowed
            )
        ]

        return jsonify(result)
    except requests.RequestException as error:
        return jsonify({"error": str(error)}), 502

@app.route("/run", methods=["POST"])
def run_code():
    body = request.get_json(silent=True) or {}
    source_code = body.get("code", "")
    language_id = body.get("language_id")

    if not isinstance(source_code, str) or not source_code.strip():
        return jsonify({"error": "Code is required"}), 400

    try:
        language_id = int(language_id)
    except (TypeError, ValueError):
        return jsonify({"error": "Valid language_id is required"}), 400

    try:
        response = requests.post(
            f"{JUDGE0_URL}/submissions?base64_encoded=false&wait=true",
            json={
                "source_code": source_code,
                "language_id": language_id
            },
            timeout=30
        )
        return jsonify(response.json()), response.status_code
    except requests.RequestException as error:
        return jsonify({"error": str(error)}), 502

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)