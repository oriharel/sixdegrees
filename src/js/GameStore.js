var Reflux = require('reflux');
var GameActions = require('./GameActions');
var Constants = require('./Constants');
var moment = require('moment');

var GameStore = Reflux.createStore({

	localStorageKey: 'sixdegrees',

	listenables: [GameActions],

	onAddActors: function(data) {

		console.log('setting new actors '+data.actor1.actorName+' '+data.actor2.actorName);
		localStorage.setItem(this.localStorageKey, JSON.stringify(data));
		this.gameData = data;
		this.trigger(data);
	},

	update: function() {
		localStorage.setItem(this.localStorageKey, JSON.stringify(this.gameData));
	},

	onAddStep: function(actor, movie) {
		console.log('adding step '+JSON.stringify(actor));
		this.gameData.chain.push({movie: movie, actor: actor});
		this.update();
		this.trigger(this.gameData);
	},

	onClearChain: function() {
		console.log('clearing chain');
		this.gameData.chain = [];
		this.update();
		this.trigger(this.gameData);
	},

	onSelectMovie: function(movieId) {
		var url = "http://api.themoviedb.org/3/movie/"+movieId+"/credits";
		var that = this;
		console.log('fetching actors for movieId '+movieId);
		$.ajax({
		      url: url,
		      dataType: 'json',
		      data: {
				api_key: Constants.API_KEY
			  },
		      success: function(data) {
		      	var movieCast = data.cast, unsortedList;

		      	unsortedList = movieCast.map(function(actor) {
		      		return {
		      			actorId: actor.id,
		      			actorName: actor.name,
		      			actorImage: 'https://image.tmdb.org/t/p/w185'+actor.profile_path
		      		}
		      	});

		      	that.gameData.selectedMovieCast = unsortedList;
		      	that.trigger(that.gameData);

		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
	    });
	},

	onSelectSourceActor: function(actorId) {
		var url = "http://api.themoviedb.org/3/person/"+actorId+"/movie_credits";
		var that = this;
		console.log('fetching movies for actorId '+actorId);
		$.ajax({
		      url: url,
		      dataType: 'json',
		      data: {
				api_key: Constants.API_KEY
			  },
		      success: function(data) {
		      	var castedMovied = data.cast, unsortedList;

		      	unsortedList = castedMovied.map(function(movie) {
		      		var momentDate = moment(movie.release_date);
		      		return {
		      			id: movie.id,
		      			title: movie.title,
		      			release_date: momentDate.year(),
		      			posterPath: movie.poster_path !== null ? "https://image.tmdb.org/t/p/w92"+movie.poster_path : './images/movie-no-image.png'
		      		}
		      	});

		      	that.gameData.sourceActorMovies = unsortedList.sort(function(movie1, movie2) {
		      		if (movie1.release_date < movie2.release_date) {
		      			return 1;
		      		}
		      		if (movie1.release_date > movie2.release_date) {
		      			return -1;
		      		}

		      		return 0;
		      	});
		      	that.trigger(that.gameData);

		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
	    });

		this.gameData.selectedMovieCast = [];
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