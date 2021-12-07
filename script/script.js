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