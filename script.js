document.addEventListener('DOMContentLoaded', () => {
    const recommendBtn = document.getElementById('recommend-btn');
    recommendBtn.addEventListener('click', getRecommendations);
});

async function getRecommendations() {
    const bookInput = document.getElementById('book-input').value.trim();
    const sortOption = document.getElementById('sort-options').value; // Get selected sorting method

    if (!bookInput) {
        alert('Please enter a book title.');
        return;
    }

    try {
        const response = await fetch('output.json');
        const books = await response.json();

        // Find the input book
        const inputBook = books.find(book => book.title.toLowerCase().includes(bookInput.toLowerCase()));

        if (!inputBook) {
            alert('Sorry, that book was not found in our database.');
            return;
        }

        let recommendations = [];

        // Determine sorting method
        if (sortOption === "rating") {
            recommendations = books
                .filter(book => book.genre === inputBook.genre && book.title.toLowerCase() !== bookInput.toLowerCase())
                .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));

        } else if (sortOption === "published") {
            recommendations = books
                .filter(book => book.genre === inputBook.genre && book.title.toLowerCase() !== bookInput.toLowerCase())
                .sort((a, b) => (b.published_year || 0) - (a.published_year || 0));

        } 

        displayRecommendations(recommendations);
    } catch (error) {
        console.error("Error loading book data:", error);
        alert("Failed to load book data. Please try again later.");
    }
}

function displayRecommendations(recommendations) {
    const recommendationsList = document.getElementById('recommendations');
    const recommendationTitle = document.getElementById('recommendation-title');

    recommendationsList.innerHTML = '';

    if (recommendations.length === 0) {
        recommendationsList.innerHTML = '<li>No recommendations found.</li>';
    } else {
        recommendations.forEach(book => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${book.title}</strong> by ${book.author} <br>
                            <em>Genre:</em> ${book.genre} <br>
                            <em>Rating:</em> ${book.average_rating || 'Rating not available'} <br>
                            <em>Published Year:</em> ${book.published_year || 'N/A'} <br>
                            <em>Description:</em> ${book.description || 'Unavailable in our database'}`;
            recommendationsList.appendChild(li);
        });
    }

    // Show the recommendations section after button click
    recommendationTitle.style.display = 'block';
    recommendationsList.style.display = 'block';
}

