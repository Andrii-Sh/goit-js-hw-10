import './css/styles.css';
import { fetchCountries } from "./fetchCountries";
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;


const searchBoxEl = document.querySelector("input#search-box");

searchBoxEl.addEventListener('input', debounce(handleSearchBoxInput, DEBOUNCE_DELAY));

let countryName = '';

function handleSearchBoxInput(event) {
    countryName = event.target.value;

    if (!countryName) {
        return;
    };

    fetchCountries(countryName)
    .then(data => {
        // console.log(data);
        // console.log(data[0].name);
        console.log(data.length);

        if (data.length === 1) {
            renderSingleMurkup(data);
        } else if (data.length > 1 && data.length <= 10) {
            renderMultipleMurkup(data);
        } else {
            console.log("Too many matches found. Please enter a more specific name.");
        }    

        
     })    
    .catch (error => {
        console.log("Oops, there is no country with that name");
    });
    
    // console.log(fetchCountries(countryName));
}


function renderSingleMurkup(data) {
    console.log("Single country: " + data[0].name.common);
}

function renderMultipleMurkup(data) {
    data.forEach(element => {
        console.log("Multiple countries: " + element.name.common);
    });
}
