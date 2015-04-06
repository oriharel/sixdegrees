var React = require('react');
var Reflux = require('reflux');
var GameStore = require('./GameStore');
var GameActions = require('./GameActions');
var Constants = require('./Constants');

var EdgeStep = React.createClass( {
	render: function() {
		return (
					<div className="step">
						<div className="step-rect"></div>
						<div className="step-rect"></div>
						<div className="step-rect"></div>
					</div>
				);
	}
})

var Chain = React.createClass({
	mixins: [Reflux.connect(GameStore, "gameData")],

	onActorChainClick: function() {
		GameActions.addActors({actor1: this.state.gameData.actor2, actor2: this.state.gameData.actor1});
		GameActions.selectSourceActor(this.state.gameData.actor2.actorId);
	},

	render: function() {
		// var stepComponents = this.state.gameData.steps.map(function(step) {
			// return (<Step id={step.id} />);
		// })
		return (
				<div className="play-container">
					<div className="actor-chain">
						<img src={this.state.gameData.actor1.imageUrl}/>
						<div className="chain-actor-name">{this.state.gameData.actor1.actorName}</div>
					</div>
					
					<EdgeStep />
					<div className="chain-container">
					</div>
					<EdgeStep />
					<div className="actor-chain" onClick={this.onActorChainClick}>
						<img src={this.state.gameData.actor2.imageUrl}/>
						<div className="chain-actor-name">{this.state.gameData.actor2.actorName}</div>
					</div>
				</div>
			);
	}
});

var QueriedActor = React.createClass( {
	render: function() {
		return (<div className="query-container">
				<img src={this.props.imageUrl}/>
				<div className="actor-name">{this.props.actorName}</div>
			</div>);	
	}
})

var QueriedActorMovies = React.createClass( {

	mixins: [Reflux.connect(GameStore, "gameData")],


	onMovieSelect: function(movieId) {
		GameActions.selectMovie(movieId);

	},

	render: function() {

		var moviesElements;

		if (this.props.movies) {
			var that = this;
			moviesElements = this.props.movies.map(function(movie) {

						return (<li className="movieItem" key={movie.id} onClick={that.onMovieSelect.bind(that, movie.id)}>
									<div className="movie-image">
										<img src={movie.posterPath}></img>
									</div>
									<div className="movieDetails">
										<div className="movie-title">{movie.title}</div>
										<div className="movie-title">({movie.release_date})</div>
									</div>
									
								</li>);
					})
		}
		else {
			moviesElements = (<li className="no-movie-item" key="no-movie-key">No Movies</li>);
		}
		

		return (<ul className="moviesList">{moviesElements}</ul>);
	}
})

var QueriedMovie = React.createClass( {

	mixins: [Reflux.connect(GameStore, "gameData")],

	render: function() {
		var movieCast = [];
		if (this.props.cast) {
			movieCast = this.props.cast.map(function(actor) {

						return (<li className="movieItem" key={actor.id}>
									<div className="movie-image">
										<img src={actor.actorImage}></img>
									</div>
									<div className="movieDetails">
										<div className="movie-title">{actor.actorName}</div>
									</div>
									
								</li>);
					})
		}
		else {
			movieCast = (<li className="no-movie-item" key="no-movie-key">No Cast</li>);
		}
		return (<div>
					<div className="movie-div"></div>
					<div className="movie-cast-div">
						<ul className="castList">{movieCast}</ul>
					</div>
				</div>
				)
	}
})

var QuerySection = React.createClass( {
	mixins: [Reflux.connect(GameStore, "gameData")],

	componentDidMount: function() {
		console.log('action selectSrouceActor invoked from component');
		GameActions.selectSourceActor(this.state.gameData.actor1.actorId);
	},

	render: function() {
		return (
			<div className="query-section">
				<QueriedActor imageUrl={this.state.gameData.actor1.imageUrl} actorName={this.state.gameData.actor1.actorName} />
				<QueriedActorMovies movies={this.state.gameData.sourceActorMovies} />
				<QueriedMovie cast={this.state.gameData.selectedMovieCast}/>
			</div>
		)
	}
})

var Play = React.createClass({

	render: function() {
		console.log("start rendering Play component");
		return (
					<div>
						<Chain />
						<QuerySection />
					</div>
				);
	}
});

module.exports = Play;