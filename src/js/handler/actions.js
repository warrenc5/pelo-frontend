
/**
 * These Actions are like our own custom events descriptors.
 *
 * The name of the action is arbitary,
 * Every action useally has some parameters
 * The standard format for the data struct is
 * type and a payload or error
 *
 * The way we create them is a function that constructs the data structure.
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

export function toggleTracking(newId) {
    console.log(`tt ${newId}`)
    return {
        type: 'TOGGLE_TRACK',
        payload: {id: newId}
    }
}

export function doLogin(user, password) {
    alert(`tt ${user} ${password}`)
    return {
        type: 'LOGIN',
        payload: {id: newId}
    }
}

export function loginTest(data1) {

}

//TODO DON'T USE Symbols for TYPE ids
export const JOIN_GROUP = Symbol('JOIN_GROUP')

export function joinGroup(userId, groupId) {
    return {
        type: JOIN_GROUP,
        payload: {userId: userId, groupId: groupId}
    }
}
