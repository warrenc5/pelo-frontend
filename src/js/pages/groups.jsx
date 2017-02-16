import React, { PropTypes } from 'react'
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Subheader from 'material-ui/Subheader';
import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import reduxConnectedPropTypes from 'redux-connected-proptypes';

import style from '../layout/style'

class Groups extends React.Component {
    constructor(props) {
        super(props)
    }

    GridListExampleSimple = () => (
        <div style={style.root}>
            <GridList
                cellHeight={180}
                style={style.gridList}
            >
                <Subheader>December</Subheader>
                {this.props.groups.map((group) => (
                <GridTile
                    key={group.id}
                    title={group.name}
                    subtitle={<span>Creator: <b>{group.id}</b></span>}
                    actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                    onTouchTap={e => {
                        e.preventDefault()
                        this.props.joinGroup(this.props.userId,group.id)
                    }}>
                    <img src={group.avatar}/>
                </GridTile>
                    ))}
            </GridList>
        </div>
    )

    render() {
        return (
            <div>
                <h2>Groups</h2>
                <div>
                    {this.GridListExampleSimple()}
                </div>
            </div>
        )
    }
}

Groups.propTypes = {
    joinGroup: PropTypes.func.isRequired,
    groups: PropTypes.array.isRequired
}

//TODO: can we use redux-connected-proptypes here? - only for state - not for dispatch..
//export const GroupsContainer = reduxConnectedPropTypes(Groups);
export const GroupsContainer = connect(
    (mainState) => {
        return {
            groups: mainState.groups,
            userId: mainState.login.id
        }
    },
    (dispatch) => {
        return {
            joinGroup: (userId, groupId) => {
                dispatch(joinGroup(userId, groupId))
            }
        }
    }
)(Groups)
export default GroupsContainer

export function joinGroup(userId, groupId) {
    return {
        type: 'JOIN_GROUP',
        payload: {userId: userId, groupId: groupId}
    }
}

