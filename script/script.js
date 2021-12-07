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
    document.getElementById("Display").value = myCalcul.displayStr;
}
window.Input = doInput
window.Clear = Clear
window.Delete = Delete

function TestMeteo() {
    let requestURL = 'http://api.weatherapi.com/v1/current.json?key=f111c71466e14bca870155327210212%20&q=Montreal&aqi=no&lang=fr';
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

var section = document.getElementById('meteo');

function PopulateMeteo(jsonObj) {


    var myArticle = document.createElement('article');
    var myH2 = document.createElement('p');
    var myPara1 = document.createElement('p');
    var myPara2 = document.createElement('p');

    myH2.textContent = `${jsonObj.location.name}, ${jsonObj.location.region}`;
    myPara1.textContent = `Courant: ${jsonObj.current.temp_c}℃, Resenti ${jsonObj.current.feelslike_c}℃`;
    myPara2.textContent = jsonObj.current.condition.text;


    myArticle.appendChild(myH2);
    myArticle.appendChild(myPara1);
    myArticle.appendChild(myPara2);

    section.appendChild(myArticle);

}

TestMeteo()