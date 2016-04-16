import React from 'react/dist/react'
import IndexBanner from './indexbanner'
import Carousel from './carousel'
import AnimeStore from '../stores/anime'
import ImageGallery from '../stores/image_gallery'
import Dispatcher from '../util/dispatcher'
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

const AnimeItem = React.createClass({
    componentDidMount() {

    },
    onEdit(evt) {
	Dispatcher.dispatch({actionType:"animeEdit", view:"edit",id: this.props.titleId, rev:this.props.rev});
	console.log("on edit clicked");
	evt.preventDefault();
    },
    componentWillUnmount() {
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
		 </div>
	       );
    }
});

const PageEdit = React.createClass({
    render() {
	return (<div className="col m4" >
		<div className="card" style={{height:"800px"}}>
		<div className="card-content">
		<span className="card-title">Whats New In Anime</span>
		<div className="card-action">
		</div>
		</div>
		</div>
		</div>
	       )
    }
})


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
	return { data: {} }
    },
    componentDidMount() {
	$('.modal-trigger').leanModal();
    },
    handleChange(evt) {
	let target = evt.currentTarget;
	let dataObj = this.state.data;
	dataObj[target.name] = target.value;
	this.setState({ data: dataObj });
	
	evt.preventDefault();
    },
    submitNew(evt) {
	console.log("Submit new log");
	Dispatcher.dispatcher({actionType: "newAnimePost", data:this.state.data});
	this.setState({data: {}});
	evt.preventDefault();
    },
    cancel(evt) {
	$('#newAnimeModal').closeModal();
	this.setState({data: {}});
	evt.preventDefault();
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

		<div id="newAnimeModal" className="modal">
		<div className="modal-content">
		<h4>New Post</h4>
		<form>
		<div className="container">
		<div className="row">
		<div className="input-field col s12">
		<input type="text" name="title" onChange={this.handleChange}></input>
		<label>Title</label>
		</div>
		</div>

		<div className="row">
		<div className="input-field col s12">
		<input type="text" name="imageHeader" onChange={this.handleChange}></input>
		<label>Image Header</label>
		</div>
		</div>

		
		<div className="row">
		<div className="input-field col s12">
		<textarea name="excerpt" style={{height:"5rem"}} onChange={this.handleChange} className="materialize-textarea"></textarea>
		<label>Excerpt</label>
		</div>
		</div>

		<div className="row">
		<div className="input-field col s12">
		<textarea name="content" style={{height:"15rem"}} onChange={this.handleChange} className="materialize-textarea"></textarea>
		<label>Content</label>
		</div>
		</div>

		<div className="row">
		<div className="input-field col s12">
		<textarea name="links" style={{height:"2rem"}} onChange={this.handleChange} className="materialize-textarea"></textarea>
		<label>Links</label>
		</div>
		</div>
		
		<div className="row">
		<div className="input-field col s3">
		<button className="btn" onClick={this.submitNew}>Create New</button>
		</div>
		<div className="input-field col s2">
		<button className="btn" onClick={this.cancel}>Cancel</button>
		</div>
		</div>
		
		</div>
		</form>
		
		</div>
		</div>
		
		</div>
	       )
    }
});

const AnimePost = React.createClass({
    render() {
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

const AnimeEdit = React.createClass({
    getInitialState() {
	return {};
    },
    back(evt) {
	Dispatcher.dispatch({actionType:"animeEdit"})
	evt.preventDefault();
    },
    post(evt) {

	AnimeStore.updatePost(this.props.id, this.props.rev, this.state.postBody);
	Dispatcher.dispatch({actionType:"animeEdit"})
	evt.preventDefault();
    },
    textChange(evt) {
	this.setState({postBody: evt.target.value});
    },
    render() {
	return ( <div className="container">
		 <h1>{ this.props.title }</h1>
		 <div className="row">
		 <form className="col s12">
		 <div className="row">
		 <div className="input-field col s12">
		 <textarea id="textarea1" className="materialize-textarea" value={this.state.postBody} onChange={this.textChange}></textarea>
		 <label for="textarea1">Textarea</label>
		 </div>
		 <input type="submit" onClick={this.post} className="btn waves-effect waves-light"></input>
		 </div>
		 </form>
		 <a href="#" onClick={this.back} className="btn waves-effect waves-light">Back To View</a>
		 </div>
		 </div>
	);
    }
});

export default React.createClass({
    getInitialState() {
	return { view: ( <AnimeView /> )};
    },
    findLocations({view, id, title, rev}) {
	
	switch(view) {
	case 'edit':
	    return ( <AnimeEdit id={id} title={title} rev={rev}/> )
	default:
	    return ( <AnimeView /> )
	}
    },
    componentDidMount() {
	this.subToken = AnimeStore.registerCallback(_ => {
	    let view;
	    if(view = AnimeStore.view()) {
		console.log("Changing view to " + view);
		if(view.id != undefined) {
		    AnimeStore.post(view.id).subscribe(data => {
			console.log("using title " + data.title);
			view.title = data.title;
			this.setState({ view: this.findLocations(view)});
		    });
		}
		else
		    this.setState({ view: this.findLocations(view)});
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
