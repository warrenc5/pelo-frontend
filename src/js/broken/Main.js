/**
 * In this file, we create a React component
 * which incorporates components providedby material-ui.
 */
import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import {deepOrange500} from 'material-ui/styles/colors'
import FlatButton from 'material-ui/FlatButton'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RouterPath from './Router'
import injectTapEventPlugin from 'react-tap-event-plugin'

const styles = {
    container: {
        textAlign: 'center',
        paddingTop: 200,
    },
}

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: deepOrange500,
    },
})
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

export default class Main extends Component {

    constructor(props, context) {
        super(props, context)

        alert("i" + JSON.stringify(props))

        this.handleRequestClose = this.handleRequestClose.bind(this)
        this.handleTouchTap = this.handleTouchTap.bind(this)

        this.state = {
            open: false,
        }
    }

    handleRequestClose() {
        this.setState({
            open: false,
        })
    }

    handleTouchTap() {
        this.setState({
            open: true,
        })
    }

    render() {
        const standardActions = (
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.handleRequestClose}
            />
        )

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.container}>
                    <Dialog
                        open={this.state.open}
                        title="Super Secret Password"
                        actions={standardActions}
                        onRequestClose={this.handleRequestClose}
                    >
                        1-2-3-4-5
                    </Dialog>
                    <h1>Material-UI</h1>
                    <h2>example project</h2>
                    <RaisedButton
                        label="Super Secret Password"
                        secondary={true}
                        onTouchTap={this.handleTouchTap}
                    />
                </div>
            </MuiThemeProvider>
        )
    }
}

export const App = (props) => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <RouterPath props={props}/>
    </MuiThemeProvider>
)

module.exports = {App:App,Main:Main}

exports.default = Main
