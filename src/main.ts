// lower-order functions
type LOF<T> = (value?: any, index?: number) => T;

interface FuncObj<T> {
  type: string;
  func: LOF<T>;
}

type ReduceFunc<T, U> = (accumulator: U, currentVal: T, index: number) => U;

class LazyIter {
  arr: any[] = [];
  funcs: FuncObj<any>[] = [];

  constructor(arr: any[] | number) {
    if (typeof arr === "number") {
      const nullArr = (Array(arr) as any[]).fill(null) as null[];
      this.arr = nullArr;
      return;
    }

    if (!arr.length) {
      throw new Error("Lazy iterable cannot contain an empty array");
    }

    this.arr = arr;
  }

  map(func: LOF<any>) {
    this.funcs.push({ type: "map", func });
    return this;
  }

  filter(func: LOF<boolean>) {
    this.funcs.push({ type: "filter", func });
    return this;
  }

  takeWhile(func: LOF<boolean>) {
    this.funcs.push({ type: "take_while", func });
    return this;
  }

  take(num: number) {
    const func: LOF<boolean> = (_, i) => i < num;
    this.funcs.push({ type: "take_while", func });
    return this;
  }

  // since all methods apply to current instance, here is an easy way to clone
  // array can just be copied since lazy iter never modifies the original array
  clone(): LazyIter {
    const lazyIter = new LazyIter(this.arr);

    // clone objects via for loop. Cheaper than JSON.strinfify (I think)
    for (const { type, func } of this.funcs) {
      lazyIter.funcs.push({ type, func });
    }

    return lazyIter;
  }

  // consumers below this line

  forEach(func: LOF<void>) {
    for (const item of this) {
      func(item);
    }
  }

  find(func: LOF<boolean>) {
    let index = 0;
    for (const item of this) {
      if (func(item, index)) return item;
      index++;
    }

    return null;
  }

  // starting value IS necesssary, unlike regular reduce since we can't look ahead to check for 
  // array length and we can't force user to know if array would have a length after the functions
  // are all applied
  reduce<T, U>(func: ReduceFunc<T, U>, startingValue: U) {
    let val = startingValue;

    let index = 0;
    for (const item of this) {
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
          if (!func(val, index)) continue outer;
          continue;
        }

        if (!func(val, index)) break outer;
      }

      yield val;
      index++;
    }
  }
}

export default LazyIter;
