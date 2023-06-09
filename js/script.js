var searchTextBox = $('#searchText')
const searchButton = $('#searchButton')
const localStorageButtons = $('.localStorageButtons')


function populateFiveDayForecast(indexes, weatherList) {
    // foreach card add the correct data

    // get the jquery object of cards
    weatherCards = $('.oneDayWeather')

    indexes.forEach((index, i) => {
        // get individual card in jquery
        let card = $(weatherCards[i])

        // create date h2
        let date = $('<h2>')
        date.text(dayjs(weatherList[index].dt_txt).format(`dddd, MMMM D`))
        card.append(date)

        // create img icon
        let icon = $('<img>')
        let url = `https://openweathermap.org/img/wn/${weatherList[index].weather[0].icon}@2x.png`
        icon.attr('src', url)
        card.append(icon)

        // create temp

        // create wind

        // create humidity 
    });
};

function getFiveDayIndex(data) {
    // check for the date in the api response and compare it to todays date plus one day,
    // I continue checking until I have all the index that corespond with the next day in the api response

    // 3 hour interval list of weather conditions
    let weatherList = data.list

    // 5 - day index array
    let indexes = []

    // set today - plus one day
    let dayChecker = dayjs().add(1, 'day')

    // foreach function that compares each day in the api response with today+1 until it finds a matching day and then moves onto comparing...
    // the api response with today+2 and so on
    let index = 0
    weatherList.forEach(hourInterval => {
        let weatherDate = dayjs(hourInterval.dt_txt)
        if (weatherDate.isSame(dayChecker, 'day')) {
            // put the correct index into the indexes array to be sent to another function to add data to the dom
            indexes.push(index)
            console.log(`populating from index ${index}`)
            // add another day to the check to get the next day
            dayChecker = dayChecker.add(1, 'day')
            index++;
        } else {
            index++;
        };
    });
    // send the array of indexes to the populate function
    populateFiveDayForecast(indexes, weatherList)
};


function populateCurrentWeather(data) {
    // update the heading element
    let heading = $('.currentWeatherTitle')
    heading.text(data.city.name + ':')

    // update the date element
    let date = $('.currentWeatherDate')
    date.text(dayjs().format('dddd, MMMM D'))

    // create icon element
    let icon = $('.currentWeatherIcon');
    let imgUrl = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`
    icon.attr('src', imgUrl)

    // update temperature, wind speed, and humidity
    const degree = String.fromCodePoint(176)
    const percent = String.fromCodePoint(65285)
    let temp = $('#currentWeatherTemp')
    let wind = $('#currentWeatherWind')
    let humid = $('#currentWeatherHumid')
    temp.text(`Temperature: ${Math.round(data.list[0].main.temp)}${degree} F`)
    wind.text(`Wind Speed: ${Math.round(data.list[0].wind.speed)} mph`)
    humid.text(`Humidity: ${Math.round(data.list[0].main.humidity)}${percent}`)
}

function addToLocalStorage(city) {
    // add city to local storage
    var cities = JSON.parse(localStorage.getItem('cities'))
    // console.log(typeof cities)
    if (cities) {
        // check for duplicate
        // had to make this messy duplicate-check-code because its not an actual array its an object so I am unable to use .includes()
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
        // iff cities is empty in local storage
    } else {
        let cityArray = [city]
        localStorage.setItem('cities', JSON.stringify(cityArray))
    };
};

// get local storage buttons and add them to the DOM
function loadLocalStorage() {
    localStorageButtons.empty()
    let cities = JSON.parse(localStorage.getItem('cities'))
    if (cities) {
        cities.forEach(city => {
            let btn = $('<button>')
            btn.text(city)
            btn.attr('onclick', 'getWeather("' + city + '")')
            localStorageButtons.append(btn)
        });
    };
};

function getWeather(city) {
    // call the weather API
    let apiKey = 'e6dfd918c685c8022ca0666f1c5af0c6'
    let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&APPID=${apiKey}`
    fetch(url, {
        method: "GET"
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            populateCurrentWeather(data);
            getFiveDayIndex(data);
        })
};

// search button
searchButton.on('click', function () {
    let city = searchTextBox.val()
    // check for a blank text box
    if (city) {
        searchTextBox.val('')
        addToLocalStorage(city)
        getWeather(city)
        loadLocalStorage()
    }
})

loadLocalStorage()