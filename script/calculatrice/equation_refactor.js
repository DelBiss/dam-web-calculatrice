import { CalcBlock, CalcParentesis, CalcNumber, CalcOperator, CalcResult } from "./items_refactor.js"

export default class Equation {
    constructor() {
        this.chain = [];
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
        this.length++;
        return false;
    }
}