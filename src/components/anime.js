import React from 'react/dist/react'
import IndexBanner from './indexbanner'
import AnimeStore from '../stores/anime'

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
    render() {
	return ( <div className="row">
		 <div className="col s12 m6 offset-m3">
		 <div className="card large">
		 <div className="card-image waves-effect waves-block waves-light">
		 <img className="activator" src={this.props.img} style={{width:"400",marginLeft:"auto",marginRight:"auto"}}></img>
		 </div>
		 <div className="card-content">
		 <span className="card-title activator grey-text text-darken-4">{this.props.title}<i className="material-icons right">more_vert</i></span>
		 <p><a href="#">This is a link</a></p>
		 </div>
		 <div className="card-reveal">
		 <span className="card-title grey-text text-darken-4">{this.props.title}<i className="material-icons right">close</i></span>
		 <p>{this.props.entry}</p>
		 </div>
		 </div>
		 </div>
		 </div>
	       );
    }
});

export default React.createClass({
    getInitialState() {
	return { currentLow: 0, currentHigh: 10, current: [] };
    },
    componentWillMount() {
	let update = () => {
	    this.setState({ current :AnimeStore.get(this.state.currentLow, this.state.currentHigh) });
	    window.setTimeout(update, 60000);
	};
	window.setTimeout(update, 6000);
    },
    render() {
	return ( <div>
		 <IndexBanner title="Anime And Manga" img="background4.jpg" />
		 {( () => {
		     return this.state.current.map( ({title,entry,img}) => {
			 return ( <AnimeItem title={ title } entry={ entry } img={ img }/> )
		     })
		 })()
		 }
		 <div className="container center">
		 <Pagination pageCount="5" activePage="1" />
		 </div>
		 </div>
		 
	       );
    }
});
