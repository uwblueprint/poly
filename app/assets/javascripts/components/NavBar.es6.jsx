NavBar = React.createClass( {

  renderSignIn: function() {
    if (this.props.currentUser) {
      return (
          <span className="logIn">
            <a href="/sign_out">Sign out</a>
            <p className="currentUser">{this.props.currentUser.email}</p>
          </span>
      )
    } else {
      return (
        <span className="logIn">
          <a className="signInButton" href="/sign_in">Log in</a>
          <p> or </p>
          <a href="/sign_up">Sign up</a>
        </span>
      )
    }
  },

  render: function() {
    return(
      <nav>
        <a className="icon home" href="/"></a>
        {this.renderSignIn()}
      </nav>
    )
  }
});
