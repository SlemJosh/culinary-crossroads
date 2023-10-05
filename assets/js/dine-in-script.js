//Edamam API

const API_ID = "74440f9d";
const API_KEY = "187b5ec2f2d8afb91eaa812faef32e21";

var inputEl = document.querySelector('#userInput');
var searchButton = document.querySelector('#searchButton');
var searchArea = document.querySelector('#searchArea');
var recipiesArea = document.querySelector('#recipiesDisplay');


function handleFormSubmit() {
    var userInput = inputEl.value;
    console.log(userInput)
    fetchAPI();
}


function displayRecipes(recipes) {
    const recipiesDisplay = document.querySelector('#recipiesDisplay');
    recipiesDisplay.innerHTML = '';
    const topRecipes = recipes.slice(0, 6);

    topRecipes.forEach((recipe, index) => {
        const recipeContainer = document.createElement('div');
        recipeContainer.classList.add('recipe-container', 'bg-orange-200', 'rounded-lg', 'shadow-md', 'p-4', 'border-2', 'border-black');

        const recipeLink = document.createElement('a');
        recipeLink.href = recipe.url;
        recipeLink.target = '_blank'; 
        

        const recipeImage = document.createElement('img');
        recipeImage.src = recipe.image;
        recipeImage.alt = `${recipe.label} Image`;
        recipeImage.classList.add('recipe-image', 'w-full', 'h-auto', 'rounded-md');

        recipeLink.appendChild(recipeImage);
        recipeContainer.appendChild(recipeLink);

        const recipeButton = document.createElement('button');
        recipeButton.textContent = `${index + 1}. ${recipe.label}`;
        recipeButton.classList.add('recipe-button');
        recipeButton.classList.add('text-xl', 'font-semibold')
        

        recipeContainer.appendChild(recipeButton);
        recipiesDisplay.appendChild(recipeContainer);
    });

    recipiesDisplay.classList.remove('hidden');
}

const fetchAPI = function () {
    var userInput = inputEl.value;
    const queryURL = 'https://api.edamam.com/api/recipes/v2?type=public&q=' + userInput + '&app_id=' + API_ID + '&app_key=' + API_KEY;
    searchArea.classList.add('hidden');
    recipiesArea.classList.remove('hidden');

    fetch(queryURL)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    const recipes = data.hits.map(hit => hit.recipe);
                    displayRecipes(recipes);
                });
            } else {
                console.error('API error:', response.status, response.statusText);
            }
        })
        .catch((error) => {
            console.error('Network error:', error);
        });
};

searchButton.addEventListener('click', handleFormSubmit);
