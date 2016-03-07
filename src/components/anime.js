import React from 'react/dist/react'
import IndexBanner from './indexbanner'
import Carousel from './carousel'
import AnimeStore from '../stores/anime'
import ImageGallery from '../stores/image_gallery'
import Dispatcher from '../util/dispatcher'

const Pagination = React.createClass({
    getInitialState() {
	return { activePage: {} }
    },
    page(i) {
	let className = "waves-effect";
	let active = -1;
	if(this.props.activePage) {
	    active = Number.parseInt(this.props.activePage);
	}
	if(i === active)
	    className = "active";
	return ( <li className={className}><a href="#!">{i}</a></li> );
	
    },
    render() {
	return ( <ul className="pagination center">
		 <li className="disabled"><a href="#!"><i className="material-icons">chevron_left</i></a></li>
		 {( () => {
		     let v = [];
		     let i = 1;
		     for(; i <= this.props.pageCount; ++i) {
			 v[i] = this.page(i);
		     }
		     return v;
		 })()
		 }
		 <li className="waves-effect"><a href="#!"><i className="material-icons">chevron_right</i></a></li>
		 </ul>
	       );
    }
});

const AnimeItem = React.createClass({
    componentDidMount() {
	Rx.Observable.fromEventPattern(h => this.onEdit = h.bind(this))
	    .map( _ => { return { actionType: "animeEdit", id: this.props.title } })
	    .subscribe(Dispatcher.dispatch);
	Rx.Observable.fromEventPattern(h => this.onComment = h.bind(this));
	Rx.Observable.fromEventPattern(h => this.onRate = h.bind(this));
    },
    componentWillUnmount() {
    },
    // onEdit(evt) {
    // 	evt.preventDefault();
    // },
    // onComment(evt) {
    // },
    // onRate(evt) {
    // },
    render() {
	return ( <div className="col m4">
		 <div className="card">
		 <div className="card-image waves-effect waves-block waves-light">
		 <img className="activator" src={this.props.img} style={{width:"400",marginLeft:"auto",marginRight:"auto"}}></img>
		 </div>
		 <div className="card-content">
		 <span className="card-title activator grey-text text-darken-4">{this.props.title}<i className="material-icons right">more_vert</i></span>

		 <div className="fixed-action-btn horizontal click-to-toggle" style={{position: "relative", top: "5px"}}>
		 <a className="btn-floating btn-large red">
		 <i className="large mdi-navigation-menu"></i>
		 </a>
		 <ul>
		 {(() => {
		     if(this.props.editable) {
			 return ( <li><a className="btn-floating red" onClick={this.onEdit}><i className="material-icons">mode_edit</i></a></li> );
		     }
		 })()
		 }
		 <li><a className="btn-floating yellow darken-1" onClick={this.onComment}><i className="material-icons">comment</i></a></li>
		 <li><a className="btn-floating green" onClick={this.onRate}><i className="material-icons">star_rate</i></a></li>
		 </ul>
 		 </div>
		 </div>
		 
		 <div className="card-reveal">
		 <span className="card-title grey-text text-darken-4">{this.props.title}<i className="material-icons right">close</i></span>
		 <p>{this.props.entry}</p>
		 </div>
		 </div>
		 </div>
	       );
    }
});

const AnimeView = React.createClass({
    getInitialState() {
	return { currentLow: 0, currentHigh: 10, current: [] };
    },
    componentWillMount() {

	this.subToken = AnimeStore.registerCallback(_ => {
	    this.setState({ current : AnimeStore.posts() })
	});
    },
    componentWillUnmount() {
	this.subToken.dispose();
    },
    render() {
	return ( <div>
		 <IndexBanner title="Anime And Manga" img="background4.jpg" />
		 <div className="container">
		 <div className="row">
		 {( () => {
		     if(this.state.current) {
			 return this.state.current.map( ({title,entry,img,editable}) => {
			     return ( <AnimeItem title={ title } entry={ entry } img={ img } editable={ editable } /> )
			 })
		     }
		 })()
		 }
		 </div>
		 </div>
		 <div className="container center">
		 <Pagination pageCount="5" activePage="1" />
		 </div>
		 </div>
		 
	       );
    }
});

const AnimeEdit = React.createClass({
    render() {
	return ( <div className="container">
		 <h1>{ this.props.title }</h1>
		 <div className="row">
		 <form className="col s12">
		 <div className="row">
		 <div className="input-field col s12">
		 <textarea id="textarea1" className="materialize-textarea"></textarea>
		 <label for="textarea1">Textarea</label>
		 </div>
		 </div>
		 </form>
		 </div>
		 </div>
	);
    }
});

export default React.createClass({
    getInitialState() {
	return { view: ( <AnimeView /> )};
    },
    findLocations(loc) {
	switch(loc) {
	case 'edit':
	    return ( <AnimeEdit /> )
	default:
	    return ( <AnimeView /> )
	}
    },
    componentDidMount() {
	this.subToken = AnimeStore.registerCallback(_ => {
	    if(AnimeStore.view()) {
		console.log("Changing view to " + AnimeStore.view());
		this.setState({ view: this.findLocations(AnimeStore.view()) })
	    }
	});
    },
    componentWillUnmount() {
	this.subToken.dispose();
    },
    render() {
	return (<div id="anime">
		{ this.state.view }
		</div>
	       )
    }
});
