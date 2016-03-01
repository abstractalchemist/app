import React from 'react/dist/react'
import Nav from './nav'
import IndexBanner from './indexbanner'
import Sections from './sections'
import Parallax from './parallax'
import Footer from './footer'
import Anime from './anime'
import Dispatcher from '../util/dispatcher'

const Front = React.createClass({

    settings() {
	return [];
    },
    connections() {
	return [];
    },
    render() {
	return ( <div id="front">
		 <IndexBanner title="Abstract Alchemist's Lab" description="Something Interesting" starting="Start Here" img="background1.jpg"/>
		 <Sections sections={this.props.locations}/>
		 <Parallax title="Other Stuff You Might Be Interested In" img="background3.jpg" />
		 <Footer settings={ this.settings() } connect={ this.connections()} bio="I am a programmer"/>
		 </div>
	       );
    }
});

export default React.createClass({
    locations() {
	return [{ name: "Anime", href: "anime.html", desc: "", id: "anime", view: <Anime /> },
		{ name: "Programming", href: "programming.html", desc: "", id: "programming" },
		{ name: "FRC", href: "frc.html", desc: "", id: "frc"},
		{ name: "Samples", href: "samples.html", desc: "", id: "samples"}];
    },
    findLocation(locationId) {
	return this.locations().find( ({ id, view }) => id === locationId );
    },
    handleEvent(payload) {
	if(payload.actionType === "viewChanged") {
	    console.log("Changing view to " + payload.view);

	    this.setState({ currentView: ( () => {
		if (payload.view === "front")
		    return <Front locations={ this.locations() } />
		    return this.findLocation(payload.view).view;
	    })() });
	}
			  
    },
    getInitialState() {
	return { currentView : <Front locations={ this.locations() }/> };
    },
    componentDidMount() {
	this.dispatcherToken = Dispatcher.register(this.handleEvent);

    },
    componentDidUpdate() {

    },
    render() {
	return (<div>
		<Nav locations={this.locations()}/>
		{this.state.currentView}
		</div>
	       );
    }
});
