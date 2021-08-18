const API_KEY = '596bad11b7dca3c1194ab4f98ce0a201';
const BASE_TRANSLATE_TEXT = 'http://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t';

const city = document.querySelector(".city")
const weatherImage = document.querySelector(".weather-img")
const degree = document.querySelector(".degree")
const status = document.querySelector(".status")
const date = document.querySelector(".date")
const tocdogio = document.querySelector(".tocdogio")
const huonggio = document.querySelector(".huonggio")
const apluc = document.querySelector(".apluc")
const doam = document.querySelector(".doam")
const mactroimoc = document.querySelector(".mactroimoc")
const mactroilan = document.querySelector(".mactroilan")
const cardList = document.querySelector(".card-list")
 
window.onload = () => {
    function ajax (data) { 
        getWeatherByLocation(data)
            .then(data => {
                console.log(data)
                date.innerHTML = setCurruntTime()
                city.innerHTML = `${data.name}, ${data.sys.country}`;
                degree.innerHTML = `${data.main.temp}℃`;
                translateText(data.weather[0].description) 
                    .then(data => {
                        status.innerHTML = data;
                    })
                tocdogio.innerHTML = `${Math.floor(data.wind.speed * 10)} `
                doam.innerHTML = `${data.main.humidity}`
                huonggio.innerHTML = setHuongGio(data.wind.deg)
                apluc.innerHTML = `${data.main.feels_like}`
                mactroimoc.innerHTML = setThoiGian(data.sys.sunrise)
                mactroilan.innerHTML = setThoiGian(data.sys.sunset)
            })
    }

    function debounce (fn, delay) {
        return args => {
            clearTimeout(fn.id)

            fn.id = setTimeout(() => {
                fn.call(this, args)
            }, delay)
        }
    }
    
    const debounceAjax = debounce(ajax, 1000)

    document.querySelector('#debounce').addEventListener('keyup', e => {
        debounceAjax(e.target.value)
    })
}

setInterval(getData, 1000 * 60)

function getData(city = 'Tra Vinh, Viet Nam') {
    getWeatherByLocation(city)
    .then(data => {
        date.innerHTML = setCurruntTime()
        city.innerHTML = `${data.name}, ${data.sys.country}`;
        degree.innerHTML = `${data.main.temp}℃`;
        translateText(data.weather[0].description) 
            .then(data => {
                status.innerHTML = data;
            })
        tocdogio.innerHTML = `${Math.floor(data.wind.speed * 10)} `
        doam.innerHTML = `${data.main.humidity}`
        huonggio.innerHTML = setHuongGio(data.wind.deg)
        apluc.innerHTML = `${data.main.feels_like}`
        mactroimoc.innerHTML = setThoiGian(data.sys.sunrise)
        mactroilan.innerHTML = setThoiGian(data.sys.sunset)
    }).catch(err => {
        cardList.innerHTML = 'Có lỗi xảy ra :('
    })
}

function getWeatherByLocation(city) {
    return fetch("https://api.openweathermap.org/data/2.5/weather?q=" +
          city +
          "&units=metric&appid=" +
          API_KEY
      )
    .then((response) => response.json())
}
function setHuongGio(deg) {
    if(deg <= 315 && deg < 45)
        return 'B';
    else if(deg >= 45 && deg < 135)
        return 'Đ';
    else if(deg >= 135 && deg < 225)
        return 'N';
    else 
        return 'T'; 
}
function setThoiGian(value) {
    let date = new Date(value * 100);
    return `${date.getHours()}:${date.getMinutes()}`;
}

async function translateText(text) {
    return await fetch(`${BASE_TRANSLATE_TEXT}&q=${text}`)
        .then(response => response.json())
        .then(data => data[0][0][0]) 
}
function setCurruntTime() {
    let date = new Date();
    return `${date.getHours()}:${date.getMinutes()}, Thứ ${date.getDay() + 1}`;
}