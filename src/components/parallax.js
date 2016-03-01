import React from 'react/dist/react'

export default React.createClass({
    componentDidMount() {
	$('.parallax').parallax();
    },
    componentDidUpdate() {
	$('.parallax').parallax();
    },
    render() {
	return (  <div id="index-banner"className="parallax-container valign-wrapper">
		  <div className="section no-pad-bot">
		  <div className="container">
		  <div className="row center">
		  <h5 className="header col s12 light">{ this.props.title }</h5>
		  </div>
		  </div>
		  </div>
		  <div className="parallax"><img src={ this.props.img} alt="Unsplashed background img 2"></img></div>
		  </div>
	       );
    }
})
