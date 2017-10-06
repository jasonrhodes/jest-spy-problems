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