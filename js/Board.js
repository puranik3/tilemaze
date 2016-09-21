/**
 * Defines a size x size board 
 * var board = new TileMaze.Board({
 *		level		: 2,
 *		size 		: 3,
 * 		container 	: '#board-container'
 * });
 */
TileMaze.Board = (function( $ ) {
	var tplBoard = '<div class="tmaze-board" />';
	
	var _Helper = {
		init : function( board ) {
			this.setupBoard( board );
			this.setupTiles( board );
			this.bindEvents( board );
		},
		setupBoard : function( board ) {
			board.$innerContainer.width( board.$outerContainer.width() );
			board.$innerContainer.height( board.$outerContainer.height() );
		},
		setupTiles	: function( board ) {
			for( var tile = null, rowIndex = 0; rowIndex  < board.size; rowIndex++ ) {
				board.tiles[rowIndex] = [];
				for( var colIndex = 0; colIndex  < board.size; colIndex++ ) {
					if( rowIndex !== board.emptySlot.row || colIndex !== board.emptySlot.col ) {
						board.tiles[rowIndex].push( new TileMaze.Tile({
							board 	: board,
							slot 	: {
								row		: rowIndex,
								col		: colIndex
							},
							position : {
								row 	: rowIndex,
								col 	: colIndex
							}
						}));
					}
				}
			}
			while( board.areTilesArranged() ) {
				board.shuffleTiles( Math.ceil( ( 30 * board.level ) / ( board.size * board.size ) ) );
			};
		},
		bindEvents : function( board ) {
			board.$innerContainer.on( 'click', '.tmaze-tile', function( $event ) {
				if( !board.areTilesArranged() ) {
					var tile = $( this ).data( 'tile' ), tileSlot = tile.getSlot();
					if( board.areNeighboringSlots( tileSlot, board.emptySlot ) ) {
						board.moveTile( tile );
						board.areTilesArranged() && board.trigger( 'tmaze:tiles-arranged' );
					}
				}
			});
			
			// @todo
			$( window ).on( 'resize', function() {
				board.render();
				board.trigger( 'resize' );
			});
		}
	};
	 
	 function Board( config ) {
		EventBus.call( this );
		$.extend( true, this, config, {
			$innerContainer : $( tplBoard ),
			tiles			: [],
			emptySlot		: {
				row : config.size - 1,
				col : config.size - 1
			}
		});
		_Helper.init( this );
	}

	Board.prototype = $.extend( Object.create( EventBus.prototype ), {
		constructor : Board,
		getWidth : function() {
			return this.$innerContainer.width();
		},
		getHeight : function() {
			return this.$innerContainer.height();
		},
		getTileAtSlot : function( slot ) {
			var tileSlot;
			for( var rowIndex = 0; rowIndex  < this.size; rowIndex++ ) {
				for( var colIndex = 0; colIndex  < this.tiles[rowIndex].length; colIndex++ ) {
					tileSlot = this.tiles[rowIndex][colIndex].getSlot();
					if( tileSlot.row === slot.row && tileSlot.col === slot.col ) {
						return this.tiles[rowIndex][colIndex];
					}
				}
			}
			return null;
		},
		areNeighboringSlots : function( slotA, slotB ) {
			return ( Math.abs( slotA.row - slotB.row ) + Math.abs( slotA.col - slotB.col ) === 1 );
		},
		shuffleTiles : function( numMoves ) {
			var swapAxis, rowIndex, colIndex;
			for( var i = 0; i < numMoves; i++ ) {
				// select a tile neighboring the empty slot (along the same row/column)
				swapAxis = ( Math.random() > 0.5 ? 'row' : 'column' );

				if( swapAxis === 'row' ) {
					rowIndex = this.emptySlot.row;
					if( this.emptySlot.col === this.size - 1 ) {
						colIndex = this.size - 2;
					} else if( this.emptySlot.col === 0 ) {
						colIndex = 1;
					} else {
						colIndex = ( Math.random() > 0.5 ? this.emptySlot.col - 1 : this.emptySlot.col + 1 );
					}
				} else {
					colIndex = this.emptySlot.col;
					if( this.emptySlot.row === this.size - 1 ) {
						rowIndex = this.size - 2;
					} else if( this.emptySlot.row === 0 ) {
						rowIndex = 1;
					} else {
						rowIndex = ( Math.random() > 0.5 ? this.emptySlot.row - 1 : this.emptySlot.row + 1 );
					}
				}
				
				this.moveTile( this.getTileAtSlot({
					row : rowIndex,
					col : colIndex
				}));
			}
		},
		moveTile : function( tile ) {
			var temp = $.extend( true, {}, tile.getSlot() );
			tile.setSlot( this.emptySlot );
			this.emptySlot = temp;
			this.trigger( 'tmaze:move' );
			return this;
		},
		renderTile : function( tile ) {
			var $tile = tile.getElement();
			$tile.detach();
			// this.$innerContainer.append( $tile.fadeIn( Math.ceil( Math.random() * 500 ) ) );
			this.$innerContainer.append( $tile );
			return this;
		},
		render : function() {
			this.$outerContainer.html( this.$innerContainer );
			
			for( var rowIndex = 0; rowIndex  < this.size; rowIndex++ ) {
				for( var colIndex = 0; colIndex  < this.tiles[rowIndex].length; colIndex++ ) {
					this.renderTile( this.tiles[rowIndex][colIndex] );
				}
			}
			
			return this;
		},
		areTilesArranged : function() {
			for( var rowIndex = 0; rowIndex  < this.size; rowIndex++ ) {
				for( var colIndex = 0; colIndex  < this.tiles[rowIndex].length; colIndex++ ) {
					if( this.tiles[rowIndex][colIndex].getSlot().row !== this.tiles[rowIndex][colIndex].getPosition().row ||
						this.tiles[rowIndex][colIndex].getSlot().col !== this.tiles[rowIndex][colIndex].getPosition().col ) {
							return false;
					}
				}
			}
			return true;
		}
	});
	
	return Board;
}( jQuery ));