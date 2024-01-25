let url = "https://webtech.labs.vu.nl/api24/8a3616ba";
let gallery = document.getElementById('gallery');
let filterBox = document.getElementById('filter-box');

//These arrays contain the currently stored data in the website at any given time.
let arrayOfIds = [];
let arrayOfYears = [];
let arrayOfNames = [];
let arrayOfGenres = [];

//This function fills the box with years with content.
async function populateFilterBox() {

    let yearRequest = await fetch(url);
    var yearArray = [];
    let duplicate = 0;

    let rawJson = await yearRequest.json();
    let jsonString = JSON.stringify(rawJson);
    let objectJSON = JSON.parse(jsonString);

    objectJSON.forEach(item => {

        for (let i = 0; i < yearArray.length; i++) {

            if (yearArray[i] == item.year) {

                duplicate++;
            }
        }
//This if branch checks for duplicate years and gets rid of them.
        if (duplicate == 0) {

            yearArray.push(item.year);

            let button = document.createElement('button');
            button.setAttribute('id', item.year);
            button.style.marginRight = "5px";
            button.textContent = item.year;

            arrayOfYears.push(item.year);

            button.addEventListener('click', () => filterGalleryByYear(item.year));

            filterBox.appendChild(button);
        }

        duplicate = 0;

    });
}
//This function unclicks the currently clicked button.
async function clearAllButtons() {

    document.getElementById('search').value = ""

    for (let i = 0; i < arrayOfYears.length; i++) {

        var property = document.getElementById(arrayOfYears[i]);

        property.style.border = "outset";
        property.style.backgroundColor = "#E8E8EC";
    }
}
//This function clicks the currently picked year.
async function clickedButton(year) {

    document.getElementById('search').value = ""

    var property = document.getElementById(year);

    property.style.border = "inset";
    property.style.backgroundColor = "#7E7E7E";

}
//This function filters the gallery accordingly to the clicked button.
async function filterGalleryByYear(year) {

    clearTableBody();

    let yearRequest = await fetch(url);

    let rawJson = await yearRequest.json();
    let jsonString = JSON.stringify(rawJson);
    let yearsObject = JSON.parse(jsonString);

    if (document.getElementById(year).style.border == "inset") {

        clearAllButtons();

        yearsObject.forEach(item => {
            appendItems(item);
        });

    } else {

        clearAllButtons()

        clickedButton(year);

        yearsObject.forEach(item => {
            if (item.year == year) {
                appendItems(item);
            }
        });

    }
}
//This functions refreshes in real time the box with years.
async function clearFilterBox() {

    let oldFilterBox = document.getElementById('filter-box');
    let newFilterBox = document.createElement('div');

    oldFilterBox.parentNode.replaceChild(newFilterBox, oldFilterBox);

    newFilterBox.id = "filter-box";

    filterBox = document.getElementById('filter-box');
}
//This function refreshes in real time the gallery with images.
async function clearTableBody() {

    const oldTable = document.getElementById('gallery');
    const newTable = document.createElement('tbody');

    oldTable.parentNode.replaceChild(newTable, oldTable);
    newTable.id = "gallery";

    gallery = document.getElementById('gallery');
}
//This function fetches the data from the database and appends it in the gallery.
async function fetchDataAndAppend() {
    fetch('https://webtech.labs.vu.nl/api24/8a3616ba')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => appendItems(item));

        })
        .catch(error => console.error('Fatal error, code: ', error));
}
//This function updates the DOM of the HTML webpage with items from the database.
async function appendItems(item) {

    arrayOfNames.push(item.name);
    arrayOfGenres.push(item.genre);
    arrayOfIds.push(item.id);

    let imageElement = document.createElement('img');
    imageElement.src = item.poster;
    imageElement.alt = item.name;

    let imageSrc = item.poster;

    try {
        const response = await fetch(imageSrc);

        if (response.ok) {

            const blob = await response.blob();
            const objectURL = URL.createObjectURL(blob);
            imageElement.src = objectURL;

        } else {

            throw new Error(`Image not loading`);
        }
    } catch (error) {

        imageElement.src = 'fallback-image-url.jpg';
        imageElement.alt = "Poster for movie: " + item.name + " (Failed to load)";
    }
//This section updats the DOM of the HTML website.
    const idCell = document.createElement('td');
    const nameCell = document.createElement('td');
    const posterCell = document.createElement('td');
    const genreCell = document.createElement('td');
    const yearCell = document.createElement('td');
    const descriptionCell = document.createElement('td');

    idCell.textContent = item.id;
    nameCell.textContent = item.name;
    genreCell.textContent = item.genre;
    yearCell.textContent = item.year;
    descriptionCell.textContent = item.description;
    posterCell.innerHTML = `<td><img src="${imageElement.src}" alt="${imageElement.alt}"></td>`;

    idCell.style.fontWeight = "bold";

    const rowElement = document.createElement('tr');

    rowElement.appendChild(idCell);
    rowElement.appendChild(nameCell);
    rowElement.appendChild(posterCell);
    rowElement.appendChild(genreCell);
    rowElement.appendChild(yearCell);
    rowElement.appendChild(descriptionCell);

    gallery.appendChild(rowElement);
}
//This functions find in real time the items that contain the substring of the search bar input.
async function findItem(itemName) {

    let arrayOfChoiceOfMovie = []
    let arrayToFilter = [];
    let arrayOfChoiceOfGenre = [];
    let arrayOfChoice = [];
    let addedGenres = [];

    let movieName = itemName.toLowerCase();

    let currentDataResponse = await fetch("https://webtech.labs.vu.nl/api24/8a3616ba");
    let currentData = await currentDataResponse.json();

    arrayOfChoiceOfGenre = currentData.filter(item => item.genre.toLowerCase().includes(movieName));
    arrayOfChoiceOfMovie = currentData.filter(item => item.name.toLowerCase().includes(movieName));


    for (let k = 0; k < arrayOfChoiceOfGenre.length; k++) {
        if (!addedGenres.includes(arrayOfChoiceOfGenre[k].genre)) {
            arrayOfChoice.push(arrayOfChoiceOfGenre[k]);
            addedGenres.push(arrayOfChoiceOfGenre[k].genre);
        }
    }

    for (let i = 0; i < arrayOfChoiceOfMovie.length; i++) {
        if (!addedGenres.includes(arrayOfChoiceOfMovie[i].genre)) {
            arrayOfChoice.push(arrayOfChoiceOfMovie[i]);
            addedGenres.push(arrayOfChoiceOfMovie[i].genre);
        }
    }

    for (let i = 0; i < arrayOfYears.length; i++) {
        if (document.getElementById(arrayOfYears[i]).style.border == "inset") {
            arrayToFilter.push(arrayOfYears[i]);
        }
    }

    clearTableBody()

    if (arrayToFilter.length != 0) {

        for (let i = 0; i < arrayOfChoice.length; i++) {
            if (arrayOfChoice[i].year == arrayToFilter[0])
                appendItems(arrayOfChoice[i]);
        }
    } else {
        for (let i = 0; i < arrayOfChoice.length; i++) {
            appendItems(arrayOfChoice[i]);
        }
    }
}
//This functions validates the URL provided by the client in the form.
function isValidUrl(string) {
    const regex = /(https?:\/\/.*\.(?:png|jpg))/i;
    return regex.test(string);
}
//This function is error - handling and validating all client input in the form.
function formValidation() {

    let form = document.getElementById('form');
    if(form.elements['poster'].value!=''){
        if (!isValidUrl(form.elements['poster'].value)) {
            alert("Input correct URl");
            return false;

        }
    }
    if(form.elements['id'].value!=''){
        if (isNaN(form.elements['id'].value)) {
            alert(`Input correct ID`);
            return false;
        }
    }
    if(form.elements['year'].value!=''){
        if (form.elements['year'].value > 2024 || form.elements['year'].value < 1888  || isNaN(form.elements['year'].value)) {
            alert(`Input correct year`);
            return false;
        }
    }
    return true;
}
//This function loads the website upon entering the HTML.
document.addEventListener('DOMContentLoaded', async function () {
    populateFilterBox();
    fetchDataAndAppend();
});
//This function listens to the submit button and sends the form data to the server.
document.getElementById('form').addEventListener('submit', async function (event) {

    event.preventDefault();

    let form = document.getElementById('form');

    if (!formValidation()) {
        return;
    }

    document.getElementById('id').value = "";

    let array = ['poster', 'name', 'genre', 'year', 'description'];
    let newArray = {};

    for (let i = 0; i < array.length; i++) {
        if (form.elements[array[i]].value !== "") {
            newArray[array[i]] = form.elements[array[i]].value;
        } else {
            newArray[array[i]] = "User didn't specify";
        }
    }

    let formData = {
        poster: newArray['poster'],
        name: newArray['name'],
        genre: newArray['genre'],
        year: newArray['year'],
        description: newArray['description'],
    };

    let postRequest = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { "content-type": "application/json" },
    })

    clearFilterBox();
    populateFilterBox();
    clearTableBody()
    fetchDataAndAppend();

});
//This function resets the server content and restores the website afterwards.
document.getElementById('resetButton').addEventListener('click', async function () {

    let resetUrl = `https://webtech.labs.vu.nl/api24/8a3616ba/reset`;

    let resetResponse = await fetch(resetUrl, {
        method: 'GET'
    });

    if (resetResponse.ok) {

        clearFilterBox();
        populateFilterBox();
        clearTableBody();
        fetchDataAndAppend();

    } else {
        console.log('Failed to reset database. HTTP error:', resetResponse.status);
    }

});
//This function listens to the update button and call the function that updated the server and website.
document.getElementById('updateButton').addEventListener('click', async function (event) {

    const movieId = document.getElementById('id').value;

    if (!formValidation()) {
        return;
    }

    let currentDataResponse = await fetch("https://webtech.labs.vu.nl/api24/8a3616ba");
    let currentData = await currentDataResponse.json();

    let itemToUpdate = currentData.find(item => item.id == movieId);

    if (!itemToUpdate) {
        alert(`Movie with id "${movieId}" not found`);
        return;
    }

    let form = document.getElementById('form');

    let array = ['poster', 'name', 'genre', 'year', 'description'];
    let newArray = {};

    for (let i = 0; i < array.length; i++) {
        if (form.elements[array[i]].value !== "") {
            newArray[array[i]] = form.elements[array[i]].value;
        } else {
            newArray[array[i]] = itemToUpdate[array[i]];
        }
    }

    let formData = {
        poster: newArray['poster'],
        name: newArray['name'],
        genre: newArray['genre'],
        year: newArray['year'],
        description: newArray['description'],
    };

    let updateUrl = `https://webtech.labs.vu.nl/api24/8a3616ba/item/${itemToUpdate.id}`;

    let updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    if (updateResponse.ok) {

        clearTableBody();
        clearFilterBox();
        populateFilterBox();
        fetchDataAndAppend();

    } else {
        console.log('Failed to update item');
    }
});
//This function checks the user input in the search bar in real time for input. 
document.getElementById('search').addEventListener('input', function (event) {
    let property = event.target.value.trim()
    findItem(property);

});
