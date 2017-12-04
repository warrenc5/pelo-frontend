import 'angular'
import $ from 'jquery'
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { routerReducer, push } from 'react-router-redux'

//import { reducer as routing } from 'react-router-dispatcher';

import * as action from './actions'


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

const INITIALIZE = `@redux-form/INITIALIZE`
const LOAD_SUCCESS = `@redux-conn/LOAD_SUCCESS`

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

const auth = (state = {}, action) => {
    switch (action.type) {
        case `LOGIN`:
            return action.payload
        default:
            return state
    }
}

const login = (state = [{}], action) => {
    switch (action.type) {
        case `LOGIN`:
            return action.payload
        case `LOAD_TEST_DATA`:
            return {... state, ...action.payload.login}
        case `LOGOUT`:
            return state
        case `LOGOUT_CONFIRM`:
            return [{}]
    /**
     Object.keys(state)
     .filter(key => key !== "login")
     .reduce((result, current) => {
                    result[current] = state[current];
                    return result;
                }, {});
     **/
        default:
            return state
    }
}

const none = (state = {}, action) => {
    return state
}

const debug = (state = {}, action) => {
    try {
        console.log(String(action.type))
    } catch (e) {
        console.log(e.message)
    }
    try {
        var p = JSON.stringify(action.payload)
        if (p == null)
            p = ""
        console.log(action.payload)
        //console.log(p.substring(p, Math.min(p.length, 100)))
    } catch (e) {
        console.log(e.message)
        //oo(action.payload)
    }

    return state;
}

const groups = (state = [{id: 0}], action) => {
    switch (action.type) {
        case `LOAD_TEST_DATA`:
            return {... state, ...action.payload.groups}
        case LOAD_SUCCESS:
            if (action.key !== `groups`)
                return state
            return action.payload.data.sort((a, b)=>a.id > b.id)
        case action.JOIN_GROUP:
            console.log('join the group3')
            break
        default:
            return state
    }
}

const selectedRides = (state = {}, action) => {
    switch (action.type) {
        case `SELECT`:
            var id = action.payload.id
            var m = {}

            if (state[id] == null) {

                m[id] = true
            } else {
                m[id] = !state[id]
            }
            return {... m}
            //return {... state, ... m}

        default:
            return state
    }
}

const rideLocations = (state = {}, action) => {
    switch (action.type) {
        case `RIDER_LOCATIONS`:
            return action.payload
        default:
            return state
    }
}

const riderLocation = (state = {}, action) => {
    switch (action.type) {
        case `LOCATION`:
            return action.payload
        default:
            return state
    }
}

const route = (state = {}, action) => {
    switch (action.type) {
        case `DOWNLOAD_ROUTE`:
            var id = action.payload.id
            var m = {}

            if (state[id] == null) {
                m[id] = action.payload.route
            }
            //return {... state, ... m}
            return action.payload
        case LOAD_SUCCESS:
            if (action.payload.key !== `route`)
                return state

            return action.payload.data
        default:
            return state
    }
    return state
}

const newRide = (state = {}, action) => {
    switch (action.type) {
        case INITIALIZE:
            return {Title: "My new Ride", startDate: "today"}
        default:
            return state
    }
}
const main = (state = {}, action) => {
    switch (action.type) {
        case INITIALIZE:
            return {Title: 'Wozza'}
        case `HAMBURGER`:
            return {open: !state.open}
        default:
            return state
    }
}

const todaysRides = (state = {}, action) => {
    switch (action.type) {
        case `LOAD_TEST_DATA`:
            return {... state, ...action.payload.todaysRides}
        case '@redux-conn/LOAD_FAIL':
            return state
        case LOAD_SUCCESS:
            if (action.payload.key !== `todaysRides`)
                return state

            return action.payload.data.sort((a, b)=>a.id > b.id)
        case 'TOGGLE_TRACK':
            console.log("handling action" + action.type + "  " + action.payload.id)
            if (action.payload.id)
                return {id: false}
            else
                return {id: true}
        case 'TOGGLE_TODO':
            return state.map(t =>
                todo(t, action)
            )
        default:
            return state
    }

    return state
    /*return getAddedIds(state.cart).map(id => ({
     ...getProduct(state.products, id),
     quantity: getQuantity(state.cart, id)
     }))
     */
}

//export const MyReducer = combineReducers({auth: auth, todaysRides})
export default function MyReducer() {
    return combineReducers({
        reduxAsyncConnect,
        routerReducer,
        debug,
        globals: none,
        groups,
        selectedRides,
        todaysRides,
        auth,
        login,
        route,
        hello: none,
        riderLocation,
        rideLocations,
        newRide,
        main,
        form,
    })
}

