from flask import Flask, jsonify, request, send_from_directory
from datetime import datetime, timedelta
import os
import json

app = Flask(__name__, static_folder="../frontend/dist")

GEOJSON_DIR = "data/processed_geojson"

@app.route("/api/vessels", methods=["GET"])
def get_vessels():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    if not start_date or not end_date:
        return jsonify({"error": "Missing start_date or end_date"}), 400

    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    all_features = []
    current = start
    while current <= end:
        filename = f"{current.strftime('%Y-%m-%d')}.geojson"
        filepath = os.path.join(GEOJSON_DIR, filename)
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                if data.get("features"):
                    all_features.extend(data["features"])
        current += timedelta(days=1)

    return jsonify({
        "type": "FeatureCollection",
        "features": all_features
    })


@app.route("/api/health")
def health_check():
    return jsonify({"status": "ok"})

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(debug=True)
