const InputType = Object.freeze({
    NUMBER: { char: "0123456789", name: "INPUT.NUMBER" },
    NUMBER_MOD: { char: "N", name: "INPUT.NUMBER_MOD" },
    PARENTHESIS_OPEN: { char: "(", name: "INPUT.PARENTHESIS_OPEN" },
    PARENTHESIS_CLOSE: { char: ")", name: "INPUT.PARENTHESIS_CLOSE" },
    DECIMAL: { char: ".,", name: "INPUT.DECIMAL" },
    EQUAL: { char: "=" + String.fromCharCode(13), name: "INPUT.EQUAL" },
    OPERATION: { char: "+-*/", name: "INPUT.OPERATION" },
    DELETE: { char: String.fromCharCode(8, 83), name: "INPUT.DELETE" },
    NONE: { char: "", name: "INPUT.NONE" }
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

export { InputType, CalcState, GetInputState, GetInputType }