function getWeather() {
    let apiKey = 'e6dfd918c685c8022ca0666f1c5af0c6'
    let url = `http://api.openweathermap.org/data/2.5/weather?q=London&units=imperial&APPID=e6dfd918c685c8022ca0666f1c5af0c6`
    fetch(url, {
        method: "GET"
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data.name);
        })
};
