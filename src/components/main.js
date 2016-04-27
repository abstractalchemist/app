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
import Device from '../stores/device'
import Programming from './programming'

const Front = React.createClass({

    settings() {
	return [];
    },
    connections() {
	return [];
    },
    render() {
	return ( <div id="front">
		 <IndexBanner title="Abstract Alchemist's Lab" description="Something Interesting" img={( _ => {
		     if(Device.mobile())
			 return "background1.png"
		     return "background1.jpg";
		 })()
												       } signin="true" classes="header center teal-text text-lighten-5" styles={{fontWeight: "500", textShadow: "1px 1px 8px #3BA52F"}}/>
		 <Sections sections={this.props.locations}/>
 		 <Parallax title="Other Stuff You Might Be Interested In" img={( _ => {
		     return "background3.jpg"
		 })()
									      }/>
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
	let publicLocations = [{ name: "Anime", href: "/anime", desc: "", id: ViewActions.animeId(), view: <Anime /> },
			       { name: "Convention", href: "/convention", desc: "", id: ViewActions.conventionId(), view: <Convention /> },
			       { name: "Programming", href: "/programming", desc: "", id: ViewActions.programmingId(), view: <Programming /> },
			       { name: "Samples", href: "/samples", desc: "", id: ViewActions.samplesId(), view: <Samples />}];
	console.log("setting locations")
	return Rx.Observable.just(publicLocations)
	    .selectMany( locations => {

		return Auth.checkImagesAccess().pluck('accessImages').map( accessible => {
		    locations = locations.filter( ({name:name}) => name !== "Images");
		    if(accessible) {
			if(!locations.find( ({name:name}) => name === "Images" ))
			    locations.push({ name: "Images", href: "/images", desc: "", id: ViewActions.imagesId(), noSection: true, view: <Images />});
			else
			    console.log("images already exists");
		    }
		    return locations;
		})
	    })
	    .selectMany(locations => {

		return Auth.checkFrcAccess().pluck('accessFrc').map( accessible => {
		    locations = locations.filter( ({name:name}) => name !== "FRC");
		    if(accessible) {
			if(!locations.find( ({name:name}) => name === "FRC" ))
			    locations.push({ name: "FRC", href: "/frc", desc: "", id: ViewActions.frcId(), view: <FRC />});
			else
			    console.log("frc alread exists");
		    }
		    return locations;
		})
	    });
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
	let viewSubject = new Rx.BehaviorSubject("front");
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
