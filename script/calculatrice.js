const InputType = Object.freeze({
    NUMBER: { char: "0123456789", name: "INPUT.NUMBER" },
    DECIMAL: { char: ".,", name: "INPUT.DECIMAL" },
    EQUAL: { char: "=" + String.fromCharCode(13), name: "INPUT.EQUAL" },
    OPERATION: { char: "+-*/", name: "INPUT.OPERATION" },
    DELETE: { char: String.fromCharCode(8, 83), name: "INPUT.DELETE" }
});

function GetInputType(input) {
    var it = null;
    for (const key in InputType) {

        if (InputType[key].char.indexOf(input) >= 0) {
            it = InputType[key];
            break;
        }
    }
    return it;
}

const CalcState = Object.freeze({
    NUMBER: { input: [InputType.NUMBER, InputType.DECIMAL], name: "STATE.NUMBER" },
    RESULT: { input: [InputType.EQUAL], name: "STATE.RESULT" },
    OPERATOR: { input: [InputType.OPERATION], name: "STATE.OPERATOR" },
    DELETE: { input: [InputType.DELETE], name: "STATE.DELETE" },
    NONE: { input: [], name: "STATE.NONE" }
});

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

class CalcBlock {
    constructor() {
        this.previous = null;
        this.next = null;
        this.value = null;
        this.state = CalcState.NONE
    };

    OnInput(input) {

        if (input.length > 1) {
            for (const c of input) {
                this.OnInput(c)
            }
            return true
        } else {
            return false
        }
        // this.value = input;
    };

    GetDisplayStr() {
        return this.value;
    }

    GetEvalStr() {
        return this.value;
    }
}

class CalcNumber extends CalcBlock {
    constructor() {
        super();
        this.value = "0"
        this._isDecimal = false;
        this.state = CalcState.NUMBER
    }

    OnInput(input) {
        if (!super.OnInput(input)) {
            switch (GetInputType(input)) {
                case InputType.DECIMAL:
                    if (!this._isDecimal) {
                        this._isDecimal = true;
                        this.value += "."
                    }
                    break;

                case InputType.DELETE:
                    this.OnDelete()
                    break;

                case InputType.NUMBER:
                    this.value += input
                    break;
            }
        }
        return true
    }

    OnDelete() {
        if (this.value.length == 1) {
            this.value = "0"
        } else {
            if (this.value[this.value.length - 1] == ".") {
                this._isDecimal = false
            }
            this.value = this.value.substr(0, this.value.length - 1)
        }
    }

    GetDisplayStr() {
        return String(Number(this.value));
    }
    GetEvalStr() {
        return String(Number(this.value));
    }
}

class CalcOperator extends CalcBlock {
    constructor() {
        super()
        this.state = CalcState.OPERATOR
    }
    OnInput(input) {
        if (!super.OnInput(input)) {
            this.value = input
        }
        return true
    };
    GetDisplayStr() {
        return " " + this.value + " ";
    }
}

class CalcResult extends CalcBlock {
    constructor(evalStr = "") {
        super();
        this.state = CalcState.RESULT
        this.evalStr = evalStr
        this.value = CalcResult.GetResult(evalStr)
    }

    static GetResult(evalStr) {
        return String(eval(evalStr))
    }

    GetDisplayStr() {
        return " = " + this.value;
    }

    GetEvalStr() {
        return "";
    }

    OnInput(input) { return true };

}

class Equation {
    constructor() {
        this.head = null;
        this.tail = this.head;
        this.length = 0;
        this.state = CalcState.NONE
    }

    OnInput(input) {
        for (var c of input) {

            switch (this.state) {
                case CalcState.NONE:
                    switch (GetInputState(c)) {
                        case CalcState.NUMBER:
                        case CalcState.OPERATOR:
                            this.append(new CalcNumber())
                            this.OnInput(c)
                            break

                        default:
                            console.log(GetInputState(c).name + " aren't handle when in " + this.state.name)
                    }
                    break;

                case CalcState.NUMBER:
                    switch (GetInputState(c)) {
                        case CalcState.NUMBER:
                        case CalcState.DELETE:
                            this.tail.OnInput(c)
                            break

                        case CalcState.OPERATOR:
                            this.append(new CalcOperator())
                            this.OnInput(c)
                            break;

                        case CalcState.RESULT:
                            this.append(new CalcResult(this.evalStr))
                            break;

                        default:
                            console.log(GetInputState(c).name + " aren't handle when in " + this.state.name)
                    }
                    break;
                case CalcState.OPERATOR:
                    switch (GetInputState(c)) {
                        case CalcState.OPERATOR:
                            this.tail.OnInput(c)
                            break

                        case CalcState.NUMBER:
                            this.append(new CalcNumber())
                            this.OnInput(c)
                            break;

                        case CalcState.RESULT:
                            var cr = this.getValue()
                            this.append(new CalcNumber)
                            this.OnInput(cr)
                            this.OnInput(c)
                            break;
                        default:
                            console.log(GetInputState(c).name + " aren't handle when in " + this.state.name)
                    }
                    break;
                default:
                    break;
            }
        }
    }

    getValue() {
        if (this.state === CalcState.RESULT) {
            return this.tail.value
        } else {
            return CalcResult.GetResult(this.evalStr)
        }
    }
    append(value) {
        if (this.tail === null) {
            this.head = value;
            this.tail = this.head;
        } else {
            value.previous = this.tail
            this.tail.next = value
            this.tail = value
        }
        this.state = this.tail.state
        this.length++
    }


    get evalStr() {
        var sReturn = ""
        for (var block of this.generator()) {
            sReturn += block.GetEvalStr()
        }
        if (this.state == CalcState.OPERATOR) {
            sReturn = sReturn.substr(0, sReturn.length - 1)
        }
        return sReturn
    }

    get displayStr() {
        var sReturn = ""
        for (var block of this.generator()) {
            sReturn += block.GetDisplayStr()
        }
        return sReturn
    }

    get lastNumber() {
        var lastNumber = null
        for (var block of this.reverseGenerator()) {
            if (block.state === CalcState.NUMBER) {
                lastNumber = block
                break;
            }
        }

        if (lastNumber != null) {
            return lastNumber.GetEvalStr()
        }
        return null
    }

    get lastOperation() {
        var lastOperator = null
        for (var block of this.reverseGenerator()) {
            if (block.state === CalcState.OPERATOR) {
                lastOperator = block
                break;
            }
        }
        var sReturn = ""
        while ((lastOperator != null) && (lastOperator.state != CalcState.RESULT)) {
            sReturn += lastOperator.GetEvalStr()
            lastOperator = lastOperator.next
        }
        return sReturn
    }

    *
    reverseGenerator() {
        if (this.length > 0) {
            let current = this.tail;
            do {
                yield current
                current = current.previous
            } while (current != null);
        }
    }

    *
    generator() {
        if (this.length > 0) {
            let current = this.head;
            do {
                yield current
                current = current.next
            } while (current != null);
        }
    }
}

export default class Calulatrice {
    constructor() {
        this.current = new Equation();
        this.history = [];
    }

    CreateNewEquation() {
        this.history.push(this.current)
        this.current = new Equation()
    }

    Clear() {
        this.current = new Equation()
    }
    get evalStr() {
        return this.current.evalStr
    }

    get displayStr() {
        return this.current.displayStr
    }

    OnInput(input) {
        for (var c of input) {
            if (this.current.state === CalcState.RESULT) {
                switch (GetInputState(c)) {
                    case CalcState.NUMBER:
                        this.CreateNewEquation()
                        this.OnInput(c)
                        break;
                    case CalcState.OPERATOR:
                        var lastResult = this.current.getValue()
                        this.CreateNewEquation()
                        this.OnInput(lastResult + c)
                        break

                    case CalcState.RESULT:
                        var lastResult = this.current.getValue()
                        var lastOperation = this.current.lastOperation
                        this.CreateNewEquation()
                        this.OnInput(lastResult + lastOperation + c)
                        break
                }
            } else if ((this.current.length == 1) && (GetInputState(c) === CalcState.RESULT)) {
                var prevEquation = this.history[this.history.length - 1]
                this.OnInput(prevEquation.lastOperation + c)
            } else {
                this.current.OnInput(c)
            }
        }
    }
}