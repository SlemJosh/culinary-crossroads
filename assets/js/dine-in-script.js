//Edamam API

const API_ID = "74440f9d";
const API_KEY = "187b5ec2f2d8afb91eaa812faef32e21";

var userInput

const fetchAPI = function () {
    const queryURL = 'https://api.edamam.com/api/recipes/v2?type=public&q=' + userInput + '&app_id=' + API_ID + '&app_key=' + API_KEY
    fetch(queryURL)
      .then((response) => {
        if (response.ok) {
            response.json().then((data) => {
            console.log(data)
        })
    }}
)}

userInput = 'chicken'
fetchAPI()