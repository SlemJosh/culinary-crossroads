// Google Maps API Script (without map and markers)

const API_KEY = "AIzaSyDronXJJHk4f5fXEP71UYplrWNcWUFUNmk";

// Function to display places in the list

console.log ('JavaScript is running');

function displayPlacesList(places) {
    const placesList = document.getElementById('placesList');
    placesList.innerHTML = ''; // Clear the previous list

    places.forEach((place, index) => {
        const listItem = document.createElement('li');
        const nameLink = document.createElement('a');
        nameLink.href = '#';
        nameLink.innerText = place.name;
        nameLink.onclick = function () {
            console.log('List item clicked');
            showPlaceDetails(index);
        };

        const attributionsList = place.html_attributions.map(attr => `<p>${attr}</p>`).join('');
        listItem.appendChild(nameLink);
        listItem.innerHTML += attributionsList;

        placesList.appendChild(listItem);
    });

    console.log('Displaying places list:', places);
}

// Function to show place details when a list item is clicked
function showPlaceDetails(index) {
    const places = window.searchResults;
    const modal = document.getElementById('placeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.getElementById('closeModal');

    if (index >= 0 && index < places.length) {
        const place = places[index];
        modalTitle.innerText = place.name;
        modalContent.innerHTML = `
            <p><strong>Address:</strong> ${place.vicinity}</p>
            <p><strong>Rating:</strong> ${place.rating}</p>
        `;

        console.log('Showing modal for place:', place);

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

    // Use Geocoding API to convert ZIP code to coordinates
    geocoder.geocode({ address: zipCode }, function (results, status) {
        if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location; // Get the location object
            console.log('Geocoding successful. Location:', location);

            // Create a request for nearby places
            const request = {
                location: location,
                radius: 2000, // Radius in meters (adjust as needed)
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

                    // Store the search results
                    window.searchResults = filteredResults;

                    // Display the places list
                    displayPlacesList(filteredResults);
                } else {
                    // Handle errors here
                    console.error('Nearby search failed:', status);
                }
            });
        } else {
            // Handle geocoding errors here
            console.error('Geocoding failed:', status);
        }
    });
}

function initMap() {

}