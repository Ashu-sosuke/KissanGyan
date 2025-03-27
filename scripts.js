const GEMINI_API_KEY = "AIzaSyDapiaso62mm6mE5KQyweaRK1GTkf-qKOU"; // Replace with your actual key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const FLASK_API_URL = "http://127.0.0.1:5000/api"; // HTTP to match app.py

async function sendMessage() {
    const userInput = document.getElementById("userInput").value.trim();
    if (!userInput) return;

    const chatBox = document.getElementById("chatBox");

    // Display user message
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.textContent = userInput;
    chatBox.appendChild(userMessage);
    document.getElementById("userInput").value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        let botReply;

        // Check if input is farming-related
        const lowerInput = userInput.toLowerCase();
        if (lowerInput.includes("soil") || lowerInput.includes("climate")) {
            const words = lowerInput.split(" ");
            const soilIdx = words.indexOf("soil") + 1;
            const climateIdx = words.indexOf("climate") + 1;
            let season = ["spring", "summer", "monsoon", "winter"].find(s => lowerInput.includes(s));

            if (soilIdx > 0 && climateIdx > 0 && soilIdx < words.length && climateIdx < words.length) {
                const soil = words[soilIdx];
                const climate = words[climateIdx];
                const response = await fetch(`${FLASK_API_URL}/advice`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ soil, climate, season })
                });
                if (!response.ok) throw new Error(`Flask API error: ${response.status}`);
                botReply = (await response.json()).response;
            } else {
                botReply = "Please specify both soil and climate, e.g., 'soil sandy climate hot_dry'.";
            }
        } else if (lowerInput.includes("season") || lowerInput.includes("time")) {
            const season = ["spring", "summer", "monsoon", "winter"].find(s => lowerInput.includes(s));
            const response = await fetch(`${FLASK_API_URL}/seasonal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ season: season || "" })
            });
            if (!response.ok) throw new Error(`Flask API error: ${response.status}`);
            botReply = (await response.json()).response;
        } else if (lowerInput.includes("community") || lowerInput.includes("review")) {
            const response = await fetch(`${FLASK_API_URL}/community`);
            if (!response.ok) throw new Error(`Flask API error: ${response.status}`);
            botReply = (await response.json()).response;
        } else {
            // Use Gemini for general queries with no numbers
            const friendlyPrompt = `Respond in a friendly, helpful tone with a concise 3-4 line answer, without using numbered points: ${userInput}`;
            const response = await fetch(GEMINI_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: friendlyPrompt }] }]
                })
            });
            if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
            const data = await response.json();
            botReply = data.candidates[0].content.parts[0].text;
        }

        const botMessageContainer = document.createElement("div");
        botMessageContainer.classList.add("message", "bot-message");
        chatBox.appendChild(botMessageContainer);
        await typeMessage(botMessageContainer, botReply);
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Error:", error);
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("message", "bot-message");
        errorMessage.textContent = `Oops! Something went wrong: ${error.message}. Please try again!`;
        chatBox.appendChild(errorMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Typing effect for continuous structured response
async function typeMessage(element, text) {
    await typeLine(element, text);
}

function typeLine(element, text) {
    return new Promise((resolve) => {
        let index = 0;
        const speed = 20;
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

document.getElementById("userInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Initial greeting
window.onload = async () => {
    try {
        const response = await fetch(`${FLASK_API_URL}/greet`);
        if (!response.ok) throw new Error(`Flask API error: ${response.status}`);
        const data = await response.json();
        const chatBox = document.getElementById("chatBox");
        const greetingMessage = document.createElement("div");
        greetingMessage.classList.add("message", "bot-message");
        greetingMessage.textContent = data.response;
        chatBox.appendChild(greetingMessage);
    } catch (error) {
        console.error("Greeting error:", error);
    }
};