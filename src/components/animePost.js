import React from 'react'

/*
 * props: title - title of article
 *        excerpt - excerpt to display in article card
 *        content - content to show for full
 *        links - additional links associated with article
 *        tags - tags to set for the article
 *        handleUpdate* - callback to handle updates to parent
 *        updating - whether this modal is updating or creating a new article
 * state: data
 */
export default React.createClass({
    getInitialState() {
	return { data: {} }
    },
    componentDidMount() {
	let data = { title: this.props.title,
		     excerpt: this.props.excerpt,
		     content: this.props.content,
		     tags: this.props.tags,
		     links: this.props.links };
	this.setState({ data: data });
    },
    /*componentWillReceiveProps(nextProps) {
	let data = { title: this.props.title,
		     excerpt: this.props.excerpt,
		     content: this.props.content,
		     tags: this.props.tags,
		     links: this.props.links };
	this.setState({ data: data });
    },*/
    cancel(evt) {

	if(!this.props.updating)
	    this.replaceState({data: {}});
	$('#' + this.props.modalId).closeModal();
	evt.preventDefault();
    },
    handleChange(evt) {
	let target = evt.currentTarget;
	this.state.data[target.name] = target.value;
	this.setState({ data : this.state.data });
    },
    submitNew(evt) {
	console.log("updating or creating new: %s", this.state.data);
	try {
	    this.props.handleUpdate(this.state.data);
	}
	catch(error) {
	    console.log("error");
	}
	this.cancel(evt);

    },
    render() {
	//console.log("rendering anime post; title is %s, excerpt is %s, id is %s", this.state.data.title, this.state.data.excerpt, this.props.modalId);
	
	return (<div id={this.props.modalId} className="modal">
		<div className="modal-content">
		<h4>New Post</h4>
		<form>
		<div className="container">
		<div className="row">
		<div className="input-field col s12">
		<input type="text" name="title" onChange={this.handleChange} value={this.state.data.title}></input>
		<label>Title</label>
		</div>
		</div>

		<div className="row">
		<div className="input-field col s12">
		<input type="text" name="img" onChange={this.handleChange}></input>
		<label>Image Header</label>
		</div>
		</div>

		
		<div className="row">
		<div className="input-field col s12">
		<textarea name="excerpt" style={{height:"5rem"}} onChange={this.handleChange} className="materialize-textarea" value={this.state.data.excerpt}></textarea>
		<label>Excerpt</label>
		</div>
		</div>

		<div className="row">
		<div className="input-field col s12">
		<textarea name="content" style={{height:"15rem"}} onChange={this.handleChange} className="materialize-textarea" value={this.state.data.content}></textarea>
		<label>Content</label>
		</div>
		</div>

		<div className="row">
		<div className="input-field col s12">
		<textarea name="links" style={{height:"2rem"}} onChange={this.handleChange} className="materialize-textarea" value={this.state.data.links}></textarea>
		<label>Links</label>
		</div>
		</div>

		<div className="row">
		<div className="input-field col s12">
		<textarea name="tags" style={{height:"2rem"}} onChange={this.handleChange} className="materialize-textarea" value={this.state.data.tags}></textarea>
		<label>Tags</label>
		</div>
		</div>
		
		<div className="row">
		<div className="input-field col s3">
		<button className="btn" onClick={this.submitNew}>{
		    (_ => {
			if(this.props.updating)
			    return "Update"
			return "Create New"
		    })()
		}</button>
		</div>
		<div className="input-field col s2">
		<button className="btn" onClick={this.cancel}>Cancel</button>
		</div>
		</div>
		
		</div>
		</form>
		
		</div>
		</div>
	       );
    }
});

