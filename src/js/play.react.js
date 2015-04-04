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

	render: function() {
		// var stepComponents = this.state.gameData.steps.map(function(step) {
			// return (<Step id={step.id} />);
		// })
		return (
				<div className="play-container">
					<img className="actor-chain" src={this.state.gameData.actor1.imageUrl}/>
					<EdgeStep />
					<div className="chain-container">
					</div>
					<EdgeStep />
					<img className="actor-chain" src={this.state.gameData.actor2.imageUrl}/>
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

	render: function() {

		var moviesElements;

		if (this.props.movies) {
			moviesElements = this.props.movies.map(function(movie) {
						var posterPath = "https://image.tmdb.org/t/p/w92/"+movie.poster_path;
						return (<li className="movieItem" key={movie.id}>
									<div className="movie-image">
										<img src={posterPath}></img>
									</div>
									<div className="movieDetails">
										<div className="movie-title">{movie.title}</div>
										<div className="movie-title">{movie.release_date}</div>
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
	render: function() {
		return (<div>
					<div className="movie-div"></div>
					<div className="movie-cast-div"></div>
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
				<QueriedMovie />
			</div>
		)
	}
})

var Play = React.createClass({

	mixins: [Reflux.connect(GameStore,"gameData")],

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