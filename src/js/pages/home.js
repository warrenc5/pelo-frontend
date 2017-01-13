import React, { PropTypes } from 'react'

import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    createCard = (textTitle, textSubtitle, textContent) => {
        return (
            <div>
                <Card className="card">
                    <CardHeader title="URL Avatar" subtitle="Subtitle"/>
                    <CardMedia overlay={<CardTitle title={textTitle} subtitle={textSubtitle} />}>
                        <img src="images/nature-600-337.jpg"/>
                    </CardMedia>
                    <CardText>
                        {textTitle}
                        <br />
                        {textSubtitle}
                        <br />
                        {textContent}
                    </CardText>
                    <CardActions>
                        <FlatButton label="Go"/>
                    </CardActions>
                </Card>
            </div>
        )
    }

    handleClick(something) {
        console.log('clicked2' + something)
        this.props.onClick2(something)
    }

    render() {
        return (
            <div>
                <h2>What's new</h2>
                <a href="#"
                   onClick={e => {
         e.preventDefault()
         //this.handleClick("nothing")
        this.props.onClick2(this.props.id)

       }}> SomeLink {this.props.id?'true':'false'} </a>
                <div className="row">
                    <div className="col-xs-4">
                        {this.createCard('Card title', 'Card subtitle', 'Card content 1')}
                    </div>
                    <div className="col-xs-4">
                        {this.createCard('Card title', 'Card subtitle', 'Card content 2')}
                    </div>
                    <div className="col-xs-4">
                        {this.createCard('Card title', 'Card subtitle', 'Card content 3')}
                    </div>
                </div>

                <h2>Latest post</h2>
                <div className="row">
                    <div className="col-xs-4">
                        {this.createCard('Card title', 'Card subtitle', 'Card content 1')}
                    </div>
                    <div className="col-xs-4">
                        {this.createCard('Card title', 'Card subtitle', 'Card content 2')}
                    </div>
                    <div className="col-xs-4">
                        {this.createCard('Card title', 'Card subtitle', 'Card content 3')}
                    </div>
                </div>
            </div>
        )
    }
}


/**
 * These component react properties are automatically bound from redux connect in the containers
 */
//https://toddmotto.com/react-create-class-versus-component/
Home.propTypes = {
    onClick2: PropTypes.func.isRequired,
    id : PropTypes.bool.isRequired

}

export default Home
