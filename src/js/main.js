var ActorSelection = React.createClass({

	render: function() {
		return (
					<div className="actor-component">
						<img src={this.props.data.imageUrl}/>
						<div className="actor-input-div">
							<input type="text" className="actor-input" value={this.props.data.actorName}/>
							<a className="icon-clear"></a>
						</div>
					</div>
				)
	}
})

var data = {
    			actor1: {imageUrl: "https://image.tmdb.org/t/p/w185/p1uCaOjxSC1xS5TgmD4uloAkbLd.jpg", actorName: "Kevin Bacon"},
    			actor2: {imageUrl: "https://image.tmdb.org/t/p/w185/cdowETe1PgXLjo72hDb7R7tyavf.jpg", actorName: "Kevin Spacey"}
    		   };


var StartPage = React.createClass({
	render: function(){
		return (
				<div id="actorsSelectionContainer">
					<div id="actor1" className="actor-div"><ActorSelection data={data.actor1}/></div>
					<div id="buttonsDiv">
						<a href="#chooseRandom" className="button-primary">Random</a>
						<a href="#play" className="button-secondary">Play!</a>
					</div>
					<div id="actor2" className="actor-div"><ActorSelection data={data.actor2}/></div>
				</div>
			)
	}
})

React.render(<StartPage />, document.body);