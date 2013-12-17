/**
 * Infinite Scroll
 * https://github.com/OpenBuildings/infinite
 *
 * A small plugin to check if the page is scrolled to an element.
 *
 * Author Haralan Dobrev <hkdobrev@gmail.com>
 * Copyright (c) 2013 OpenBuildings, Inc.
 * Licensed under the BSD 2-clause license.
 */

(function( window, $, undefined ) {

/**
 * Check if the page is scrolled to the element.
 * It assumes the page is scrolled to the element, only if it is visible
 * and there are `bufferPx` pixels or less to the element
 *
 * @param  {Number}  bufferPx number of pixels to act as a buffer. Default is 0.
 * @param  {String}  direction Either "up" or "down". Default is "down".
 * @return {Boolean}
 */
$.fn.isScrolledTo = function( bufferPx, direction ) {
	var
		$window,
		scrolledPx, visibleAreaHeight,
		elementOffsetTop, elementOffsetBottom;

	if ( !this.is( ':visible' ) ) {
		return false;
	}

	$window = $(window);
	scrolledPx = $window.scrollTop();
	elementOffsetTop = this.offset().top;

	bufferPx = bufferPx || 0;

	if ( direction === 'up' ) {
		elementOffsetBottom = elementOffsetTop + this.height();

		return scrolledPx <= elementOffsetBottom + bufferPx;
	} else {
		visibleAreaHeight = $window.height();

		return scrolledPx + visibleAreaHeight >= elementOffsetTop - bufferPx;
	}
};

}( window, window.jQuery ));
