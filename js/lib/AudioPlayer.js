/**
 * Defines an audio player
 * var audio = new AudioPlayer({
 * 		src : [ 'audio/blop.mp3', 'audio/blop.ogg' ],
 *		loop : true	// defaults to false
 * });
 */
var AudioPlayer = (function( $ ) {
	function AudioPlayer( config ) {
		EventBus.call( this );
		$.extend( true, this, AudioPlayer.defaults, config );
		
		this.audio = new Audio();
		this.setSrc( this.src );
		this.audio.loop = this.loop;
		this.audio.autoplay = this.autoplay;
	}
	
	AudioPlayer.defaults = {
		loop : false,
		autoplay : false
	};
	
	AudioPlayer.prototype = $.extend( Object.create( EventBus.prototype ), {
		constructor : AudioPlayer,
		play : function() {
			if( this.isPaused() ) {
				this.audio.play();
				this.trigger( 'audioplayer:play' );
			}
			return this;
		},
		pause : function() {
			if( !this.isPaused() ) {
				this.audio.pause();
				this.trigger( 'audioplayer:pause' );
			}
			return this;
		},
		isPaused : function() {
			return this.audio.paused;
		},
		setSrc : function( src ) {
			this.pause();
			$( this.audio ).empty();
			for( var i = 0; i < src.length; i++ ) {
				$( this.audio ).append( '<source src="' + src[i] + '"/>' );
			}
			this.trigger( 'audioplayer:sourceset' );
		}
	});
	
	return AudioPlayer;
}( jQuery ));