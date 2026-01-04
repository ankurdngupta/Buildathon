const moodInput = document.getElementById('mood-input');
const submitBtn = document.getElementById('submit-btn');
const resultsSection = document.getElementById('results-section');
const resultsContainer = document.getElementById('recommendations-container');
const statusBadge = document.getElementById('status-badge');
const moodTags = document.querySelectorAll('.mood-tag');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // No onboarding modal for this clean tech demo
    setupEventListeners();
});

function setupEventListeners() {
    moodTags.forEach(btn => {
        btn.addEventListener('click', () => {
            const mood = btn.dataset.mood;
            moodInput.value = mood; // Simple set functionality
            moodTags.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    submitBtn.addEventListener('click', handleSearch);
}

function handleSearch() {
    const input = moodInput.value.trim();
    if (!input) {
        alert("Please describe your mental state first.");
        return;
    }

    // 1. Show Skeleton State immediately (Perception of speed)
    showSkeletonLoader();
    resultsSection.style.display = 'block';
    // Scroll smoothly to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    // 2. Mock Fetch (or real)
    fetchRecommendations(input);
}

function showSkeletonLoader() {
    statusBadge.textContent = "Analyzing patterns...";
    statusBadge.style.background = "#DBEAFE";
    statusBadge.style.color = "#1E40AF";

    // Create 3 skeleton cards
    const skeletons = Array(3).fill(0).map(() => `
        <div class="insight-card skeleton-card">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text" style="width: 80%"></div>
            
            <div class="skeleton skeleton-block"></div>
            <div class="skeleton skeleton-block"></div>
        </div>
    `).join('');

    resultsContainer.innerHTML = skeletons;
}

async function fetchRecommendations(input) {
    try {
        const response = await fetch('/api/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input,
                moodContext: input,
                userProfile: {}
            })
        });

        const data = await response.json();

        if (data.success && data.data) {
            renderInsightCards(data.data);
        } else {
            resultsContainer.innerHTML = `<p style="text-align:center;">Analysis failed. Please try again.</p>`;
        }

    } catch (error) {
        console.error("Error:", error);
        resultsContainer.innerHTML = `<p style="text-align:center;">Network Error.</p>`;
    }
}

function renderInsightCards(data) {
    // Update Badge
    statusBadge.textContent = `State: ${data.detected_emotional_state}`;
    statusBadge.style.background = "#DCFCE7";
    statusBadge.style.color = "#166534";

    const items = data.recommendations || [];

    resultsContainer.innerHTML = items.map((item, index) => `
        <div class="insight-card">
            <div class="card-header">
                <div class="card-title-group">
                    <h3>${item.title}</h3>
                    <div class="card-meta">${item.year} • ${item.type || 'Media'}</div>
                </div>
                <div style="display: flex; gap: 8px; align-items: flex-start;">
                    <button class="nav-icon-btn add-watchlist-btn" data-index="${index}" title="Add to Watchlist">
                        <i class="${WatchlistService.isInWatchlist(item.id) ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                    </button>
                    <div class="match-badge">${item.match_score || 95}%</div>
                </div>
            </div>
            
            <div class="card-body">
                <div class="insight-block">
                    <div class="insight-label">Why this?</div>
                    <p class="insight-text">${item.reason}</p>
                </div>

                <div class="insight-block">
                    <div class="insight-label" style="color: var(--accent-color);">
                        <i class="fa-solid fa-heart-pulse"></i> Emotional Effect
                    </div>
                    <p class="insight-text" style="font-style: italic; color: #475569;">
                        "${item.emotional_effect}"
                    </p>
                </div>
            </div>
        </div>
    `).join('');

    // Attach Listeners
    resultsContainer.querySelectorAll('.add-watchlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = btn.dataset.index;
            const item = items[index];
            const added = WatchlistService.addToWatchlist(item);

            const icon = btn.querySelector('i');
            if (added) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                // Optional: Toast notification could be added here
            } else {
                // If already existing, maybe remove? Or just show it's there.
                // Requirement said "Add to Watchlist", implementing toggle is better UX usually, 
                // but let's stick to "save" per instructions. If exists, maybe notify?
                // For now, let's just ensure visual state is correct.
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            }
        });
    });
}
