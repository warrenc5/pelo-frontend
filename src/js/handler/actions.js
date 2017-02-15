import {debug, debug2, debugJSON} from '../service/misc'
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

export function toggleTracking (newId) {
  debug2(`tt ${newId}`)
  return {
    type: 'TOGGLE_TRACK',
    payload: {id:newId}
  }
}

export const actions = [addBike,toggleTracking,searchFilter]

exports.default = actions
exports.actions = actions
