
const API_URL = '/api';
const trendingContainer = document.getElementById('trending-container');

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');

    if (q) {
        performSearch(q);
    } else {
        loadTrending();
    }

    // Listen for instant search
    window.addEventListener('searchRequest', (e) => {
        const query = e.detail.query;
        if (query) {
            performSearch(query);
        } else {
            loadTrending();
        }
    });
});

async function performSearch(query) {
    trendingContainer.innerHTML = '<div class="loader"></div>';
    // Update header to show we are searching
    const header = document.querySelector('h2');
    if (header) header.textContent = `🔍 Results for "${query}"`;

    try {
        const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (data.success) {
            if (data.data.length > 0) {
                renderCards(data.data, trendingContainer);
            } else {
                trendingContainer.innerHTML = '<p>No results found. Try a different term.</p>';
            }
        } else {
            trendingContainer.innerHTML = '<p>Search failed.</p>';
        }
    } catch (err) {
        console.error(err);
        trendingContainer.innerHTML = '<p>Network error.</p>';
    }
}

async function loadTrending() {
    // Reset Header
    const header = document.querySelector('h2');
    if (header) header.textContent = '🔥 Global Trending';

    trendingContainer.innerHTML = '<div class="loader"></div>';

    try {
        const res = await fetch(`${API_URL}/trending`);
        const data = await res.json();

        if (data.success) {
            renderCards(data.data, trendingContainer);
        } else {
            trendingContainer.innerHTML = '<p>Could not load trending content.</p>';
        }
    } catch (err) {
        console.error(err);
        trendingContainer.innerHTML = '<p>Network error.</p>';
    }
}

function renderCards(items, container) {
    container.innerHTML = items.map((item, index) => `
        <div class="movie-card" data-index="${index}">
            <button class="add-watchlist-btn" data-index="${index}" 
                    style="position: absolute; top: 10px; right: 10px; z-index: 10; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <i class="${WatchlistService.isInWatchlist(item.id) ? 'fa-solid' : 'fa-regular'} fa-bookmark" style="color: var(--accent-color);"></i>
            </button>
            <div class="card-content">
               <div class="movie-title">${item.title}</div>
               <div class="movie-meta">
                    ${item.year} • ${item.genre}
               </div>
               <div class="reason">
                    ${item.trending_reason || item.reason_for_recommendation}
               </div>
            </div>
        </div>
    `).join('');

    // Attach listeners
    container.querySelectorAll('.add-watchlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
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

    container.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // If we clicked the button, do nothing (handled above with stopPropagation, but good to be safe)
            if (e.target.closest('.add-watchlist-btn')) return;

            const index = card.dataset.index;
            const item = items[index];
            goToDetails(item);
        });
    });
}

function goToDetails(item) {
    localStorage.setItem('currentMovie', JSON.stringify(item));
    window.location.href = '/details';
};
