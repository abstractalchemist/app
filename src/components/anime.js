import React from 'react/dist/react'
import IndexBanner from './indexbanner'
import Carousel from './carousel'
import AnimeStore from '../stores/anime'
import ImageGallery from '../stores/image_gallery'
import AnimePost from './animePost'
import AnimeActions from '../actions/anime'
import Auth from '../stores/auth'
import Rx from 'rx'

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
	return ( <li key={"page-" + i} className={className}><a href="#!">{i}</a></li> );
	
    },
    render() {
	return ( <ul className="pagination center">
		 <li className="disabled"><a href="#!"><i className="material-icons">chevron_left</i></a></li>
		 {( () => {
		     let v = []
		     Rx.Observable.range(1, this.props.pageCount).map(this.page).subscribe(data => v.push(data))
		     return v;
		 })()
		 }
		 <li className="waves-effect"><a href="#!"><i className="material-icons">chevron_right</i></a></li>
		 </ul>
	       );
    }
});

/*
 * props: title - title of article to display
 *        titleId - id of article to display
 *        editable - true if the current viewer can edit the article in question
 *        img - url to the image to display in the card
 *        entry - excerpt to show 
 *        rev - revision number in couchdb ; needed for update
 */
const AnimeItem = React.createClass({
    getInitialState() {
	return { editing: false }
    },
    componentDidMount() {

    },
    onEdit(evt) {
	this.setState({ editing: true });
	evt.preventDefault();
    },
    componentWillUnmount() {
    },
    editPost(data) {
	AnimeActions.updateAnimePost({ titleId: this.props.titleId,
				       title: data.title,
				       img: this.props.img,
				       entry: data.excerpt,
				       rev: this.props.rev,
				       content: data.content });
    },
    render() {
	return ( <div className="col s12">
		 <div className="card">
		 <div className="card-image waves-effect waves-block waves-light">
		 <img className="activator" src={this.props.img} style={{marginLeft:"auto",marginRight:"auto"}}></img>
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
			 return ( <li key="edit"><a href="#" className="btn-floating red" onClick={this.onEdit}><i className="material-icons">mode_edit</i></a></li> );
		     }
		 })()
		 }
		 <li key="comment"><a href="#" className="btn-floating yellow darken-1" onClick={this.onComment}><i className="material-icons">comment</i></a></li>
		 <li key="rate"><a href="#" className="btn-floating green" onClick={this.onRate}><i className="material-icons">star_rate</i></a></li>
		 </ul>
 		 </div>
		 </div>
		 
		 <div className="card-reveal">
		 <span className="card-title grey-text text-darken-4">{this.props.title}<i className="material-icons right">close</i></span>
		 <p>{this.props.entry}</p>
		 </div>
		 </div>
		 {( _=> {
		     if(this.state.editing)
			 return ( <AnimePost modalId={"update-" + this.props.title} handleUpdate={this.editPost} title={this.props.title} excerpt={this.props.entry}/> )
		 })()}
		 </div>
	       );
    }
});

const Col = React.createClass({
    render() {
	return (<div className={"col s" + this.props.width}>
		<div className="row">
		{( _=> {
		    return this.props.data;
		})()
		}
		</div>
		</div>
	       );
    }
});

const NewAnimePost = React.createClass({
    getInitialState() {
	return {};
    },
    componentDidMount() {
	$('.modal-trigger').leanModal();
    },
    submitNew(data) {
	console.log("Submit new log");
	AnimeActions.newAnimePost({ titleId : undefined,
				    title: data.title,
				    img: undefined,
				    entry: data.excerpt,
				    rev: undefined,
				    content: data.content })
    },
   
    render() {
	return (<div className="col s12">
		<div className="card">
		<div className="card-content">
		<a className="modal-trigger" href="#newAnimeModal"><span className="card-title">Whats new in Anime?</span></a>
		</div>
		<div className="card-action">
		</div>
		</div>
		<AnimePost modalId="newAnimeModal" handleUpdate={this.submitNew}/>
		</div>
	       )
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
		 {( () => {
		     if(this.state.current) {
			 let col0 = [],
			     col1 = [], col2 = [], col3 = [];
			 let current = Rx.Observable.fromArray(this.state.current);
			 if(Auth.authorized())
			     col0.push(<NewAnimePost />);
			 current = Rx.Observable.fromArray(col0).concat(current.map(({id, title,entry,img,editable, _rev: rev}) => {
			     return ( <AnimeItem key={id} titleId={id} title={ title } entry={ entry } img={ img } editable={ editable } rev={ rev }/> )
			 }));
			 current.filter( (_, index) => index % 4 == 0).toArray().subscribe(data => col0 = data);
			 current.filter( (_, index) => index % 4 == 1).toArray().subscribe(data => col1 = data);
			 current.filter( (_, index) => index % 4 == 2).toArray().subscribe(data => col2 = data);
			 current.filter( (_, index) => index % 4 == 3).toArray().subscribe(data => col3 = data);
			 return (<div className="row">
				 <Col data={col0} width={3} key="col0" />
				 <Col data={col1} width={3} key="col1" />
				 <Col data={col2} width={3} key="col2" />
				 <Col data={col3} width={3} key="col3" />
				 </div>
			 );
			 
			 return current;
			 
		     }
		 })()
		 }
		 </div>
		
		 <div className="container center">
		 <Pagination pageCount="5" activePage="1" />
		 </div>
		 </div>
		 
	       );
    }
});


export default React.createClass({
    getInitialState() {
	return { };
    },
    componentDidMount() {
    },
    componentWillUnmount() {
    },
    render() {
	return (<div id="anime">
		<AnimeView />
		</div>
	       )
    }
});
