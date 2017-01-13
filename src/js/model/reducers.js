import { combineReducers } from 'redux'

import {debug, debug2, debugJSON} from '../service/misc'
/**
 *
 * Reducers are like event handlers which read the action and then do something and return the result of that something
 *
 * @param state
 * @param action
 * @returns {the new state map to be grafted onto the global state}
 */
/*
 const auth = (state = {}, action) => {
 debug2("action " + action.type)

 switch (action.type) {
 case 'ADD_TODO':
 return {
 id: action.id,
 text: action.text,
 completed: false
 }
 case 'TOGGLE_TODO':
 if (state.id !== action.id) {
 return state
 }

 return Object.assign({}, state, {
 completed: !state.completed
 })

 default:
 return state
 }
 }
 */


const todaysRides = (state = {} , action) => {
    debug2(" action" + action.type )
    switch (action.type) {
        case 'LOAD':
            return {todaysRides: {id: action.payload.id}}
        case 'TOGGLE_TRACK':
            debug2("handling action" + action.type + "  " + action.payload.id)
            if (action.payload.id)
                return {id:false}
            else
                return {id:true}
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ]
        case 'TOGGLE_TODO':
            return state.map(t =>
                todo(t, action)
            )
        default:
            return state
    }

    /*return getAddedIds(state.cart).map(id => ({
     ...getProduct(state.products, id),
     quantity: getQuantity(state.cart, id)
     }))
     */
}

//export const MyReducer = combineReducers({auth: auth, todaysRides})
export const MyReducer = combineReducers({todaysRides})
//alert (typeof MyReducer )

exports.default = MyReducer

/**
 is the same as
 function todoApp(state = {}, action) {
  return {
    auth: auth(state.auth, action),
    todaysRides: todaysRides(state.todaysRides, action)
  }
}
 */
