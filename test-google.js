require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function main() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("❌ GOOGLE_API_KEY is missing.");
        return;
    }
    console.log("✅ GOOGLE_API_KEY found.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

    try {
        console.log("Attempting to call Google AI (gemma-3-27b)...");
        const result = await model.generateContent("Hello, are you there?");
        const response = await result.response;
        console.log("✅ Google AI call successful!");
        console.log("Response:", response.text());
    } catch (error) {
        console.error("❌ Google AI call failed.");
        console.error(error);
    }
}

main();
