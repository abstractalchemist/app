import React from 'react'
import IndexBanner from './indexbanner'

export default React.createClass({
    getInitialState() {
	return {}
    },
    render() {
	return (<div>
		<IndexBanner title="Programming" description="Under Construction" img="programming.jpg"/>
		</div>)
    }
});
