var searchTextBox = $('#searchText')
const searchButton = $('#searchButton')
const localStorageButtons = $('.localStorageButtons')

function populateCurrentWeather(data) {
    // update the heading element
    let heading = $('.currentWeatherTitle')
    heading.text(data.name + ':')

    // update the date element
    let date = $('.currentWeatherDate')
    date.text(dayjs().format('dddd, MMMM D'))

    // create icon element
    let icon = $('.currentWeatherIcon')
    let imgUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    icon.attr('src', imgUrl)
}

function addToLocalStorage(city) {
    // add city to local storage
    var cities = JSON.parse(localStorage.getItem('cities'))
    // console.log(typeof cities)
    if (cities) {
        // check for duplicate
        // had to make this messy duplicate check code because its not an actual array its an object so I am unable to use .includes()
        let duplicate = false
        cities.forEach(cityInArray => {
            if (cityInArray === city) {
                duplicate = true;
            };
        });
        if (duplicate) {
            return
        } else {
            cities.push(city)
            localStorage.setItem('cities', JSON.stringify(cities))
        }
    } else {
        let cityArray = [city]
        localStorage.setItem('cities', JSON.stringify(cityArray))
    };
};

// get local storage buttons and add them to the DOM
function loadLocalStorage() {
    localStorageButtons.empty()
    let cities = localStorage.getItem('cities')
    if (cities) {
        cities = JSON.parse(cities)
        cities.forEach(city => {
            let btn = $('<button>')
            btn.text(city)
            btn.attr('onclick', '')
            localStorageButtons.append(btn)
        });
    };
};

function getWeather(city) {
    // call the weather API
    let apiKey = 'e6dfd918c685c8022ca0666f1c5af0c6'
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${apiKey}`
    fetch(url, {
        method: "GET"
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            populateCurrentWeather(data)
        })
};

// search button
searchButton.on('click', function () {
    let city = searchTextBox.val()
    // check for a blank text box
    if (city) {
        addToLocalStorage(city)
        getWeather(city)
        loadLocalStorage()
    }
})



loadLocalStorage()