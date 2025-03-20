const userForm = document.querySelector("#form");
const userInput = document.querySelector("#input");
const userBox = document.querySelector(".wrapper");

const countryAll = "https://restcountries.com/v3.1/all";

let countries = []; 

// Davlatlarni yuklash
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
                        <button class="btn btn-primary">More</button>
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

fetchCountries();
