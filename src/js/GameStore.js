var Reflux = require('reflux');
var GameActions = require('./GameActions');

var GameStore = Reflux.createStore({

	localStorageKey: 'sixdegrees',

	listenables: [GameActions],

	onAddActors: function(data) {
		localStorage.setItem(this.localStorageKey, JSON.stringify(data));
		this.gameData = data;
		this.trigger(data);
	},

	getInitialState: function() {
		var loadedGameData = localStorage.getItem(this.localStorageKey);
		if (loadedGameData) {
			this.gameData = JSON.parse(loadedGameData);
		}
		return this.gameData;
	}

})

module.exports = GameStore;