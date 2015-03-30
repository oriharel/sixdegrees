var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var GameActions = require('./GameActions');
var Select = require('react-select');
var apiKey = "4824a0c20d8b1bf69548c63dbb66bc10"

var ActorSelection = React.createClass({

	loadOptions: function(input, callback) {

		input = input.toLowerCase();

		if (input.length) {
			$.ajax({
		      url: 'http://api.themoviedb.org/3/search/person',
		      dataType: 'json',
		      data: {
				api_key: apiKey,
				query: input,
				search_type: "ngram"
			  },
		      success: function(data) {
		        var ret = data.results.map(function(person) {
		        	return {
								label: person.name,
								value: JSON.stringify(person),
								id: person.id
							}
		        });
		        callback(null, {options: ret});
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.data.url, status, err.toString());
		      }.bind(this)
		    });
		}
	},

	render: function() {
		return (
					<div className="actor-component">
						<img src={this.props.data.imageUrl}/>
						<div className="actor-name">{this.props.data.actorName}</div>
						<div className="actor-input-div">
							<Select
							    className="actor-select"
							    asyncOptions={this.loadOptions}
							    onChange={this.props.onChange}
							/>
						</div>
					</div>
				)
	}
})

var StartPage = React.createClass({
	getInitialState: function() {
	    return {
    			actor1: {imageUrl: "https://image.tmdb.org/t/p/w185/p1uCaOjxSC1xS5TgmD4uloAkbLd.jpg", actorName: "Kevin Bacon"},
    			actor2: {imageUrl: "https://image.tmdb.org/t/p/w185/cdowETe1PgXLjo72hDb7R7tyavf.jpg", actorName: "Kevin Spacey"},
    			popular: [],
    			randomClass: "button-primary"
    		   };
  	},

  	componentDidMount: function() {
  		for (var i = 1; i < 50; i++) {
  			$.ajax({
		      url: "http://api.themoviedb.org/3/person/popular",
		      dataType: 'json',
		      data: {
				api_key: apiKey,
				page: i
			  },
		      success: function(data) {
		      	var existingPopular = this.state.popular;
		      	var newPopular = existingPopular.concat(data.results);
		        this.setState({popular: newPopular});
		        if (this.state.popular.length === 260) {
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
    	console.log('generate random from: '+this.state.popular.length);
    	// var ceiling = this.state.popular.length;
    	var ceiling = 50;
    	var actor1 = this.state.popular[Math.floor(Math.random()*ceiling)];
    	var actor2= this.state.popular[Math.floor(Math.random()*ceiling)];

    	var selectedActor1 = {actorName: actor1.name, imageUrl: 'https://image.tmdb.org/t/p/w185'+actor1.profile_path};
    	var selectedActor2 = {actorName: actor2.name, imageUrl: 'https://image.tmdb.org/t/p/w185'+actor2.profile_path};

		this.setState({actor1: selectedActor1, actor2: selectedActor2});
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

	beforePlay: function() {
		GameActions.addActors(this.state);
	},

	render: function(){
		return (
				<div id="actorsSelectionContainer">
					<div id="actor1" className="actor-div"><ActorSelection data={this.state.actor1} onChange={this.onChange1}/></div>
					<div id="buttonsDiv">
						<a href="#" className={this.state.randomClass} onClick={this.generateRandom}>Random</a>
						<Link to="play" onClick={this.beforePlay}>Play!</Link>
					</div>
					<div id="actor2" className="actor-div"><ActorSelection data={this.state.actor2} onChange={this.onChange2}/></div>
				</div>
			)
	}
})

module.exports = StartPage;