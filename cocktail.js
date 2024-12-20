// DOM Elements
const searchInput = document.getElementById("searchInput");
const searchButton = document.querySelector(".search-icon");
const cocktailGrid = document.getElementById("cocktailGrid");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const closeButton = document.querySelector(".close-button");

// API Base URL
const API_BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1/";

// Fetch cocktails based on a search query
async function fetchCocktails(query) {
    try {
        const response = await fetch(`${API_BASE_URL}search.php?s=${query}`);
        const data = await response.json();
        if (data.drinks) {
            displayCocktails(data.drinks);
        } else {
            cocktailGrid.innerHTML = `<p>No results found for "${query}". Try searching for another cocktail!</p>`;
        }
    } catch (error) {
        console.error("Error fetching cocktails:", error);
        cocktailGrid.innerHTML = "<p>Something went wrong. Please try again later.</p>";
    }
}

// Display cocktails in a grid format
function displayCocktails(cocktails) {
    cocktailGrid.innerHTML = ""; 
    cocktails.forEach((cocktail) => {
        const card = document.createElement("div");
        card.classList.add("cocktail-card");
        card.innerHTML = `
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" class="cocktail-image">
            <h3>${cocktail.strDrink}</h3>
        `;
        card.addEventListener("click", () => showModal(cocktail));
        cocktailGrid.appendChild(card);
    });
}

// Extract ingredients and measurements
function getIngredients(cocktail) {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push(`${measure ? measure : ""} ${ingredient}`.trim());
        }
    }
    return ingredients;
}

// Show modal with cocktail details
function showModal(cocktail) {
    const ingredients = getIngredients(cocktail);
    modalContent.innerHTML = `
        <h2>${cocktail.strDrink}</h2>
        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" class="modal-image">
        <h3>Ingredients</h3>
        <ul>
            ${ingredients.map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <h3>Instructions</h3>
        <p>${cocktail.strInstructions}</p>
    `;
    modal.style.display = "block";
}

// Close modal
closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close modal when clicking outside content
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Trigger search on button click
searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchCocktails(query);
    }
});

// Trigger search on Enter key
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
            fetchCocktails(query);
        }
    }
});

// Fetch initial data (optional: default search)
fetchCocktails("margarita");
