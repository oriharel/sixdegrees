var Reflux = require('reflux');

var GameActions = Reflux.createActions([
        "addActors",
        "selectSourceActor"
    ]);

module.exports = GameActions;