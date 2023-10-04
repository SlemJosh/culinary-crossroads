// Google Maps API Script (without map and markers)

// API_KEY = "AIzaSyDronXJJHk4f5fXEP71UYplrWNcWUFUNmk";

document.addEventListener('DOMContentLoaded', function () {
    const API_KEY = "AIzaSyDronXJJHk4f5fXEP71UYplrWNcWUFUNmk"; // Replace with your actual API key

    console.log('JavaScript is running');  // Testing JavaScript script linked and running

    // Function to display places in the list
    function displayPlacesList(places) {
        const placesList = document.getElementById('placesList');
        placesList.innerHTML = ''; // Clear the previous list

        // Adding a condition if there are no search results. We want the user to see this and know that it's still working
        if (places.length === 0) {
            // If the places array is empty, display a message
            const noResults = document.createElement('p');
            noResults.innerText = 'No results found for this search.';
            placesList.appendChild(noResults);
        } else {
            // If there are results. Show them
            places.forEach((place, index) => {
                const listItem = document.createElement('li');
                const nameLink = document.createElement('a');
                nameLink.href = '#';
                nameLink.innerText = place.name;
                nameLink.onclick = function () {
                    showRestaurantDetails(place);
                };

                listItem.appendChild(nameLink);
                placesList.appendChild(listItem);
            });

            console.log('Displaying places list:', places);
        }
    }

    function showRestaurantDetails(restaurant) {
        const modal = document.getElementById('restaurantModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        const closeModal = document.getElementById('closeModal');
        const getDirections = document.createElement('a');
        const priceLevel = convertPriceLevel(restaurant.price_level);

        modalContent.style.backgroundColor = 'silver';

        modalTitle.innerText = restaurant.name;

        modalContent.innerHTML = `
            <p><strong>Address:</strong> ${restaurant.vicinity}</p>
            <p><strong>Rating:</strong> ${getStarRatingHTML(restaurant.rating)}</p>
            <p><strong>Price Level:</strong> ${priceLevel}</p>
        `;

        // Link for getting directions on the modal
        getDirections.innerText = 'Get Directions';
        getDirections.href = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.geometry.location.lat()},${restaurant.geometry.location.lng()}`;
        getDirections.target = '_blank';  // We want the link to open in a new tab so they don't lose their place.

        // Adding inline CSS to the link color
        getDirections.style.color = 'blue';

        // Adding the getDirections link onto the modal
        modalContent.appendChild(getDirections);

        modal.style.display = 'block';

        closeModal.onclick = function () {
            modal.style.display = 'none';
        };

        // Opens the modal  
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }

    // Event listener for the form submission
    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission
        console.log('Form submitted');
        const zipCode = document.getElementById('zipCode').value;
        const cuisine = document.getElementById('foodType').value;

        // Call the function to search for nearby food
        console.log('Submitting form with ZIP code:', zipCode, 'and cuisine:', cuisine);
        searchNearbyFood(zipCode, cuisine);
    });

    // Function to perform the nearby food search
    function searchNearbyFood(zipCode, cuisine) {
        const geocoder = new google.maps.Geocoder();

        // Using Geocoding API to convert ZIP code to coordinates
        geocoder.geocode({ address: zipCode }, function (results, status) {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location; // Get the location object
                console.log('Geocoding successful. Location:', location);

                // Create a request for nearby places
                const request = {
                    location: location,
                    radius: 8046.72, // 5-mile radius, converted to meters.
                    keyword: cuisine,
                };

                // Initialize the Places service and perform the nearby search
                const service = new google.maps.places.PlacesService(document.createElement('div'));
                service.nearbySearch(request, function (results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        // Filter the results to include only places with "restaurant" in types
                        const filteredResults = results.filter(place => {
                            return place.types.includes('restaurant');
                        });
                        console.log('Nearby search results:', filteredResults);

                        // Adding condition to display no search results
                        if (filteredResults.length === 0) {
                            displayNoResults();
                        } else {
                            // Display the places list
                            displayPlacesList(filteredResults);
                        }
                    } else {
                        // Handle errors here
                        console.error('Nearby search failed:', status);
                        displayNoResults();
                    }
                });
            } else {
                // Handle geocoding errors here
                console.error('Geocoding failed:', status);
                displayErrorMessage();
            }
        });
    }

    // Zero results in the array for restaurant searches
    function displayNoResults() {
        const placesList = document.getElementById('placesList');
        placesList.innerHTML = ''; // Clear the previous list
        const noResults = document.createElement('p');
        noResults.innerText = 'No results found for this search.';
        placesList.appendChild(noResults);
    }

    // If geocoding fails another function and message to run.
    function displayErrorMessage() {
        const placesList = document.getElementById('placesList');
        placesList.innerHTML = ''; // Clear the previous list
        const errorMessage = document.createElement('p');
        errorMessage.innerText = 'An error occurred while searching for nearby places.';
        placesList.appendChild(errorMessage);
    }

    // Function for coverting our rating on the modal into a star visualization.
    function getStarRatingHTML(rating) {
        const maxStars = 5; // Maximum number of stars
        const starIcon = '★'; // Unicode character for a star
        const fullStarCount = Math.floor(rating); // Number of full stars
        const halfStarCount = Math.ceil(rating - fullStarCount); // Number of half stars (if any)
        const emptyStarCount = maxStars - fullStarCount - halfStarCount; // Number of empty stars

        let starsHTML = '';

        // Add full stars
        starsHTML += `<span style="color: gold;">${starIcon.repeat(fullStarCount)}</span>`;

        // Add half star if necessary
        if (halfStarCount > 0) {
            starsHTML += `<span style="color: gold;">½</span>`;
        }

        // Add empty stars
        starsHTML += `<span style="color: gold;">${starIcon.repeat(emptyStarCount)}</span>`;

        return starsHTML;
    }


    // Converting the price_level given to us in the array pull, and assigning it a string that will be more accessible than just some numbers.
    function convertPriceLevel(priceLevel) {
        switch (priceLevel) {
            case 0:
                return 'Free';
            case 1:
                return 'Inexpensive';
            case 2:
                return 'Moderate';
            case 3:
                return 'Expensive';
            case 4:
                return 'Very Expensive';
            default:
                return 'N/A'; // Handle unknown or missing values
        }
    }
});