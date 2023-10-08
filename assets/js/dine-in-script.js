// Edamam API
// API_ID = "74440f9d";
// API_KEY = "187b5ec2f2d8afb91eaa812faef32e21"

// API info and Variables
const API_ID = "74440f9d";
const API_KEY = "187b5ec2f2d8afb91eaa812faef32e21";

const inputEl = document.querySelector('#userInput');
const searchButton = document.querySelector('#searchButton');
const searchArea = document.querySelector('#searchArea');
const recipesArea = document.querySelector('#recipesDisplay');

const loadMoreButton = document.querySelector('#loadMore');
const backOnePageButton = document.querySelector('#backOne');
const backToFirstPageButton = document.querySelector('#firstPage');

// Run fetchAPI when search button is selected
function handleFormSubmit(event) {
    event.preventDefault();  // Prevents the default behavior
    var userInput = inputEl.value.trim();

    // Verify that the user has entered something into the search bar.
    if (userInput){
        fetchAPI();
        document.querySelector('.error-message').classList.add('hidden');
    }
    else {
        document.querySelector('.error-message').classList.remove('hidden');
    }
}

// Use user input with the API URL to select specific recipes based on the input
const fetchAPI = function () {
    const userInput = inputEl.value;
    const queryURL = 'https://api.edamam.com/api/recipes/v2?type=public&q=' + userInput + '&app_id=' + API_ID + '&app_key=' + API_KEY;
    searchArea.classList.add('hidden');
    recipesArea.classList.remove('hidden');

    fetch(queryURL)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    // Run function to display recipes that the user is searching for
                    const recipes = data.hits.map(hit => hit.recipe);
                    console.log('API search results:', recipes);
                    totalRecipes = recipes;
                    displayRecipes(recipes.slice(0, displayedRecipeCount));

                    if(displayedRecipeCount < recipes.length){
                        loadMoreButton.style.display = 'block';
                    }
                });
            } else {
                // Display error message if unable to get a valid API response
                console.error('API error:', response.status, response.statusText);
            }
        })
        .catch((error) => {
            // Display error message if there is a network error
            console.error('Network error:', error);
        });
};

// Display recipes that the user searched for
function displayRecipes(recipes) {
    const recipesDisplay = document.querySelector('#recipesDisplay');
    recipesDisplay.innerHTML = '';
    // Constant to show the top 6 recipes
    const topRecipes = recipes.slice(0, 6);

    // Create a container, image, and link for each of the top recipes
    topRecipes.forEach((recipe, index) => {
        const recipeContainer = document.createElement('div');
        recipeContainer.classList.add('recipe-container', 'bg-blue-400', 'rounded-lg', 'shadow-md', 'p-4', 'border-2', 'border-black');

        const recipeLink = document.createElement('a');
        recipeLink.href = recipe.url;
        recipeLink.target = '_blank'; 

        const recipeImage = document.createElement('img');
        recipeImage.src = recipe.image;
        recipeImage.alt = `${recipe.label} Image`;
        recipeImage.classList.add('recipe-image', 'w-full', 'h-auto', 'rounded-md');

        recipeLink.appendChild(recipeImage);
        recipeContainer.appendChild(recipeLink);

        const recipeName = document.createElement('p');
        recipeName.textContent = `${index + 1}. ${recipe.label}`;
        recipeName.classList.add('recipe-name', 'pt-2');
        recipeName.classList.add('text-xl', 'font-semibold')

        recipeContainer.appendChild(recipeName);
        recipesDisplay.appendChild(recipeContainer);
    });
}

searchButton.addEventListener('click', handleFormSubmit);

// Add an event listener to the "Load More" button
loadMoreButton.addEventListener('click', loadMoreRecipes);

let displayedRecipeCount = 6; // Initial count of displayed recipes

backOnePageButton.style.display = 'none';

// Function to load more recipes
function loadMoreRecipes() {
    const nextBatch = totalRecipes.slice(displayedRecipeCount, displayedRecipeCount + 6);
   
    // Display additional recipes if available
    if (nextBatch.length > 0) {
        displayedRecipeCount += 6;
        displayRecipes(nextBatch);

        if (displayedRecipeCount >= 12) {
            backOnePageButton.style.display = 'block';
        }
    } else {
        loadMoreButton.style.display = "none";

        if (displayedRecipeCount >= totalRecipes.length){
            backToFirstPageButton.style.display = 'block';
        }
    }
}

backToFirstPageButton.addEventListener('click', firstPage);

// Function to activate a button to take us back to the first page of results.
function firstPage(){
    displayedRecipeCount = 6;

    displayRecipes(totalRecipes.slice(0, displayedRecipeCount));

    backOnePageButton.style.display = 'none';
    backToFirstPageButton.style.display = 'none';

    if (totalRecipes.length > displayedRecipeCount){
        loadMoreButton.style.display = 'block';
    }

    // This will scroll to the top of the page with results, considering the button is at the bottom it will make it more user friendly to see the list from the top again
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

backOnePageButton.addEventListener('click', backOne);

// Function to go back one page
function backOne() {
    // Go back one page by reducing the displayedRecipeCount by 6
    displayedRecipeCount -= 6;

    // Hide the "Back One Page" button when we reach the first page of results
    if (displayedRecipeCount < 6) {
        // We don't want the back one page button to display on page 1
        backOnePageButton.style.display = 'none';
        
        displayedRecipeCount = 6;
    }

    // Display the recipes for the current page
    displayRecipes(totalRecipes.slice(displayedRecipeCount - 6, displayedRecipeCount));
}
