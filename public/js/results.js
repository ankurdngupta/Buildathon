
const API_URL = '/api';
const recommendationsContainer = document.getElementById('recommendations-container');
const contextSummary = document.getElementById('context-summary');
const resultsSection = document.getElementById('results-section');

document.addEventListener('DOMContentLoaded', () => {
    loadRecommendations();
});

async function loadRecommendations() {
    const storedContext = JSON.parse(localStorage.getItem('moodSearchContext'));
    if (!storedContext) {
        window.location.href = '/';
        return;
    }

    const { input, moodTags } = storedContext;
    if (contextSummary) {
        contextSummary.textContent = `Analyzing: "${input}"`;
    }

    // Show loading flow
    recommendationsContainer.innerHTML = '<div class="loader"></div><p style="text-align:center; color: var(--text-secondary); width: 100%;">Connecting to your emotional profile...</p>';

    try {
        const timeContext = new Date().toLocaleTimeString() + ", " + new Date().toLocaleDateString();
        const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};

        const res = await fetch(`${API_URL}/recommend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input,
                moodContext: moodTags ? moodTags.join(' ') : "",
                userProfile,
                timeContext
            })
        });

        const response = await res.json();

        if (response.success && response.data) {
            handleAIResponse(response.data);
        } else {
            recommendationsContainer.innerHTML = '<p>AI is taking a break. Please try again.</p>';
        }

    } catch (err) {
        console.error(err);
        recommendationsContainer.innerHTML = '<p>Network issue. Please check your connection.</p>';
    }
}

function handleAIResponse(data) {
    // 1. Show Detected Emotional State
    // Create or update status banner
    let statusBanner = document.getElementById('emotional-status');
    if (!statusBanner) {
        statusBanner = document.createElement('div');
        statusBanner.id = 'emotional-status';
        statusBanner.className = 'glass-panel';
        statusBanner.style.marginBottom = '20px';
        statusBanner.style.borderLeft = '4px solid var(--accent-color)';
        if (resultsSection) resultsSection.insertBefore(statusBanner, recommendationsContainer);
    }

    const safetyIcon = data.safety_decision === 'unsafe' ? '🛡️' : '✨';

    statusBanner.innerHTML = `
        <h3 style="margin:0; color: #fff; font-size: 1.2rem;">
            ${safetyIcon} Detected State: ${data.detected_emotional_state}
        </h3>
        <p style="margin: 5px 0 0; font-size: 0.95rem; color: var(--text-color); opacity: 0.8;">
            ${data.safety_note || "Curated for your current vibe."}
        </p>
    `;

    if (data.safety_decision === 'unsafe') {
        statusBanner.style.borderColor = 'var(--error-color)';
        statusBanner.style.background = 'rgba(176, 58, 46, 0.1)';
    }

    // 2. Render Cards
    const items = data.recommendations || [];
    renderCards(items);
}

function renderCards(items) {
    recommendationsContainer.innerHTML = items.map((item, index) => `
        <div class="movie-card" data-index="${index}" style="position: relative;">
            <button class="add-watchlist-btn" data-index="${index}" 
                    style="position: absolute; top: 10px; right: 10px; z-index: 10; background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                <i class="${WatchlistService.isInWatchlist(item.id) ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
            </button>
            <img src="${item.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}" alt="${item.title}" loading="lazy">
            <div class="card-content">
                <div class="match-score">${item.match_score || 90}% Match</div>
                <h3 class="movie-title">${item.title}</h3>
                <div class="movie-meta">
                    ${item.year} • ${item.type || 'Movie'}
                </div>
                <p style="font-size: 0.8rem; margin-top: 8px; color: #ddd; line-height: 1.3;">
                   ${item.emotional_effect || item.reason}
                </p>
            </div>
        </div>
    `).join('');

    // Attach listeners
    document.querySelectorAll('.add-watchlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = btn.dataset.index;
            const item = items[index];
            const added = WatchlistService.addToWatchlist(item);

            const icon = btn.querySelector('i');
            if (added) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            }
        });
    });

    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.add-watchlist-btn')) return;
            const index = card.dataset.index;
            const item = items[index];
            goToDetails(item);
        });
    });
}

function goToDetails(item) {
    localStorage.setItem('selectedMovie', JSON.stringify(item));
    window.location.href = '/details';
};
