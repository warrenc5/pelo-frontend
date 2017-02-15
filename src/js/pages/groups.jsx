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

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        width: 500,
        height: 450,
        overflowY: 'auto',
    },
};

class Groups extends React.Component {
    constructor(props) {
        super(props)
   }

    GridListExampleSimple = () => (
        <div style={styles.root}>
            <GridList
                cellHeight={180}
                style={styles.gridList}
            >
                <Subheader>December</Subheader>
                {this.props.groups.map((tile) => (
                <GridTile
                    key={tile.id}
                    title={tile.name}
                    subtitle={<span>Creator: <b>{tile.id}</b></span>}
                    actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                >
                    <img src={tile.id}/>
                </GridTile>
                    ))}
            </GridList>
        </div>
    );

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
    onClick2: PropTypes.func.isRequired,
    groups: PropTypes.array.isRequired
}


//TODO: can we use redux-connected-proptypes here? - only for state - not for dispatch..

//export const GroupsContainer = reduxConnectedPropTypes(Groups);
export const GroupsContainer = connect(
    (mainState) => {
        return {
            groups: mainState.groups
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
export default GroupsContainer
