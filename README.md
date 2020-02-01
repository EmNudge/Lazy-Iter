# Lazy-Iter

This is a utility class to allow lazy iterables in javascript. 
You can read [here](https://dev.to/emnudge/lazy-iterators-from-scratch-2903) to learn about the problems with the current available iteration methods, but essentially, while normal array methods which consume HOFs are much more readable than a simple `for` loop, they can be much less performant.

Lazy iterables allow you to gain a significant performance boost in many instances.

## Usage
```js
const arr = [1, 2, 3, 4, 5];
const arrIter = new LazyIter(arr);

// cube values, remove even results, and then only return elements while the current element is under 30 
// takeWhile will skip iterations, unlike filter, making it more performant
arrIter
  .map(n => n ** 3)
  .filter(n => n % 2 == 1)
  .takeWhile(n => n < 30);
  
// collect is a consumer, which means it no longer returns the iterator
// collect runs through the array and applies all the functions in order
const newArr = arrIter.collect();
```

A lazy iterable first encloses an array (which is never mutated, so no need to clone) and methods are called which are added to an internal array. Nothing happens until a consumer is called, at which point the iterable will internally iterate over the array and return values as a result of calling the functions in order.

A number can alternatively be provided instead of an array, which creates an array of said size, filled with `null`.
```js
const arrIter = new LazyIter(10);
const reduceFunc = (accum, val) => `${accum} ${val}`;

// reduce is another consumer which works the same as `Array.prototype.reduce`, but it requires a starting value
const str = arrIter.map((_, i) => i).reduce(reduceFunc, '');

console.log(str) // logs: " 0 1 2 3 4 5 6 7 8 9"
```
- The LazyIter instance can alternatively be thrown into the header of a `for` loop as it is an iterator.

Consult the tests folder to see methods in use.

## Documentation

### Initialization
```js
new LazyIter(param: number | any[])
```
Returns an instance of LazyIter. If passed a number instead of a string, it will create an array of said size, filled with `null`. This may be useful if you wish to later map over these values and fill them up with another.

Instances of `LazyIter` are an iterable and can thus be used in a for loop:
```js
const iterable = new LazyIter([1, 2, 3, 4, 5]);
for (const num of iterable) {
  console.log(num);
}
```

<br />

### HOF Methods
These methods return the current instance and can thus be chained.

They allow for a value and index in the parameter list, but do not provide a reference to the array. Since values are computed lazily, it would defeat the purpose to reference the new array in the parameter list.

**map**
```js
.map(func: (val?: any, index?: number) => any): LazyIter
```
`map` takes in a function with optional params of the current value and the current index. Whatever is returned is passed off to the next function.

**filter**
```js
.filter(func: (val?: any, index?: number) => boolean): LazyIter
```
`filter` takes in a function with optional params of the current value and the current index. If the return value is false, no other methods are tried on the current value and it is not returned as part of the array when using `collect`.

**takeWhile**
```js
.takeWhile(func: (val?: any, index?: number) => boolean): LazyIter
```
`takeWhile` takes in a function with optional params of the current value and the current index. If the return value is false, no other values are looked at after this, ending the iteration.


**takeWhile**
```js
.take(length: number): LazyIter
```
`take` takes in a number, denoting how many items to allow. It is simply a `takeWhile` with a function of `(_, i) => i < num`.
  
<br />

### Consumers

These do not return the current instance and thus chaining methods will not work as expected

**collect**
```js
.collect(): any[]
```
`collect` is used to iterate over the iterable and return an array of values. An array will always be returned, but it may be empty.

**forEach**
```js
.forEach(func: (val?: any, index?: number) => void): void
```
`forEach` iterates over an array, applying the function provided to each value. 
This may be preferable to a simpler `for` loop as it keeps with the same coding style and also provides the index.

**find**
```js
.find(func: (val?: any, index?: number) => boolean): any
```
`find` iterates over an array, finding where the function returns true for a given value. The first instance of this will be the return value.

**reduce**
```js
.reduce<T>(func: (accumulator?: T, currentValue?: any, index?: number) => T, initialValue: T): any
```
`reduce` acts similarly to `Array.prototype.reduce` except the `initialValue` parameter is not optional. This is because it can only be optional if array length can be checked. As this is not possible without first iterating over it, this is not allowed.

As a note, it is not extremely difficult to iterate simply for the first value, this would expect the user to know that their `filter` did not result in an empty array (as an error would be thrown in such a case), which is not a practical expectation.

<br />

### Misc

**clone**
```js
.clone(): LazyIter
```
In order to allow chaining, `clone` will create a new instance of `LazyIter` and copy over the functions previously added. The array is not cloned because `LazyIter` does not mutate the array and so it is not a concern. 

<br />

## ToDo
I may add a `.entries()` method which returns an iterator with the value and index combined in an array, similarly to how `Array.prototype.entries` works. This is because using the `for` loop over `forEach` may be a style preference for many, but the index would have to be retrieved manually, by incrementing a local `index` variable on each iteration.

This would clean things up, but it is not of vital importance.

