document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded event fired.");

// Get references to HTML elements
const zipCodeInput = document.getElementById("zipCode");
const foodTypeSelect = document.getElementById("foodType");
const searchButton = document.getElementById("searchButton");
const resultsDiv = document.getElementById("results");

// Function to perform a search
function performSearch(event) {

    const zipCode = zipCodeInput.value;
    const foodType = foodTypeSelect.value;

    // Your Google Places API key
    const API_KEY = "AIzaSyDronXJJHk4f5fXEP71UYplrWNcWUFUNmk";

    // Construct the request URL
    const requestUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${foodType}+restaurants&location=${zipCode}&key=${API_KEY}`;

    fetch(requestUrl, {
        headers: {
            "Accept-Encoding": "gzip, deflate", // Request compressed response
        },
    })

    // Make a request to the Google Places API
    fetch(requestUrl)
        .then((response) => response.json())
        .then((data) => {
            // Handle the API response (list of restaurants)
            console.log(data);
            // You can process the data to display restaurant names, addresses, etc.
            resultsDiv.innerHTML = JSON.stringify(data, null, 2); // Display JSON data as text
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

// Event listener for the search button
    searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        performSearch();
    });
});
