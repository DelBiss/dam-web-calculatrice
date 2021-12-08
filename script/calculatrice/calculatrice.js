import { InputType, CalcState, GetInputState, GetInputType } from "./input.js"
import { CalcBlock, CalcParentesis, CalcNumber, CalcOperator, CalcResult } from "./items.js"

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