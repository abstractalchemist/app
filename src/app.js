import React from 'react/dist/react';
import ReactDOM from 'react-dom/dist/react-dom';
import Main from './components/main'
import ViewActions from './actions/view'

$(document).ready(() => {
    ReactDOM.render(<Main />, $('#main')[0]);
    
    page('/anime', _ => {
	console.log("navigating to anime");
	ViewActions.anime();
    });
    page('/programming', _ => {
	console.log("navigating to programming");
	ViewActions.programming();
    });
    page('/search', _ => {
	ViewActions.search();
    });
    page('/frc', _ => {
	ViewActions.frc();
    });
    page('/images', _ => {
	ViewActions.images();
    });
    page('/convention', _ => {
	ViewActions.convention();
    });
    page('/samples', _ => {
	ViewActions.samples();
    });
    page('/', _ => {
	console.log("default login");
	ViewActions.front();
    });
    page({hashbang:true});

});
