import React from 'react/dist/react'

export default React.createClass({
    componentDidMount() {
	$('.parallax').parallax();
    },
    componentDidUpdate() {
	$('.parallax').parallax();
    },
    render() {
	return (<div className="parallax-container">
		<div className="section no-pad-bot">
		<div className="container">
		<br></br>
		<h1 className="header center teal-text text-lighten-2">{ this.props.title }</h1>
		<div className="row center">
		<h5 className="header col s12 light">{ this.props.description }</h5>
		</div>
		{( () => {
		    if(this.props.starting) {
			return ( <div className="row center">
				 <a href="#" className="btn-large waves-effect waves-light teal lighten-1">{ this.props.starting  }</a>
				 </div>
			       );
		    }
		}) ()
		}
		<br></br>
		</div>
		</div>
		<div className="parallax"><img src={this.props.img} alt="Unsplashed background img 1"></img></div>
		</div>
	       );
    }
})
