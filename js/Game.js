TileMaze.Game = (function( $ ) {
	var tplGame = [
		'<div id="game-container-inner">',
			'<header>',
				'<h2>',
					'<img id="logo-container" src="img/logo.png" />',
					'<div id="level-container-outer"></div>',
					'<div id="timer-container-outer"></div>',
					'<div id="control-panel-container-outer"></div>',
				'</h2>',
			'</header>',
			'<div id="board-container-outer"></div>',
			'<div id="audio-container-outer"></div>',

			'<div class="tmaze-dialog-container">',
				'<div class="tmaze-dialog-body">',
					'Game over!',
				'</div>',
				'<span class="tmaze-dialog-close">Close</span>',
				'<div class="tmaze-dialog-mask" />',
			'</div>',
		'</div>'
	].join( '\n' );
	
	var tplLevel = [
		'<div id="level-container-inner">',
			'<div>Level <span id="level-number"></span></div>',
			'<hr/>',
		'</div>'
	].join( '\n' );

	var _Helper = {
		init : function( game ) {
			this.setLevel( game );
			this.setupTimer( game );
			this.setupAudio( game ); // set this up before control panel
			this.setupControlPanel( game );	// this makes use of audio player
			this.setupBoard( game );
			this.bindEvents( game );
		},
		setLevel :  function( game ) {
			var $level = $( tplLevel );
			game.$innerContainer.find( '#level-container-outer' ).html( $level );
			$level.find( '#level-number' ).text( game.level );
		},
		setupTimer : function( game ) {
			game.timerObj = new TileMaze.Timer({
				$outerContainer : game.$innerContainer.find( '#timer-container-outer' )
			});
		},
		setupControlPanel : function( game ) {
			game.controlPanelObj = new TileMaze.ControlPanel({
				$outerContainer : game.$innerContainer.find( '#control-panel-container-outer' ),
				game 			: game
			});
		},
		setupAudio : function( game ) {
			game.bgmAudioPlayerObj = new AudioPlayer({
				src : [ 'audio/bgm.mp3' ],
				loop : true
			});
			game.winningMusicAudioPlayerObj = new AudioPlayer({
				src : [ 'audio/success.mp3' ],
				loop : false
			});
		},
		setupBoard : function( game ) {
			game.board.$outerContainer = game.$innerContainer.find( '#board-container-outer' );
			game.board.level = game.level;
			// @todo : solution for preventing hard-coded values for width and height
			game.board.$outerContainer.width( 300 );
			game.board.$outerContainer.height( 300 );
			
			game.boardObj = new TileMaze.Board( game.board );
		},
		bindEvents : function( game ) {
			game.boardObj.on( 'tmaze:move', function() {
				game.numMoves++;
			});
			game.boardObj.on( 'tmaze:tiles-arranged', function() {
				game.stop();
				game.winningMusicAudioPlayerObj.play();
				alert( 'Hurray! You completed the board in ' + game.numMoves + ' moves and ' + game.timerObj.getElapsedSeconds() + ' seconds.' );
				game.trigger( 'tmaze:gameover' );
			});
		}
	};
	
	function Game( config ) {
		EventBus.call( this );
		$.extend( true, this, config, { $innerContainer : $( tplGame ), numMoves : 0 } );
		_Helper.init( this );
	}
	
	Game.prototype = $.extend( Object.create( EventBus.prototype ), {
		constructor : Game,
		start 		: function() {
			if( this.state !== 'play' ) {
				this.timerObj.start();
				this.bgmAudioPlayerObj.play();
				this.state = 'play';
			}
			return this;
		},
		stop 		: function() {
			this.pause();
			return this;
		},
		pause 		: function() {
			if( this.state !== 'pause' ) {
				this.timerObj.stop();
				this.bgmAudioPlayerObj.pause();
				this.state = 'pause';
			}
			return this;
		},
		playEffect : function() {
			document.getElementById( "mp4_src" ).src = "movie.mp4";
			document.getElementById( "ogg_src" ).src = "movie.ogg";
			document.getElementById( "myVideo" ).load();
		},
		render		: function() {
			this.$outerContainer.html( this.$innerContainer );
			this.timerObj.render();
			this.controlPanelObj.render();
			this.boardObj.render();
			
			return this;
		}
	});
	
	return Game;
})( jQuery );