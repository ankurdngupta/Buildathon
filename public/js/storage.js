class WatchlistService {
    static STORAGE_KEY = 'moodflicks_watchlist';

    /**
     * Get all movies in the watchlist
     * @returns {Array} List of movie objects
     */
    static getWatchlist() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        try {
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error parsing watchlist data:', e);
            return [];
        }
    }

    /**
     * Add a movie to the watchlist
     * @param {Object} movie - Movie object to add
     * @returns {boolean} True if added, false if already exists
     */
    static addToWatchlist(movie) {
        const watchlist = this.getWatchlist();
        console.log('Current Watchlist before add:', watchlist);

        // Robust ID check: compare string IDs to be safe
        const exists = watchlist.some(item => String(item.id) === String(movie.id) || (item.title === movie.title && item.year === movie.year));

        if (!exists) {
            const newWatchlist = [...watchlist, movie]; // Explicitly create new array
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newWatchlist));
            console.log('New Watchlist saved:', newWatchlist);
            this.dispatchUpdateEvent();
            return true;
        }
        console.warn('Movie already in watchlist:', movie.title);
        return false;
    }

    /**
     * Remove a movie from the watchlist
     * @param {string|number} movieId - ID of the movie to remove
     */
    static removeFromWatchlist(movieId) {
        let watchlist = this.getWatchlist();
        // Filter out if ID matches OR if we only have title/year (fallback)
        // Ideally we should adhere to ID, but let's be robust
        watchlist = watchlist.filter(item => item.id !== movieId);

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(watchlist));
        this.dispatchUpdateEvent();
    }

    /**
     * Check if a movie is in the watchlist
     * @param {string|number} movieId 
     * @returns {boolean}
     */
    static isInWatchlist(movieId) {
        const watchlist = this.getWatchlist();
        return watchlist.some(item => item.id === movieId);
    }

    /**
     * Dispatch a custom event so UI can react globally
     */
    static dispatchUpdateEvent() {
        const event = new CustomEvent('watchlistUpdated', {
            detail: { count: this.getWatchlist().length }
        });
        window.dispatchEvent(event);
    }
}

// Global export for vanilla JS environment
window.WatchlistService = WatchlistService;
