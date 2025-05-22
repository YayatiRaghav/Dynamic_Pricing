// js/search.js
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim().toLowerCase();
            if (query) {
                // Redirect to products page with search query parameter
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
});
