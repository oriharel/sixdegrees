var Reflux = require('reflux');
var GameActions = require('./GameActions');
var Constants = require('./Constants');	

var ActorsStore = Reflux.createStore({

	localStorageKey: 'sixdegrees-popular',

	getInitialState: function() {
		console.log('getting initial state from store');
		var loadedPopularActors = localStorage.getItem(this.localStorageKey);
		if (loadedPopularActors) {
			this.popularActors = JSON.parse(loadedPopularActors);
		}
		else {
			this.popularActors = [];
		}

		var existingPopular = [], that = this;
		//TODO - obviesly need to cache stuff here and load quickly
  		for (var i = 1; i < 50; i++) {
  			$.ajax({
		      url: "http://api.themoviedb.org/3/person/popular",
		      dataType: 'json',
		      data: {
				api_key: Constants.API_KEY,
				page: i
			  },
		      success: function(data) {
		      	existingPopular = existingPopular.concat(data.results);
		        // console.log('num of people: '+existingPopular.length);
		        if (existingPopular.length === 980) {
		        	console.log('saving popular actors list');
		        	var toStore = JSON.stringify(existingPopular);
		        	localStorage.setItem(this.localStorageKey, toStore);
		        	that.trigger(existingPopular);
		        }
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
		    });
  		}
  		console.log('returning '+this.popularActors.length+' popularActors');
		return this.popularActors;
	}

})

module.exports = ActorsStore;