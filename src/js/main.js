var React = require('react');
var StartPage = require('./actorsSelection.react');
var Play = require('./play.react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;

var App = React.createClass({

	render: function() {
		return (
	      <div>
	        <RouteHandler/>
	      </div>
      	);
	}
	
})

var routes = (
  <Route name="app" path="/" handler={App}>
	<Route name="play" handler={Play}/>  
    <DefaultRoute handler={StartPage}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});