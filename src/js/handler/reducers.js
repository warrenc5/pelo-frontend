import 'angular'
import $ from 'jquery'
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { routerReducer, push } from 'react-router-redux'

import * as action from './actions'
import {debug2, debugJSON} from '../service/misc'

/**
 *
 * Reducers are like event handlers which receive the action and then do something
 * and return the result of that something as a data structure
 * their names are important, they are the states member object name eg. const login = reducer for state.login
 *
 * Warning state will not be visible in the reduxProps config if there is not a reducer for it
 *
 * @param state
 * @param action
 * @returns {the new state map to be grafted onto the global state}
 */

const form = formReducer.plugin({
    form: (state, action) => {
        //every form
    },
    LoginForm: (state, action) => {
        switch (action.type) {
            case `FBLOGIN`:
                return state
            case `FBLOGIN_ERROR`:
                return {
                    ... state,
                    error: action.payload.error
                }
            case `LOGIN`:
                //console.log("2" + JSON.stringify(action) + " " + JSON.stringify(state))
                return {
                    ...state,
                    values: {
                        ...state.values,
                        username: action.payload.id,
                        password: undefined
                    },
                    fields: {
                        ...state.fields,
                        password: undefined
                    },
                }
            case `LOGIN_ERROR`:
                return {
                    ... state,
                    error: action.payload.error,
                    values: {
                        ...state.values,
                        password: undefined
                    },
                    ok: true,
                }
            default:
                return state
        }
    }
})

const none = (state = {}, action) => {
    return state
}

const debug = (state = {}, action) => {
    try {
        debug2("action: " + String(action.type))
    } catch (e) {
        debug2(e.message)
    }
    try {
        debug2("payload: " + JSON.stringify(action.payload))
    } catch (e) {
        debug2(e.message)
        //oo(action.payload)
    }

    try {
        debug2("state: " + JSON.stringify(state))
    } catch (e) {
        debug2(e.message)
    }

    return state;
}

const groups = (state = [{id: 0}], action) => {
    switch (action.type) {

        case action.JOIN_GROUP:
            alert('join the group')

            break
        //case '@redux-conn/LOAD_SUCCESS':
            //alert(JSON.stringify(state))
            //return {...state, groups: action.payload.data}
            //return state
            //break
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
    return combineReducers({
        debug,
        globals: none,
        groups,
        auth: none,
        login: none,
        router: routerReducer,
        reduxAsyncConnect,
        form
    })//, debug, todaysRides, groups, login})
    //return combineReducers({globals:debug, debug, form})//, debug, todaysRides, groups, login})
}
