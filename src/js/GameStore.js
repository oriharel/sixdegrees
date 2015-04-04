var Reflux = require('reflux');
var GameActions = require('./GameActions');
var Constants = require('./Constants');

var GameStore = Reflux.createStore({

	localStorageKey: 'sixdegrees',

	listenables: [GameActions],

	onAddActors: function(data) {

		console.log('setting new actors '+data.actor1.actorName+' '+data.actor2.actorName);
		localStorage.setItem(this.localStorageKey, JSON.stringify(data));
		this.gameData = data;
		this.trigger(data);
	},

	onSelectSourceActor: function(actorId) {
		var url = "http://api.themoviedb.org/3/person/"+actorId+"/movie_credits";
		var that = this;

		$.ajax({
		      url: url,
		      dataType: 'json',
		      data: {
				api_key: Constants.API_KEY
			  },
		      success: function(data) {
		      	var castedMovied = data.cast;

		      	that.gameData.sourceActorMovies = castedMovied;
		      	that.trigger(that.gameData);

		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
	    });
	},

	getInitialState: function() {
		console.log('getting initial state from store');
		var loadedGameData = localStorage.getItem(this.localStorageKey);
		if (loadedGameData) {
			this.gameData = JSON.parse(loadedGameData);
		}
		return this.gameData;
	}

})

module.exports = GameStore;