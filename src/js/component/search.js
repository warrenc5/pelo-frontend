import React from 'react'

export default class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {open: false}
  }

  handleToggle = () => {
    this.setState({open: !this.state.open})
  }

  render() {
    return (
      <div className="main-search">
        search input box
      </div>
    )
  }
}