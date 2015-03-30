var React = require('react');
var Reflux = require('reflux');
var GameStore = require('./GameStore');

var Play = React.createClass({

	mixins: [Reflux.connect(GameStore,"gameData")],

	render: function() {
		return (<div className="play">Connect between {this.state.gameData.actor1.actorName} and {this.state.gameData.actor2.actorName}</div>);
	}
})

module.exports = Play;