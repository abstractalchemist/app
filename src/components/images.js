import React from 'react'
import ImageStore from '../stores/images.js'
import Rx from 'rx'
import Device from '../stores/device.js'
import Auth from '../stores/auth'
/*
 * props: image - url of image to display
 */
const ImageCard = React.createClass({
    componentDidMount() {
	$('.materialboxed').materialbox();
    },
    render() {
	return (<div className="col s12" style={{animationDuration: "5s", animationName: "slideAndFadeIn", animationTimingFunction: "ease-in-out"}} >
		<div className="material-placeholder" style={{margin: "10px 10px 10px 10px"}}>
		<img src={( _ => {
		    
		    return this.props.image;
	 	})()
		} className="materialboxed" data-caption="an image" width="100%"/>
		</div>
		</div>
	       );
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
    selectColsFromDevice() {
	if(Device.mobile())
	    return 1;
	return 4;
    },
    componentDidMount() {
	ImageStore.images().subscribe(data => {
	    this.setState({ images: data })
	    this.generateImageCols(this.selectColsFromDevice());
	});
	let subscriber = d => {
//	    console.log("scroll distance %s", d);
	    this.generateImageCols(this.selectColsFromDevice());
	};
	let errorHandler = err => console.log("Error in scroll algorithm: %s", err);
	Rx.Observable.fromEvent(window, 'scroll')
	    .debounce(100)
	    .selectMany( _ => {
		let imageHeight = Math.max( $('#images0 > div').height(),$('#images1 > div').height(),$('#images2 > div').height(),$('#images3 > div').height());
//		console.log("length is %s", imageHeight);
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
    generateImageCols(colCount) {
	if(this.state.images) {
	    
	    let imageObservable = Rx.Observable.fromArray(this.state.images)
		.take(this.state.end);

	    Rx.Observable.range(0, colCount)
		.selectMany(col => imageObservable.filter( (_, index) => index % 4 == col).toArray())
		.selectMany( (data, index) => {
		    this.setState({['img' + index] : data});
		    return Rx.Observable.fromArray(data);
		    
		})
		.subscribe( _ => this.setState({recievedData:true}));
	}
    },
    render() {
	
	return (<div className="container">
		
		{( _ => {
		    return  (<div className="row" id="image-container">
			     {( _ => {
				 if(!this.state.recievedData)
				     return ( <div className="progress"><div className="indeterminate"></div></div> );
				 
				 let cols = this.selectColsFromDevice();
				 let vecs = [];
				 for(let i = 0; i < cols; ++i) {
				     vecs.push( <ImageCol width={12/cols} images={this.state['img' + i]} key={"images" + i} id={"images" + i} /> );
				 }
				 return vecs;
			     })()
			     }
			     </div>)
		    
		})()
		}

		</div>
	       );
    }
});
