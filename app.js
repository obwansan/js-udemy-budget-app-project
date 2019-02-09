// BUDGET CONTROLLER
var budgetController = (function() {

    // some code

})();


// UI CONTROLLER
var UIController = (function() {

  // Means you only have to make one code change if a CSS selector changes
  var DOMSelectors = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMSelectors.inputType).value, // will be either inc(ome) or exp(ense)
        description: document.querySelector(DOMSelectors.inputDescription).value,
        value: document.querySelector(DOMSelectors.inputValue).value
      };
    },

    getDOMSelectors: function() {
      return DOMSelectors;
    }
  }
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMSelectors();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event) {
      // If the Enter key is pressed
      if (event.keycode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function() {

    // 1. Get the field input data
    var input = UICtrl.getInput();

    // 2. Add the item to the budget controller

    // 3. Add the item to the UI

    // 4. Calculate the budget

    // 5. Display the budget on the UI

  };
  return {
    init: function() {
      console.log('Application has started');
      setupEventListeners();
    }
  };

})(budgetController, UIController);

controller.init();