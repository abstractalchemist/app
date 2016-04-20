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
	return (<div className="col s12" style={{animation: "5s slidein"}} >
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
	return (<div className={"col s" + this.props.width} id={this.props.id}>
		<div className="row">
		{( _ => {
		    if(this.props.images) {
			return this.props.images.map( ({id:id}) => {
			    return ( <ImageCard key={id} image={ImageStore.imageUrl(id)} /> )
			})
		    }
		    else {
			console.log("no images found");
		    }
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
	    this.generateImageCols();
	});
	let subscriber = d => {
	    console.log("scroll distance %s", d);
	    this.generateImageCols();
	};
	let errorHandler = err => console.log("Error in scroll algorithm: %s", err);
	Rx.Observable.fromEvent(window, 'scroll')
	    .debounce(100)
	    .selectMany( _ => {
		let imageHeight = Math.max( $('#images0 > div').height(),$('#images1 > div').height(),$('#images2 > div').height(),$('#images3 > div').height());
		console.log("length is %s", imageHeight);
		return Rx.Observable.just((window.scrollY + window.innerHeight) - imageHeight);
	    })
	    .do(distance => {
		if(distance >= -100 ) {
		    if(this.state.end < this.state.images.length)
			this.setState({end : this.state.end + 10})
		}
		
	    })
		.subscribe(subscriber, errorHandler);

    },
    generateImageCols() {
	if(this.state.images) {
	    let img0, img1, img2, img3;
	    
	    let imageObservable = Rx.Observable.fromArray(this.state.images)
		.take(this.state.end);
	    
	    
	    imageObservable
		.filter( (_, index) => index % 4 == 0)
		.toArray()
		.subscribe(data => this.setState({img0:data}));
	    imageObservable.filter( (_, index) => index % 4 == 1)
		.toArray()
		.subscribe(data => this.setState({img1:data}));
	    imageObservable.filter( (_, index) => index % 4 == 2)
		.toArray()
		.subscribe(data => this.setState({img2:data}));
	    imageObservable.filter( (_, index) => index % 4 == 3)
		.toArray()
		.subscribe(data => this.setState({img3:data}));
	    
	}
    },
    render() {
	
	return (<div className="container">
		
		{( _ => {
			return  (<div className="row" id="image-container">
				 <ImageCol width={3} images={this.state.img0} key="images0" id="images0"/>
				 <ImageCol width={3} images={this.state.img1} key="images1" id="images1"/>
				 <ImageCol width={3} images={this.state.img2} key="images2" id="images2"/>
				 <ImageCol width={3} images={this.state.img3} key="images3" id="images3"/>
				 </div>)
		    
		})()
		}

		</div>
	       );
    }
});
