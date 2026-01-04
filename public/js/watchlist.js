document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('watchlist-container');
    const emptyState = document.getElementById('empty-state');

    function renderWatchlist() {
        const movies = WatchlistService.getWatchlist();

        if (movies.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            if (container) container.style.display = 'none';
            return;
        }

        if (container) {
            container.innerHTML = '';
            container.style.display = 'grid'; // Restore grid
            if (emptyState) emptyState.style.display = 'none';

            movies.forEach(movie => {
                const card = createMovieCard(movie);
                container.appendChild(card);
            });
        }
    }

    function createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'insight-card';

        // Handle images
        const imageUrl = movie.image || movie.poster || 'assets/placeholder-movie.jpg';

        card.innerHTML = `
            <div style="position: relative; aspect-ratio: 2/3; overflow: hidden; background: #eee;">
                <img src="${imageUrl}" alt="${movie.title}" 
                     style="width: 100%; height: 100%; object-fit: cover;"
                     onerror="this.classList.add('broken-image'); this.style.display='none'; this.parentElement.classList.add('broken-image')">
                <button class="remove-btn" data-id="${movie.id}" 
                        style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            <div class="card-body" style="padding: 16px;">
                <h3 style="font-size: 1.1rem; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${movie.title}</h3>
                <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 8px;">
                    ${movie.year || 'N/A'} • ${movie.rating || 'NR'}
                </div>
                <div style="font-size: 0.85rem; color: var(--text-color); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                    ${movie.explanation || movie.description || 'No description available.'}
                </div>
            </div>
        `;

        // Attach event listener immediately to avoid delegation complexity
        const removeBtn = card.querySelector('.remove-btn');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (confirm(`Remove "${movie.title}" from watchlist?`)) {
                WatchlistService.removeFromWatchlist(movie.id);
                renderWatchlist(); // Re-render
            }
        });

        return card;
    }

    renderWatchlist();
});
