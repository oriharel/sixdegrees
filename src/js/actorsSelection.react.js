var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var GameActions = require('./GameActions');
var Select = require('react-select');
var Constants = require('./Constants');
// var apiKey = "4824a0c20d8b1bf69548c63dbb66bc10"

var ActorSelection = React.createClass({

	render: function() {
		return (
					<div className="actor-component">
						<img src={this.props.data.imageUrl}/>
						<div className="actor-name">{this.props.data.actorName}</div>
					</div>
				)
	}
})

var StartPage = React.createClass({
	getInitialState: function() {
	    return {
    			actor1: {imageUrl: "", actorName: "", actorId: ""},
    			actor2: {imageUrl: "", actorName: "", actorId: ""},
    			popular: [],
    			randomClass: "button-primary",
    			steps: [{id: 'first-step'}]
    		   };
  	},

  	componentDidMount: function() {
  		// return;

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
		      	var existingPopular = this.state.popular;
		      	var newPopular = existingPopular.concat(data.results);
		        this.setState({popular: newPopular});
		        // console.log('num of people: '+this.state.popular.length);
		        if (this.state.popular.length === 980) {
		        	this.setState({randomClass: 'button-primary active'})
		        }
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
		    });
  		}
  		
    },

    generateRandom: function() {
    	// console.log('generate random from: '+this.state.popular.length);
    	// var ceiling = this.state.popular.length;
    	var ceiling = 50;
    	var actor1 = this.state.popular[Math.floor(Math.random()*ceiling)];
    	var actor2 = this.state.popular[Math.floor(Math.random()*ceiling)];

    	var selectedActor1 = {actorName: actor1.name, imageUrl: 'https://image.tmdb.org/t/p/w185'+actor1.profile_path, actorId: actor1.id};
    	var selectedActor2 = {actorName: actor2.name, imageUrl: 'https://image.tmdb.org/t/p/w185'+actor2.profile_path, actorID: actor2.id};

		this.setState({actor1: selectedActor1, actor2: selectedActor2});
		GameActions.addActors({actor1: selectedActor1, actor2: selectedActor2});
    },

  	onChange1: function(actorStr) {
		var actorObj = JSON.parse(actorStr);
		console.log('actor1 id is: '+actorObj.id);
		var selectedActor = {actorName: actorObj.name, imageUrl: 'https://image.tmdb.org/t/p/w185'+actorObj.profile_path};
		this.setState({actor1: selectedActor});
	},

	onChange2: function(actorStr) {
		var actorObj = JSON.parse(actorStr);
		console.log('actor2 id is: '+actorObj.id);
		var selectedActor = {actorName: actorObj.name, imageUrl: 'https://image.tmdb.org/t/p/w185'+actorObj.profile_path};
		this.setState({actor2: selectedActor});
	},

	// beforePlay: function() {
		// console.log('calling addActors actions from component');
		
	// },

	render: function(){
		return (
				<div id="actorsSelectionContainer">
					<div id="actor1" className="actor-div"><ActorSelection data={this.state.actor1} onChange={this.onChange1}/></div>
					<div id="buttonsDiv">
						<a href="#" className={this.state.randomClass} onClick={this.generateRandom}>Random</a>
						<Link to="play">Play!</Link>
					</div>
					<div id="actor2" className="actor-div"><ActorSelection data={this.state.actor2} onChange={this.onChange2}/></div>
				</div>
			)
	}
})

module.exports = StartPage;