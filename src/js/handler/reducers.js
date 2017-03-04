import 'angular'
import $ from 'jquery'
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import * as action from './actions'
import ngScope from '../service/bridge'

import {debug2, debugJSON} from '../service/misc'
/**
 *
 * Reducers are like event handlers which receive the action and then do something
 * and return the result of that something as a data structure
 * their names are important, they are the states member object name eg. const login = reducer for state.login
 *
 * @param state
 * @param action
 * @returns {the new state map to be grafted onto the global state}
 */

const formReducers = {
    form: formReducer.plugin({
        LoginForm: (state, action) => {   // <----- 'login' is name of form given to reduxForm()
            alert(state + " " + JSON.stringify(action))
            switch (action.type) {
                case LOGIN:
                    return {
                        ...state,
                        values: {
                            ...state.values,
                            password: undefined // <----- clear password value
                        },
                        fields: {
                            ...state.fields,
                            password: undefined // <----- clear field state, too (touched, etc.)
                        }
                    }
                default:
                    return state
            }
        }
    })
}

const login = (state = {}, action) => {
    switch (action.type) {
        default:
            return state;
    }
}

const debug = (state = {}, action) => {
    debug2("reduce: " + String(action.type) + " " + JSON.stringify(action.payload))
    debug2(JSON.stringify(state))

    return state;
}

const groups = (state = [{id: 0}], action) => {
    switch (action.type) {
        case action.JOIN_GROUP:
            alert('join the group')
            ngScope().client.login('wozza', '123')

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
    return combineReducers({formReducers, debug, todaysRides, groups, login})

}
