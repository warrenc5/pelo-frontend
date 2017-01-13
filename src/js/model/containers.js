import { connect } from 'react-redux'
import Home from '../pages/home'
import {toggleTracking} from './actions'
import {debug, debug2, debugJSON} from '../service/misc'
/**
 * connected components can use the triggers in the second argument to fire events
 *
 */
export const HomeContainer = connect(
    (state) => {
        return {
            id: state.todaysRides.id
        }
    },
    (dispatch) => {
        return {
            onClick2: (id) => {
                dispatch(toggleTracking(id))
            }
        }
    }
)(Home)

