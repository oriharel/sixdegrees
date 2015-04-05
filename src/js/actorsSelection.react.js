var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var GameActions = require('./GameActions');
var Reflux = require('reflux');
var ActorsStore = require('./actorsStore');
var Select = require('react-select');
var Constants = require('./Constants');

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

	mixins: [Reflux.connect(ActorsStore, "popularActors")],

	getInitialState: function() {
		console.log('StartPage getInitialState started');
	    return {
    			actor1: {imageUrl: "", actorName: "", actorId: ""},
    			actor2: {imageUrl: "", actorName: "", actorId: ""},
    			randomClass: "button-primary",
    			steps: [{id: 'first-step'}]
    		   };
  	},

  	componentDidMount: function() {
  		if (this.state.popularActors.length > 0) {
  			this.setState({randomClass: "button-primary active"})
  			this.generateRandom();
  		}
    },

    generateRandom: function() {
    	var ceiling = 950;
    	var actor1 = this.state.popularActors[Math.floor(Math.random()*ceiling)];
    	var actor2 = this.state.popularActors[Math.floor(Math.random()*ceiling)];

    	var selectedActor1 = {actorName: actor1.name, imageUrl: 'https://image.tmdb.org/t/p/w185'+actor1.profile_path, actorId: actor1.id};
    	var selectedActor2 = {actorName: actor2.name, imageUrl: 'https://image.tmdb.org/t/p/w185'+actor2.profile_path, actorId: actor2.id};

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