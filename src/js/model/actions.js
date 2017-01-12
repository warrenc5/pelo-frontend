let nextTodoId = 0

/**
 * These Actions are like our own custom events descriptors.
 *
 * All actions have some parameters, type and a payload or error
 *
 * see
 * https://github.com/acdlite/flux-standard-action
 *
 */
export const addBike = (bikeName) => {
  return {
    type: 'ADD_BIKE',
    payload: {bikeName}
  }
}

export const searchFilter = (filter) => {
  return {
    type: 'searchFilter',
    filter
  }
}

export const toggleTracking = (id) => {
  return {
    type: 'TOGGLE_TODO',
    payload: {stuff:'hello'}
  }
}

export const actions = [addBike,toggleTracking,searchFilter]

module.exports = actions
exports.default = actions
exports.actions = actions
