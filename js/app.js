(function( $ ) {
	var App = {
		pics : [ 'dexter.jpg', 'mrbean.jpg', 'mickey.jpg', 'dexter2.jpg', 'donald.jpg', 'johnny.jpg', 'monkey.jpg', 'speedy.jpg', 'looney.jpg', 'southpark.jpg', 'pluto.jpg', 'flintstone.jpg', 'garfield.jpg' ],
		init : function() {
			this.game = null;
			this.level = 0;
			this.startNextLevelGame();
		},
		startNextLevelGame : function() {
			this.level++;
			this.setupGame();
			this.startGame();
		},
		setupGame : function() {
			$( '#app-container' ).html( '<div id="game-container-outer" />' );
			// create, render and start the game
			var boardSize = 3 + Math.floor( ( this.level - 1 ) / 6 );
			this.game = new TileMaze.Game({
				$outerContainer : $( '#game-container-outer' ),
				level : this.level,
				board : {
					size : boardSize,
					img	 : ' img/' + this.pics[ Math.floor( Math.random() * this.pics.length ) ]
				}
			}).render();
			
			this.game.on( 'tmaze:gameover', this.startNextLevelGame.bind( this ) );
		},
		startGame : function() {
			this.game.start();
		}
	};

	$( document ).on( 'ready', App.init.bind( App ) );
})( jQuery );