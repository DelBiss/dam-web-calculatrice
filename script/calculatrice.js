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

const CalcState = Object.freeze({
    NUMBER: { input: [InputType.NUMBER, InputType.DECIMAL, InputType.NUMBER_MOD], name: "STATE.NUMBER" },
    PARENTHESIS_OPEN: { input: [InputType.PARENTHESIS_OPEN], name: "STATE.PARENTHESIS_OPEN" },
    PARENTHESIS_CLOSE: { input: [InputType.PARENTHESIS_CLOSE], name: "STATE.PARENTHESIS_CLOSE" },
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

    GetCurrentStr() {
        return "0";
    }
}
class CalcParentesis extends CalcBlock {
    constructor(value = null) {
        super();
        this.value = new Equation(value);
        this.state = CalcState.PARENTHESIS_OPEN;
        this.isClose = false
    }

    OnInput(input) {
        if ((GetInputState(input) === CalcState.PARENTHESIS_CLOSE) &&
            (this.value.state != CalcState.PARENTHESIS_OPEN)) {
            this.Close()
        } else {
            this.value.OnInput(input)
        }
    }

    Close() {
        if (this.value.state === CalcState.PARENTHESIS_OPEN) {
            this.value.OnInput(")")
        }
        this.isClose = true
        this.state = CalcState.PARENTHESIS_CLOSE
    }

    GetEvalStr() {
        return "(" + this.value.evalStr + ")"
    }

    GetDisplayStr() {
        var sReturn = "(";
        sReturn += this.value.displayStr

        if (this.isClose) {
            if (this.value.state == CalcState.NUMBER) {
                sReturn += this.value.currentStr
            }
            sReturn += ")"
        }

        return sReturn
    }

    GetCurrentStr() {
        if (this.state === CalcState.PARENTHESIS_OPEN) {
            return this.value.currentStr
        } else {
            return "0"
        }
    }
}

class CalcNumber extends CalcBlock {
    constructor(value = null) {
        super();
        this.value = "0"
        this.isDecimal = false;
        this.isNegative = false;
        this.state = CalcState.NUMBER
        this.SetValue(value)
    }

    OnInput(input) {
        if (!super.OnInput(input)) {
            switch (GetInputType(input)) {
                case InputType.DECIMAL:
                    if (!this.isDecimal) {
                        this.isDecimal = true;
                        this.value += "."
                    }
                    break;

                case InputType.DELETE:
                    this.OnDelete()
                    break;

                case InputType.NUMBER:
                    if (this.value == "0") {
                        this.value = input
                    } else {
                        this.value += input
                    }
                    break;
                case InputType.NUMBER_MOD:
                    switch (input) {
                        case "N":
                            this.isNegative = !this.isNegative
                            break;
                        default:
                            console.log(InputType.NUMBER_MOD.name + "[${input}] isn't handled")
                            break
                    }
            }
        }
        return true
    }

    OnDelete() {
        if (this.value.length == 1) {
            this.value = "0"
        } else {
            if (this.value[this.value.length - 1] == ".") {
                this.isDecimal = false
            }
            this.value = this.value.substr(0, this.value.length - 1)
        }
    }

    GetValue() {
        return Number(this.GetEvalStr())
    }

    SetValue(value = null) {
        if (value != null) {
            if (value < 0) {
                this.isNegative = true
            }
            this.value = String(Math.abs(value))
        }
    }

    GetDisplayStr() {
        var myValue = this.value;
        if (this.isNegative) {
            myValue = "-" + myValue;
        }
        if (this.next === null) {
            return myValue;
        }
        return String(Number(myValue));
    }

    GetEvalStr() {
        var myValue = this.value;
        if (this.isNegative) {
            myValue = "-" + myValue;
        }
        return String(Number(myValue));
    }

    GetCurrentStr() {
        return this.GetDisplayStr();
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
        var nResult = eval(evalStr)

        return String(Math.round(nResult * 10 ** 8) / 10 ** 8)
    }

    GetDisplayStr() {
        return this.value;
    }

    GetEvalStr() {
        return "";
    }

    GetCurrentStr() {
        return this.GetDisplayStr();
    }

    GetValue() {
        return Number(this.value)
    }

    OnInput(input) { return true };

}

class Equation {
    constructor(value = null) {
        this.head = null;
        this.tail = this.head;
        this.length = 0;
        this.state = CalcState.NONE

        if (value != null) {
            this.append(new CalcNumber(value))
        }
    }

    OnInput(input) {
        for (var c of input) {
            console.log(`Input: ${c}: ${GetInputState(c).name} in ${this.state.name}`)
            switch (this.state) {
                case CalcState.NONE:
                    switch (GetInputState(c)) {
                        case CalcState.NUMBER:
                        case CalcState.OPERATOR:
                            this.append(new CalcNumber())
                            this.OnInput(c)
                            break
                        case CalcState.NONE:
                            break
                        case CalcState.PARENTHESIS_OPEN:

                            this.append(new CalcParentesis())
                            break;

                        default:
                            console.log(GetInputType(c).name + " aren't handle when in " + this.state.name)
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

                        case CalcState.PARENTHESIS_OPEN:
                            // var temp = this.tail;
                            var parenthe = new CalcParentesis(this.tail.GetValue());
                            this.replaceLast(parenthe)
                                // parenthe.previous = this.tail.previous
                                // if (parenthe.previous != null) {
                                //     parenthe.previous.next = parenthe
                                // } else {
                                //     this.head = parenthe
                                // }
                                // this.tail = parenthe
                                // this.state = this.tail.state
                            break

                        default:
                            console.log(GetInputType(c).name + " aren't handle when in " + this.state.name)
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
                            this.append(new CalcNumber(cr))
                            this.OnInput(c)
                            break;

                        case CalcState.PARENTHESIS_OPEN:
                            this.append(new CalcParentesis())
                            break;
                        default:
                            console.log(GetInputState(c).name + " aren't handle when in " + this.state.name)
                    }
                    break;

                case CalcState.PARENTHESIS_OPEN:
                    switch (GetInputState(c)) {
                        case CalcState.RESULT:
                            this.tail.Close()
                            this.state = this.tail.state
                            this.OnInput(c)
                            break
                        default:
                            this.tail.OnInput(c)
                            this.state = this.tail.state
                            break
                    }
                    break

                case CalcState.PARENTHESIS_CLOSE:
                    switch (GetInputState(c)) {
                        case CalcState.OPERATOR:
                            this.append(new CalcOperator())
                            this.OnInput(c)
                            break;

                        case CalcState.RESULT:
                            this.append(new CalcResult(this.evalStr))
                            break;
                    }
                    break
                default:
                    break;
            }
        }
    }

    getValue() {
        if (this.state === CalcState.RESULT) {
            return this.tail.GetValue()
        } else {
            return Number(CalcResult.GetResult(this.evalStr))
        }
    }
    replaceLast(value) {
        var temp = this.tail
        this.tail = temp.previous
        this.length--
            // if (this.length == 1)
            this.append(value)
        return temp
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

    get currentStr() {
        if (this.tail != null) {
            return this.tail.GetCurrentStr()
        }
        return "0"
    }

    get displayStr() {
        var sReturn = ""
        var last = 0;
        if (this.state === CalcState.NUMBER || this.state === CalcState.RESULT) {

            last = -1;
        }

        for (var block of this.slice(0, last)) {
            sReturn += block.GetDisplayStr()
        }
        if (this.state === CalcState.RESULT) {
            sReturn += " ="
        }
        console.log(`Display at ${this.state.name} : ${sReturn}`)
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
    slice(first = null, last = null) {
        var it = null
        if (first === null) {
            first = 0
        } else if (first < 0) {
            first = this.length + first
        }

        if ((last === null) || last == 0) {
            last = this.length
        } else if (last < 0) {
            last = this.length + last
        }

        if (first < last) {
            let i = 0;
            let current = this.head;
            while (i < last) {
                if (i >= first) {
                    yield current
                }
                current = current.next;
                i++
            }
        } else {
            let i = this.length;
            let current = this.tail;
            while (i > last) {
                if (i <= first) {
                    yield current
                }
                current = current.previous;
                i--
            }
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

    CreateNewEquation(value = null) {
        this.history.push(this.current)
        this.current = new Equation(value)
    }

    Clear() {
        this.current = new Equation()
    }
    get evalStr() {
        return this.current.evalStr
    }

    get state() {
        return this.current.state
    }

    get displayStr() {
        return this.current.displayStr
    }

    get currentStr() {

        return this.current.currentStr

    }

    OnInput(input) {
        for (var c of input) {
            if (this.current.state === CalcState.RESULT) {
                switch (GetInputState(c)) {
                    case CalcState.NUMBER:
                        this.CreateNewEquation()
                        this.OnInput(c)
                        break;

                    case CalcState.PARENTHESIS:
                        if (GetInputType(c) === InputType.PARENTHESIS_CLOSE) {
                            break;
                        }
                    case CalcState.OPERATOR:
                        var lastResult = this.current.getValue()
                        this.CreateNewEquation(lastResult)
                        this.OnInput(c)
                        break

                    case CalcState.RESULT:
                        var lastResult = this.current.getValue()
                        var lastOperation = this.current.lastOperation
                        this.CreateNewEquation(lastResult)
                        this.OnInput(lastOperation + c)
                        break
                }
            } else if ((GetInputState(c) === CalcState.RESULT) && (this.current.length == 1) && (this.current.state === CalcState.NUMBER)) {
                var prevEquation = this.history[this.history.length - 1]
                this.OnInput(prevEquation.lastOperation + c)
            } else {
                this.current.OnInput(c)
            }
        }
    }
}