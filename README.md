This is a small repo meant to show some issues with jest, ES6 imports, and mocking/stubbing.

In `src/main.js` I have a very simple set up where a memoized function (using _.memoize) checks for that the items in one array (`subset`) are also totally contained in a second array (`set`) using `_.difference`.

## Problem

A simple JS file:
```js
import _ from 'lodash'

function checkDifference(subset, set) {
  return _.difference(subset, set).length === 0
}

const memoized = _.memoize(
  checkDifference,
  (subset, set) => subset.join('') + '::' + set.join('')
)

export default function diff(subset, set) {
  return memoized(subset, set)
}
```

And a simple test that the boolean logic works and that memoization is happening correctly:
```js
const set = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

it('should return true if ALL values are in the set', () => {
  expect(main['a', 'c'], set).toEqual(true)
})

it('should return false if ANY value is not in the set', () => {
  expect(main(['a', 'c', 'z'], set)).toEqual(false)
})

it('should only call the memoized function once', () => {
  main(['a'], set)
  main(['a'], set)
  main(['a'], set)

  expect(_.difference).toHaveBeenCalledTimes(1) // <--- this expect is the big problem
})
```

## Failed Solutions

### Mocking lodash

If you mock lodash entirely, `_.memoize` returns undefined and breaks the test, unless you completely rebuild the functionality of memoize in a stub. Not a good idea.

### Spying on _.difference

See: [`src/main.test.js`](src/main.test.js)

If you try to spy on `_.difference` using `jest.spyOn()`, it doesn't work. I think this one breaks because `babel-plugin-lodash` is running and converts the import to reference something else, so the spy doesn't reference the right thing.

### Import * trick

See: [`src/main_import-star.test.js`](src/main_import-star.test.js)

This is a trick I've used with jest where it gives you a better reference to imported functions so you can stub and mock them better. Doesn't work here, probably for the same reason as above re: `babel-plugin-lodash`.

### Mocking `lodash/difference`

See: [`src/main_mock.test.js`](src/main_mock.test.js)

OK this actually works for the check on memoization. It reads in the right reference for `babel-plugin-lodash` and lets you only mock that one function, and you can have it return an empty array so that things generally work, and then verify it was only called once to verify memoization is happening.

Unfortunately, it also means you can only have `_.difference` return a single value for the life of the test file. And in this case, I also need `_.difference` to just act normally (which is why I'd much rather spy on it), so that I can also test that my function returns true/false correctly based on the values of `subset` and `set`. This solution breaks those other tests.

I tried to use `diff = jest.fn()` in the test to adjust what it returns but since it's a default export, it doesn't maintain the reference like it would if it was `_.diff` etc.

I tried to spy on `diff` but doing `jest.spyOn(diff)` doesn't work because you have to have an object and method to spy on something.


## Sad face

If you can think of a solution that solves all these issues, let me know!