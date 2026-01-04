
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testConnection() {
  try {
    console.log("Initializing Google AI...");
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

    console.log("Sending test prompt...");
    const result = await model.generateContent("Hello, are you there?");
    const response = await result.response;
    const text = response.text();
    console.log("Success! Response:", text);
  } catch (error) {
    console.error("Error connecting to Google AI:", error);
  }
}

testConnection();
