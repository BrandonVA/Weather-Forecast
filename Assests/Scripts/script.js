$(document).ready(function() {
    console.log('jquery!!!')



const addActiveCity = (event) => {
    event.preventDefault();
    let testThis = event.target.innerText
    console.log(testThis);
}

const creatCityItem = (event) => {
    event.preventDefault();
    let newCityIemEl = $('<li>');
    let newCityText = $('#city-input').val();


    newCityIemEl.addClass('list-group-item')
    .text(newCityText);
    $('.list-group').append(newCityIemEl);

}



$('li').on('click', addActiveCity)
$('#searchCity').on('click', creatCityItem)





















})