require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function main() {
    const apiKey = process.env.GOOGLE_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    // Note: The SDK doesn't have a direct 'listModels' helper on the client instance in some versions, 
    // but we can try to infer or just try the standard "gemini-2.0-flash-exp" or "gemini-1.5-pro" if Gemma isn't there.
    // However, let's try to verify if we can list models via REST or if I should just ask the user/try a standard one.
    // Actually, looking at docs, genAI.getGenerativeModel is for *instantiating*. 
    // To list, we might need to use the API directly or check common names.

    // Let's try to stick to "gemini-1.5-flash" as a fallback if I can't find Gemma, 
    // BUT the user specifically asked for Gemma. 

    // Let's try to query the models endpoint via fetch since the SDK might abstract it.

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Failed to list models:", error);
    }
}

main();
