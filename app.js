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
          return add(b);
        }
    }

})();

var UIController = (function() {

    // some code

})();

// Best practice to pass budgetController and UIController into controller
// rather than just access them in the global scope. Why? If the names of these
// object.methods changes, you only need to change the name of the argument passed
// into controller rather than the (potentially multiple) uses of it in the
// controller object.
var controller = (function(budgetCtrl, UICtrl) {

    var z = budgetCtrl.publicTest(30);

    return {
      anotherPublicMethod: function() {
        console.log(z);
      }
    }

})(budgetController, UIController);
