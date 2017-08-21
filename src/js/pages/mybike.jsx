import React from 'react'
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import Navigation from '../widget/navigation'
import Search from '../widget/search'

export default class MyBike extends React.Component {
  constructor(props) {
    super(props)
  }

  createCard = (textTitle, textSubtitle, textContent) => {
    return (
      <div>
        <Card className="card">
          <CardHeader title="URL Avatar" subtitle="Subtitle"/>
          <CardMedia overlay={<CardTitle title={textTitle} subtitle={textSubtitle} />} >
            <img src="images/nature-600-337.jpg" />
          </CardMedia>
          <CardText>
            {textTitle}
            <br />
            {textSubtitle}
            <br />
            {textContent}
          </CardText>
          <CardActions>
            <FlatButton label="Go" />
          </CardActions>
        </Card>
      </div>
    )
  }

  render() {
    return (          
      <div>
        <Navigation />  

        <Search />

        <div id="main-content-wrapper" className="main-content-wrapper">

          <h2>What's new</h2>
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
      </div>
    )
  }
}

/*
MyBike.propTypes = {
  : PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired,
  Click: PropTypes.func.isRequired
}
*/
