import $ from 'jquery'
import 'angular'
import MyComponent, {myAsyncFormConnect} from '../widget/common'
import PropTypes from 'prop-types';
import {push} from 'react-router-redux'

@myAsyncFormConnect()
export class NgScope2 extends MyComponent {

    constructor(props) {
        super(props)
        ngScope().initReactBridge(this)
        this.props = props
        ngScope().platform.cordovaOnly(this.setup.bind(this))
    }

    setup() {
	this.oldState = ngScope().platform.checkConnection()

        document.addEventListener("offline", this.goOffline.bind(this), false)
        document.addEventListener("online", this.goOnline.bind(this), false)
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        return this.props.children
    }
    
    updateConnection() {
	var newState = ngScope().platform.checkConnection()

	if(this.oldState === Connection.UNKNOWN) {
	  this.oldState = newState
	  return false
	} else {
	  this.oldState = newState
	  return true
        }
    }

    goOffline() {
	if(!this.updateConnection()) {
	  return
	} 
        alert('offline')
        console.log('offline')
        this.reload()
    }

    goOnline(e) {
	if(!this.updateConnection()) {
	  return
	} 
        alert('online') 
        console.log('online',e)
        this.reload()
    }

    reload() {
        this.props.reload()
    }

    static propTypes = {
        ngScope: PropTypes.object.isRequired,
    }

    static reduxPropsConfig = (state, props) => ({
        ngScope: angular.element($("#app")).scope()
    })

    static reduxDispatchConfig = (dispatch, props) => ({
        reload: () => {
            console.log('reloading', props)
            //TODO reload the page completley
            //dispatch({push(props.location.state.pathname))
            dispatch({
                type: `RECONNECT`,
                payload: {connectionState: ngScope().platform.connectionState}
            })
        }
    })
}

export function ngScope() {
    try {
        return angular.element($("#app")).scope()
    } catch (e) {
        console.log(e)
        alert("*" + e)
    }
}

