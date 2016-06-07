# Lazy iterator

Creates iterator that iterate over collection lazily

## Example:

```js
const iter = require('lazyiter');

function fib(n) {
    return n < 2 ? n : fib(n-2) + fib(n-1);
}

var list = iter([11, 22, 133, 144, 155]);

list.map(fib).take(2).collect() // [ 89, 17711 ]

// and no big CPU consumption, because of laziness
```

You can pass iterators between functions and add new layers in any moment,
and no computation happens until you apply `eager` method

```js
function foo(arr) {
    // no computation here
    return lazyiter(arr).map(e => e.toUpperCase())
}

var a = foo(["Oleg", "Jeka", "Dimon", "Demian", "Artem", "Escobar"]);

// add new layers

a.take(3).filter(e => e.length < 6)

// compute either with `collect`
a.collect() // [ 'OLEG', 'JEKA', 'DIMON' ]

// or by hand (note: iterator can be passed only once)
a.next();  // { value: 'OLEG', done: false }
a.next();  // { value: 'JEKA', done: false }
a.next();  // { value: 'DIMON', done: false }
a.next();  // { value: undefined, done: true }
```

## Methods

### Lazy:
- __map__(fn)      - return new iterator that apply `fn` to every entry
- __filter__(fn)   - return new iterator that apply `fn` to every entry and
  exlude the entry if `fn` return `false`
- __takewhile__(fn) - return new iterator that apply `fn` to every entry until
  `fn` return `false` and exclude enries for which `fn` return `false` and rest
  of enries for which `fn` was not applied
- __take(n)__ - return new iterator that has only first `n` entries

### Eager:
- __forEach__(fn) - go through enries and apply `fn` to each entry
- __find__(fn) - go throuh entries and apply `fn` for each entry until `fn`
  return `true`, return the entry for which `fn` return `true`
- __reduce__([acc,] fn) - reduce enries with `fn`
- __collect__() - convert iterator into array
