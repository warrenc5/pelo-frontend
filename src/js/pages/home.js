import React, { PropTypes } from 'react';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class Home extends React.Component {
    constructor(props) {
        super(props);
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
        alert('clicked' + something)
        this.props.onClick2(something)
    }

    render() {
        return (
            <div>
                <h2>What's new</h2>
                <a href="#"
                   onClick={e => {
         e.preventDefault()
         this.handleClick("nothing")
       }}> SomeLink </a>
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
;

//https://toddmotto.com/react-create-class-versus-component/

Home.propTypes = {
    onClick2: PropTypes.func.isRequired
}

export default Home;
