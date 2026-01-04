const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const SYSTEM_PROMPT = `
You are an AI-powered, emotionally responsible content companion.
Your primary responsibility is:
- User emotional well-being
- Safe and meaningful content guidance
- Explainable and human-centric AI behavior

You must prioritize:
1. Emotional safety over engagement
2. Reliability over fancy UI
3. Clear reasoning over black-box AI

If there is a conflict between “popular” and “emotionally safe”, choose emotionally safe.

/// EMOTIONAL STATE DETECTION ///
Given the user input, classify the emotional state into ONE of the following:
- Burnout → tired, stressed, mentally exhausted
- Lonely → disconnected, isolated, missing people
- Overstimulated → anxious, overwhelmed, restless
- Calm → relaxed, neutral, peaceful
- Happy → energetic, positive
- Nostalgic → reflective, emotional, memory-driven

/// RESPONSIBLE AI DECISION LAYER ///
Before recommending content, evaluate if the request is emotionally SAFE for the detected state.
Safety Rules:
- Burnout + Horror/Dark/Heavy → NOT SAFE (Prefer: Feel-good, light drama, comfort)
- Lonely + Dark Isolation/Depressing → NOT SAFE (Prefer: Warm relationships, hope)
- Overstimulated + Fast-paced/Loud → NOT SAFE (Prefer: Slow-paced, calming)
- Calm → SAFE (Prefer: Reflective, meaningful)
- Happy → SAFE (Prefer: Energetic, adventurous)
- Nostalgic → SAFE (Prefer: Emotional, memory-based)

/// GIBBERISH / NONSENSE CHECK ///
If the user input is random letters (e.g., "asdfghj"), gibberish, or too short to convey meaning (less than 2 valid words), classify as "INVALID_INPUT".

/// RESPONSE FORMAT ///
You must strictly return a valid JSON object. No markdown.
Structure:
{
  "detected_emotional_state": "Burnout | Lonely | Overstimulated | Calm | Happy | Nostalgic | INVALID_INPUT",
  "safety_decision": "safe | unsafe | invalid_input",
  "safety_note": "Explanation of safety check or refusal reason.",
  "recommendations": [
    {
      "title": "Title",
      "year": 2024,
      "type": "Movie | Series",
      "reason": "Level 1: Why it was recommended (Mood match/History)",
      "emotional_effect": "Level 2: What the user is likely to feel AFTER watching (e.g., 'This may help you feel calmer')",
      "match_score": 95
    }
  ]
}

- If "safety_decision" is "invalid_input", return an empty recommendations array [].
- Always return at least 2 recommendations for valid inputs.
- Level 2 explanation must feel human, not technical.
`;

const getRecommendations = async ({ input, moodContext, userHistory, timeContext, userProfile }) => {
  try {
    const userPrompt = `
        User Input: "${input || 'No specific input'}"
        Explicit Mood Context: ${moodContext || 'Unknown'}
        Time/Context: ${timeContext || 'Unknown'}
        
        User Cold-Start Profile:
        - Favorite Genre: ${userProfile?.genre || 'Unknown'}
        - Language: ${userProfile?.language || 'English'}
        - Typical Mood: ${userProfile?.typicalMood || 'Neutral'}

        Provide tailored recommendations based on the emotional safety rules.
        `;

    const model = genAI.getGenerativeModel({
      model: "gemma-3-27b-it"
    });

    const combinedPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;

    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: combinedPrompt }] }
      ],
      generationConfig: {
        temperature: 0.6, // Slightly lower for more consistent rule following
      }
    });

    const response = result.response;
    const text = response.text();

    console.log("Raw AI Response:", text); // Debug log

    let jsonResult;
    try {
      // First try direct parse
      jsonResult = JSON.parse(text);
    } catch (e) {
      // Robust Cleanup: Find the first '{' and the last '}'
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON object found in response");
        }
      } catch (parseError) {
        console.error("JSON Parse Failed. Raw Text:", text);
        throw new Error("Invalid JSON format from AI");
      }
    }

    return { success: true, data: jsonResult };

  } catch (error) {
    console.error("Google AI Service Error:", error);
    return { success: false, error: error.message || error };
  }
};

const getTrending = async () => {
  // Trending should also be somewhat safe or at least diverse to not strictly show unsafe content
  // For now, we keep trending simple but structured
  try {
    const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });
    const prompt = `
        List 4 currently trending movies or web series globally.
        Prioritize diverse genres and generally universally appealing content.
        
        Strictly return raw JSON:
        [
            {
                "title": "Title",
                "year": 2024,
                "genre": "Genre",
                "trending_reason": "Why it's trending now"
            }
        ]
        `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let jsonResult;
    try {
      jsonResult = JSON.parse(text);
    } catch (e) {
      const jsonMatch = text.match(/\[[\s\S]*\]/); // Array match for trending
      if (jsonMatch) {
        jsonResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON array found in trending response");
      }
    }

    return { success: true, data: jsonResult };

  } catch (error) {
    console.error("AI Trending Error:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { getRecommendations, getTrending };
