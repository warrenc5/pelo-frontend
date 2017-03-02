import { combineReducers } from 'redux'

import * as action from './actions'
import ngScope from '../service/bridge'

import {debug2, debugJSON} from '../service/misc'
/**
 *
 * Reducers are like event handlers which read the action and then do something and return the result of that something
 * their names are the states object name eg. const login = reducer for state.login
 *
 * @param state
 * @param action
 * @returns {the new state map to be grafted onto the global state}
 */
import 'angular'
import $ from 'jquery'
import { reducer as formReducer } from 'redux-form'

const login = (state = {}, action) => {
    switch (action.type) {
        default:
            return state;
    }
}

const debug = (state = {}, action) => {
    debug2("reduce: " + String(action.type) + " " + JSON.stringify(action.payload))
    return state;
}

const groups = (state = [{id: 0}], action) => {
    switch (action.type) {
        case action.JOIN_GROUP:
            alert ('join the group')
            ngScope().client.login('wozza','123')

        default:

            return state
    }
}

const todaysRides = (state = {}, action) => {
    switch (action.type) {
        case 'LOAD':
            return {todaysRides: {id: action.payload.id}}
        case 'TOGGLE_TRACK':
            debug2("handling action" + action.type + "  " + action.payload.id)
            if (action.payload.id)
                return {id: false}
            else
                return {id: true}
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
export default function MyReducer() {
return combineReducers({form:formReducer, debug,todaysRides, groups, login})
}
