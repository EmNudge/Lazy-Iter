'use strict';

class LazyIter {
    constructor(arr) {
        this.arr = [];
        this.funcs = [];
        if (typeof arr === "number") {
            const nullArr = Array(arr).fill(null);
            this.arr = nullArr;
            return;
        }
        if (!arr.length) {
            throw new Error("Lazy iterable cannot contain an empty array");
        }
        this.arr = arr;
    }
    map(func) {
        this.funcs.push({ type: "map", func });
        return this;
    }
    filter(func) {
        this.funcs.push({ type: "filter", func });
        return this;
    }
    takeWhile(func) {
        this.funcs.push({ type: "take_while", func });
        return this;
    }
    take(num) {
        const func = (_, i) => i < num;
        this.funcs.push({ type: "take_while", func });
        return this;
    }
    // since all methods apply to current instance, here is an easy way to clone
    // array can just be copied since lazy iter never modifies the original array
    clone() {
        const lazyIter = new LazyIter(this.arr);
        // clone objects via for loop. Cheaper than JSON.strinfify (I think)
        for (const { type, func } of this.funcs) {
            lazyIter.funcs.push({ type, func });
        }
        return lazyIter;
    }
    // consumers below this line
    forEach(func) {
        for (const item of this) {
            func(item);
        }
    }
    find(func) {
        let index = 0;
        for (const item of this) {
            if (func(item, index))
                return item;
            index++;
        }
        return null;
    }
    reduce(func, startingValue) {
        let val = startingValue || null;
        let index = 0;
        for (const item of this) {
            if (!index && !val)
                val = item;
            val = func(val, item, index);
            index++;
        }
        return val;
    }
    collect() {
        return [...this];
    }
    *[Symbol.iterator]() {
        let index = 0;
        outer: for (const item of this.arr) {
            let val = item;
            for (const { type, func } of this.funcs) {
                if (type === "map") {
                    val = func(val, index);
                    continue;
                }
                if (type === "filter") {
                    if (!func(val, index))
                        continue outer;
                    continue;
                }
                if (!func(val, index))
                    break outer;
            }
            yield val;
            index++;
        }
    }
}

module.exports = LazyIter;
