var Reflux = require('reflux');

var GameActions = Reflux.createActions([
        "addActors",
        "selectSourceActor",
        "selectMovie",
        "clearChain",
        "addStep"
    ]);


module.exports = GameActions;