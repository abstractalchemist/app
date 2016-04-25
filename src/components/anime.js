import React from 'react/dist/react'
import IndexBanner from './indexbanner'
import Carousel from './carousel'
import AnimeStore from '../stores/anime'
import AnimePost from './animePost'
import AnimeActions from '../actions/anime'
import Auth from '../stores/auth'
import Rx from 'rx'
import ImageStore from '../stores/images'
import Device from '../stores/device'

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
    componentDidMount() {
	Rx.Observable.range(1, this.props.pageCount).map(this.page).toArray().subscribe(data => this.setState({pages:data}))
    },
    render() {
	return ( <ul className="pagination center">
		 <li className="disabled"><a href="#!"><i className="material-icons">chevron_left</i></a></li>
		 {( () => {
		     return this.state.pages;
		 })()
		 }
		 <li className="waves-effect"><a href="#!"><i className="material-icons">chevron_right</i></a></li>
		 </ul>
	       );
    }
});

const Tags = React.createClass({
    render() {
	return (<div className="section">
		{( _=> {
		    return this.props.tags.map( data => {
			return (<div className="chip" key={data}>{data}</div>)
		    })
		})()
		}
		</div>
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
 *        tags -
 *        fullArticle* - callback that is invoked when the full article wants to be seen
 */
const AnimeItem = React.createClass({
    getInitialState() {
	return { }
    },
    componentDidMount() {
    },
    onEdit(evt) {
	$('#update-article-' + this.props.titleId).openModal();
	evt.preventDefault();
    },
    componentWillUnmount() {
    },
    editPost(data) {
	AnimeActions.updateAnimePost({ id: this.props.titleId,
				       title: data.title,
				       img: this.props.img,
				       links: (_=> { if(data.links) return data.link.split(/\s/) })(),
				       entry: data.excerpt,
				       rev: this.props.rev,
				       tags: (_=> { if(data.tags) return data.tags.split(/\s/) })(),
				       content: data.content });
    },
    fullArticle(evt) {
	this.props.fullArticle(this.props.titleId);
	evt.preventDefault();
    },
    render() {
	return ( <div className="col s12" style={{animation: "6s slidein"}}>
		 <div className="card" >
		 <div className="card-image waves-effect waves-block waves-light" style={{minHeight: "100px"}} key={this.props.titleId + '-image'}>
		 {( _ => {
		     if(this.props.img)
			 return (<img className="activator" src={ImageStore.imageUrl(this.props.img)} style={{marginLeft:"auto",marginRight:"auto"}}></img>)
		 })()
		 }
		 </div>
		 <div className="card-content" key={this.props.titleId + '-content'}>
		 {( _=> {
		     if(this.props.tags) {
			 return <Tags tags={this.props.tags} />;
		     }
//		     else {
//			 console.log("Tags? " + this.props.tags);
//		     }
		 })()
		 }
		 <span className="card-title activator grey-text text-darken-4" key={this.props.titleId + '-title'}>{this.props.title}<i className="material-icons right">more_vert</i></span>

		 <div key={this.props.titleId + '-actions'} className="fixed-action-btn horizontal click-to-toggle" style={{position: "relative", top: "5px"}}>
		 <a className="btn-floating btn-large red">
		 <i className="large mdi-navigation-menu"></i>
		 </a>
		 <ul style={{ right: "0"  }}>
		 {(() => {
		     if(this.props.editable) {
			 return ( <li key="edit"><a href={"#update-article-" + this.props.titleId} className="btn-floating red modal-trigger" onClick={this.onEdit}><i className="material-icons">mode_edit</i></a></li> );
		     }
		 })()
		 }
		 <li key="comment"><a href="#" className="btn-floating yellow darken-1" onClick={this.onComment}><i className="material-icons">comment</i></a></li>
		 <li key="rate"><a href="#" className="btn-floating green" onClick={this.onRate}><i className="material-icons">star_rate</i></a></li>
		 </ul>
 		 </div>
		 </div>
		 
		 <div className="card-reveal" key={this.props.titleId + '-reveal'}>
		 <span className="card-title grey-text text-darken-4">{this.props.title}<i className="material-icons right">close</i></span>
		 <p>{this.props.entry}</p>
		 <a href="#" onClick={this.fullArticle}>Full Article</a>
		 </div>
		 </div>
		 {( _=> {
		     if(this.props.editable)
			 return ( <AnimePost
				  img={( _=> { if(this.props.img) { if(this.props.img.startsWith('http')) return this.props.img; return decodeURIComponent(this.props.img) } })()}
				  modalId={"update-article-" + this.props.titleId}
				  handleUpdate={this.editPost}
				  title={this.props.title}
				  excerpt={this.props.entry}
				  updating={true}
				  tags={( _ => { if(this.props.tags) return this.props.tags.join("\n") })()}
				  links={(_ => {
//				      console.log("getting links for " + this.props.links);
				      if(this.props.links)
					  return this.props.links.map(({link:link}) => link).join("\n")
				      return undefined;
				  })()
					}/> )
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
    },
    submitNew(data) {

	AnimeActions.newAnimePost({ id : undefined,
				    title: data.title,
				    img: data.img,
				    entry: data.excerpt,
				    links: data.links.split(/\s/),
				    rev: undefined,
				    content: data.content })
    },
    modalOpen(evt) {
	let linkTarget = evt.currentTarget;
	$('#newAnimeModal').openModal();
	evt.preventDefault();
    },
    render() {
	return (<div className="col s12" style={{animation: "6s slidein"}}>
		<div className="card">
		<div className="card-content">
		<a className="modal-trigger" onClick={this.modalOpen} href="#newAnimeModal"><span className="card-title">Whats new in Anime?</span></a>
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
	return (<div className="col s12" style={{animation: "6s slidein"}}>
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
			console.log("current schedule: " + typeof(this.props.schedule));
			return this.props.schedule.map( ({title:title,link:link}) => {
			    return (<li key={title} className="collection-item avatar"><a href={link}><span className="title">{title}</span></a></li>)
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
    selectColsBasedOnDevice() {
	if(Device.mobile())
	    return 1;
	return 4;
    },
    componentWillMount() {
	this.isMounted = true;
	this.subToken = AnimeStore.registerCallback(_ => {
	    //this.setState({ current : AnimeStore.posts()})
	    this.generateItems(AnimeStore.posts(), this.selectColsBasedOnDevice())
	    AnimeStore.schedule().subscribe(data => {
		if(this.isMounted)
		    this.setState({ schedule: data });
	    });
	});


    },
    componentWillUnmount() {
	this.isMounted = false;
	this.subToken.dispose();
    },
    fullArticle(id) {
	this.props.fullArticle(id);
//	console.log('full article of id %s', id);
    },
    generateItems(items, colCount) {
	if(items) {
//	    console.log("generating %s cols", colCount);
//	    let col0 = [],
//		col1 = [], col2 = [], col3 = [];
	    let current = Rx.Observable.fromArray(items);
	    let col0 = [];
	    
	    if(Auth.authorized())
		col0.push(<NewAnimePost key="newAnimePost"/>);
	    col0.push(<AnimeSchedule schedule={this.state.schedule.schedule} img={this.state.schedule.img} key="watchSchedule"/>);
	    
	    current = Rx.Observable.fromArray(col0).concat(current.map(({id, title,entry,img,editable, _rev: rev, links:links, tags:tags}) => {
		return ( <AnimeItem key={id}
			 titleId={id}
			 tags={tags}
			 title={ title }
			 entry={ entry }
			 img={ img }
			 editable={ editable }
			 rev={ rev }
			 links={links}
			 fullArticle={this.fullArticle}/> )
	    }));
	    Rx.Observable.range(0, colCount)
		.selectMany(col => current.filter( (_, index) => index % colCount == col).toArray())
		.select( (data, index) => {
		    //		    console.log("setting state to " + data + " and index " + index)
		    if(this.isMounted)
			this.setState({ ['col' + index ] : data });
		})
		.subscribe(_ => {
		    if(this.isMounted)
			this.setState({recievedData:true});
		})
			 
	}
	
    },
    render() {
	return ( <div>
		 <IndexBanner title="Anime And Manga" img="background4.jpg" />
		 <div className="container">
		 {( () => {
		     return (<div className="row">

			     {( _ => {
				 if(!this.state.recievedData)
				     return (<div className="progress"><div className="indeterminate"></div></div> );

				 let cols = this.selectColsBasedOnDevice();
//				 console.log("cols is " + cols);
				 let vec = [];
				 for(let i = 0; i < cols; ++i)
				     vec.push(<Col data={this.state["col" + i]} width={12/cols} key={"col" + i} id={"col" + i}/>);
				 return vec;
			     })()
			     }
			     </div>
			    );
			 
		
			 
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
			 return this.state.links.map( ({title:title,link:link}) => ( <li className="collection-item"><a href={link}>{title}</a></li> ) );
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
