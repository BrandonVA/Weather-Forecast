$(document).ready(function() {
  
    // Adding all cities stored on the local storage cities araray 
    const addCities = () => {
        $('ul').empty();
        

        let listOfCities = localStorage.getItem('citiesArray');
        listOfCities = JSON.parse(listOfCities);

        // loops through array gets an li for each one.
        listOfCities.forEach(city => {
            let listItemEl = $('<li>');
            listItemEl.addClass('list-group-item').text(city)
            $('ul').append(listItemEl);
        })
    }

    //----------------------------LOGIC FOR CONVERTING TEMPS-----------------------------------
    // Change temp top from k to f 
    const convertFromKelvin = temp => {
       return Math.round(((temp-273.15)*1.8 )+32);
    }
    // converst temp to celcius
    const convertTempToC = temp => {
        return Math.round( (temp - 32) * 5/9  );
    }
    const convertTempToF = temp => {
        return Math.round((temp * 9/5) + 32 );
    }
    // Only return numbers in a string
    const testStringForNumber = string => {
        string = string.trim().split('');
        let number = []
        // loop through each character
        string.forEach(char => {
            // if the charectar is a number
            if ( !isNaN(char) ){
                // add to number array
                number.push(char)
            }
        })
        // join the numbers into on sring than convert to an interger
        number = parseInt( number.join('') )
        // check value
        return number;
    }
    //-------------------------------------------------------------------------------

    ///////////////////////////////////////////////////////////////////////////////
    //-------------Function to convert temp to celcius vs fahrenheit and vise versa 
    const convertTemp = (event) => {

        // Change text of button element
        if (event.target.innerText === 'Convert to C') {
            event.target.innerText = 'Convert to F';
        } else if (event.target.innerText = 'Convert to F') {
            event.target.innerText = 'Convert to C'
        }

        // get required data to handel changing the temp
        let typeofTemp = $('p #current-temp').data('temp');
        let currentDayTempText = $('span[data-temp]').html();
        let currentDayTempToConvert = testStringForNumber(currentDayTempText);
        let currentTempConverted = '';

        // check value of the data attr and change if releative to value 
        if (typeofTemp === 'f') {
            $('#current-temp').data('temp', "c");
            currentTempConverted = convertTempToC(currentDayTempToConvert);
            $('span[data-temp]').html(currentTempConverted + '&#8451;' );
        } else {
            $('#current-temp').data('temp', "f");
            currentTempConverted = convertTempToF(currentDayTempToConvert);
            $('span[data-temp]').html(currentTempConverted + '&#8457;');
        }

        // same as above just loops through each item and changing the value.
        $('div p[data-temp]').each(function(element) {
    
            let currentTempUnits = $(this).data('temp');
            let tempText = $(this).html();
            let tempToConvert = testStringForNumber(tempText);
            let tempConverted = '';

            if (currentTempUnits === 'f' ) {
                $(this).data('temp', 'c')
                tempConverted = convertTempToC(tempToConvert);
                $(this).html('Temp: ' + tempConverted + '&#8451;');
            } else {
                $(this).data('temp','f')
                tempConverted = convertTempToF(tempToConvert);
                $(this).html('Temp: '+ tempConverted + '&#8457;')
            }
        })

    }

    
    


    ///////////////////////////////////////////////////////////////////////////////
    //------Getting data from list items
    const addActiveCity = (event) => {
        event.preventDefault();
        let selectedCity = event.target.innerText
        getWeather(selectedCity);

        // getting value of the array of cities stored
        let testLocalArray = localStorage.getItem('citiesArray');
        testLocalArray = JSON.parse(testLocalArray);

        // setting the display weather local object to the clicked on city.
        let weatherToDisply = localStorage.getItem('displayWeather');
        weatherToDisply = JSON.parse(weatherToDisply);
        // Updating the local storage object with the stringified value of the cities object
        weatherToDisply = JSON.stringify(weatherToDisply);
        localStorage.setItem('displayWeather', weatherToDisply);

    }


    // Function to return all words in a sentence with the fist letter capitalized
    const capitalizeCity = city => {
        
        city = city.trim().split(' ');
        let cityCaped = [];

        city.forEach(item => {
            item = item[0].toUpperCase() + item.slice(1);
            cityCaped.push(item)
        }) 

        cityCaped = cityCaped.join(' ');
        return cityCaped;
    }

    ///////////////////////////////////////////////////////////////////////////////
    // ----Adding new citys
    const creatCityItem = (event) => {
        event.preventDefault();

        // Getting value of the city inpu
        let newCityText = $('#city-input').val();
        newCityText = capitalizeCity(newCityText)

        // storing array of cities from the local storage array
        let testCity = localStorage.getItem('citiesArray')
        testCity = JSON.parse( testCity );
        
        // creating a test var 
        let testCase = true;

        //  if the city you inputed already exists dont add it to the list
        for (let i = 0; i < testCity.length; i++) {
            if (newCityText === testCity[i]) {
                alert('please select a new city this city is already active');
                testCase = false;
            } 
        }
        // if test case remains true create a new city element and get the weather for that city
        if (testCase) {
            getWeather(newCityText);
        }
        
    }

    ///////////////////////////////////////////////////////////////////////////
    //------------Function to handle getting all the cities data
    const getWeather = city => {
       
        // creating vars to store all the data needed for an api call
        let apiCity = `q=${city}`
        const url = 'https://api.openweathermap.org/data/2.5/forecast?' 
        const apiKey = '&appid=d8730e114dc8b472804de4c9ab0ed1da';
        let endpoint = `${url}${apiCity}${apiKey}&units=imperial`;

        let newCityData = {};
        let cityLat;
        let cityLon;
        let cityName = '?';


        // making the api call 
        $.ajax({
            url: endpoint,
            method: 'GET'
        }).then(function(response){

            cityName = response.city.name

            // storing lat and long for uv index call
            cityLat = response.city.coord.lat;
            cityLon = response.city.coord.lon;

        })
        // when the ajax call is complete 
        .then( () => {
            //////////////////////////////////////////////////////////////////////////////////////////////////////
            let exclued = 'minutely,hourly,alerts'
            let secondApi = 'd8730e114dc8b472804de4c9ab0ed1da'
        
            let oneCallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=${exclued}&appid=${secondApi}`
            $.ajax({
                url: oneCallAPI,
                method: 'GET'
            }).then(oneCallresponse => {
                
                // Setting of newCityData to the values of the object i wamt to use 
                newCityData = {
                    currentDay: {
                        name: cityName,
                        date: moment().format('L'),
                        icon: oneCallresponse.current.weather[0].icon,
                        temp: convertFromKelvin(oneCallresponse.current.temp) ,
                        humidity: oneCallresponse.current.humidity,
                        windSpeed: Math.round( (oneCallresponse.current.wind_speed * 2.237) * 10 ) / 10,
                        uvIndex: oneCallresponse.current.uvi

                    },
                    followingDays: [

                        {
                            date: moment().add(1, 'days').format('MMM Do YY'),
                            icon: oneCallresponse.daily[0].weather[0].icon,
                            temp:  convertFromKelvin(oneCallresponse.daily[0].temp.day),
                            humidity: oneCallresponse.daily[0].humidity
                        },
                        {
                            date: moment().add(2, 'days').format('MMM Do YY'),
                            icon: oneCallresponse.daily[1].weather[0].icon,
                            temp: convertFromKelvin(oneCallresponse.daily[1].temp.day),
                            humidity: oneCallresponse.daily[1].humidity
                        },
                        {
                            date: moment().add(3, 'days').format('MMM Do YY'),
                            icon: oneCallresponse.daily[2].weather[0].icon,
                            temp: convertFromKelvin(oneCallresponse.daily[2].temp.day),
                            humidity: oneCallresponse.daily[2].humidity
                        },
                        {
                            date: moment().add(4, 'days').format('MMM Do YY'),
                            icon: oneCallresponse.daily[3].weather[0].icon,
                            temp: convertFromKelvin(oneCallresponse.daily[3].temp.day),
                            humidity: oneCallresponse.daily[3].humidity
                        },
                        {
                            date: moment().add(5, 'days').format('MMM Do YY'),
                            icon: oneCallresponse.daily[4].weather[0].icon,
                            temp: convertFromKelvin(oneCallresponse.daily[4].temp.day),
                            humidity: oneCallresponse.daily[4].humidity
                        }
                    ]
                }
            }).then(()=> {
                // setting the display weather local object to the clicked on city.
                let currentWeatherObj = localStorage.getItem('displayWeather');
                currentWeatherObj = JSON.parse(currentWeatherObj);
                currentWeatherObj = newCityData;
                localStorage.setItem('displayWeather', JSON.stringify(currentWeatherObj))


                let old_listOfCities = JSON.parse(localStorage.getItem('citiesArray'))
                let checkCity = true;

                old_listOfCities.forEach(index => {
                    if (index === cityName) {
                        checkCity = false;
                    }
                })
                if (checkCity) {
                    old_listOfCities.push(cityName)
                }

                localStorage.setItem('citiesArray', JSON.stringify(old_listOfCities) )
                updateWeather();
            
            }).then(() => {

                // Updates uvi elements background color
                let uviToCheck = $('#current-uv').text()
                uviToCheck = parseFloat(uviToCheck)
                updateUVI(uviToCheck)
                addCities()
                $('.weather-conatiner').css('display', 'block')
                
                
            })
            //------------------------------------------------------------------------------------------------
        })
        $('#changeTemp').text('Convert to C')
        $('#current-temp').data('temp', "f");
    }
    const updateWeather = () => {

        // function to handle updating the dom with the currently active city storeage in the dispay weather local storage object
        let testDisplayWeather = localStorage.getItem('displayWeather');
        testDisplayWeather = JSON.parse(testDisplayWeather);
    
        let date = testDisplayWeather.currentDay.date
        let currentDayIcon = testDisplayWeather.currentDay.icon;
    
        let iconUrl = `https://openweathermap.org/img/wn/${ currentDayIcon }@2x.png`
        
        
        $('#current-city').text(testDisplayWeather.currentDay.name + ' ' + date);
        $('#current-city-icon').attr('src', iconUrl);
        $('#current-temp').attr('data-temp','f').html(testDisplayWeather.currentDay.temp + '&#8457;'); 
        $('#current-humidity').text(testDisplayWeather.currentDay.humidity + '%');
        $('#current-wind').text(testDisplayWeather.currentDay.windSpeed + ' mph');
        $('#current-uv').text(testDisplayWeather.currentDay.uvIndex);
    
        testDisplayWeather.followingDays.forEach((day,index) => {
            let divEl = $(`div[data-day="${index}"]`);
            let followingIconUrl = `https://openweathermap.org/img/wn/${ day.icon }@2x.png`
    
            let h5El = $('<h5>').text(day.date);
            let followingDaysIconEl = $('<img>').attr({
                src: followingIconUrl,
                alt: 'weather icon'
            });
            let paragraphTempEl = $('<p>').attr('data-temp','f').html(`Temp: ${day.temp}&#8457;`);
            let paragraphHumidityEl = $('<p>').text(`Hum: ${day.humidity}%`);
    
            divEl.empty();
            divEl.append(h5El,followingDaysIconEl,paragraphTempEl,paragraphHumidityEl)
        })
        //                -----------------------------------------------------------   $('#changeTemp').text('Convert to C').data('temp', 'f')
    }

    const updateUVI = uvi => {
        let uviEl = $('#current-uv');
        let bgColor;
        if (uvi <= 2) {
            bgColor = 'bg-success text-white p-1 rounded'
        }else if (uvi <= 5) {
            bgColor = 'bg-warning text-dark p-1 rounded'
        } else if (uvi < 8 && uvi > 5) {
            bgColor = 'bg-orange text-dark p-1 rounded'
        } else if ( uvi <= 10 && uvi > 8) {
            bgColor = 'bg-danger text-white p-1 rounded';
        } else if ( uvi > 10) {
            bgColor = 'bg-extreme text-white p-1 rounded'
        }

        uviEl.removeClass()
        uviEl.addClass(bgColor);
    }

    if (localStorage.getItem('citiesArray') === null ) {
        localStorage.setItem('citiesArray', '[]');
        // $('.weather-conatiner').css('display', 'none')
    } else {
        let cityArray = JSON.parse(localStorage.getItem('citiesArray'))
        let city = cityArray.slice(-1)
        console.log(city.length);
        if (city.length > 0) {
            getWeather(city);
        }
        

    }

    if (localStorage.getItem('displayWeather') === null ) {
        localStorage.setItem('displayWeather', "{}");
    }
    //-------------- change back after graded so 
    // else {
    //     let weatherObj = localStorage.getItem('displayWeather')
    //     weatherObj = JSON.parse(weatherObj)
    //     let city = weatherObj.currentDay.name
    //     getWeather(city);
    // }


    // Function calls on events
    $('ul').on('click', 'li', addActiveCity)
    $('#searchCity').on('click', creatCityItem)
    addCities();
    $('#changeTemp').on('click', convertTemp)


















})