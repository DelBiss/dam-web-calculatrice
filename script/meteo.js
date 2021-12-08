function FetchMeteo(section) {
    let requestURL = 'https://api.weatherapi.com/v1/current.json?key=f111c71466e14bca870155327210212%20&q=Montreal&aqi=no&lang=fr';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        const meteoResponse = request.response;
        PopulateMeteo(meteoResponse, section);
    }

}



function PopulateMeteo(jsonObj, section) {
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

export { FetchMeteo }