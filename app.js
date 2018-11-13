// BUDGET CONTROLLER
var budgetController = (function() {

    // some code

})();


// UI CONTROLLER
var UIController = (function() {

    // some code

})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

  var ctrlAddItem = function() {

    // 1. Get the field input data

    // 2. Add the item to the bidget controller

    // 3. Add the item to the UI

    // 4. Calculate the budget

    // 5. Display the budget on the UI

    console.log('It works');
  }

  document.querySelector(".add__btn").addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event) {

    // If the enter key is pressed
    if (event.keycode === 13 || event.which === 13) {
      ctrlAddItem();
    }


  });

})(budgetController, UIController);
