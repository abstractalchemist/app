import React from 'react/dist/react'

const Setting = React.createClass({
    render() {
	return ( <li><a className="white-text" href="#!">{this.props.link}</a></li> );
    }
});

const Connection = React.createClass({
    render() {
	return ( <li><a className="white-text" href="#!">{this.props.link}</a></li> );
    }
});


export default React.createClass({
    render() {
	return (   <footer className="page-footer teal">
		   <div className="container">
		   <div className="row">
		   <div className="col l6 s12">
		   <h5 className="white-text">Bio</h5>
		   <p className="grey-text text-lighten-4">{ this.props.bio }</p>


		   </div>
		   <div className="col l3 s12">
		   <h5 className="white-text">Settings</h5>
		   <ul>
		   {( () => {
		       return this.props.settings.map(({id,link,name}) => {
			   return ( <Settings link={ name } href={ link } key={ id }/> );
		       });
		   } )()
		   }
		   </ul>
		   </div>
		   <div className="col l3 s12">
		   <h5 className="white-text">Connect</h5>
		   <ul>
		   {( () => {
		       return this.props.connect.map( ({id,link,name}) => {
			   return ( <Connection link={ name } href={ link } key={ id } /> );
		       })
		   }) ()
		   }
		   </ul>
		   </div>
		   </div>
		   </div>
		   <div className="footer-copyright">
		   <div className="container">
		   Created By <a className="brown-text text-lighten-3" href="#">Jason Hirata</a>
		   </div>
		   </div>
		   </footer>
)
}
});
