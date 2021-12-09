import { InputType, CalcState, GetInputState, GetInputType } from "./input.js"
import Equation from "./equation_refactor.js";

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

class EquationBlock {
    constructor() {
        this.display_PreSuf = ["", ""];
        this.eval_PreSuf = ["", ""];
        this.block = "";
    }

    get display() {
        var strBlock = this.block

        if (strBlock instanceof EquationBlock) {
            strBlock = strBlock.display
        }
        return ` ${this.display_PreSuf[0]}${strBlock}${this.display_PreSuf[1]}`;
    }

    get eval() {
        var strBlock = this.block

        if (strBlock instanceof EquationBlock) {
            strBlock = strBlock.eval
        }
        return ` ${this.eval_PreSuf[0]}${strBlock}${this.eval_PreSuf[1]}`;
    }

    get value() {
        return null
    }

    OnInput(inputType, input) {
        return true
    }
}

class CalcNumber extends EquationBlock {
    constructor() {
        super();
        this.block = "0"

        this.sign = 1;
    }

    get isDecimal() {
        return this.block.indexOf(".") >= 0
    }

    OnInput(inputType, input) {
        switch (inputType) {
            case InputType.NUMBER:
                this.OnInputNumber(input)
                break;
            case InputType.DECIMAL:
                this.OnInputDecimal();
                break;

            default:
                break;
        }
    }

    OnInputNumber(input) {
        if (this.block == "0") {
            this.block = input
        } else {
            this.block += input
        }
    }

    OnInputDecimal() {
        if (!this.isDecimal) {
            this.block += "."
        }
    }

    OnInputDelete() {
        if (this.block.length == 1) {
            this.block = "0"
        } else {
            this.block = this.block.substr(0, this.block.length - 1)
        }
    }

    OnInputNeg() {
        this.sign = this.sign * -1
    }

    set value(newValue) {
        if (newValue instanceof Number) {
            this.block = String(Math.abs(newValue))
            if (newValue < 0) {
                this.sign = -1
            }
        } else {
            console.error(`Trying to set the value of a Number with a ${typeof newValue}`);
        }
    }

    get value() {
        return Number(this.block) * this.sign;
    }

    get display() {
        return String(this.value)
    }

    get eval() {
        return String(this.value)
    }

    get current() {
        if (this.sign < 0) {
            return "-" + this.block
        }
        return this.block
    }

}
class oldCalcNumber extends CalcBlock {
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

class OperatorBlock extends EquationBlock {
    constructor(block) {
        super();
        if (block instanceof EquationBlock) {
            this.block = block;
        } else {
            console.log(`OperatorBlock need to be initialized with a EquationBlock, but was initialized with a ${typeof block}`);
        }

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

export { cNumber, CalcBlock, CalcParentesis, CalcNumber, CalcOperator, CalcResult }