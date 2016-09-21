/**
 * Defines the control panel of a game 
 * var controlPanel = new TileMaze.ControlPanel({
 * 		container 	: '#control-panel-container'
 *		game		: game,		
 *		gameState	: 'play',
 *		audioState	: {
 *			bgm			: 'unmute',
 *			effects		: 'unmute'
 *		}
 * });
 */
TileMaze.ControlPanel = (function( $ ) {
	var tplControlPanel = [
		'<div id="control-panel-container">',
			'<span id="control-play-pause" class="control tmaze-icon"></span>',
			'<span id="control-mute-unmute" class="control tmaze-icon"></span>',
		'</div>'
	].join( '\n' );

	var _Helper = {
		init : function( controlPanel ) {
			this.setupControls( controlPanel );
			this.bindEvents( controlPanel );
		},
		setupControls : function(  controlPanel ) {
			controlPanel.$gameState  = controlPanel.$innerContainer.find( '#control-play-pause' )
																   .addClass( 'tmaze-icon-' + ( controlPanel.gameState || 'pause' ) );
			controlPanel.$audioState = controlPanel.$innerContainer.find( '#control-mute-unmute' )
																   .addClass( 'tmaze-icon-' + ( ( controlPanel.audioState && controlPanel.audioState.bgm ) || 'unmute' ) );
		},
		bindEvents : function( controlPanel ) {
			controlPanel.$gameState.on( 'click', function() {
				console.log( 'toggle game state' );
			});
			
			controlPanel.$audioState.on( 'click', function() {
				controlPanel.game.bgmAudioPlayerObj[controlPanel.game.bgmAudioPlayerObj.isPaused() ? 'play' : 'pause']();
			});
			
			controlPanel.game.bgmAudioPlayerObj.on( 'audioplayer:play', function() {
				controlPanel.$audioState.removeClass( 'tmaze-icon-mute' ).addClass( 'tmaze-icon-unmute' );
			});

			controlPanel.game.bgmAudioPlayerObj.on( 'audioplayer:pause', function() {
				controlPanel.$audioState.removeClass( 'tmaze-icon-unmute' ).addClass( 'tmaze-icon-mute' );
			});
		}
	};
	 
	function ControlPanel( config ) {
		EventBus.call( this );
		$.extend( true, this, config, { $innerContainer : $( tplControlPanel ) } );
		_Helper.init( this );
	}

	ControlPanel.prototype = $.extend( Object.create( EventBus.prototype ), {
		constructor : ControlPanel,
		setControl : function( controlName, value ) {
			this.controlName = value;
			this['$' + controlName] = value;
			switch( controlName ) {
				case 'gameState' :
					value === 'play' ? game.start() : game.pause();
					break;
				case 'audioState' :
					value === 'unmute' ? game.bgmAudioPlayerObj.pause() : game.bgmAudioPlayerObj.play();
					break;
			}
		},
		render : function() {
			this.$outerContainer.html( this.$innerContainer );
			return this;
		}
	});
	
	return ControlPanel;
}( jQuery ));