// Example of a 'module' in JS. An IIFE that returns an object with a method.
//
// budgetController.add(5) doesn't work because it's effectively a private
// method (because budgetController is an IIFE).
//
// budgetController.publicTest(5) works because budgetController is an IIFE
// that returns an object, of which publicTest is a method. So when the JS
// runtime runs budgetController becomes the object the IIFE returns and the
// publicTest method can be run on it.
//
// The publicTest method will always have access to variable x and function add()
// because of closure. 
var budgetController = (function() {

    var x = 23;

    var add = function(a) {
      return x + a;
    }

    return {
        publicTest: function(b) {
          console.log(add(b));
        }
    }

})();
