import React from 'react/dist/react'

const Icon = React.createClass({
    render() {
	return ( <h2 className="center brown-text"><i className="material-icons">{this.props.icon}</i></h2> )
    }
});

const Section = React.createClass({
    render() {
	return ( <div className={"col " + this.props.size }>
		 <div className="icon-block">
		 <Icon icon={this.props.icon} />
		 <h5 className="center">{this.props.short}</h5>
		 <p className="light">{this.props.long}</p>
		 </div>
		 </div>
	       );
    }
});

export default React.createClass({
    render() {
	return ( <div className="container">
		 <div className="section">
		 <div className="row">

		 { ( () => {
		     let filtered = this.props.sections.filter(({noSection}) => !noSection);
		     const size = "m" + Math.floor(12/filtered.length);
		     return filtered.map( ({ name, desc, icon, id }) => {
			 return ( <Section short={name} long={ desc } icon={ icon } size={ size } key={ id + "-section" }/> );
		     })
		 } )()
		 }
		 
		 </div>
		 </div>
		 </div>
	       );
    }
});
