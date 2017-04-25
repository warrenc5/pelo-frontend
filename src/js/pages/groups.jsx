import React, { PropTypes } from 'react'
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import {ngScope,myAsyncFormConnect} from '../service/bridge'

import style from '../layout/style'
import * as action from '../handler/actions'
import * as select from '../handler/selectors'
import {debug0,debug2, debugJSON} from '../service/misc'
import 'scrollreveal'

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
export default class Groups extends React.Component {
    constructor(props) {
        super(props)
    }

    GridListExampleSimple = (props) => {
        const {groups} = props
        return (
            <div style={style.root}>
                <GridList
                    cellHeight={180}
                    style={style.gridList}
                >
                    <Subheader>{this.props.total}</Subheader>
                    {groups.map((group) => (
                    <GridTile data-scroll-reveal
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
    }

    render() {
        return (
            <div>
                <h2>Groups</h2>
                <span>size:{this.props.groups.length}</span>
                <div>
                    {this.GridListExampleSimple(this.props)}
                </div>
            </div>
        )
    }

    static propTypes = {
        joinGroup: PropTypes.func.isRequired,
        groups: PropTypes.array.isRequired
    }


    static reduxAsyncConfig = [{
        key: `groups`,
        promise: ({ store,params,helpers,matchContext,router,history,location,routes}) => new Promise((resolve, reject)=> {
            const {auth} = store.getState()

            //TODO put this in base class
            if (login.id == -1) {
                router.push('/login')
                resolve({})
                return
            }

            ngScope().client.groups(auth.id, (name, data)=> {
                resolve(data)
            }, (e)=> {
                reject(e)
            })
        }).then((result) =>result).catch((e)=> {
            console.log(e)
        })
    }]

    static reduxPropsConfig = (state, props) => ({
        total: 3,//select.mySelector(state,props),
        groups: state.groups,
        userId: state.login.id
    })

    static reduxDispatchConfig = (dispatch) => ({
        joinGroup: () => (...args) => dispatch(action.joinGroup(args))
    })

    static reduxFormConfig = {
        form: `GroupsForm`,
    }
}

