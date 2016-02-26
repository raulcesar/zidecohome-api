'use strict';

var func1 = function(arg1, arg2) {
    console.log('arg1: ' + arg1);
    console.log('arg2: ' + arg2);
};


func1();
func1('a');
func1('a', 'b');
func1(1, 2);
func1(1);
func1(1, 2, 3, 'b');

func1({
    a: '1',
    b: '2'
}, function(bla) {
    console.log(bla);
}, 1, 2, 3);
