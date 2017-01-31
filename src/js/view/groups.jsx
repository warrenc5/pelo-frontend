import React, { PropTypes } from 'react'
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Subheader from 'material-ui/Subheader';

import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

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

const tilesData = [
    {
        img: 'images/grid-list/00-52-29-429_640.jpg',
        title: 'Pelo',
        author: 'Bob',
    },
    {
        img: 'images/grid-list/burger-827309_640.jpg',
        title: 'Pelo1',
        author: 'Tom',
    },
    {
        img: 'images/grid-list/camera-813814_640.jpg',
        title: 'Pelo2',
        author: 'Jim',
    },
    {
        img: 'images/grid-list/morning-819362_640.jpg',
        title: 'Pelo3',
        author: 'Pete',
    },
    {
        img: 'images/grid-list/hats-829509_640.jpg',
        title: 'Pelo4',
        author: 'Patrick',
    },
    {
        img: 'images/grid-list/honey-823614_640.jpg',
        title: 'Pelo5',
        author: 'Andy',
    },
    {
        img: 'images/grid-list/vegetables-790022_640.jpg',
        title: 'Pelo6',
        author: 'Joe',
    },
    {
        img: 'images/grid-list/water-plant-821293_640.jpg',
        title: 'Pelo7',
        author: 'Barry',
    },
];

class Groups extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    GridListExampleSimple = () => (
        <div style={styles.root}>
            <GridList
                cellHeight={180}
                style={styles.gridList}
            >
                <Subheader>December</Subheader>
                {tilesData.map((tile) => (
                    <GridTile
                        key={tile.img}
                        title={tile.title}
                        subtitle={<span>Creator: <b>{tile.author}</b></span>}
                        actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                    >
                        <img src={tile.img} />
                    </GridTile>
                ))}
            </GridList>
        </div>
    );


    render() {
        return (
            <div>
                <h2>Test2</h2>
                <div>
                    {this.GridListExampleSimple()}
                </div>
            </div>
        )

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
