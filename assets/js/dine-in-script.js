//Edamam API

const API_ID = "74440f9d";
const API_KEY = "187b5ec2f2d8afb91eaa812faef32e21";

var inputEl = document.querySelector('#userInput');
var searchButton = document.querySelector('#searchButton');
var searchArea = document.querySelector('#searchArea');
var recipiesArea = document.querySelector('#recipiesDisplay');


function handleFormSubmit() {
    var userInput = inputEl.value
    console.log(userInput)
    fetchAPI()
}

const fetchAPI = function () {
    var userInput = inputEl.value
    const queryURL = 'https://api.edamam.com/api/recipes/v2?type=public&q=' + userInput + '&app_id=' + API_ID + '&app_key=' + API_KEY
    searchArea.classList.add('hidden')
    recipiesArea.classList.remove('hidden')

    fetch(queryURL)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    console.log(data)

                })
            }
        },
        )
        var picture1 = document.querySelector('#picture-1')
        var picture2 = document.querySelector('#picture-2')
        var picture3 = document.querySelector('#picture-3')
        var picture4 = document.querySelector('#picture-4')
        var picture5 = document.querySelector('#picture-5')
        var picture6 = document.querySelector('#picture-6')
    picture1.src ='https://placehold.co/600x400' ;
    picture2.src ='https://placehold.co/600x400' ;
    picture3.src ='https://placehold.co/600x400' ;
    picture4.src ='https://placehold.co/600x400' ;
    picture5.src ='https://placehold.co/600x400' ;
    picture6.src ='https://placehold.co/600x400' ;
}



searchButton.addEventListener('click', handleFormSubmit);
