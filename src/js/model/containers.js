import { connect } from 'react-redux'
import Home from '../pages/home'

export const HomeContainer = connect(
    (state) => {
        return {
            id: "cool"
        },
            //TODO: rewrite this smaller once it's working
            (dispatch) => {
                return {
                    onClick: (id) => {
                        dispatch(function () {
                            alert("clicked" + id)
                        })
                    }
                }
            }
    }
)(Home)

