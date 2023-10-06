// Google Maps API Script (without map and markers)

// API_KEY = "AIzaSyDronXJJHk4f5fXEP71UYplrWNcWUFUNmk";

const API_KEY = "AIzaSyDronXJJHk4f5fXEP71UYplrWNcWUFUNmk";

document.addEventListener('DOMContentLoaded', function () {
    console.log('JavaScript is running');

    const savedSearchParams = getSavedSearchParameters();
    const resultsContainer = document.getElementById('resultsContainer');
    const displayHistoryButton = document.getElementById('displayHistoryButton');
    const clearHistoryButton = document.getElementById('clearHistoryButton');
    const placesList = document.getElementById('placesList');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const previousSearches = document.getElementById('previousSearches');

    function searchNearbyFood(zipCode, cuisine, searchRadius) {
        resultsContainer.style.display = 'block';

        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address: zipCode }, function (results, status) {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                console.log('Geocoding successful. Location:', location);

                const request = {
                    location: location,
                    radius: parseFloat(searchRadius) * 1609.34,
                    keyword: cuisine,
                };

                const service = new google.maps.places.PlacesService(document.createElement('div'));

                placesList.innerHTML = '';

                service.nearbySearch(request, function (results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        const filteredResults = results.filter(place => place.types.includes('restaurant'));

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

                        console.log('Nearby search results:', filteredResults);

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

    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Form submitted');
        const zipCode = document.getElementById('zipCode').value;
        const cuisine = document.getElementById('foodType').value;
        const searchRadius = document.getElementById('searchRadius').value;

        saveSearchParameters(zipCode, cuisine, searchRadius);
        console.log('Submitting form with ZIP code:', zipCode, 'and cuisine:', cuisine);
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

    function displayPlacesList(places) {
        clearNoResultsMessage();
        placesList.innerHTML = '';

        if (places.length === 0) {
            displayNoResults();
        } else {
            places.forEach((place, index) => {
                const listItem = document.createElement('li');
                const nameLink = document.createElement('a');
                const cityInfo = place.vicinity.split(',')[1].trim();

                nameLink.href = '#';
                nameLink.innerText = `${place.name} (${cityInfo})`;
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

    function checkSavedSearches() {
        const savedSearchParams = getSavedSearchParameters();
        clearHistoryButton.style.display = savedSearchParams.length > 0 ? 'inline-block' : 'none';
            }

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
            
            searchLink.addEventListener('click', () =>{
                
                searchNearbyFood(savedSearch.zipCode, savedSearch.cuisine, savedSearch.searchRadius);
            });

           listItem.appendChild(searchLink);
           savedSearchList.appendChild(listItem);

            savedSearchList.appendChild(listItem);
        });

        const previousSearches = document.getElementById('previousSearches');
        previousSearches.innerHTML = '';
        previousSearches.appendChild(savedSearchList);

        document.getElementById('resultsContainer').style.display = 'none';

        checkSavedSearches();


    }

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

    function getSavedSearchParameters() {
        return JSON.parse(localStorage.getItem('savedSearches')) || [];
    }

    document.getElementById('clearHistoryButton').addEventListener('click', () => {
        clearSearchHistory();
    });

    function clearSearchHistory() {
        localStorage.removeItem('savedSearches');
        const savedSearchList = document.getElementById('previousSearches');
        savedSearchList.innerHTML = '';
    }

    function clearAndCenterNoResultsMessage() {
        noResultsMessage.style.display = 'block';
        noResultsMessage.innerText = 'No results found for this search.';
        placesList.innerHTML = '';
    }

    function displayNoResults() {
        clearAndCenterNoResultsMessage();
    }

    function clearNoResultsMessage() {
        noResultsMessage.style.display = 'none';
    }

    function getNumberOfColumns(numResults) {
        if (numResults <= 7) {
            return 1;
        } else if (numResults <= 14) {
            return 2;
        } else {
            return 3;
        }
    }

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
    checkSavedSearches();
});
