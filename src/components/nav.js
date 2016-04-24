import React from 'react/dist/react';
//import Dispatcher from '../util/dispatcher'
import Auth from '../stores/auth'
import ViewActions from '../actions/view'
import GoogleSignin from './google_signin'
import GoogleSignOut from './google_signout'

const NavItem = React.createClass({
    itemClicked(evt) {
	console.log("Changing to " + this.props.id);
	//Dispatcher.dispatch( { actionType: "viewChanged", view: this.props.id } );
	
	ViewActions.view(this.props.id);
	evt.preventDefault();
    },
    render() {
	return ( <li><a href={ this.props.href } >{ this.props.name }</a></li> )
    }
});

 
export default React.createClass({
    getInitialState() {
	return {};
    },
    componentDidMount() {
	$('.button-collapse').sideNav();
	Auth.registerSignInCallback(user => {
	    if(user.isSignedIn())
		this.setState({ user });
	    else
		this.setState({ user: undefined });
	});
	    
    },
    componentDidUpdate() {
	$('.button-collapse').sideNav();
    },
    standardNav() {
	if(this.props.locations) {
	 //   console.log("mapping %s", this.props.locations);
	    return this.props.locations.map( ({ name, href, id }) => {
		return ( <NavItem key={ id + "-nav" } href={ href } name={ name } id={ id } /> );
	    });
	}
	return [];
    },
    itemClicked(evt) {
	//Dispatcher.dispatch( { actionType: "viewChanged", view: "front" } );
	ViewActions.front();
	evt.preventDefault();
    },
    search(evt) {
	//Dispatcher.dispatch( { actionType: "viewChanged", view: "search" });
	ViewAction.search();
	evt.preventDefault();
    },
    render() {
	return ( <nav className="white" role="navigation">
		 <div className="nav-wrapper container">
		 <a id="logo-container" href="/" className="brand-logo" onClick={this.itemClicked}>Logo</a>
		 <ul className="right hide-on-med-and-down" style={{ height: "100%"}}>
		 { this.standardNav() }
		 <li style={{height:"100%"}}>
		 <div className="valign-wrapper" style={{height:"100%"}}>
		 <div className="valign">
		 <GoogleSignin />
		 </div>
		 </div>
		 
		 </li>
		 <li>
 		 <div className="valign-wrapper" style={{height:"100%"}}>
		 <div className="valign">
		 <GoogleSignOut />
		 </div>
		 </div>
		 </li>
		 <li>
		 {( _ => {
		     if(this.state.user) {
			 return (<a>Welcome back, {this.state.user.getBasicProfile().getEmail()}</a>);
		     }
		 })()
		 }
		 </li>

		 <li>
		 <a href="/search" ><i className="material-icons">search</i></a>
		 </li>
		 </ul>
		 <ul className="side-nav">
		 { this.standardNav() }
		 <li>
		 {( _ => {
		     if(this.state.user) {
			 return (<a>Welcome back, {this.state.user.getBasicProfile().getEmail()}</a>);
		     }
		 })()
		 }
		 </li>
		 </ul>
		 <a href="#" data-activates="nav-mobile" className="button-collapse"><i className="material-icons">menu</i></a>
		 </div>
		 </nav>
	       );
    }
});
