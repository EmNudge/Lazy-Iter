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

docs and explanations can be seen on the [wiki](https://github.com/EmNudge/Lazy-Iter/wiki) as it provided a better format for longer and better-written explanations.
<br />

## ToDo
A `.entries()` method may be added which returns an iterator with the value and index combined in an array, similarly to how `Array.prototype.entries` works. This is because using the `for` loop over `forEach` may be a style preference for many, but the index would have to be retrieved manually, by incrementing a local `index` variable on each iteration.

This would clean things up, but it is not of vital importance.

