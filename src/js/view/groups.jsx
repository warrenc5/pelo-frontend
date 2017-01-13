import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

class Groups extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        return <div ng-show="auth !=null && viz.groups" id="groups">
            <div ng-show="groups.length==0">
                <img src="../src/img/empty.png"/>
                <span class="dark">No groups found, join some groups.</span>
            </div>
            <ul ng-repeat="group in groups">
                <li>
                    <img avatar user="{{group}}"/>

                    <p ng-click="toggleGroup(group.id);">
                        group.name
                    </p>
                    <ul ng-show="!viz['group_users{{group.id}}']" ng-repeat="user in group.members"
                        ng-if="user.id != auth.id">
                        <li>

                            <img class="round-image" avatar user="{{user}}"/>
                            <span>user.id</span>
                            <span>user.name</span>
                            <span>distances[user.id]</span>

                        </li>
                    </ul>
                </li>
            </ul>
            <br/>
        </div>
    }
}

Groups.propTypes = {
    onClick2: PropTypes.func.isRequired,
    id: PropTypes.bool.isRequired

}

export const GroupsContainer = connect(
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
)(Groups)

