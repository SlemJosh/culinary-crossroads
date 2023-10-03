//Edamam API

const API_ID = "74440f9d";
const API_KEY = "187b5ec2f2d8afb91eaa812faef32e21";

<<<<<<< HEAD
var userInput

const fetchAPI = function () {
=======
var inputEl = document.querySelector('#userInput')
var searchButton = document.querySelector('#searchButton')
var searchArea = document.querySelector('#searchArea')


function handleFormSubmit() {
    var userInput = inputEl.value
    console.log(userInput)
    fetchAPI()
}

const fetchAPI = function () {
    var userInput = inputEl.value
>>>>>>> cec27b6d1aed189b89526606b4ed4ec8f1e3c606
    const queryURL = 'https://api.edamam.com/api/recipes/v2?type=public&q=' + userInput + '&app_id=' + API_ID + '&app_key=' + API_KEY
    fetch(queryURL)
      .then((response) => {
        if (response.ok) {
            response.json().then((data) => {
            console.log(data)
        })
    }}
<<<<<<< HEAD
)}

userInput = 'chicken'
fetchAPI()
=======
)};




searchButton.addEventListener('click', handleFormSubmit);
 
>>>>>>> cec27b6d1aed189b89526606b4ed4ec8f1e3c606
