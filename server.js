require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const aiService = require('./services/aiService');
const mockData = require('./services/mockData');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/browse', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'browse.html'));
});

app.get('/watchlist', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'watchlist.html'));
});

app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'results.html'));
});

app.get('/details', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'details.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Trending Recommendations (Mock/Static for speed)
app.get('/api/trending', async (req, res) => {
    try {
        // Try AI first
        const aiResult = await aiService.getTrending();
        if (aiResult.success) {
            return res.json({ success: true, source: 'ai', data: aiResult.data });
        }

        // Fallback
        throw new Error('AI Trending Failed');
    } catch (error) {
        console.error('Trending API Error (Falling back to mock):', error);
        const trending = mockData.getTrending();
        res.json({ success: true, source: 'mock', data: trending });
    }
});

// Search Endpoint
app.get('/api/search', (req, res) => {
    const query = req.query.q || '';
    const results = mockData.search(query);
    res.json({ success: true, data: results });
});

// Main Recommendation Endpoint
app.post('/api/recommend', async (req, res) => {
    try {
        const { input, moodContext, userHistory, timeContext, userProfile } = req.body;

        console.log('Received request:', { input, moodContext, timeContext });

        // TIMEOUT LOGIC: If AI takes > 25 seconds, return fallback
        const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => {
                resolve({ timeout: true });
            }, 25000); // 25 second hard timeout
        });

        const aiPromise = aiService.getRecommendations({
            input,
            moodContext,
            userHistory,
            timeContext,
            userProfile
        });

        const result = await Promise.race([aiPromise, timeoutPromise]);

        if (result.timeout) {
            console.warn('AI Request timed out (25000ms limit exceeded), returning fallback.');
            const fallback = mockData.getFallback(moodContext);
            return res.json({
                success: true,
                source: 'fallback_timeout',
                data: fallback,
                message: "AI is taking a bit longer than usual, so here are some quick safe picks!"
            });
        }

        if (!result.success) {
            console.warn('AI Service failed:', result.error);
            const fallback = mockData.getFallback(moodContext);
            return res.json({
                success: true,
                source: 'fallback_error',
                data: fallback,
                message: "AI encountered a hiccup, but here are some safe bets."
            });
        }

        // Check for INVALID_INPUT
        if (result.data?.safety_decision === 'invalid_input' || result.data?.detected_emotional_state === 'INVALID_INPUT') {
            return res.json({
                success: false, // Treat as client error handling
                source: 'ai_validation',
                message: "I didn't catch that emotion. Could you try describing how you feel in a full sentence?"
            });
        }

        // Success - result.data contains the { detected_emotional_state, safety_decision, recommendations... }
        res.json({ success: true, source: 'ai', data: result.data });

    } catch (error) {
        console.error('Recommendation API Critical Error:', error);
        const fallback = mockData.getFallback(req.body.moodContext);
        res.status(200).json({
            success: true,
            source: 'critical_fallback',
            data: fallback,
            message: "Something went wrong, but the show must go on."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
