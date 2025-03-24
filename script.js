const userInput = document.querySelector("#input");
const userBox = document.querySelector(".wrapper");
const continentSelect = document.querySelector("#continentSelect");

const countryAll = "https://restcountries.com/v3.1/all";
let countries = [];

async function fetchCountries() {
    try {
        const response = await fetch(countryAll);
        countries = await response.json();
        renderCountries(countries);
    } catch (error) {
        console.error("Error fetching data", error);
    }
}

function renderCountries(data) {
    userBox.innerHTML = "";
    data.forEach(country => {
        userBox.innerHTML += `
          <div class="card bg-base-100 w-96 shadow-sm mt-[50px]">
                <figure>
                    <img class="rasm h-[250px] w-full"
                    src="http://www.geonames.org/flags/x/${country.cca2.toLowerCase()}.gif"
                    alt="${country.name.common}" />
                </figure>
                <div class="card-body">
                    <h2 class="card-title">${country.name.common}</h2>
                    <p class="text">${country.name.official}</p>
                    <div class="card-actions justify-end">
                        <button class="btn btn-primary more-btn" data-country="${country.name.common}">More</button>
                    </div>
                </div>
            </div>
        `;
    });
}

userInput.addEventListener("input", () => {
    const searchText = userInput.value.toLowerCase();
    const filteredCountries = countries.filter(country => 
        country.name.common.toLowerCase().includes(searchText) || 
        country.name.official.toLowerCase().includes(searchText)
    );
    renderCountries(filteredCountries);
});

continentSelect.addEventListener("change", () => {
    const selectedRegion = continentSelect.value;
    const filteredCountries = selectedRegion === "all" 
        ? countries 
        : countries.filter(country => country.region === selectedRegion);

    renderCountries(filteredCountries);
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("more-btn")) {
        const countryName = e.target.dataset.country;
        localStorage.setItem("selectedCountry", countryName);
        document.getElementById("country-modal").checked = true;
        loadCountryInfo(countryName);
    }
});

function loadCountryInfo(countryName) {
    const countryInfo = document.querySelector("#countryInfo");
    countryInfo.innerHTML = "<p>Loading...</p>";

    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => response.json())
        .then(data => {
            if (!data.length) {
                countryInfo.innerHTML = "<p>Country not found!</p>";
                return;
            }

            const country = data[0];
            countryInfo.innerHTML = `
                <h1>${country.name.common} (${country.cca2})</h1>
                <img src="http://www.geonames.org/flags/x/${country.cca2.toLowerCase()}.gif" alt="${country.name.common}" width="200"/>
                <p><strong>Official Name:</strong> ${country.name.official}</p>
                <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
                <p><strong>Currency:</strong> ${country.currencies 
                    ? Object.values(country.currencies)[0].name + " (" + Object.values(country.currencies)[0].symbol + ")" 
                    : "N/A"}</p>
            `;
        })
        .catch(error => {
            console.error("Error fetching country details:", error);
            countryInfo.innerHTML = "<p>Error loading country details.</p>";
        });
}

window.addEventListener("DOMContentLoaded", () => {
    fetchCountries();
    const savedCountry = localStorage.getItem("selectedCountry");
    if (savedCountry) {
        document.getElementById("country-modal").checked = true;
        loadCountryInfo(savedCountry);
    }
});
