//Edamam API

//API info
const API_ID = "74440f9d";
const API_KEY = "187b5ec2f2d8afb91eaa812faef32e21";

var inputEl = document.querySelector('#userInput');
var searchButton = document.querySelector('#searchButton');
var searchArea = document.querySelector('#searchArea');
var recipiesArea = document.querySelector('#recipiesDisplay');

//Run fetchAPI when search button is selected
function handleFormSubmit() {
    var userInput = inputEl.value;
    console.log(userInput)
    fetchAPI();
}

//Use user input with the API URL to select specific recipies based on the input
const fetchAPI = function () {
    var userInput = inputEl.value;
    const queryURL = 'https://api.edamam.com/api/recipes/v2?type=public&q=' + userInput + '&app_id=' + API_ID + '&app_key=' + API_KEY;
    searchArea.classList.add('hidden');
    recipiesArea.classList.remove('hidden');

    fetch(queryURL)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    //Run function to display recipies that the user is searching for
                    const recipes = data.hits.map(hit => hit.recipe);
                    displayRecipes(recipes);
                });
            } else {
                //Display error message if unable to get a vaild API response
                console.error('API error:', response.status, response.statusText);
            }
        })
        .catch((error) => {
            //Display error message if there is a network error
            console.error('Network error:', error);
        });
};

//Display recipies that the user searched for
function displayRecipes(recipes) {
    const recipiesDisplay = document.querySelector('#recipiesDisplay');
    recipiesDisplay.innerHTML = '';
    //Const to show the top 6 recipies
    const topRecipes = recipes.slice(0, 6);

    //Create a container, image, and link for each of the top recipies
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
        recipiesDisplay.appendChild(recipeContainer);
    });

}

searchButton.addEventListener('click', handleFormSubmit);
