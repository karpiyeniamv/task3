ymaps.ready(init);

var myMap, myPlacemark, myCollection;

countOfCities = cities.length;
currentIndexHuman = 0;
currentIndexComp = 0;

playArrayHuman = new Array();

playArrayComp = new Array();

var startFlag=true;
var tempCharComp = '';

$(document).keypress(function (e) {
    if (e.which == 13 || event.keyCode == 13) {
        onBtnFunction();
    }
});


function init(){

    myMap = new ymaps.Map ("map", {
        center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
        zoom: 4
    });
    myMap.controls.add('zoomControl', {right : '10px'});
    myCollection = new ymaps.GeoObjectCollection();
}

function pasteCitiesOnMap( hCity, cCity) {

    var humanGeocoder = ymaps.geocode(hCity);
    var compGeocoder = ymaps.geocode(cCity);

    humanGeocoder.then(
        function (res) {
            myPlacemark = new ymaps.Placemark(res.geoObjects.get(0).geometry.getCoordinates(), { content: hCity, balloonContent: hCity},{ preset: 'twirl#darkgreenDotIcon' });
            myCollection.add (myPlacemark);
            myMap.geoObjects.add(myCollection);
        },
        function (err) {
            alert('Ошибка');
        }
    );

    compGeocoder.then(
        function (res) {
            if (cCity!=' '){
                myPlacemark = new ymaps.Placemark(res.geoObjects.get(0).geometry.getCoordinates(), { content: cCity, balloonContent: cCity},{ preset: 'twirl#violetDotIcon' });
                myCollection.add (myPlacemark);
                myMap.geoObjects.add(myCollection);
            }
        },
        function (err) {
            alert('Ошибка');
        }
    );
}

function searchCity (lastCharH) {
    for (var i=0;i<countOfCities;i++)
    {
        if ( cities[i][0].toLowerCase() == lastCharH )
        {
            if (isNotRepeat (cities[i]))
            {
                var oldA =  document.getElementById("blink2");
                var tempA = document.createElement("a");
                tempA.id = "blink2";
                var l = cities[i].length;
                tempCharComp =  cities[i][l-1];
                if (tempCharComp == 'ь' || tempCharComp == 'ъ' || tempCharComp == 'ы' || tempCharComp == 'й')
                    tempCharComp =  cities[i][l-2];
                tempA.innerText = "Ваш город должен начинаться на букву " + tempCharComp.toUpperCase();
                if (currentIndexHuman==1)
                {
                    document.getElementById("divWithBlink").appendChild(tempA);
                }
                else {
                    document.getElementById("divWithBlink").replaceChild(tempA,oldA);
                }
                document.getElementById("humanCity").value= '';
                return cities[i];
            }
        }
    }
    isFinished(1);
    return ' ';
}

function isNotRepeat (city) {

    for ( var i=0;i<currentIndexHuman;i++){
        var temp = playArrayHuman[i].toLowerCase();
        if (temp.localeCompare(city.toLowerCase())==0) {
            return false;
        }
    }
    for (var  i=0;i<currentIndexComp;i++){
        var temp = playArrayComp[i].toLowerCase();
        if (temp.localeCompare(city.toLowerCase())==0) {
            return false;
        }
    }
    return true;
}

function isCity(hCity) {
    flagV = false;
    var promise = new Promise(function(resolve, reject) {
        var myTestGeocoder = ymaps.geocode(hCity);
        myTestGeocoder.then(
            function (res) {
                if (res.geoObjects.get(0) != null) {
                    var citytemp = res.geoObjects.get(0).properties.get('name');
                    flagV = ((hCity.toLowerCase().localeCompare(citytemp.toLowerCase())) == 0);

                    if (flagV)
                    {
                        console.log("город на карте и введенный пользователем полностью совпали");
                    }
                    else {
                        console.log("город на карте и введенный пользователем не совпадают");
                    }
                    resolve(flagV);
                }
                else {
                    console.log ("такого города нет");
                    resolve(flagV);
                }
            }
            ,
            function (err) {
                console.log("ошибка");
                reject (err);
            }
        );

    });

    promise.then (function (flagV) {
        promiseThen(flagV, hCity);
    }, function (err) {
        console.log(err);
    })
}

function promiseThen (flagV, hCity) {

    if (flagV !== true)
    {
        console.log (flagV);
        //console.log (isCity(hCity));
        document.getElementById("absent").removeAttribute('style');
        document.getElementById("humanCity").value='';
    }
    else

    {
        console.log ("tempCharComp "+tempCharComp);
        if (startFlag == false && hCity[0].toUpperCase() != tempCharComp.toUpperCase() )
        {
            document.getElementById("incorrect").removeAttribute('style');
            document.getElementById("humanCity").value='';
        }
        else
        {
            playArrayHuman[currentIndexHuman]=hCity;
            currentIndexHuman++;
            addRowToTable(1,hCity);
            var tempChar = hCity[hCity.length-1];
            if (tempChar == 'ь' || tempChar == 'ъ' || tempChar == 'ы' || tempChar == 'й')
                tempChar = hCity[hCity.length-2];
            var cCity=searchCity(tempChar);
            addRowToTable(2,cCity);
            playArrayComp[currentIndexComp]=cCity;
            currentIndexComp++;
            document.getElementById("compCity").value=cCity;
            pasteCitiesOnMap( hCity, cCity);
            startFlag=false;
        }
    }
}

function isFinished (param) {

    var table = document.getElementById('tableId');
    var copyTBody =  table.cloneNode(true);
    var row = copyTBody.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.className='resRow';
    cell2.className='resRow';
    cell1.innerHTML = playArrayHuman.length;
    cell2.innerHTML = playArrayComp.length;
    if (param==1)
    {
        document.getElementById('winH').removeAttribute('style');
        document.getElementById("tableWinH").appendChild(copyTBody);
    }

    if (param==2)
    {
        document.getElementById('winC').removeAttribute('style');
        document.getElementById("tableWinC").appendChild(copyTBody);
    }
}

function addRowToTable (num, city) {
    var table = document.getElementById('tableId');
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    if (num==1){
        cell1.innerHTML = city;
        cell2.innerHTML = " ";
    }
    if (num==2){
        cell1.innerHTML = " ";
        cell2.innerHTML = city;
    }
}

function onBtnFunction () {

    var hCity= document.getElementById("humanCity").value;

    if ( !isNotRepeat (hCity)){
        document.getElementById('repeat').removeAttribute('style');
        document.getElementById("humanCity").value='';
        return 0;
    }
    else
    {
        isCity(hCity);
    }

}

function onInput (){

    function startRecognizer() {
        if ('webkitSpeechRecognition' in window) {
            var recognition = new webkitSpeechRecognition();
            recognition.lang = 'ru';
            recognition.onresult = function (event) {
                var result = event.results[event.resultIndex];
                console.clear();
                var hCity = result[0].transcript;
                console.log(hCity);
                document.getElementById("inputId").value = hCity;
            };
            recognition.onend = function () {
                console.log('Распознавание завершилось.');
            };
            recognition.start();
        } else alert('webkitSpeechRecognition не поддерживается :(')
    }
    startRecognizer();
}

