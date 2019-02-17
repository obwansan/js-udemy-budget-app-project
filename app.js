// BUDGET CONTROLLER
var budgetController = (function() {

    // A function constructor that creates an object. We use this because there 
    // will be lots of expenses.Creating a new Expense object example: 
    // var exp = new Expense(1, test, 100);
    var Expense = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    };

    // Adds the calcPercentage method to all instances of the Expense object
    Expense.prototype.calcPercentage = function(totalIncome) {
      if (totalIncome > 0) {
          this.percentage = Math.round((this.value / totalIncome) * 100);
      } else {
          this.percentage = -1;
      }
    };

    // Adds the getPercentage method to all instances of the Expense object
    Expense.prototype.getPercentage = function() {
      return this.percentage;
    };

    var Income = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
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
        // type uses the same term ('exp' or 'inc') as the items object property.
        // The 'inc' and 'exp' arrays hold Expense and Income objects, respectively.
        // So here we're accessing the id property of the last object in the array
        // and adding 1 to create the ID of the next object to be added to the array.
        if (data.items[type].length > 0) {
          ID = data.items[type][data.items[type].length - 1].id + 1;
        } else {
          ID = 0;
        }
        
        // Create new item based on 'inc' or 'exp' type.
        // Pass it the actual ID (an argument) and parameters for description and placeholder.
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

      // My version
      deleteItem: function(type, ID) {
        data.items[type].forEach(function(obj, index) {
          // If the ID of the budget item (DOM node / div) you are deleting is the 
          // same as the id of a previously added budget item (object) in the data.items[type] array,
          if (obj.id === ID) {
            // remove it
            data.items[type].splice(index, 1);
          }
        });
      },

      // Jonas' version
      // deleteItem: function(type, ID) {
      //   var ids, index;

      //   // Get an array of the budget object ids
      //   ids = data.items[type].map(function(current) {
      //     return current.id;
      //   });
      //   // Get the index of the container parentNode div that has the 
      //   // event listener (see ctrlDleteItem() )
      //   index = ids.indexOf(ID);

      //   // If the index (and therefore the container parentNode div) is in the array
      //   if (index !== -1) {
      //     // remove it
      //     data.items[type].splice(index, 1);
      //   }
      // },

      calculateTotal: function(type) {
        var sum = 0;
        data.items[type].forEach(function(obj) {
          sum += obj.value;
        });
        data.totals[type] = sum;
      },

      calculateBudget: function() {
        // calculate total income and expenses
        this.calculateTotal('exp');
        this.calculateTotal('inc');

        // calculate the budget: income - expenses
        data.budget = data.totals.inc - data.totals.exp;

        // calculate the percentage of income that we spent
        if(data.totals.inc > 0) {
          data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else {
          data.percentage = -1;
        }
      },

      calculatePercentages: function() {
        data.items.exp.forEach(function(expObj) {
          // Calling the calcPercentage method that was added to the Expense object prototype.
          // calcPercentage calculates the percentage and adds it to the objects percentage property.
          expObj.calcPercentage(data.totals.inc);
        })
      },

      getPercentages: function() {
        // The return keyword doesn't break out of the loop, it adds it to the new array that
        // the map function returns.
        var allPercentages = data.items.exp.map(function(expObj) {
          return expObj.getPercentage();
        });
        return allPercentages;
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
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  }

  var formatNumber = function(num, type) {
    var numSplit, int, dec;
    // Makes negative numbers positive
    num = Math.abs(num);
    // toFixed is a method on the JS number prototype. Calling it on a number variable 
    // automatically wraps the number primitive in a number object that has the method.
    num = num.toFixed(2);
    // Split the number into array on the decimal. Can split it because, bizarrely, .toFixed returns a string!
    numSplit = num.split('.');
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // input 2310 outputs 2,310
    }
    dec = numSplit[1];
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  };

  // Create a forEach function for node lists
  var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  // The budgetController function returns this object when the app loads/reloads because its an IIFE.
  // The return object contains public methods that can be accessed outside the controller. The functions,
  // varibles and objects that aren't returned are private (can't be accessed except by a getter function).
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

          html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
      } else if (type === 'exp') {
          element = DOMSelectors.expensesContainer;

          html = '<div class="item clearfix" id="exp-%0%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      // Replace placeholder text with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
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
    // Displays the main figures in the center of the page
    displayBudget: function(obj) {
      var type;
      // The obj parameter is passed the budget variable, which holds an object containing the budget
      // property (see the updateBudget function in the global app controller). This 'budget' value is 
      // really the income left after expenses, so if it's greater than 0 the prefix should be a + and 
      // vica versa. 
      obj.budget > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMSelectors.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMSelectors.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMSelectors.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      
      if(obj.percentage > 0) {
          document.querySelector(DOMSelectors.percentageLabel).textContent = obj.percentage + '%';
      } else {
          document.querySelector(DOMSelectors.percentageLabel).textContent = '---';
      }
    },

    // The percentages argument passed in here is the array of percentages (from each exp/inc object) 
    // returned by the getPercentages function.
    displayPercentages: function(percentages) {

      // Returns a DOM node list (all DOM nodes / HTML elements with the class .item__percentage)
      var fields = document.querySelectorAll(DOMSelectors.expensesPercLabel);

      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },

    displayMonth: function() {
      var now, month, months, year;
      now = new Date();
      // ES6 alternative to having to list all months in an array and use the month integer
      // gotten from .getMonth() to access the month name at the corresponding index in the array.
      month = now.toLocaleString('en-gb', {month: 'long'});
      year = now.getFullYear();
      document.querySelector(DOMSelectors.dateLabel).textContent = month + ' ' + year;

      // One line solution
      // document.querySelector(DOMSelectors.dateLabel).textContent = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    },

    changedType: function() {

      // Returns a node list therefore can't use normal forEach
      var fields = document.querySelectorAll(
        DOMSelectors.inputType + ',' +
        DOMSelectors.inputDescription + ',' +
        DOMSelectors.inputValue
      );

      // So use the forEach we made earlier!
      // Whenever the type is changed from expense to income or vica versa, if one 
      // of the 3 fields has the call .red-focus, remove it, and if it doesn't, add it.
      nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');
      });

      document.querySelector(DOMSelectors.inputBtn).classList.toggle('red');

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

    // The callback function passed to a event listener always has access to the event object
    // via the parameter passed to it. Can call it anything, but usually 'event', 'ev' or 'e'.
    document.addEventListener('keypress', function(event) {
      // If the Enter key is pressed
      if (event.keycode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    // The click event bubbles up from the event target (the delete button) to the element
    // that is parent to all income or expense divs (i.e. DOM.container). So don't have to put 
    // an event listener on every income / expense div (maybe you can't anyway if they're 
    // generated dynamically?)
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  };

  var updateBuget = function() {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    // 2. Return the budget
    var budget = budgetCtrl.getBudget();
    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function() {

    // Calculate percentages
    budgetCtrl.calculatePercentages();

    // Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();

    // Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  // This function runs whenever the user clicks the add button or presses the enter key
  // (as long as it's passed to an event listener!)
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

      // 6. Calculate and update percentages
      updatePercentages();
    }
  };

  // The callback function passed to a event listener always has access to the event object
  // via the parameter passed to it. Can call it anything, but usually 'event', 'ev' or 'e'.
  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

    // Get the CSS #id of the required parent node (the div that contains all the HTML for an
    // expense or income item.)
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      // inc-1
      splitID = itemID.split('-');
      type = splitID[0]; // e.g. inc
      ID = parseInt(splitID[1]); // e.g. 1

      // 1. Delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // 3. Update and show the new budget
      updateBuget();

      // 4. Calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function() {
      console.log('Application has started');
      UICtrl.displayMonth();
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