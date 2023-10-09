// Google Maps API Script (without map and markers)

// API_KEY = AIzaSyDronXJJHk4f5fXEP71UYplrWNcWUFUNmk;

const API_KEY = "AIzaSyDronXJJHk4f5fXEP71UYplrWNcWUFUNmk";

// Define DOM elements
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the DOM elements
    const savedSearchParams = getSavedSearchParameters();
    const resultsContainer = document.getElementById('resultsContainer');
    const displayHistoryButton = document.getElementById('displayHistoryButton');
    const clearHistoryButton = document.getElementById('clearHistoryButton');
    const placesList = document.getElementById('placesList');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const previousSearches = document.getElementById('previousSearches');

    // Functions for searching and displaying results
    // SearchNearbyFood function
    function searchNearbyFood(zipCode, cuisine, searchRadius) {
        resultsContainer.style.display = 'block';

        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address: zipCode }, function (results, status) {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;

                // Getting some additional geocode information stored so we can display our city and state with the search results.
                const locationInfoElement = document.getElementById('locationInfo');
                const city = getCityFromGeocodeResult(results[0]);
                const state = getStateFromGeocodeResult(results[0]);
                if (city && state) {
                    locationInfoElement.innerText = `${city}, ${state}`;
                } else if (city) {
                    locationInfoElement.innerText = `${city}`;
                } else {
                    locationInfoElement.innerText = ' Location information not available';
                }

                const request = {
                    location: location,
                    radius: parseFloat(searchRadius) * 1609.34, // Convert miles to meters for the Google API
                    keyword: cuisine,
                };

                const service = new google.maps.places.PlacesService(document.createElement('div'));

                placesList.innerHTML = '';

                service.nearbySearch(request, function (results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        
                        // We need to filter the results so we are only showing those that classify as a restaurant.  In this coding, we also find out that we are
                        // reliant on the API's information, because some places would show up on our list and not be actual restaurants.  But just because someone
                        // put this type into their array, it automatically pulls it.  So by filtering, at least we can reduce some of those conflicts.
                        const filteredResults = results.filter(place => place.types.includes('restaurant'));

                        // Here we are getting our lat and long so we can calculate the distance between where we are and the restaurant we are viewing.  It also helps us with our state and city info.
                        filteredResults.sort((a, b) => {
                            const distanceA = calculateDistance(
                                location.lat(),
                                location.lng(),
                                a.geometry.location.lat(),
                                a.geometry.location.lng()
                            );
                            const distanceB = calculateDistance(
                                location.lat(),
                                location.lng(),
                                b.geometry.location.lat(),
                                b.geometry.location.lng()
                            );
                            return distanceA - distanceB;
                        });

                        // If we don't have any results to the array, we need to run the function to display an error for the user.

                        if (filteredResults.length === 0) {
                            displayNoResults();

                        } else {
                            placesList.style.columnCount = getNumberOfColumns(filteredResults.length);
                            displayPlacesList(filteredResults);

                            clearHistoryButton.style.display = 'inline-block';
                        }
                    } else {
                        console.error('Nearby search failed:', status);
                        displayNoResults();
                    }
                });
            } else {
                console.error('Geocoding failed:', status);
                displayErrorMessage();
            }
        });
    }

    // Display Places List Function
    function displayPlacesList(places) {
        clearNoResultsMessage();
        placesList.innerHTML = '';

        // Again if there are no results, we need some way to tell the user that, so they can search again or give up trying. =P
        if (places.length === 0) {
            displayNoResults();
        } else {
            const zipCode = document.getElementById('zipCode').value;
            const geocoder = new google.maps.Geocoder();

            geocoder.geocode({ address: zipCode }, function (zipCodeResults, zipCodeStatus) {
                if (zipCodeStatus === 'OK' && zipCodeResults[0]) {
                    const zipCodeLocation = zipCodeResults[0].geometry.location;

                    places.forEach((place, index) => {
                        const listItem = document.createElement('li');
                        const nameLink = document.createElement('a');
                        const cityInfo = place.vicinity.split(',')[1].trim();
                        const restaurantLocation = place.geometry.location;

                        // We want the user to be able to see some upfront information, a big helpful part is the distance betwen them and the restaurants.
                        const distance = calculateDistance(
                            zipCodeLocation.lat(),
                            zipCodeLocation.lng(),
                            restaurantLocation.lat(),
                            restaurantLocation.lng()
                        );

                        const distanceMiles = distance * 0.621371; // Convert kilometers to miles.  Google uses meters across the board, but most of our users need other information   

                        nameLink.href = '#';
                        nameLink.innerText = `${place.name} - (${cityInfo}) - ${distanceMiles.toFixed(2)} miles away`;
                        nameLink.onclick = function () {
                            showRestaurantDetails(place);
                        };

                        listItem.appendChild(nameLink);
                        placesList.appendChild(listItem);
                    });
                } else {
                    console.error('Geocoding failed for zip code:', zipCodeStatus);
                    displayNoResults();
                }

            });
        }
    }

    // Show the Restaurant Details in a modal Function
    function showRestaurantDetails(restaurant) {
        const modal = document.getElementById('restaurantModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        const closeModal = document.getElementById('closeModal');
        const getDirections = document.createElement('a');
        const priceLevel = convertPriceLevel(restaurant.price_level);

        modalContent.style.backgroundColor = 'silver';
        modalTitle.innerText = restaurant.name;

        // Our modal acts as a placeholder ad for the restaurant. We want to give them some of the pertinent information. Further functions will be needed to display this information in the most helpful way.
        modalContent.innerHTML = `
            <p><strong>Address:</strong> ${restaurant.vicinity}</p>
            <p><strong>Rating:</strong> ${getStarRatingHTML(restaurant.rating)}</p>
            <p><strong>Price Level:</strong> ${priceLevel}</p>
        `;

        // It is a google API so we might as well utilize some of the other resources from Google.  This is especially helpful if you pull this up on a phone, as you can immediately navigate to where you are going.
        getDirections.innerText = 'Get Directions';
        getDirections.href = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.geometry.location.lat()},${restaurant.geometry.location.lng()}`;
        getDirections.target = '_blank';
        getDirections.style.color = 'blue';

        modalContent.appendChild(getDirections);
        modal.style.display = 'block';

        closeModal.onclick = function () {
            modal.style.display = 'none';
        };

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }

    // Event Listeners
    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault();

        const zipCode = document.getElementById('zipCode').value;
        const cuisine = document.getElementById('foodType').value;
        const searchRadius = document.getElementById('searchRadius').value;

        if (!zipCode || !/^\d{5}$/.test(zipCode)) {
            alert('Please enter a valid 5-digit zip code.')
            return;
        }
        saveSearchParameters(zipCode, cuisine, searchRadius);
        searchNearbyFood(zipCode, cuisine, searchRadius);
    });

    displayHistoryButton.addEventListener('click', () => {
        displaySavedSearches();
    });

    clearHistoryButton.addEventListener('click', () => {
        clearSearchHistory();
        clearHistoryButton.style.display = 'none';
    });

    checkSavedSearches();

    // Helper Functions for utilizing our search history

    // checking saved Searches Function
    function checkSavedSearches() {
        const savedSearchParams = getSavedSearchParameters();
        clearHistoryButton.style.display = savedSearchParams.length > 0 ? 'inline-block' : 'none';
    }

    // Function to display our saved searches with the click of the button
    function displaySavedSearches() {
        const savedSearchParams = getSavedSearchParameters();
        const savedSearchList = document.createElement('ul');

        savedSearchParams.forEach((savedSearch, index) => {
            const listItem = document.createElement('li');
            const searchLink = document.createElement('a');

            searchLink.innerText = `Search ${index + 1}: Zip Code - ${savedSearch.zipCode}, Cuisine - ${savedSearch.cuisine}, Radius - ${savedSearch.searchRadius} miles`;
            searchLink.href = '#';

            // Applying styling so that people know they can click on the items as links
            searchLink.classList.add('search-link');

            searchLink.addEventListener('click', () => {

                searchNearbyFood(savedSearch.zipCode, savedSearch.cuisine, savedSearch.searchRadius);
            });

            listItem.appendChild(searchLink);
            savedSearchList.appendChild(listItem);
        });

        const previousSearches = document.getElementById('previousSearches');
        previousSearches.innerHTML = '';
        previousSearches.appendChild(savedSearchList);

        document.getElementById('resultsContainer').style.display = 'none';

        checkSavedSearches();

    }

    // Function to save the search parameters.
    function saveSearchParameters(zipCode, cuisine, searchRadius) {
        const searchParams = {
            zipCode,
            cuisine,
            searchRadius,
        };
        let savedSearches = JSON.parse(localStorage.getItem('savedSearches')) || [];
        savedSearches.push(searchParams);
        localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
    }

    //  Function to get our local storage data
    function getSavedSearchParameters() {
        return JSON.parse(localStorage.getItem('savedSearches')) || [];
    }

    // we don't want the history button visible if there is no history.  So upon clicking it, we want to make it vanish.
    document.getElementById('clearHistoryButton').addEventListener('click', () => {
        clearSearchHistory();
    });

    // Function to clear the search history
    function clearSearchHistory() {
        localStorage.removeItem('savedSearches');
        const savedSearchList = document.getElementById('previousSearches');
        savedSearchList.innerHTML = '';
    }

    // More Helper Functions. For displaying results and Information

    // Function to put an error message in the center for a no results search
    function clearAndCenterNoResultsMessage() {
        noResultsMessage.style.display = 'block';
        noResultsMessage.innerText = 'No results found for this search.';
        placesList.innerHTML = '';
    }

    // Function for displaying our error message
    function displayNoResults() {
        clearAndCenterNoResultsMessage();
    }

    // Function for setting the error message back to a hidden one
    function clearNoResultsMessage() {
        noResultsMessage.style.display = 'none';
    }

    // Helper Functions for Formatting and Geocoding

    // Function for setting the results into columns based on how many results.  Max results = 20.
    function getNumberOfColumns(numResults) {
        if (numResults <= 7) {
            return 1;
        } else if (numResults <= 14) {
            return 2;
        } else {
            return 3;
        }
    }

    // Function for converting the API's data for price level to something more helpful to the user who see's it on the modal.
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
                return 'N/A';
        }
    }

    // Function for coverting a numerical rating system into a visual representation of stars.
    function getStarRatingHTML(rating) {
        const maxStars = 5;
        const starIcon = '★';
        const fullStarCount = Math.floor(rating);
        const halfStarCount = Math.ceil(rating - fullStarCount);
        const emptyStarCount = maxStars - fullStarCount - halfStarCount;

        let starsHTML = '';

        starsHTML += `<span style="color: gold;">${starIcon.repeat(fullStarCount)}</span>`;

        if (halfStarCount > 0) {
            starsHTML += `<span style="color: gold;">½</span>`;
        }

        starsHTML += `<span style="color: gold;">${starIcon.repeat(emptyStarCount)}</span>`;

        return starsHTML;
    }

    // Function for getting the city from the zip code provided at the beginning
    function getCityFromGeocodeResult(result) {
        for (let component of result.address_components) {
            if (component.types.includes('locality')) {
                return component.long_name;
            }
        }
        return null;
    }

    // Function for getting the state from the zip code provided at the beginning
    function getStateFromGeocodeResult(result) {
        for (let component of result.address_components) {
            if (component.types.includes('administrative_area_level_1')) {
                return component.short_name;
            }
        }
        return null;
    }

    // Function for calculating distance from one point of lat long to another. In this case it will be from the restaurant to the zip code provided.  We will use it to sort our results as well as display it in them.
    // *Haversine formula* https://www.geeksforgeeks.org/haversine-formula-to-find-distance-between-two-points-on-a-sphere/
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }

});


