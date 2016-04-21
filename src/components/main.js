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
import Search from './search'
import ViewActions from '../actions/view'
import Auth from '../stores/auth'
import Convention from './convention'

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
    /*
    locations() {
	let publicLocations = [{ name: "Anime", href: "/anime", desc: "", id: ViewActions.animeId(), view: <Anime /> },
			       { name: "Programming", href: "/programming", desc: "", id: ViewActions.programmingId() },
			       { name: "Samples", href: "/samples", desc: "", id: ViewActions.samplesId(), view: <Samples />}];
	if(FRCStore.authorized())
	    publicLocations.push({ name: "FRC", href: "/frc", desc: "", id: ViewActions.frcId(), view: <FRC />});
	if(ImageStore.authorized())
	    publicLocations.push({ name: "Images", href: "/images", desc: "", id: ViewActions.imagesId(), noSection: true, view: <Images />});
 	return publicLocations;
    },
    */
    setLocations() {
	return Auth.checkAllAccess().selectMany(data => {
	    let frcAccess = false;
	    let imagesAccess = false;
	    data.forEach(i => {
		if(i.accessImages)
		    imagesAccess = true;
		if(i.accessFrc)
		    frcAccess = true
		
	    });
	    let publicLocations = [{ name: "Anime", href: "/anime", desc: "", id: ViewActions.animeId(), view: <Anime /> },
				   { name: "Convention", href: "/convention", desc: "", id: ViewActions.conventionId(), view: <Convention /> },
				   { name: "Programming", href: "/programming", desc: "", id: ViewActions.programmingId() },
				   { name: "Samples", href: "/samples", desc: "", id: ViewActions.samplesId(), view: <Samples />}];
	    if(frcAccess)
		publicLocations.push({ name: "FRC", href: "/frc", desc: "", id: ViewActions.frcId(), view: <FRC />});
	    if(imagesAccess)
		publicLocations.push({ name: "Images", href: "/images", desc: "", id: ViewActions.imagesId(), noSection: true, view: <Images />});
 	    return Rx.Observable.fromArray(publicLocations);

	}).toArray();
    },

    findLocation(locationId) {
	//return this.locations().find( ({ id, view }) => id === locationId );
	if(this.state.locations)
	    return this.state.locations.find(({ id, view }) => id === locationId );
    },
    getInitialState() {
	//return { currentView : <Front locations={ this.locations() }/> };
	return { currentView: undefined, locations: undefined }
    },
    componentDidMount() {
	let viewDispatch = Rx.Observable.fromEventPattern(h => Dispatcher.register(h))
	    .filter(payload => payload.actionType === 'viewChanged')
	    .pluck('view');
	let viewSubject = new Rx.ReplaySubject();
	viewDispatch.subscribe(viewSubject);
	let locationsDispatch = this.setLocations()
	    .do(locations => {
		let frontPage = <Front locations={locations} />;
		this.setState({ locations: locations, front: frontPage, currentView: frontPage });
	    });
	locationsDispatch.selectMany(locations => { 
	    return viewSubject
		.map(view => {
		    if(view === 'front')
			return this.state.front
		    return this.findLocation(view).view;
		});
	}).subscribe(view => this.setState({ currentView: view}), error => console.log("Error setting view: " + error));
	
	
    },
    componentDidUpdate() {

    },
    componentWillUnmount() {
	this.viewSub.dispose()
    },
    render() {
	return (<div>
		<Nav locations={this.state.locations}/>
		{this.state.currentView}
		</div>
	       );
    }
});
