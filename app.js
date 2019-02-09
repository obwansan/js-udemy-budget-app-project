// BUDGET CONTROLLER
var budgetController = (function() {

    // A function constructor that creates an object. We use this because there 
    // will be lots of expenses.Creating a new Expense object example: 
    // var exp = new Expense(1, test, 100);
    var Expense = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };

    var Income = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };

    var data = {
      items: {
        exp: [],
        inc: []
      },
      totals: {
        exp: 0,
        inc: 0
      }
    }

    // The budgetController function returns this object when the app 
    // loads/reloads because its an IIFE.
    return {
      addItem: function(type, des, val) {
        var newItem, ID;

        // Create new ID
        // Can use bracket object access notation because the argument 
        // type uses the same term as the items object property.
        // The 'inc' and 'exp' arrays hold Expense and Income objects, respectively.
        // So here we're accessing the id property of the last object in the array
        // and adding 1 to create the ID of the next object to be added to the array.
        if (data.items[type].length > 0) {
          ID = data.items[type][data.items[type].length - 1].id + 1;
        } else {
          ID = 0;
        }
        

        // Create new item based on 'inc' or 'exp' type
        if (type === 'exp') {
          newItem = new Expense(ID, des, val);
        } else if (type === 'inc') {
          newItem = new Income(ID, des, val);
        }
        // Push it into our data structure
        data.items[type].push(newItem);

        // Enables access to the newItem using budgetController.addItem()
        return newItem;
      },

      testing: function() {
        console.log(data);
      }
    }

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
    var input, newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();

    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

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

/* The controller function is called automatically when the app loads/reloads,
   and the budgetController and UIController functions are passed in, allowing 
   the controller function to access both their functions and objects.
   What's the difference between budgetController and UIController just containing
   an object and returning an object? It seems both can be accessed in the same way
   e.g. budgetController.data.items.exp and budgetController.addItem

   Because budgetController.data.items.exp won't work. budgetController returns an 
   object that doesn't have data as a property! The only way to access the data object 
   is using a getter function such as getDOMSelectors() in UIController.
*/