var Reflux = require('reflux');
var GameActions = require('./GameActions');

var GameStore = Reflux.createStore({

	localStorageKey: 'sixdegrees',

	listenables: [GameActions],

	onAddActors: function(data) {

		//TODO - data.popular is very big - no need to store it
		console.log('setting new actors '+data.actor1.actorName+' '+data.actor2.actorName);
		localStorage.setItem(this.localStorageKey, JSON.stringify(data));
		this.gameData = data;
		this.trigger(data);
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