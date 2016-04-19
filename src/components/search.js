import React from 'react'

const Search = React.createClass({
    render() {
	return ( <form style={{margin:"0px 0px 0px 0px"}}>
		 <div className="input-field">
		 <input id="search-for-stuff" type="search" required>
		 </input>
		 <label htmlFor="search"><i className="material-icons">search</i></label>
		 <i className="material-icons">close</i>
		 </div>
		 </form>
	       )

    }
});


export default React.createClass({
    render() {
	return (<div className="container">
		</div>
	       );
    }
});
