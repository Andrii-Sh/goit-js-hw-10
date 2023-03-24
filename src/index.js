import './css/styles.css';
import { fetchCountries } from "./fetchCountries";
const debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchBoxEl = document.querySelector("input#search-box");
const countryListEl = document.querySelector('ul.country-list');
const countryInfoEl = document.querySelector('div.country-info');

searchBoxEl.addEventListener('input', debounce(handleSearchBoxInput, DEBOUNCE_DELAY));

let countryName = '';

function handleSearchBoxInput(event) {
    countryName = event.target.value;

    if (!countryName) {
        clearInterface();
        return;
    };

    fetchCountries(countryName)
    .then(data => {
        if (data.length === 1) {
            clearInterface();
            countryInfoEl.innerHTML = renderSingleMurkup(data);
        } else if (data.length > 1 && data.length <= 10) {
            clearInterface();
            countryListEl.innerHTML = renderMultipleMurkup(data);            
        } else {
            clearInterface();
            Notify.info("Too many matches found. Please enter a more specific name.");
        }            
     })    
        .catch(error => {
        clearInterface();
        Notify.failure("Oops, there is no country with that name");
    });
}

function renderSingleMurkup(data) {
    const languages = Object.values(data[0].languages).join(', ');

    return data.map(({ capital, flags, name, population }) => {
        return `<div class="country-info__wrapper">
            <img src="${flags.svg}" alt="Country flag" width="40" height="30" class="country-info__flag" />
            <p class="country-info__name">${name.official}</p>
        </div>
        <p class="country-info__capital"><b>Capital:</b> ${capital}</p>
        <p class="country-info__population"><b>Population:</b> ${population}</p>
        <p class="languages"><b>Languages:</b> ${languages}</p>`
    }).join('');  
}

function renderMultipleMurkup(data) {
    return data.map(({ flags, name }) => {
        return `<li class="country-list__item">
                    <img src="${flags.svg}" alt="Conntry flag" width="40" height="30" class="country-list__flag">
                    <p class="country-list__name">${name.official}</p>
                </li>`;
    }).join('');
}

function clearInterface() {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
}
