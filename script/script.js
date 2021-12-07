import Calulatrice from "./calculatrice.js";

function logKey(e) {
    console.log(e)
    if (e.key.length > 1) {
        test(String.fromCharCode(e.keyCode))
    } else {
        test(e.key)
    }
}
var myCalcul = new Calulatrice()
document.onkeydown = logKey;

function doInput(val) {
    try {
        myCalcul.OnInput(val)
        document.getElementById("Display").value = myCalcul.displayStr;
        console.log(myCalcul.displayStr)
    } catch (error) {
        myCalcul = new Calulatrice()
        document.getElementById("Display").value = "#ERROR#";
        console.log("#ERROR#")
        console.log(error)
    }
}

function Clear() {
    myCalcul.Clear()
    document.getElementById("Display").value = myCalcul.displayStr;
}
window.Input = doInput
window.Clear = Clear