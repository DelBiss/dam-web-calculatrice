import Calulatrice from "./calculatrice.js";

function logKey(e) {

    if (e.key.length > 1) {
        doInput(String.fromCharCode(e.keyCode))
    } else {
        doInput(e.key)
    }
}
var myCalcul = new Calulatrice()
document.onkeydown = logKey;

function doInput(val) {
    try {
        myCalcul.OnInput(val)
        Refresh()
    } catch (error) {
        myCalcul = new Calulatrice()
        document.getElementById("Display").value = "#ERROR#";
        console.log("#ERROR#")
        console.log(error)
    }
}

function Delete() {
    myCalcul.OnInput(String.fromCharCode(8))
    Refresh()
}

function Clear() {
    myCalcul.Clear()
    Refresh()
}

function Refresh() {
    // document.getElementById("Display").value = myCalcul.state.name + " -> " + myCalcul.displayStr;
    document.getElementById("Display").value = myCalcul.displayStr;
    document.getElementById("Current").value = myCalcul.currentStr;
}


function TestMeteo() {
    let requestURL = 'https://api.weatherapi.com/v1/current.json?key=f111c71466e14bca870155327210212%20&q=Montreal&aqi=no&lang=fr';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        const superHeroes = request.response;
        // populateHeader(superHeroes);
        PopulateMeteo(superHeroes);
    }

}



function PopulateMeteo(jsonObj) {
    var section = document.getElementById('meteo');
    var myArticle = document.createElement('article');
    myArticle.className = "MeteoItem";

    // ===============================
    var location = document.createElement('section');
    location.className = "location";

    var ville = document.createElement("p");
    var province = document.createElement("p");

    ville.className = "ville";
    province.className = "province";

    ville.textContent = jsonObj.location.name;
    province.textContent = jsonObj.location.region;

    location.appendChild(ville);
    location.appendChild(province);

    // ===============================
    var condition = document.createElement('section');
    condition.className = "condition";

    var img = document.createElement('img');

    img.src = "https:" + jsonObj.current.condition.icon;
    img.alt = jsonObj.current.condition.text;
    img.title = jsonObj.current.condition.text;

    // ------------------------------
    var condition_text = document.createElement('section');
    condition_text.className = "condition_text";

    // ------------------------------
    var temperature = document.createElement('section');
    temperature.className = "temperature";

    var courant = document.createElement("p");
    var resenti = document.createElement("p");

    courant.className = "courant";
    resenti.className = "resenti";

    courant.textContent = jsonObj.current.temp_c;
    resenti.textContent = jsonObj.current.feelslike_c;

    temperature.appendChild(courant);
    temperature.appendChild(resenti);
    condition_text.appendChild(temperature);
    // ------------------------------
    var textuelle = document.createElement("p");

    textuelle.className = "textuelle";

    textuelle.textContent = jsonObj.current.condition.text;

    condition_text.appendChild(textuelle);
    // ------------------------------
    condition.appendChild(img);
    condition.appendChild(condition_text);

    // ===============================
    myArticle.appendChild(location)
    myArticle.appendChild(condition)

    section.appendChild(myArticle);

}

function ToggleMeteo() {
    var section = document.getElementById('meteo');
    section.classList.toggle("open");
}

function ToggleXkey() {
    var section = document.getElementById('XKey');
    section.classList.toggle("open");
}

TestMeteo()
Refresh()
window.Input = doInput
window.Clear = Clear
window.Delete = Delete
window.ToggleMeteo = ToggleMeteo
window.ToggleXkey = ToggleXkey