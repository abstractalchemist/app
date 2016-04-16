import React from 'react/dist/react'
import Nav from './nav'
import IndexBanner from './indexbanner'
import Sections from './sections'
import Parallax from './parallax'
import Footer from './footer'
import Anime from './anime'
import Dispatcher from '../util/dispatcher'
import FRC from './frc'
import FRCStore from '../stores/frc'
import Samples from './samples'
import Images from './images'
import ImageStore from '../stores/images'

const Front = React.createClass({

    settings() {
	return [];
    },
    connections() {
	return [];
    },
    render() {
	return ( <div id="front">
		 <IndexBanner title="Abstract Alchemist's Lab" description="Something Interesting" img="background1.jpg" signin="true"/>
		 <Sections sections={this.props.locations}/>
		 <Parallax title="Other Stuff You Might Be Interested In" img="background3.jpg" />
		 <Footer settings={ this.settings() } connect={ this.connections()} bio="I am a programmer"/>
		 </div>
	       );
    }
});

export default React.createClass({
    locations() {
	let publicLocations = [{ name: "Anime", href: "anime.html", desc: "", id: "anime", view: <Anime /> },
			       { name: "Programming", href: "programming.html", desc: "", id: "programming" },
			       { name: "Samples", href: "samples.html", desc: "", id: "samples", view: <Samples />}];
	if(FRCStore.authorized())
	    publicLocations.push({ name: "FRC", href: "frc.html", desc: "", id: "frc", view: <FRC />});
	if(ImageStore.authorized())
	    publicLocations.push({ name: "Images", href: "images.html", desc: "", id: "images", view: <Images />});
	return publicLocations;
    },
    findLocation(locationId) {
	return this.locations().find( ({ id, view }) => id === locationId );
    },
    getInitialState() {
	return { currentView : <Front locations={ this.locations() }/> };
    },
    componentDidMount() {
	let src = Rx.Observable.fromEventPattern(h => Dispatcher.register(h))
	    .filter(payload => payload.actionType === 'viewChanged')
	    .map(payload => {
		if(payload.view === 'front')
		    return ( <Front locations={ this.locations() } /> );
		return this.findLocation(payload.view).view;
	    });

	this.viewSub = src.subscribe(view => this.setState({ currentView: view}));

    },
    componentDidUpdate() {

    },
    componentWillUnmount() {
	this.viewSub.dispose()
    },
    render() {
	return (<div>
		<Nav locations={this.locations()}/>
		{this.state.currentView}
		</div>
	       );
    }
});
