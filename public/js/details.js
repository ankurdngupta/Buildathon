
const detailsContainer = document.getElementById('details-container');

document.addEventListener('DOMContentLoaded', () => {
    const movieStr = localStorage.getItem('currentMovie');
    if (!movieStr) {
        window.location.href = '/browse';
        return;
    }

    try {
        const movie = JSON.parse(decodeURIComponent(movieStr));
        renderDetails(movie);
    } catch (e) {
        console.error("Error parsing movie details", e);
        detailsContainer.innerHTML = "<p>Invalid movie data.</p>";
    }
});

function renderDetails(movie) {
    detailsContainer.innerHTML = `
        <div class="glass-panel" style="max-width: 800px; margin: 0 auto;">
            <h1>${movie.title}</h1>
            <div class="movie-meta" style="font-size: 1.2rem; margin: 20px 0;">
                <span style="color: var(--accent-color)">${movie.match_score ? movie.match_score + '% Match' : 'Trending'}</span>
                • ${movie.year} 
                • ${movie.genre}
                • ${movie.language || 'International'}
            </div>
            
            <h3 class="section-title">Why you'll love it</h3>
            <p style="font-size: 1.1rem; line-height: 1.8; color: #ddd;">
                ${movie.reason_for_recommendation || movie.trending_reason}
            </p>

            <div style="margin-top: 40px; display: flex; gap: 20px;">
                <button class="cta-btn" onclick="alert('Playing feature coming soon!')">
                    <i class="fa-solid fa-play"></i> Watch Trailer
                </button>
                <button class="icon-btn" style="border-radius: 6px; padding: 10px 20px; background: rgba(255,255,255,0.1);" onclick="history.back()">
                    Go Back
                </button>
            </div>
        </div>
    `;
}
