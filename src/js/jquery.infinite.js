/**
 * Infinite Scroll
 * https://github.com/OpenBuildings/infinite
 *
 * Author Haralan Dobrev <hkdobrev@gmail.com>
 * Copyright (c) 2013 OpenBuildings, Inc.
 * Licensed under the BSD 2-clause license.
 */

(function( window, $, undefined ) {

var
	// Constants
	PLUGIN = 'infinite',
	NAMESPACE = '.' + PLUGIN,
	LOADING_CLASS = 'inf-anchor-loading',
	EVENTS = {
		click: 'click' + NAMESPACE,
		start: 'start' + NAMESPACE
	},
	DIRECTIONS = {
		up: 'up',
		down: 'down',
		both: 'both'
	},

	// Default options.
	// They could be overriden for all instances by setting
	// $.infinite.defaultOptions
	defaultOptions = {

		// Interval in milliseconds to check if scrolled
		scrollTimeInterval: 256,

		// Direction for the infinite scroll. "down", "up" or "both"
		direction: DIRECTIONS.down,

		// Number of buffer pixels before the next anchor is reached.
		// If loading of items is slow or you want to achieve seamless UX,
		// increase this value. Common for both directions.
		buffer: 100,

		upSelector: '.inf-anchor-up',

		downSelector: '.inf-anchor-down',

		itemSelector: '.inf-item'

	},
	$window = $(window),
	coreSlice = Array.prototype.slice;

function Infinite( options, element ) {
	this.element = element;
	this.options = $.extend(
		{},
		$.infinite.defaultOptions,
		$( element ).data(),
		options
	);
	this.deferred = new $.Deferred();

	this._init();
}

// Instance methods
$.extend(true, Infinite.prototype, {

	// Private methods

	// Initialization
	_init: function() {
		var
			direction = this.options.direction,
			self,
			upAnchor, downAnchor,
			scrolledPx, previousScrolledPx;

		this.retrieving = {
			up: false,
			down: false
		};

		if ( direction === 'both' ) {
			this.upDirection = true;
			this.downDirection = true;
		} else if ( direction === 'up' ) {
			this.upDirection = true;
		} else if ( direction === 'down' ) {
			this.downDirection = true;
		}

		upAnchor = $(this.options.upSelector);
		downAnchor = $(this.options.downSelector);

		if ( !upAnchor.length && !downAnchor.length ) {
			// No next anchor on page.
			// Probably the infinite scroll plugin was enabled in vain.
			// Further resistance is futile.
			return;
		}

		downAnchor.add(upAnchor).on(EVENTS.click, function() {
			return false;
		});

		if ( upAnchor.isScrolledTo( this.options.buffer ) ) {
			this.retrieve( 'up' );
		}

		if ( downAnchor.isScrolledTo( this.options.buffer ) ) {
			this.retrieve( 'down' );
		}

		scrolledPx = previousScrolledPx = $window.scrollTop();

		this._clearTimeout();

		self = this;

		(function hasScrolled() {
			scrolledPx = $window.scrollTop();

			self.scrolledDistancePx = scrolledPx - previousScrolledPx;

			if ( self.scrolledDistancePx !== 0 ) {
				self.scrolled();
			}

			previousScrolledPx = scrolledPx;

			self.timeoutID = window.setTimeout(
				hasScrolled,
				self.options.scrollTimeInterval
			);
		}());
	},

	// No more items in this direction
	_done: function( direction ) {

		// If fetching items failed (or finished) in both directions,
		// destroy instance to free up resources

		this[ direction + 'Direction' ] = false;

		$( this.options[ direction + 'Selector' ] ).remove();

		if ( !this.upDirection && !this.downDirection ) {
			this.destroy();
		}
	},

	// used in destroy
	_clearTimeout: function() {
		if ( this.timeoutID ) {
			window.clearTimeout(this.timeoutID);
		}
	},

	// Public methods
	
	promise: function() {
		return this.deferred.promise();
	},

	// Document is scrolled
	scrolled: function() {

		var
			direction = this.scrolledDistancePx > 0 ? 'down' : 'up',
			nextAnchor;

		// Currently retrieving items in this direction. Stop further checks.
		if ( this.retrieving[ direction ] ) {
			return;
		}

		// Infinite scroll in this direction is not enabled.
		if ( !this[ direction + 'Direction' ] ) {
			return;
		}

		nextAnchor = $( this.options[ direction + 'Selector' ] );

		// Anchor for this direction is no longer visible. Stop further checks.
		if ( !nextAnchor.is( ':visible' ) ) {
			return;
		}

		// Check if we have reached next anchor in this direction
		if ( nextAnchor.isScrolledTo( this.options.buffer, direction ) ) {

			// Retrieve items in this direction
			this.retrieve( direction );
		}
	},

	// Retrieve more elements to append in a given direction
	retrieve: function( direction ) {
		var
			self = this,
			nextAnchor = $( this.options[ direction + 'Selector' ] );

		// Set retrieving flag for the current direction
		this.retrieving[ direction ] = true;

		$( this.element ).trigger( EVENTS.start, direction );

		nextAnchor.addClass( LOADING_CLASS );

		$.get( nextAnchor.prop( 'href' ) )
			.done(function( data ) {
				self.loaded( data, direction );
			})
			.fail(function() {
				self._done( direction );
			})
			.always(function() {
				// Always unset the retrieving flag for this direction
				self.retrieving[ direction ] = false;

				nextAnchor.removeClass( LOADING_CLASS );
			});
	},

	// Response from the server is loaded
	loaded: function( data, direction ) {
		var
			nextAnchorSelector = this.options[ direction + 'Selector' ],
			nextAnchor, container, children, oldDocumentHeight;

		if ( !data || !data.length ) {
			this._done( direction );
			$( nextAnchorSelector ).remove();

			return;
		}

		// Support for infinite scroll in tables
		// You cannot append <tr> inside a <div> on some browsers
		container = $( this.element.nodeName === 'TABLE' ?
			'<tbody>' :
			'<div>' ).append( data );

		children = container.find( this.options.itemSelector );

		if ( !children.length ) {
			this._done( direction );
			$( nextAnchorSelector ).remove();

			return;
		}

		oldDocumentHeight = $( document ).height();

		$( this.element )[ direction === 'up' ?
			'prepend' :
			'append' ]( children );

		if ( direction === DIRECTIONS.up ) {
			$( window ).scrollTop(
				$( window ).scrollTop() +
				$( document ).height() -
				oldDocumentHeight
			);
		}

		this.deferred.notify( direction, children );

		nextAnchor = container.find( nextAnchorSelector );

		if ( !nextAnchor.length ) {
			this._done( direction );
			$( nextAnchorSelector ).remove();

			return;
		}

		$( nextAnchorSelector ).replaceWith( nextAnchor );
	},

	// Destroy the instance
	destroy: function() {
		this.deferred.resolve();
		$.removeData( this.element, PLUGIN );
		this._clearTimeout();
	}
});

$.fn.infinite = function( options ) {
	var
		isMethodCall = typeof options === "string",
		args = coreSlice.call( arguments, 1 ),
		domElement = this.get( 0 ),
		instance, methodResult;

	if ( !domElement ) {
		return this;
	}

	instance = $.data( domElement, PLUGIN );

	if ( isMethodCall ) {

		if ( options === "instance" ) {
			return instance;
		}

		// If there is no instance, throw an error
		if ( !instance ) {
			return $.error( "cannot call methods on " +
				PLUGIN +
				" prior to initialization; " +
				"attempted to call method '" +
				options +
				"'" );
		}

		// If there is no such public method, throw an error
		if ( !$.isFunction( instance[ options ] ) ||
			options.charAt( 0 ) === "_" ) {
			return $.error( "no such method '" +
				options +
				"' for "+
				PLUGIN +
				" instance" );
		}

		methodResult = instance[ options ].apply( instance, args );

		if ( methodResult !== instance && methodResult !== undefined ) {
			return methodResult;
		}

		return this;
	}

	if ( instance ) {
		$.extend( instance.options, options || {} );
		if ( instance._init ) {
			instance._init();
		}
	} else {
		instance = new Infinite( options, domElement );
		$.data( domElement, PLUGIN, instance );
	}

	return instance.deferred.promise();
};

// Expose Infinite constructor
$.infinite = Infinite;

// Expose static properties
$.extend( $.infinite, {
	namespace: NAMESPACE,
	events: EVENTS,
	directions: DIRECTIONS,
	defaultOptions: defaultOptions
});

}( window, window.jQuery ));
