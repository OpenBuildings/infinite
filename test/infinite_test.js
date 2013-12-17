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

	module('jQuery#infinite', {
		// This will run before each test in this module.
		setup: function() {
			this.items = $('#qunit-fixture').children();
		}
	});

	test('return a Promise', 6, function() {
		var actual = this.items.infinite();

		ok( typeof actual === 'object', 'must be an object' );
		ok( typeof actual.always === 'function', 'must have a method always' );
		ok( typeof actual.progress === 'function', 'must have a method progress' );
		ok( typeof actual.done === 'function', 'must have a method done' );
		ok( typeof actual.fail === 'function', 'must have a method fail' );
		ok( typeof actual.then === 'function', 'must have a method then' );
	});

}(jQuery));
