var React = require('react');
var Reflux = require('reflux');
var GameStore = require('./GameStore');
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
						return (<li className="movieItem" key={movie.id}>{movie.title}</li>);
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

		console.log('fetching movies list of '+this.state.gameData.actor1.actorName);
		var url = "http://api.themoviedb.org/3/person/"+this.state.gameData.actor1.actorId+"/movie_credits";

		$.ajax({
		      url: url,
		      dataType: 'json',
		      data: {
				api_key: Constants.API_KEY
			  },
		      success: function(data) {
		      	var castedMovied = data.cast;

		      	this.setState({queriedActorMovies: castedMovied})
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
	    });
	},

	render: function() {
		return (
			<div>
				<QueriedActor imageUrl={this.state.gameData.actor1.imageUrl} actorName={this.state.gameData.actor1.actorName} />
				<QueriedActorMovies movies={this.state.queriedActorMovies} />
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