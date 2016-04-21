import React from 'react'
import IndexBanner from './indexbanner'
import Rx from 'rx'

export default React.createClass({
    getInitialState() {
	return {}
    },
    componentDidMount() {
	this.content();
	try {
	    $('ul.tabs').tabs();
	}
	catch(err) {
	}
    },
    componentDidUpdate() {
	try {
	    $('ul.tabs').tabs();
	}
	catch(err) {
	}
    },
    retrieveContent(evt) {
	let target = evt.target;
	Rx.Observable.fromPromise($.ajax({method:"GET", url:target.dataset.href})).subscribe(text => {
	    let contentTarget = target.attributes['href'].nodeValue;
	    console.log("setting to " + contentTarget);
	    $(contentTarget).html(text);
	}, _ => console.log("Error"))
	evt.preventDefault();
    },
    remoteContent() {
	return Rx.Observable.fromArray([{id:0,title:"Macross",href:"/articles/macross.html"},{id:1,title:"Anime U",href:"/articles/anime_u.html"}]);
    },
    content() {
	let content = this.remoteContent();
	content.count().subscribe(num => {
	    content.map( ({id:id,title:title,href:href}) => {
		return ( <li key={id} className={"tab col" + 12/num}><a onClick={this.retrieveContent} data-href={href} data-article-id={id} href={"#content-" + id}>{title}</a></li>)
	    }).toArray().subscribe(data => this.setState({ tabs: data}));
	    content.map( ({id:id, href:href}) => {
		return (<div key={id} id={"content-" + id} className="col s12" data-href={href}></div>)
	    }).toArray().subscribe(data => this.setState({ content: data}));
	});
	
	    
    },
    render() {
	return ( <div className="container">
		 <IndexBanner title="Anime Convention Home" description="Anime Convention Content produced by authors"/>
		 <div className="row">
		 <div className="col s12">
		 <ul className="tabs">
		 { this.state.tabs }
		 </ul>
		 { this.state.content }
		 </div>
		 </div>
		 </div>
	       );
    }
});
