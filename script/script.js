import Calculatrice from "./calculatrice/calculatrice.js";
import { FetchMeteo } from "./meteo.js";

function logKey(e) {
    console.log(e)
    if (e.key.length > 1) {
        Input(String.fromCharCode(e.keyCode))
    } else {
        Input(e.key)
    }
}
var myCalcul = new Calculatrice()
document.onkeydown = logKey;

function Input(val) {
    try {
        myCalcul.OnInput(val)
        Refresh()
    } catch (error) {
        myCalcul = new Calculatrice()
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
    document.getElementById("Current").value = myCalcul.currentStr;
}


function ToggleMeteo() {
    var section = document.getElementById('meteo');
    section.classList.toggle("open");
}

function ToggleXkey() {
    var section = document.getElementById('XKey');
    section.classList.toggle("open");
}

FetchMeteo(document.getElementById('meteo'))
Refresh()
window.Input = Input
window.Clear = Clear
window.Delete = Delete
window.ToggleMeteo = ToggleMeteo
window.ToggleXkey = ToggleXkey