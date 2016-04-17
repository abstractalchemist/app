import React from 'react'
import ImageStore from '../stores/images.js'
import Rx from 'rx'

/*
 * props: image - url of image to display
 */
const ImageCard = React.createClass({
    componentDidMount() {
	$('.materialboxed').materialbox();
    },
    render() {
	return (<div className="col s12">
		<div className="card">
		<div className="card-image">
		<img src={this.props.image} className="materialboxed"/>
		</div>
		<div className="card-content">
		</div>
		</div>
		</div>
	       )
    }
});


/*
 * props: width - inverse width of column
 *        images - images to display
 */
const ImageCol = React.createClass({
    render() {
	return (<div className={"col s" + this.props.width}>
		<div className="row">
		{( _ => {
		    return this.props.images.map( ({id:id}) => {
			return ( <ImageCard key={id} image={ImageStore.imageUrl(id)} /> )
		    })
		})()
		}
		</div>
		</div>
	       )
    }

});

export default React.createClass({
    getInitialState() {
	return { images: undefined, start:0, end:20 }
    },
    componentDidMount() {
	ImageStore.images().subscribe(data => {
	    this.setState({ images: data })
	});
	let currentLength = 3000;
	let inc = 1000;

	Rx.Observable.fromEvent(window, 'scroll')
	    .selectMany( _ => {
		return Rx.Observable.just((window.scrollY + window.innerHeight) - document.documentElement.offsetHeight);
	    })
	    .debounce(500)
	    .do(distance => {
		if(distance >= -50 ) {
		    if(this.state.end < this.state.images.length)
			this.setState({end : this.state.end + 10})
		}
		    
	    })
		.subscribe(d => {
		    console.log("scroll distance: " + d + "; currentLength: " + currentLength)
		},
			   _ => {});
    },
    render() {
	
	return (<div className="container">
		
		{( _ => {
		    if(this.state.images) {
			let img0, img1, img2, img3;
			let imageObservable = Rx.Observable.fromArray(this.state.images).take(this.state.end);
			imageObservable.filter( (_, index) => index % 4 == 0)
			    .toArray()
			    .subscribe(data => img0 = data);
			imageObservable.filter( (_, index) => index % 4 == 1)
			    .toArray()
			    .subscribe(data => img1 = data);
			imageObservable.filter( (_, index) => index % 4 == 2)
			    .toArray()
			    .subscribe(data => img2 = data);
			imageObservable.filter( (_, index) => index % 4 == 3)
			    .toArray()
			    .subscribe(data => img3 = data);
			return  (<div className="row" id="image-container">
				 <ImageCol width={3} images={img0} />
				 <ImageCol width={3} images={img1} />
				 <ImageCol width={3} images={img2} />
				 <ImageCol width={3} images={img3} />
				 </div>)
		    }
		})()
		}

		</div>
	       );
    }
});
