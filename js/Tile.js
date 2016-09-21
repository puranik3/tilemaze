/**
 * Defines a tile associated with a board 
 * var tile = new TileMaze.Tile({
 *		row   : 0,
 *		col   : 2,
 *		board : boardObj
 *		img   : imgObj
 * });
 */
TileMaze.Tile = (function( $ ) {
	var tplTile = '<div class="tmaze-tile tmaze-tile-img" />';

	var _Helper = {
		init : function( tile ) {
			tile.$tile.data( 'tile', tile );
			tile.setSlot();
			tile.setTileDimensions();
			tile.setImg();
			this.bindEvents( tile );
		},
		bindEvents : function( tile ) {
			tile.board.on( 'resize', function() {
				tile.setTileDimensions();
			});
			return this;
		}
	};
	
	function Tile( config ) {
		EventBus.call( this );
		$.extend( true, this, config, { $tile : $( tplTile ) } );
		_Helper.init( this );
	}

	Tile.prototype = $.extend( Object.create( EventBus.prototype ), {
		constructor : Tile,
		getElement : function() {
			return this.$tile;
		},
		getSlot : function() {
			return this.slot;
		},
		getPosition : function() {
			return this.position;
		},		
		getCalculatedDimensions : function() { // calculates dimensions based on board dimensions, rather than checking out tile node's width and height
			return {
				"width"  : this.board.getWidth() / this.board.size,
				"height" : this.board.getHeight() / this.board.size
			};
		},
		setTileDimensions : function() {
			this.$tile.css( this.getCalculatedDimensions() );
			return this;
		},
		setSlot : function( newSlot ) {
			newSlot && $.extend( true, this, {
				slot : newSlot
			});
			var dimens = this.getCalculatedDimensions();
			this.$tile.css({
				"top"	: this.slot.row * dimens.width,
				"left"	: this.slot.col * dimens.height
			});
			return this;
		},
		setImg : function() {
			var dimens = this.getCalculatedDimensions();
			this.$tile.css({
				"background-image" 	  : 'url(' + this.board.img + ')',
				"background-position" : '-' + ( this.slot.col * dimens.width + 'px' ) + ' ' + '-' + ( this.slot.row * dimens.height + 'px' ),
				"width"				  : dimens.width + 'px',
				"height"			  : dimens.height + 'px'
			});
			return this;
		}
	});
	
	return Tile;
}( jQuery ));