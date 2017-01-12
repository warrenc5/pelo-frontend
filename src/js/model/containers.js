import { connect } from 'react-redux'
import Home from '../pages/home'
import {toggleTracking} from './actions'

const mapDispatchToProps = (dispatch) => {
    return {
        onClick2: (id) => {
            alert("there" + id + " " + toggleTracking)
            /*alert(typeof dispatch )
            //    dispatch(toggleTracking(id))
            dispatch((id) => {
            */
                return {
                    type: 'TOGGLE_TODO',
                    payload: {stuff: 'hello'}
                }
            /*
            })
            */
        }
    }
}

export const HomeContainer = connect(
    (state) => {
        return {
            id: "cool"
        },
            mapDispatchToProps
        /*
         //TODO: rewrite this smaller once it's working
         (dispatch) => {
         return {
         onClick2: (id) => {
         alert("here" + this.dispatch)
         this.dispatch(function () {
         alert("$clicked" + id)

         })
         }
         }
         }
         */
    }
)(Home)

