/**
 * Defines a timer for a game
 * var timer = new TileMaze.Timer({
 * 		container : '#timer-container-outer'
 * });
 */
TileMaze.Timer = (function( $ ) {
	var tplTimer = [
		'<div id="timer-container-inner">',
			'<span class="tmaze-icon tmaze-icon-stopclock"></span>',
			'<span id="timer-seconds-container">',
				'<span class="tmaze-timer">',
			'</span>',
		'</div>'
	].join( '\n' );
	
	function Timer( config ) {
		EventBus.call( this );
		$.extend( true, this, config, {
			$innerContainer : $( tplTimer ),
			lastStartTime   : null,
			elapsedSeconds  : null,
			intervalId	    : null
		});
	}
	
	Timer.prototype = $.extend( Object.create( EventBus.prototype ), {
		constructor : Timer,
		start		: function() {
			if( this.state !== 'start' ) {
				var timer = this;
				this.elapsedSeconds	= this.elapsedSeconds || 0;
				this.lastStartTime	= new Date();
				this.intervalId 	= setInterval( function() {
					var oldElapsedSeconds = timer.elapsedSeconds;
					timer.elapsedSeconds  = Math.floor( ( new Date() - timer.lastStartTime ) / 1000 );
					( oldElapsedSeconds !== timer.elapsedSeconds ) && timer.render();
				}, 250 );
				this.state = 'start';
			}
			return this;
		},
		stop		: function() {
			if( this.state !== 'stop' ) {
				clearInterval( this.intervalId );
				this.intervalId = null;
				this.lastStartTime = null;
				this.state = 'stop';
			}
			return this;
		},
		reset		: function() {
			this.stop();
			this.elapsedSeconds = null;
			return this;
		},
		getElapsedSeconds 	: function() {
			return this.elapsedSeconds;
		},
		render 		: function() {
			this.$innerContainer.find( '.tmaze-timer' ).html( this.elapsedSeconds || 0 );
			this.$outerContainer.html( this.$innerContainer );
			return this;
		}
	});
	
	return Timer;
}( jQuery ));