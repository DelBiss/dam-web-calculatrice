import { InputType, CalcState, GetInputState, GetInputType } from "./input.js"
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

export { CalcBlock, CalcParentesis, CalcNumber, CalcOperator, CalcResult }