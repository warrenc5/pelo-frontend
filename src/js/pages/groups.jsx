import React from 'react'
import PropTypes from 'prop-types';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

import style from '../layout/style'
import * as action from '../handler/actions'
import * as select from '../handler/selectors'

import 'scrollreveal'
import * as router from '../Router.jsx'
import MyComponent, {Catch,myAsyncFormConnect} from '../widget/common'
import { ReactMaterialImage } from 'react-material-image'
import {ngScope} from '../service/bridge'

/**
 * TODO: add scrolling
 * let onUpdate = () => {
 *   window.scrollTo(0, 0)
 * }
 *
 * http://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
 *
 *
 */
@myAsyncFormConnect()
export default class Groups extends MyComponent {
    constructor(props) {
        super(props)
    }

    GridListExampleSimple = (props) => {
        const {groups} = props
        return (
            <div style={style.root}>
                <GridList
                    cols={1}
                    style={style.gridList}
                >
                    <Subheader>{this.props.total}</Subheader>
                    {groups.map((group) => (
                    <GridTile data-scroll-reveal
                              key={group.id}
                              title={group.name}
                              subtitle={
                              <div>
                              {group.members === undefined ?<span>no members</span>:
                              group.members.map((member)=>

                              <span>{member.slug} &nbsp;</span>
                              ) }
                              {/**
                                <ReactMaterialImage class="round-image"
                                    src={ngScope().state.baseUrl + `userimage/${member.id}`}/>
                              **/}
                              </div>
                              }
                              actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                              onTouchTap={e => {
                        e.preventDefault()
                        this.props.joinGroup(this.props.authId,group.id)
                    }}>
                        <ReactMaterialImage class="round-image"
                                            src={ngScope().state.baseUrl + `groupimage/${group.id}`}/>
                    </GridTile>
                        ))}
                </GridList>
            </div>
        )
    }

    render() {
        return this.props.groups === undefined ?
            <span>no groups</span> :
            <Catch>
                <div>
                    <div>
                        {/**
                            <a href="http://placehold.it"><img src="http://placehold.it/250x150"></img></a>
                            **/}
                    </div>
                    <div>
                        {this.GridListExampleSimple(this.props)}
                    </div>
                </div>
            </Catch>
    }

    static propTypes = {
        joinGroup: PropTypes.func.isRequired,
        groups: PropTypes.array.isRequired,
        authId: PropTypes.number.isRequired,
    }

    static reduxPropsConfig = (state, props) => ({
        total: select.groupSelector(state).length,
        groups: select.groupSelector(state),
        authId: select.authIdSelector(state),
    })

    static reduxDispatchConfig = (dispatch) => ({
        joinGroup: () => (...args) => dispatch(action.joinGroup(args))
    })

    static reduxFormConfig = {
        form: `GroupsForm`,
    }

    static reduxAsyncConfig = [{
        key: `groups`,
        promise: ({ store }) => new Promise((resolve, reject)=> {
            const authId = select.authIdSelector(store.getState())
            ngScope().client.groups(authId, (name, data)=> {
                resolve(data)
            }, (e)=> {
                console.log(e)
                reject(e)
            })
        })
    }]
}

