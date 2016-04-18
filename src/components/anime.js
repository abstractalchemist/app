import React from 'react/dist/react'
import IndexBanner from './indexbanner'
import Carousel from './carousel'
import AnimeStore from '../stores/anime'
import AnimePost from './animePost'
import AnimeActions from '../actions/anime'
import Auth from '../stores/auth'
import Rx from 'rx'
import ImageStore from '../stores/images'

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
 *        fullArticle* - callback that is invoked when the full article wants to be seen
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
    fullArticle(evt) {
	this.props.fullArticle(this.props.titleId);
	evt.preventDefault();
    },
    render() {
	return ( <div className="col s12">
		 <div className="card" >
		 <div className="card-image waves-effect waves-block waves-light" style={{minHeight: "100px"}}>
		 {( _ => {
		     if(this.props.img)
			 return (<img className="activator" src={ImageStore.imageUrl(this.props.img)} style={{marginLeft:"auto",marginRight:"auto"}}></img>)
		 })()
		 }
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
		 <a href="#" onClick={this.fullArticle}>Full Article</a>
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

	AnimeActions.newAnimePost({ titleId : undefined,
				    title: data.title,
				    img: data.img,
				    entry: data.excerpt,
				    links: data.links.split(/\s/),
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

/*
 * props: schedule* - the current watch schedule
 *        img - the current img
 */
const AnimeSchedule = React.createClass({
    render() {
	return (<div className="col s12">
		<div className="card">

		<div className="card-image">
		<img className="activator" src={ImageStore.imageUrl(this.props.img)} />
		</div>

		<div className="card-content">
		<span className="card-title activator">Anime Watch Schedule</span>
		</div>

		<div className="card-reveal">
		<span className="card-title">Anime Watch Schedule</span>
		<ul className="collection">
		{( _ => {
		    if(this.props.schedule) {
			return this.props.schedule.map( data => {
			    return (<li className="collection-item avatar"><span className="title">{data}</span></li>)
			})
		    }
		})()
		}
		</ul>				      
		</div>
		</div>
		</div>
	       )
    }
});

/*
 * props: fullArticle
 */
const AnimeView = React.createClass({
    getInitialState() {
	return { currentLow: 0, currentHigh: 10, current: [], schedule: [] };
    },
    componentWillMount() {

	this.subToken = AnimeStore.registerCallback(_ => {
	    this.setState({ current : AnimeStore.posts()})
	    
	});
	AnimeStore.schedule().subscribe(data => this.setState({ schedule: data }));
    },
    componentWillUnmount() {
	this.subToken.dispose();
    },
    fullArticle(id) {
	this.props.fullArticle(id);
	console.log('full article of id %s', id);
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
			 col0.push(<AnimeSchedule schedule={this.state.schedule.schedule} img={this.state.schedule.img} />);
			 current = Rx.Observable.fromArray(col0).concat(current.map(({id, title,entry,img,editable, _rev: rev}) => {
			     return ( <AnimeItem key={id} titleId={id} title={ title } entry={ entry } img={ img } editable={ editable } rev={ rev } fullArticle={this.fullArticle}/> )
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

/*
 * carousel to show screenshots 
 *
 * props: screenshots* - list of srcs for screenshots
 */
const AnimeScreenShots = React.createClass({
    render() {
	return ( <div className="carousel">
		 {( _ => {
		     return this.props.screenshots.map( data => ( <a className="carousel-item"><img src={data} className="materializedbox"/></a> ) );
		 })()
		 }
		 </div>
	       );
    }
});

/*
 * props: id* - id of the article to display
 *        back* - callback to return to previous screen
 */
const AnimeArticle = React.createClass({
    getInitialState() {
	return {}
    },
    componentDidMount() {
	AnimeStore.getArticle(this.props.id).subscribe( ({title:title,content:content,img:img,links:links}) => {
	    this.setState({ title: title, content: content,img:img,links:links})
	});
    },
    back(evt) {
	this.props.back();
	evt.preventDefault();
    },
    render() {
	return ( <div className="container">
		 <div className="row">
		 <h1 className="center-align">{this.state.title}</h1>
		 
		 <div className="col s8 offset-s2">
		 <img src={ImageStore.imageUrl(this.state.img)} style={{minWidth: "60%"}}/>
		 </div>
		 <div className="col s12">
		 <p>
		 {this.state.content}
		 </p>
		 </div>
		 
		 <div className="col s12">
		 <ul className="collection">
		 {( _ => {
		     if(this.state.links) {
			 return this.state.links.map( data => ( <li className="collection-item"><a href={data}>Link 1</a></li> ) );
		     }
		 })()
		 }
		 </ul>
		 </div>
		 
		 <div className="col s12">
		 {( _ => {
		     if(this.state.screenshots) {
			 return <AnimeScreenShots  screenshots={this.state.screenshots} />;
		     }
		 })()
		 }
		 </div>
		 
		 <div className="col s12">
		 <a href="#" onClick={this.back}>Back</a>
		 </div>
		 
		 </div>
		 </div>
	       )
    }
});

export default React.createClass({
    getInitialState() {
	return { view : <AnimeView fullArticle={this.fullArticle} />};
    },
    componentDidMount() {
    },
    componentWillUnmount() {
    },
    back() {
	this.setState({ view: <AnimeView fullArticle={this.fullArticle} />});
    },
    fullArticle(id) {
	this.setState({ view: <AnimeArticle id={id} back={this.back}/> });
    },
    render() {
	return (<div id="anime">
		{this.state.view}
		</div>
	       )
    }
});
