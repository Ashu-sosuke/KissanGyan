import random

soil_types = ["sandy", "clay", "loam"]
climate_conditions = {
    "hot_dry": {"temp": "30-40°C", "rain": "low"},
    "warm_rainy": {"temp": "20-30°C", "rain": "high"},
    "cool_dry": {"temp": "10-20°C", "rain": "low"}
}
methods = {
    "sandy": {"hot_dry": "Drip irrigation, plant millet", "warm_rainy": "Mulching, plant sorghum", "cool_dry": "Sprinkler, plant barley"},
    "clay": {"hot_dry": "Furrow irrigation, plant cotton", "warm_rainy": "Raised beds, plant rice", "cool_dry": "Mulching, plant wheat"},
    "loam": {"hot_dry": "Drip irrigation, plant maize", "warm_rainy": "Sprinkler, plant beans", "cool_dry": "Mulching, plant oats"}
}
seasonal_tips = {
    "spring": "Plant early crops like peas or beans. Check soil moisture regularly.",
    "summer": "Use irrigation wisely. Opt for heat-tolerant crops like millet or maize.",
    "monsoon": "Focus on water management. Rice or sorghum work well.",
    "winter": "Plant wheat or barley. Protect against frost."
}

# Chatbot class
class CropBot:
    def __init__(self):
        self.name = "CropBot"
        self.greetings = ["Hi! I’m CropBot, here to help with your farming. What’s on your mind?",
                          "Hello! Ready to grow some crops? Ask me anything!"]

    def greet(self):
        return random.choice(self.greetings)

    def get_advice(self, soil, climate, season=None):
        soil = soil.lower()
        climate = climate.lower()

        # Check if inputs are valid
        if soil not in soil_types:
            return "Sorry, I don’t recognize that soil type. Try 'sandy', 'clay', or 'loam'."
        if climate not in climate_conditions:
            return "I don’t know that climate. Try 'hot_dry', 'warm_rainy', or 'cool_dry'."

        # Get method recommendation
        method = methods.get(soil, {}).get(climate, "No specific advice for this combo yet.")
        
        # Add seasonal tip if provided
        seasonal_tip = seasonal_tips.get(season.lower(), "No seasonal tip available.") if season else ""
        
        response = f"For {soil} soil and {climate} climate: {method}."
        if seasonal_tip:
            response += f" Seasonal tip ({season}): {seasonal_tip}"
        return response

    def community_response(self):
        # Simulate community feedback
        comments = [
            "Drip irrigation worked great for my sandy soil last summer!",
            "Mulching saved my clay soil crops during the rains.",
            "Anyone tried sprinklers on loam? Worked for me!"
        ]
        return "Here’s what the community says: " + random.choice(comments)

    def chat(self):
        print(self.greet())
        while True:
            user_input = input("You: ").lower().strip()
            
            # Exit condition
            if user_input in ["bye", "exit", "quit"]:
                print("CropBot: Happy farming! See you later!")
                break
            
            # Seasonal tips
            elif "season" in user_input or "time" in user_input:
                for season in seasonal_tips:
                    if season in user_input:
                        print(f"CropBot: {seasonal_tips[season]}")
                        break
                else:
                    print("CropBot: Which season? Say 'spring', 'summer', 'monsoon', or 'winter'.")
            
            # Community page
            elif "community" in user_input or "review" in user_input:
                print(f"CropBot: {self.community_response()}")

            # Advice based on soil and climate
            else:
                try:
                    # Simple parsing (expects "soil <type> climate <type> [season]")
                    words = user_input.split()
                    soil_idx = words.index("soil") + 1 if "soil" in words else -1
                    climate_idx = words.index("climate") + 1 if "climate" in words else -1
                    season = None
                    for s in seasonal_tips:
                        if s in user_input:
                            season = s
                            break
                    
                    if soil_idx == -1 or climate_idx == -1:
                        print("CropBot: Tell me the soil type and climate, e.g., 'soil sandy climate hot_dry'.")
                    else:
                        soil = words[soil_idx]
                        climate = words[climate_idx]
                        advice = self.get_advice(soil, climate, season)
                        print(f"CropBot: {advice}")
                except:
                    print("CropBot: Hmm, try saying something like 'soil sandy climate hot_dry'.")

# Run the chatbot
if __name__ == "__main__":
    bot = CropBot()
    bot.chat()