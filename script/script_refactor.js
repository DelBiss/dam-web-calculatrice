import Calculatrice from "./calculatrice/calculatrice_refactor.js";
import { FetchMeteo } from "./meteo.js";

let myCalc = new Calculatrice(document.getElementById("calculatrice"))
    // myCalc.HookToHTML()

function ToggleMeteo() {
    var section = document.getElementById('meteo');
    section.classList.toggle("open");
}

function ToggleXkey() {
    var section = document.getElementById('XKey');
    section.classList.toggle("open");
}

window.ToggleMeteo = ToggleMeteo
window.ToggleXkey = ToggleXkey
FetchMeteo(document.getElementById('meteo'))

document.onkeydown = console.log