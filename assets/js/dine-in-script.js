// Edamam API
const API_ID = "74440f9d";
const API_KEY = "187b5ec2f2d8afb91eaa812faef32e21";
const API_ENDPOINT = "https://api.edamam.com/api/recipes/v2";

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.querySelector(".bg-orange-400");
    const recipesList = document.getElementById("recipes-list");

    searchButton.addEventListener("click", () => {
        const ingredientInput = document.getElementById("Ingredient").value;

        // Define your request parameters
        const params = {
            q: ingredientInput,
            type: "public",
            app_id: API_ID,
            app_key: API_KEY,
        };

        // Set up the Axios config
        const config = {
            params,
        };

        // Make the API request
        axios.get(API_ENDPOINT, config)
            .then((response) => {
                // Handle the API response here
                const recipes = response.data.hits;

                // Clear the previous list of recipes
                recipesList.innerHTML = '';

                // Loop through the recipes and display them
                recipes.forEach((recipe) => {
                    const recipeTitle = recipe.recipe.label;
                    const recipeLink = recipe.recipe.url;

                    const recipeItem = document.createElement('li');
                    recipeItem.innerHTML = `<a href="${recipeLink}" target="_blank">${recipeTitle}</a>`;
                    recipesList.appendChild(recipeItem);
                });
            })
            .catch((error) => {
                // Handle any errors that occur during the request
                console.error('Error:', error);
            });
    });
});
