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
		return (
				<div className="play-container">
					<div className="actor-chain">
						<img src={this.state.gameData.actor1.actorImage}/>
						<div className="chain-actor-name">{this.state.gameData.actor1.actorName}</div>
					</div>
					
					<EdgeStep />
					<div className="chain-container">
					</div>
					<EdgeStep />
					<div className="actor-chain" onClick={this.onActorChainClick}>
						<img src={this.state.gameData.actor2.actorImage}/>
						<div className="chain-actor-name">{this.state.gameData.actor2.actorName}</div>
					</div>
				</div>
			);
	}
});

var QueriedActor = React.createClass( {
	render: function() {
		return (<div className="query-container">
				<img src={this.props.actorImage}/>
				<div className="actor-name">{this.props.actorName}</div>
			</div>);	
	}
})

var QueriedActorMovies = React.createClass( {

	// mixins: [Reflux.connect(GameStore, "gameData")],

	onMovieSelectInner: function(movie) {
		this.props.onMovieSelect(movie);
	},

	componentDidUpdate: function() {
		console.log('QueriedActorMovies componentDidUpdate');
		// var node = this.getDOMNode();
  		// node.scrollTop = 0;
	},

	render: function() {

		var moviesElements;

		if (this.props.movies) {
			var that = this;
			moviesElements = this.props.movies.map(function(movie) {

						return (<li className="movieItem" key={movie.id} onClick={that.onMovieSelectInner.bind(that, movie)}>
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

	onActorSelect: function(actor) {
		GameActions.addStep(actor, this.props.movie);
		GameActions.selectSourceActor(actor.actorId);
	},

	render: function() {
		var movieCast = [];
		if (this.props.cast) {
			var that = this;
			movieCast = this.props.cast.map(function(actor) {

						return (<li className="actorItem" key={actor.id} onClick={that.onActorSelect.bind(that, actor)}>
									<div className="actor-image">
										<img src={actor.actorImage}></img>
									</div>
									<div className="actorDetails">
										<div className="actor-title">{actor.actorName}</div>
									</div>
									
								</li>);
					})
		}
		else {
			movieCast = (<li className="no-movie-item" key="no-movie-key">No Cast</li>);
		}
		return (
					<div className="movie-cast-div">
						<ul className="castList">{movieCast}</ul>
					</div>
				)
	}
})

var QuerySection = React.createClass( {
	mixins: [Reflux.connect(GameStore, "gameData")],

	getInitialState: function() {
    	return {selectedMovie: ""};
  	},	

	onMovieSelect: function(movie) {
		GameActions.selectMovie(movie.id);
		this.setState({selectedMovie: movie});
	},

	componentDidMount: function() {
		console.log('action selectSrouceActor invoked from component');
		var lastChainIndex = this.state.gameData.chain.length-1;
		GameActions.selectSourceActor(this.state.gameData.chain[lastChainIndex].actor.actorId);
	},

	render: function() {
		var lastChainIndex = this.state.gameData.chain.length-1;
		console.log('latest chain index is '+lastChainIndex);
		var lastChainActor = this.state.gameData.chain[lastChainIndex].actor;
		console.log('latest chain actor is '+JSON.stringify(lastChainActor));
		return (
			<div className="query-section">
				<QueriedActor actorImage={lastChainActor.actorImage} actorName={lastChainActor.actorName} />
				<QueriedActorMovies movies={this.state.gameData.sourceActorMovies} onMovieSelect={this.onMovieSelect}/>
				<QueriedMovie cast={this.state.gameData.selectedMovieCast} movie={this.state.selectedMovie}/>
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