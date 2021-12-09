const InputType = Object.freeze({
    NUMBER: { keycode: [0], char: "0123456789", name: "INPUT.NUMBER", hasInput: true, inputPrefix: "num" },
    NUMBER_MOD: { keycode: [0], char: "N", name: "INPUT.NUMBER_MOD", hasInput: true, inputPrefix: "mod" },
    PARENTHESIS_OPEN: { keycode: [0], char: "(", name: "INPUT.PARENTHESIS_OPEN", hasInput: false },
    PARENTHESIS_CLOSE: { keycode: [0], char: ")", name: "INPUT.PARENTHESIS_CLOSE", hasInput: false },
    DECIMAL: { keycode: [0], char: ".,", name: "INPUT.DECIMAL", hasInput: false },
    EQUAL: { keycode: [0], char: "=" + String.fromCharCode(13), name: "INPUT.EQUAL", hasInput: false },
    OPERATION: { keycode: [0], char: "+-*/", name: "INPUT.OPERATION", hasInput: true, inputPrefix: "op" },
    DELETE: { keycode: [0], char: String.fromCharCode(8, 83), name: "INPUT.DELETE", hasInput: false },
    CLEAR: { keycode: [0], char: "", name: "INPUT.CLEAR", hasInput: false },
    NONE: { keycode: [], char: "", name: "INPUT.NONE", hasInput: false }
});

const CalcState = Object.freeze({
    NUMBER: { input: [InputType.NUMBER, InputType.DECIMAL, InputType.NUMBER_MOD], name: "STATE.NUMBER" },
    PARENTHESIS_OPEN: { input: [InputType.PARENTHESIS_OPEN], name: "STATE.PARENTHESIS_OPEN" },
    PARENTHESIS_CLOSE: { input: [InputType.PARENTHESIS_CLOSE], name: "STATE.PARENTHESIS_CLOSE" },
    RESULT: { input: [InputType.EQUAL], name: "STATE.RESULT" },
    OPERATOR: { input: [InputType.OPERATION], name: "STATE.OPERATOR" },
    DELETE: { input: [InputType.DELETE], name: "STATE.DELETE" },
    NONE: { input: [], name: "STATE.NONE" }
});

function GetKeyType(input) {
    var it = InputType.NONE;
    for (const key in InputType) {

        if (InputType[key].keycode.includes(input)) {
            it = InputType[key];
            break;
        }
    }
    return it;
}

function GetInputType(input) {
    var it = InputType.NONE;
    for (const key in InputType) {

        if (InputType[key].char.indexOf(input) >= 0) {
            it = InputType[key];
            break;
        }
    }
    return it;
}

function GetInputState(input) {
    var it = CalcState.NONE;
    var inType = GetInputType(input)
    for (const key in CalcState) {
        if (CalcState[key].input.includes(inType)) {
            it = CalcState[key];
            break;
        }
    }
    return it;
}

function GetInputTypeState(input) {
    var it = CalcState.NONE;
    for (const key in CalcState) {
        if (CalcState[key].input.includes(input)) {
            it = CalcState[key];
            break;
        }
    }
    return it;
}

export { InputType, CalcState, GetInputState, GetInputType, GetInputTypeState }