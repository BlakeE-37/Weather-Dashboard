var searchTextBox = $('#searchText')
const searchButton = $('#searchButton')

function populateCurrentWeather(data) {
    let container = $('#currentWeather')

    // create the header element
    let heading = $('<h2>')
    heading.text(data.name)
    heading.addClass('currentWeatherTitle')
    container.append(heading)

    // create the date element
    let date = $('<h3>')
    date.text = (dayjs().format('dddd, MMMM D'))
    container.append(date)
}


function getWeather(city) {
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

searchButton.on('click', function () {
    getWeather(searchTextBox.val())
})