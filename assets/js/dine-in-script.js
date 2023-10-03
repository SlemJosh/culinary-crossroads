//Edamam API

const API_ID = "74440f9d";
const API_KEY = "187b5ec2f2d8afb91eaa812faef32e21";

const fetchAndDisplayRecipes = (userInput) => {
    const queryURL = `https://api.edamam.com/api/recipes/v2?type=public&q=${userInput}&app_id=${API_ID}&app_key=${API_KEY}`;

    fetch(queryURL)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch data from the API');
            }
        })
        .then((data) => {
            const recipesList = document.getElementById('recipes-list');
            recipesList.innerHTML = '';

            for (let i = 0; i < 10 && i < data.hits.length; i++) {
                const recipe = data.hits[i].recipe;
                const recipeTitle = recipe.label;
                const recipeLink = recipe.url;

                const recipeItem = document.createElement('li');
                recipeItem.innerHTML = `<a href="${recipeLink}" target="_blank">${recipeTitle}</a>`;
                recipesList.appendChild(recipeItem);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

document.getElementById('search-button').addEventListener('click', () => {
    const userInput = document.getElementById('Ingredient').value;
    fetchAndDisplayRecipes(userInput);
});
