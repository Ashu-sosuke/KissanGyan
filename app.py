from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load CSV dataset
df = pd.read_csv("farming_data.csv")

# Extract unique values for validation
soil_types = df["soil_type"].unique().tolist()
climate_conditions = df["climate"].unique().tolist()
seasons = df["season"].dropna().unique().tolist()

# API Endpoints
@app.route("/api/advice", methods=["POST"])
def get_advice():
    try:
        data = request.json or {}
    except:
        return jsonify({"response": "Invalid input. Please send valid JSON data."}), 400
    
    soil = data.get("soil", "").lower()
    climate = data.get("climate", "").lower()
    season = data.get("season", "").lower() or None

    if soil not in soil_types:
        return jsonify({"response": f"Sorry, I don’t recognize that soil type. Try {', '.join(soil_types)}."})
    if climate not in climate_conditions:
        return jsonify({"response": f"I don’t know that climate. Try {', '.join(climate_conditions)}."})

    # Query the dataset
    result = df[(df["soil_type"] == soil) & (df["climate"] == climate)]
    if result.empty:
        return jsonify({"response": "No specific advice for this soil and climate combination yet."})
    
    # Get the first matching row (assuming one match per combo)
    row = result.iloc[0]
    method = row["method"]
    crop = row["crop"]
    growth_days = row["growth_days"]
    water_needs = row["water_needs"]
    ph_range = row["ph_range"]
    temp = row["temp"]
    rainfall = row["rainfall"]
    
    # Build detailed response
    response = f"For {soil} soil and {climate} climate:\nMethod: {method}, plant {crop}\nCrop Details: {crop} grows in {growth_days} days, needs {water_needs} water, prefers pH {ph_range}\nClimate Info: Temp {temp}, Rainfall {rainfall}"
    
    # Add seasonal tip if provided and matches
    if season and season in seasons:
        seasonal_row = df[(df["soil_type"] == soil) & (df["climate"] == climate) & (df["season"] == season)]
        if not seasonal_row.empty:
            response += f"\nSeasonal Tip ({season}): {seasonal_row.iloc[0]['tip']}"
        else:
            response += f"\nSeasonal Tip ({season}): No specific tip available for this season."
    
    return jsonify({"response": response})

@app.route("/api/community", methods=["GET"])
def community_response():
    comments = [
        "Drip irrigation worked great for my sandy soil last summer!",
        "Mulching saved my clay soil crops during the rains!",
        "Anyone tried sprinklers on loam? Worked for me!"
    ]
    return jsonify({"response": f"Here’s what the community says: {random.choice(comments)}"})

@app.route("/api/seasonal", methods=["POST"])
def seasonal_tip():
    try:
        data = request.json or {}
    except:
        return jsonify({"response": "Invalid input. Please send valid JSON data."}), 400
    
    season = data.get("season", "").lower()
    if season in seasons:
        # Get a random tip for the season
        seasonal_data = df[df["season"] == season].iloc[0]
        return jsonify({"response": f"Seasonal tip for {season}: {seasonal_data['tip']}"})
    return jsonify({"response": f"Which season? Say {', '.join(seasons)}."})

@app.route("/api/greet", methods=["GET"])
def greet():
    greetings = [
        "Hi! I’m Rammu, here to help with your farming. What’s on your mind?",
        "Hello! Ready to grow some crops? Ask me anything!"
    ]
    return jsonify({"response": random.choice(greetings)})

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)  # HTTP