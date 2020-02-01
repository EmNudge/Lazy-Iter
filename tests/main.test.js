const LazyIter = require("../build/bundle.js");

const clone = arr => JSON.parse(JSON.stringify(arr));

describe("Initialization", () => {
  test("number array is collected to itself", () => {
    const arr = [1, 2, 3, 4, 5];
    const resolvedIter = new LazyIter(arr).collect();

    expect(resolvedIter).toStrictEqual(clone(arr));
  });

  test("object array is collected to itself", () => {
    const arr = [{ val: 1 }, { val: 2 }, { val: 3 }, { val: 4 }];
    const resolvedIter = new LazyIter(arr).collect();

    expect(resolvedIter).toStrictEqual(clone(arr));
  });

  test("make arrray of empty things", () => {
    const resolvedIter = new LazyIter(20).collect();
    const nullArr = Array(20).fill(null);

    expect(resolvedIter).toStrictEqual(nullArr);
  })
});

describe("methods mimics native arrays", () => {
  const arr = [1, 2, 3, 4, 5];

  test("(map) doubles values", () => {
    const double = n => 2 * n;
    const resolvedIter = new LazyIter(arr).map(double).collect();

    expect(resolvedIter).toStrictEqual(arr.map(double));
  });

  test("(map) index works", () => {
    const getIndex = (_, i) => i;

    const resolvedIter = new LazyIter(20).map(getIndex).collect();
    const arr = Array(20).fill(null).map(getIndex);

    expect(resolvedIter).toStrictEqual(arr);
  });

  test("(filter) removes even", () => {
    const isOdd = n => n % 2 === 1;
    const resolvedIter = new LazyIter(arr).filter(isOdd).collect();

    expect(resolvedIter).toStrictEqual(arr.filter(isOdd));
  });

  test("(take) gets first few", () => {
    debugger;
    const resolvedIter = new LazyIter(arr).take(2).collect();

    const newArr = clone(arr);
    newArr.length = 2;

    expect(resolvedIter).toStrictEqual(newArr);
  });

  test("(map + filter) removes large nums", () => {
    const enlargen = n => n ** 2;
    const isSmall = n => n < 30;

    const resolvedIter = new LazyIter(arr)
      .map(enlargen)
      .filter(isSmall)
      .collect();

    const newArr = arr.map(enlargen).filter(isSmall);

    expect(resolvedIter).toStrictEqual(newArr);
  });
});

describe("Consumer testing", () => {
  const arr = [1, 2, 3, 4, 5];

  test("forEach works", () => {
    const iter = new LazyIter(arr);

    const arr1 = [];
    const arr2 = [];

    for (const item of arr) arr1.push(item);

    iter.forEach(item => arr2.push(item));

    expect(arr1).toStrictEqual(arr2);
  });

  test("finding stuff works", () => {
    const iter = new LazyIter(arr);
    const isOver4 = n => n > 4;

    const num1 = iter.find(isOver4);
    const num2 = arr.find(isOver4);

    expect(num1).toBe(num2);
  });

  test("reduce works", () => {
    const iter = new LazyIter(arr);
    const recuceFunc = (accum, val) => val + accum;

    const num1 = iter.find(recuceFunc);
    const num2 = arr.find(recuceFunc);

    expect(num1).toBe(num2);
  })
});
