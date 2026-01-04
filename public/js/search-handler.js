document.addEventListener('DOMContentLoaded', () => {
    const searchInputs = document.querySelectorAll('.search-bar input');

    searchInputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = input.value.trim();
                if (query) {
                    handleSearch(query);
                }
            }
        });

        // Real-time filtering (Debounced)
        let timeout;
        input.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const query = e.target.value.trim();
                // Only filter if we are on the Browse page
                if (window.location.pathname.includes('/browse')) {
                    const event = new CustomEvent('searchRequest', { detail: { query } });
                    window.dispatchEvent(event);
                }
            }, 300);
        });
    });

    // Check URL params for query if on browse page
    if (window.location.pathname.includes('/browse')) {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q');
        if (q) {
            // Wait for browse.js to be ready (or dispatch event)
            // Dispatching event is safer
            setTimeout(() => {
                const event = new CustomEvent('searchRequest', { detail: { query: q } });
                window.dispatchEvent(event);
            }, 100);

            // Also fill input
            searchInputs.forEach(input => input.value = q);
        }
    }

    // Genre Filter Logic
    const genreFilter = document.getElementById('genre-filter');
    if (genreFilter) {
        genreFilter.addEventListener('change', (e) => {
            const genre = e.target.value;
            // Dispatch search request with genre as query for now
            if (window.location.pathname.includes('/browse')) {
                const event = new CustomEvent('searchRequest', { detail: { query: genre } });
                window.dispatchEvent(event);
            } else if (genre) {
                window.location.href = `/browse?q=${encodeURIComponent(genre)}`;
            }
        });
    }
});

function handleSearch(query) {
    if (window.location.pathname.includes('/browse')) {
        // Just update params and dispatch
        const newUrl = `${window.location.pathname}?q=${encodeURIComponent(query)}`;
        window.history.pushState({ path: newUrl }, '', newUrl);

        const event = new CustomEvent('searchRequest', { detail: { query } });
        window.dispatchEvent(event);
    } else {
        // Redirect
        window.location.href = `/browse?q=${encodeURIComponent(query)}`;
    }
}
