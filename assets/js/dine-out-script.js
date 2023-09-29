const API_ID = "YourAPIID"; // Your API ID (if required)
const API_KEY = "AIzaSyDronXJJHk4f5fXEP71UYplrWNcWUFUNmk"; // Your Google Places API Key
const API_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";

// Get references to HTML elements
const locationSelect = document.getElementById("location");
const searchButton = document.getElementById("searchButton");
const resultsDiv = document.getElementById("results");

// Function to perform a search
function performSearch() {
    const searchQuery = "Chinese food";
    const location = locationSelect.value;
    const radius = 1000; // Search radius in meters (adjust as needed)

    // Construct the request URL
    let requestUrl = `${API_URL}?query=${searchQuery}&location=${location}&radius=${radius}&key=${API_KEY}`;

    // If you have an API_ID, you can add it to the URL
    if (API_ID) {
        requestUrl += `&client=${API_ID}`;
    }

    // Make a request to the Google Places API
    fetch(requestUrl)
        .then((response) => response.json())
        .then((data) => {
            // Handle the API response (list of Chinese restaurants)
            console.log(data);
            // You can process the data to display restaurant names, addresses, etc.
            resultsDiv.innerHTML = JSON.stringify(data, null, 2); // Display JSON data as text
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

// Event listener for the search button
searchButton.addEventListener("click", () => {
    performSearch();
});
