import React from 'react/dist/react';
import Dispatcher from '../util/dispatcher'

const NavItem = React.createClass({
    itemClicked(evt) {
	console.log("Changing to " + this.props.id);
	Dispatcher.dispatch( { actionType: "viewChanged", view: this.props.id } );
	evt.preventDefault();
    },
    render() {
	return ( <li><a href={ this.props.href } onClick={this.itemClicked}>{ this.props.name }</a></li> )
    }
});

export default React.createClass({

    componentDidMount() {
	$('.button-collapse').sideNav();
    },
    componentDidUpdate() {
	$('.button-collapse').sideNav();
    },
    standardNav() {
	return this.props.locations.map( ({ name, href, id }) => {
	    return ( <NavItem key={ id + "-nav" } href={ href } name={ name } id={ id } /> );
	});
    },
    itemClicked(evt) {
	Dispatcher.dispatch( { actionType: "viewChanged", view: "front" } );
	evt.preventDefault();
    },
    render() {
	return ( <nav className="white" role="navigation">
		 <div className="nav-wrapper container">
		 <a id="logo-container" href="#" className="brand-logo" onClick={this.itemClicked}>Logo</a>
		 <ul className="right hide-on-med-and-down">
		 { this.standardNav() }
		 </ul>
		 <ul className="side-nav">
		 { this.standardNav() }
		 </ul>
		 <a href="#" data-activates="nav-mobile" className="button-collapse"><i className="material-icons">menu</i></a>
		 </div>
		 </nav>
	       );
    }
});
