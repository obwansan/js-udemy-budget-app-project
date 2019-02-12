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

    var calculateTotal = function(type) {
      var sum = 0;
      data.items[type].forEach(function(obj) {
        sum += obj.value;
      });
      data.totals[type] = sum;
    };

    // -1 is a way of saying pecentage doesn't exist yet
    var data = {
      items: {
        exp: [],
        inc: []
      },
      totals: {
        exp: 0,
        inc: 0
      },
      budget: 0,
      percentage: -1
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

      calculateBudget: function() {
        // calculate total income and expenses
        calculateTotal('exp');
        calculateTotal('inc');

        // calculate the budget: income - expenses
        data.budget = data.totals.inc - data.totals.exp;

        // calculate the percentage of income that we spent
        if(data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else {
            data.percentage = -1;
        }
      },

      getBudget: function() {
        return {
          budget: data.budget,
          totalInc: data.totals.inc,
          totalExp: data.totals.exp,
          percentage: data.percentage
        }
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
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage'
  }

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMSelectors.inputType).value, // will be either inc(ome) or exp(ense)
        description: document.querySelector(DOMSelectors.inputDescription).value,
        value: parseFloat(document.querySelector(DOMSelectors.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;

      // Create html string with placeholder text
      if (type === 'inc') {
          element = DOMSelectors.incomeContainer;

          html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
      } else if (type === 'exp') {
          element = DOMSelectors.expensesContainer;

          html = '<div class="item clearfix" id="expense-%0%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      // Replace placeholder text with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(DOMSelectors.inputDescription + ', ' + DOMSelectors.inputValue);

      // querySelectorAll returns a 'list', an array-like object that doesn't have access to the 
      // built-in JS array functions like slice. Using slice on the list returns an array. But have 
      // to use slice on the Array.prototype as can't use it on the array itself.
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(currentEl) {
        currentEl.value = '';
      });

      // Move focus back to the description field after entering an item
      fieldsArr[0].focus();

    },

    displayBudget: function(obj) {
      document.querySelector(DOMSelectors.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMSelectors.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMSelectors.expensesLabel).textContent = obj.totalExp;
      
      if(obj.percentage > 0) {
          document.querySelector(DOMSelectors.percentageLabel).textContent = obj.percentage + '%';
      } else {
          document.querySelector(DOMSelectors.percentageLabel).textContent = '---';
      }
    },

    // Public 'getter' function (method)
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

  var updateBuget = function() {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    // 2. Return the budget
    var budget = budgetCtrl.getBudget();
    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  // This function runs whenever the user clicks the add button or presses the enter key
  var ctrlAddItem = function() {
    var input, newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();

    // Only add a new item to the UI if there's a description and valid value
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller data object and return it
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      UICtrl.clearFields();

      // 5. Calculate and update budget
      updateBuget();
    }

  };
  return {
    init: function() {
      console.log('Application has started');
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
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