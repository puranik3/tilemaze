/**
 * Pushes passed element(s) onto calling array if not already present.
 * Note: This is helper method used in EventBus class. This implementation does not support IE 6, 7 and 8. For a fallback on these browsers check out http://stackoverflow.com/questions/143847/best-way-to-find-an-item-in-a-javascript-array
 * @param {number|boolean|string|object|array} elements - The items to be pushed onto array.
 * 														  An array of objects to be pushed is also accepted.
 * 														  However in case the first argument is an array, the rest (if any) are ignored.
 * @return {number} - An array of elements that actually got pushed. Note that an array is returned even when an array was not passed to pushMerge.
 */
Array.prototype.pushMerge = function( elements /*, ... */ ) {
	var elementsToPush = ( toString.call( elements ) === '[object Array]' ? elements : arguments );
	
	for( var pushedElements = [], i = 0, length = elementsToPush.length; i < length; i++ )
		if( this.indexOf( elementsToPush[i] ) < 0 )
			pushedElements.push( elementsToPush[i] );
	
	Array.prototype.push.apply( this, pushedElements );
	return pushedElements;
}

// **************
// EventBus class
// **************
var EventBus = (function( $ ) {
	function EventBus() {
		this._callbacksMap = {};
	}

	EventBus.prototype = {
		constructor : EventBus,
		on : function( eventNames, callbacks ) {
			var splitEventNames = eventNames.split( ' ' ), eventName;
			for( var i = 0; i < splitEventNames.length; i++ ) {
				eventName = splitEventNames[i];
				this._callbacksMap[eventName] = this._callbacksMap[eventName] || [];
				this._callbacksMap[eventName].pushMerge( ( toString.call( callbacks ) === '[object Array]' ? callbacks : Array.prototype.slice.call( arguments, 1 ) ) );
			}
		},
		off : function( eventNames, callbacks ) {
			var splitEventNames = eventsNames.split( ' ' ), eventName;
			for( var i = 0; i < splitEventNames.length; i++ ) {
				eventName = splitEventNames[i];
				var callbacksForEvent = this._callbacksMap[eventName];
				if( callbacksForEvent && callbacks ) {
					var callbacksToRemove = ( toString.call( callbacks ) === '[object Array]' ? callbacks : Array.prototype.slice.call( arguments, 1 ) );
					for( var i = 0, callbackIndex = 0, length = callbacksToRemove.length; i < length; i++ ) {
						callbackIndex = callbacksForEvent.indexOf( callbacksToRemove[i] );
						if( callbackIndex !== -1 )
							callbacksForEvent.splice( callbackIndex, 1 );
					}
				} else
					delete this._callbacksMap[eventName];
			}
		},
		trigger : function( eventName, paramList ) {
			var callbacksForEvent = this._callbacksMap[eventName];
			if( callbacksForEvent )
				for( var i = 0, length = callbacksForEvent.length; i < length; i++ ) {
					callbacksForEvent[i].apply( null, paramList ); /* reusing paramList in each call - you may consider making a deep copy before passing */
				}
		}
	}
	
	return EventBus;
}( jQuery ));