import main from './main'
import _ from 'lodash'

const set = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

it('should only call memoized func once', () => {
  const diffSpy = jest.spyOn(_, 'difference')

  main(['a'], set)
  main(['a'], set)
  main(['a'], set)

  expect(diffSpy).toHaveBeenCalledTimes(1)
})