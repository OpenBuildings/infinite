(function($) {
	/*
		======== A Handy Little QUnit Reference ========
		http://api.qunitjs.com/

		Test methods:
			module(name, {[setup][ ,teardown]})
			test(name, callback)
			expect(numberOfAssertions)
			stop(increment)
			start(decrement)
		Test assertions:
			ok(value, [message])
			equal(actual, expected, [message])
			notEqual(actual, expected, [message])
			deepEqual(actual, expected, [message])
			notDeepEqual(actual, expected, [message])
			strictEqual(actual, expected, [message])
			notStrictEqual(actual, expected, [message])
			throws(block, [expected], [message])
	*/

	module('jQuery#isScrolledTo', {
		// This will run before each test in this module.
		setup: function() {
			this.element = $('#long-list').children().first();
			this.elementLast = $('#long-list').children().last();
		}
	});

	test('return boolean', 1, function() {

		var result = this.element.isScrolledTo(),
			type = $.type(result);

		strictEqual(type, 'boolean', 'should be a boolean');
	});

}(jQuery));
