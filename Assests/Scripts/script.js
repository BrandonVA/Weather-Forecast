$(document).ready(function() {
    console.log('jquery!!!')

    if (localStorage.getItem('citiesArray') === null ){
        localStorage.setItem('citiesArray', '[]');
    }
    


///////////////////////////////////////////////////////////////////////////////
//------Getting data from list items
const addActiveCity = (event) => {
    event.preventDefault();
    let testThis = event.target.innerText
    console.log(testThis);
    let testLocalArray = localStorage.getItem('citiesArray');
    testLocalArray = JSON.parse(testLocalArray);
    console.log(testLocalArray);
}


///////////////////////////////////////////////////////////////////////////////
// ----Adding new citys
const creatCityItem = (event) => {
    event.preventDefault();

    let newCityIemEl = $('<li>');
    let newCityText = $('#city-input').val();

    let testCity = localStorage.getItem('citiesArray')
    testCity = JSON.parse( testCity );
    
    // testCity.forEach(element => {
    //     console.log(testCity[element]);
    //     console.log(newCityText);
    //     if (element !== newCityText) {

 
        
            
    //     }
    // });
    let testCase = true;

    for (let i = 0; i < testCity.length; i++) {
        console.log(testCity[i][0]);
        if (newCityText === testCity[i][0]) {
            alert('please select a new city this city is already active');
            testCase = false;
        } else {
            console.log('this should do the trick');

        }


    }
    if (testCase) {
        newCityIemEl.addClass('list-group-item')
        .text(newCityText);
        $('.list-group').append(newCityIemEl);
        getWeather(newCityText);
    }
}

///////////////////////////////////////////////////////////////////////////
//------------Function to handle getting all the cities data
const getWeather = city => {
    console.log(city);

    let apiCity = `q=${city}`
    const url = 'https://api.openweathermap.org/data/2.5/forecast?' 
    const apiKey = '&appid=d8730e114dc8b472804de4c9ab0ed1da';
    let endpoint = `${url}${apiCity}${apiKey}&units=imperial`;

    let newCityData = [city];
    let cityLat;
    let cityLon;

    $.ajax({
        url: endpoint,
        method: 'GET'
    }).then(function(response){
        console.log(response);
        cityLat = response.city.coord.lat;
        cityLon = response.city.coord.lon;



        newCityData.push( {
            currentDay: {
            name: response.city.name,
            date: response.list[0].dt_txt,
            icon: response.list[0].weather[0].icon,
            temp: response.list[0].main.temp,
            humidity: response.list[0].main.humidity,
            windSpeed: response.list[0].wind.speed,

            },
            followingDays: [

                {
                    date: response.list[4].dt_txt,
                    icon: response.list[4].weather[0].icon,
                    temp: response.list[4].main.temp,
                    humidity: response.list[4].main.humidity
                },
                {
                    date: response.list[13].dt_txt,
                    icon: response.list[13].weather[0].icon,
                    temp: response.list[13].main.temp,
                    humidity: response.list[13].main.humidity
                },
                {
                    date: response.list[21].dt_txt,
                    icon: response.list[21].weather[0].icon,
                    temp: response.list[21].main.temp,
                    humidity: response.list[21].main.humidity
                },
                {
                    date: response.list[29].dt_txt,
                    icon: response.list[29].weather[0].icon,
                    temp: response.list[29].main.temp,
                    humidity: response.list[29].main.humidity
                },
                {
                    date: response.list[37].dt_txt,
                    icon: response.list[37].weather[0].icon,
                    temp: response.list[37].main.temp,
                    humidity: response.list[37].main.humidity
                }
            ]
        })
        







    })
    .then( () => {
        console.log(cityLat, cityLon);

        let uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityLat}&lon=${cityLon}${apiKey}`
        $.ajax({
            url: uvUrl,
            method: 'GET'
        }).then(function(nestedResponse){

            newCityData[1].currentDay.uvIndex = nestedResponse.value
            console.log('====================final LOG =====================');

            let old_citiesArray = localStorage.getItem('citiesArray');
            old_citiesArray = JSON.parse(old_citiesArray);

          
            old_citiesArray.push(newCityData)

            let new_citiesArray = old_citiesArray;

            new_citiesArray = JSON.stringify(new_citiesArray);
            localStorage.setItem('citiesArray', new_citiesArray);
    
    
        })
    })

}



$('ul').on('click', 'li', addActiveCity)
$('#searchCity').on('click', creatCityItem)





















})