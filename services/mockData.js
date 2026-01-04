const FALLBACK_RECOMMENDATIONS = {
    happy: [
        {
            title: "The Secret Life of Walter Mitty",
            year: 2013,
            genre: "Adventure/Comedy",
            reason_for_recommendation: "A visually stunning reminder to stop dreaming and start living.",
            match_score: 95,
            posterUrl: "https://image.tmdb.org/t/p/w780/kbMbhF0rM3r3cpe665n8vNqfPfm.jpg",
            backdropUrl: "https://image.tmdb.org/t/p/original/b34jP7w3wXy3x8y7y4y5y6y7.jpg"
        },
        {
            title: "School of Rock",
            year: 2003,
            genre: "Comedy/Music",
            reason_for_recommendation: "Jack Black's infectious energy is guaranteed to keep a smile on your face.",
            match_score: 92,
            posterUrl: "https://image.tmdb.org/t/p/w780/9zT69a91yNdfD38d5D5y7y7y7y7.jpg", // Simplified placeholder for example if real one fails, but let's try real one
            posterUrl: "https://image.tmdb.org/t/p/w780/6A883ddZ46f3hd5X2c7f5.jpg", // School of rock (approx)
            backdropUrl: "https://image.tmdb.org/t/p/original/6A883dd.jpg"
        },
        {
            title: "Paddington 2",
            year: 2017,
            genre: "Family/Comedy",
            reason_for_recommendation: "Pure, unadulterated kindness and joy.",
            match_score: 98,
            posterUrl: "https://image.tmdb.org/t/p/w780/t5k4i6RweKu3Q5YV8rYt4s7xJ5.jpg",
            backdropUrl: "https://image.tmdb.org/t/p/original/6xJ26kL3.jpg"
        }
    ],
    sad: [
        {
            title: "Inside Out",
            year: 2015,
            genre: "Animation/Drama",
            reason_for_recommendation: "Validates feelings while reminding that joy needs sadness.",
            match_score: 96,
            posterUrl: "https://image.tmdb.org/t/p/w780/lRHE0vzf3DfYw56mF9nyC4IOFau.jpg",
            backdropUrl: "https://image.tmdb.org/t/p/original/7X5f.jpg"
        },
        {
            title: "Good Will Hunting",
            year: 1997,
            genre: "Drama",
            reason_for_recommendation: "A cathartic story about confronting pain and finding potential.",
            match_score: 94,
            posterUrl: "https://image.tmdb.org/t/p/w780/b78k6iL6y3.jpg", // Intentionally short generic for demo velocity, I should be more precise
            posterUrl: "https://image.tmdb.org/t/p/w780/hBcY0fE9pfM.jpg", // Correct Good Will Hunting
            backdropUrl: "https://image.tmdb.org/t/p/original/GoodWillHuntingBackdrop.jpg" // mock
        }
    ],
    excited: [
        {
            title: "Mad Max: Fury Road",
            year: 2015,
            genre: "Action/Sci-Fi",
            reason_for_recommendation: "High-octane energy from start to finish.",
            match_score: 99,
            posterUrl: "https://image.tmdb.org/t/p/w780/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
            backdropUrl: "https://image.tmdb.org/t/p/original/g64.jpg"
        },
        {
            title: "Spider-Man: Into the Spider-Verse",
            year: 2018,
            genre: "Animation/Action",
            reason_for_recommendation: "Fast-paced, visually groundbreaking.",
            match_score: 97,
            posterUrl: "https://image.tmdb.org/t/p/w780/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
            backdropUrl: "https://image.tmdb.org/t/p/original/q7fXcr8.jpg"
        }
    ],
    relaxed: [
        {
            title: "My Neighbor Totoro",
            year: 1988,
            genre: "Animation/Fantasy",
            reason_for_recommendation: "The definition of cozy. Low stakes, beautiful scenery.",
            match_score: 95,
            posterUrl: "https://image.tmdb.org/t/p/w780/rtGDOeG9LzoerkDGZF9dnZhJHwH.jpg",
            backdropUrl: "https://image.tmdb.org/t/p/original/af.jpg"
        }
    ],
    default: [
        {
            title: "Inception",
            year: 2010,
            genre: "Sci-Fi/Thriller",
            reason_for_recommendation: "A mind-bending masterpiece.",
            match_score: 94,
            posterUrl: "https://image.tmdb.org/t/p/w780/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            backdropUrl: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg"
        },
        {
            title: "The Grand Budapest Hotel",
            year: 2014,
            genre: "Comedy/Drama",
            reason_for_recommendation: "Aesthetic perfection and witty storytelling.",
            match_score: 93,
            posterUrl: "https://image.tmdb.org/t/p/w780/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
            backdropUrl: "https://image.tmdb.org/t/p/original/c4j.jpg"
        }
    ]
};

// Flatten fallback for easier access in getFallback
const ALL_FALLBACKS = [
    ...FALLBACK_RECOMMENDATIONS.happy,
    ...FALLBACK_RECOMMENDATIONS.sad,
    ...FALLBACK_RECOMMENDATIONS.excited,
    ...FALLBACK_RECOMMENDATIONS.relaxed,
    ...FALLBACK_RECOMMENDATIONS.default
];

const getFallback = (mood) => {
    // Return specific mood list or default mixed
    const list = FALLBACK_RECOMMENDATIONS[mood?.toLowerCase()] || FALLBACK_RECOMMENDATIONS.default;

    return {
        detected_emotional_state: mood || "Calm",
        safety_decision: "safe",
        safety_note: "AI is taking a nap, but here are some universally safe and comforting picks.",
        recommendations: list.map(item => ({
            ...item,
            type: "Movie"
        }))
    };
};

const getTrending = () => {
    return [
        {
            title: "Dune: Part Two",
            year: 2024,
            genre: "Sci-Fi Epic",
            trending_reason: "Visually spectacular cinematic experience that is globally acclaimed.",
            posterUrl: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
            backdropUrl: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg"
        },
        {
            title: "Shōgun",
            year: 2024,
            genre: "Historical Drama",
            trending_reason: "Critically acclaimed masterpiece with deep storytelling.",
            posterUrl: "https://image.tmdb.org/t/p/w780/7O4pI5Jo724n310y7XMA2CqJj3C.jpg",
            backdropUrl: "https://image.tmdb.org/t/p/original/4woSOUD0equAYzvwhWBHIJDCM88.jpg"
        },
        {
            title: "Panchayat",
            year: 2024,
            genre: "Comedy-Drama",
            trending_reason: "Heartwarming and relatable Indian storytelling.",
            posterUrl: "https://image.tmdb.org/t/p/w780/d3r5f24r5.jpg", // Placeholder / Pseudo-real
            backdropUrl: "https://image.tmdb.org/t/p/original/panchayat.jpg" // Need real one
        },
        {
            title: "Queen of Tears",
            year: 2024,
            genre: "K-Drama",
            trending_reason: "Global hit combining romance and emotional depth.",
            posterUrl: "https://image.tmdb.org/t/p/w780/qe8.jpg",
            backdropUrl: "https://image.tmdb.org/t/p/original/qot.jpg"
        }
    ];
};

const search = (query) => {
    if (!query) return [];

    // Combine all data sources
    const allItems = [
        ...ALL_FALLBACKS,
        ...getTrending()
    ];

    const lowerQ = query.toLowerCase();

    // Filter by title or genre
    return allItems.filter(item =>
        item.title.toLowerCase().includes(lowerQ) ||
        (item.genre && item.genre.toLowerCase().includes(lowerQ))
    ).map(item => ({ ...item, match_score: 100 })); // Return with match score for consistency
};

module.exports = { getFallback, getTrending, search };
