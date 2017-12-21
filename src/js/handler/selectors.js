import { createSelector } from 'reselect'
import {routes} from '../Router.jsx'

/**
 * reselectors are caches for computation optimization, and can be nested so in this example the total is only calculated once
 *
 * the first parameters for createSelector are the selectors and the last parameter argument is the transformer
 * - which takes each selector as a parameter
 *
 */
const copy = (result) => (result)
export const authIdSelector = createSelector(state => state.login === undefined ? -1 : state.login.id, copy)
export const buildTimeSelector = createSelector(state => state.globals.buildTime, copy)
export const groupSelector = createSelector(state => state.groups == null ? [{}] : state.groups, copy)
export const defaultPath = createSelector(state => state.main !== undefined && state.main.defaultPath !== undefined ? state.main.defaultPath
    : routes.DEFAULT, copy)

export const currentRideId = createSelector(state => {
    var selectedRide = -1

    if (state.selectedRides !== undefined) {
        for (var rideId in state.selectedRides) {
            selectedRide = rideId
            break;
        }

    }

    return parseInt(selectedRide)
}, copy)

export const currentRouteId = createSelector(state => {
    var selectedRide = currentRideId(state)
    var selectedRoute = -1
    if (state.todaysRides !== undefined && state.todaysRides.length > 0) {
        state.todaysRides.forEach(ride=> {
            if (ride.id === selectedRide) {
                selectedRoute = parseInt(ride.route)
            }
        })
    }
    return selectedRoute
}, copy)
export const selectedRide = createSelector(state => {
    var selectedRide = currentRideId(state)
    return state.todaysRides === undefined ? null : state.todaysRides.find(r=>r.id===selectedRide)
}, copy)

export const difficultyLevel = createSelector(state => {
    if (state !== undefined)
        switch (state.difficulty) {
            case 1:
                return 'Easy'
            case 2:
                return 'Intermediate'
            case 3:
                return 'Difficult'
            case 4:
                return 'Expert'
            default:
                return 'Unknown'
        }
    return 'Unknown'
}, copy)

/*
 export const mySelector = createSelector((state) => state.auth.id, (result) => result * 2)
 const shopItemsSelector = state => state.shop.items
 const taxPercentSelector = state => state.shop.taxPercent

 const subtotalSelector = createSelector(
 shopItemsSelector,
 items => items.reduce((acc, item) => acc + item.value, 0)
 )

 const taxSelector = createSelector(
 subtotalSelector,
 taxPercentSelector,
 (subtotal, taxPercent) => subtotal * (taxPercent / 100)
 )

 export const totalSelector = createSelector(
 subtotalSelector,
 taxSelector,
 (subtotal, tax) => ({ total: subtotal + tax })
 )

 let exampleState = {
 shop: {
 taxPercent: 8,
 items: [
 { name: 'apple', value: 1.20 },
 { name: 'orange', value: 0.95 },
 ]
 }
 }

 console.log(subtotalSelector(exampleState)) // 2.15
 console.log(taxSelector(exampleState))      // 0.172
 console.log(totalSelector(exampleState))    // { total: 2.322 }
 */