import React from 'react/dist/react'
import Dispathcer from '../util/dispatcher'

export default React.createClass({
    getInitialState() {
	return {}
    },
    componentDidMount() {
	$('.carousel').carousel();
    },
    componentDidUpdate() {
    },
    render() {
	return (
		<div className="container">
		<div className="carousel carousel-slider" style={{height:"500px"}}>
		{(() => {
		    if(this.props.images) {
			return this.props.images.map(({img}) => {
			    return ( <a className="carousel-item"><img src={img}></img></a> );
			});
		    }
		})()
		}
	    </div>
		</div>
	       );
    }
})
