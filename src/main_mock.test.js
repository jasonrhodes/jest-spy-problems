import main from './main'
import * as diff from 'lodash/difference'

jest.mock('lodash/difference', () => jest.fn(() => []))

const set = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

it('should return true if ALL values are in the set', () => {
  expect(main(['a', 'c'], set)).toEqual(true)
})

it('should return false if ANY value is not in the set', () => {
  expect(main(['a', 'c', 'z'], set)).toEqual(false)
})

it('should only call memoized func once', () => {
  main(['a'], set)
  main(['a'], set)
  main(['a'], set)

  expect(diff).toHaveBeenCalledTimes(1)
})