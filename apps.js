///////////////////////////////////budgetController/////////////////////////////////////////////////////////////////////////////////////
var budgetController = (function(){
 
    var Expense = function(id, description, value) {
      this.id =id;
      this.description= description;
      this.value =value; 
      this.percentage = -1;    
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome>0){
            this.percentage = Math.round((this.value/totalIncome)*100);
        }else{
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
    
    
    var Income = function(id, description, value) {
      this.id =id;
      this.description= description;
      this.value =value;   
    };
    
    var data = {
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp :0,
            inc :0
        },
        budget:0,
        percentage: -1
    };
    
    var calculateTotal = function(type){
        var sum =0;
        data.allItems[type].forEach(function(cur){
            sum +=cur.value;
        });
        data.totals[type] = sum;
    };
    
    
return{
    addItem:function(type,des,val){
        var newItem ,ID;
        
        // Create new ID
        if(data.allItems[type].length > 0){
          ID = data.allItems[type][data.allItems[type].length -1].id +1;  
        }else{
            ID=0;
        }
            
         // Create new item based on 'inc' or 'exp' type
        if(type==='exp'){
            newItem = new Expense(ID,des,val);
        } else if(type==='inc'){
            newItem =new Income(ID,des,val);
        }
        
         // Push it into our data structure
         data.allItems[type].push(newItem);
        
        // Return the new element
        return newItem;
  
    },
    
    calculateBudget: function(){
        // calculate total income and expnses
            calculateTotal('inc');
            calculateTotal('exp');
        
        //calculate the budget: total income – total expense
            data.budget = data.totals.inc - data.totals.exp;
        
        // calculate the percentage of income that we spent
            if(data.totals.inc>0){
              data.percentage =Math.round((data.totals.exp/ data.totals.inc)*100);  
            }else{
              data.percentage = -1;
            }
            
    },
    
    getBudget:function(){
        return{
            budget: data.budget,
            totalInc :data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
        };
    },
    
    
    deleteItem: function(type,id) {
       var ids, index;
        
      ids = data.allItems[type].map(function(current){
                return current.id;
      });
         
      index = ids.indexOf(id);
        if (index !== -1){
            data.allItems[type].splice(index, 1);
        }
    },
    
    calculatePercentage:function(){
        data.allItems.exp.forEach(function(cur){
            cur.calcPercentage(data.totals.inc);
        })
    },
    
    getPercentages: function(){
        var allPerc = data.allItems.exp.map(function(cur){
            return cur.getPercentage();
        });
        
        return allPerc;  
    },
    
    
    
    testing: function() {
            console.log(data);
        }
};    
    
})();

/////////////////////////////////UIController/////////////////////////////////////////////////////////////////////////////////////////////
var UIController = (function(){
   
   var DOMstrings ={
      addType: '.add_type',
      addDescription: '.add_description',
      addValue:'.add_value',  
      addBtn:'.add_btn',
      incomeContainer:'.income_list',
      expenseContainer: '.expenses_list',
      budgetLabel : '.budget_value',
      incomeLabel : '.budget_income_value',
      expenseLabel: '.budget_expense_value',
      percentageLabel: '.budget_expense_percentage',
      Container: '.container',
      expensesPercLabel: '.item_percentage',
      dateLabel: '.budget_title_month' 
   }; 
    
    
  var nodeListForEach = function(list, callback){
      
      for(var i =0; i< list.length; i++){
          callback(list[i],i);     //(current,index)
      }
     };  
    
  var formatNumbers = function(num, type){
      var numSplit, int, dec;
     //+ or – before the numbers
	//Exactly 2 decimal points
	//Comma separating the thousands
     num = Math.abs(num);
     num = num.toFixed(2);
     numSplit =num.split('.');
     int = numSplit[0];
      
      if(int.length>3){
         int = int.subst(0,int.length-3) + ',' + int.substr(int.length-3,3); 
      }
      
     dec = numSplit[1];  
    
      return (type=='inc'? '+': '-') +' ' +int + '.' +dec; 
       
  };    
    
    
   return{
       
      getInput:function() {
          return{
        type : document.querySelector(DOMstrings.addType).value,   //exp or inc
        description : document.querySelector(DOMstrings.addDescription).value,
        value :parseFloat(document.querySelector(DOMstrings.addValue).value)  
          };
     }, 
  
       getDOMstrings: function(){
           return DOMstrings;
       },
       
       addListItem: function(obj, type){
           var HTML,newHtml,element;
           //1. create a html element with placeholder text
           if (type==='inc'){
               element = DOMstrings.incomeContainer;
             HTML = '<div class="item clearfix" id="inc-%id%"><div class="item_description">%description%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="item_delete"><button class="item_delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';  
               
           } else if(type==='exp'){
               element = DOMstrings.expenseContainer;
               HTML = '<div class="item clearfix" id="exp-%id%"><div class="item_description">%description%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="item_percentage">21%</div><div class="item_delete"><button class="item_delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
               
           }
           //2.replace the placeholder text with some actual data
           
           newHtml = HTML.replace('%id%', obj.id);
           newHtml = newHtml.replace('%description%', obj.description);
           newHtml = newHtml.replace('%value%', formatNumbers(obj.value , type));
           
           //3. insert the html into the dom
           
           document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
       },
       
       clearFields: function(){
           var fields, fieldsArr;
          fields = document.querySelectorAll(DOMstrings.addDescription +',' + DOMstrings.addValue);
          fieldsArr = Array.prototype.slice.call(fields);
          fieldsArr.forEach(function(cur){
              cur.value = "";
          });
           fieldsArr[0].focus();
       },
       
       displayBudget:function(obj){
           
           obj.budget > 0 ? type ='inc': type='exp';
           document.querySelector(DOMstrings.budgetLabel).textContent = formatNumbers(obj.budget, type);
           document.querySelector(DOMstrings.incomeLabel).textContent = formatNumbers(obj.totalInc , 'inc');
           document.querySelector(DOMstrings.expenseLabel).textContent = formatNumbers(obj.totalExp, 'exp');
           
           if(obj.percentage>0){
              document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';  
           }else{
              document.querySelector(DOMstrings.percentageLabel).textContent ='---';  
           }
          
       },
       
       deleteListItem: function(selectorID){
          var el;
           
          el = document.getElementById(selectorID);
           el.parentNode.removeChild(el);
        
       },
       
       
       displayPercentages: function(percentages){
           
        var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);   //returns a node list
         nodeListForEach(fields, function(cur, index){
             if(percentages[index]>0){
                 cur.textContent = percentages[index] + '%';
             }else{
                 cur.textContent = '---';
             }
         });  
       },
       
       displayDate: function(){
           var now, month, months, year;
           
           now = new Date();
           month = now.getMonth();
           months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
           year = now.getFullYear();
           
           document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
       },
       
       
       changedType: function(){
           
          var fields = document.querySelectorAll(DOMstrings.addType + ',' + DOMstrings.addDescription + ','+ DOMstrings.addValue);
           
           nodeListForEach(fields , function(cur){
               cur.classList.toggle('red-focus');
            });
           
               document.querySelector(DOMstrings.addBtn).classList.toggle('red');
           
       }
       
       
     };
})();


///////////////////////////////////mainController////////////////////////////////////////////////////////////////////////////////////////////
var mainController = (function(bgtCtrl,UICtrl) {
    
var setupEventListeners = function(){
    var DOM = UICtrl.getDOMstrings();    
    document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event){
   if(event.keycode===13 || event.which===13){
       ctrlAddItem();
   }  
     
   });    
   
    document.querySelector(DOM.Container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOM.addType).addEventListener('change', UICtrl.changedType);
 };
    

var updateBudget = function(){
 //1.calculate the budget
    bgtCtrl.calculateBudget(); 
    
 //2.return the budget
    var budget = bgtCtrl.getBudget();
    //console.log(budget);
    
 //3.display the budget in the UI   
   // console.log('it works!');
    UICtrl.displayBudget(budget);
     
};
    
var updatePercentages = function(){
    
//1. Calculate percentages
   bgtCtrl.calculatePercentage(); 
    
//2. Read percentages from the budgetController
    var percentages = bgtCtrl.getPercentages();
    
//3. Update the UI with the new percentages
    
    UICtrl.displayPercentages(percentages);
};
    
    
 var ctrlAddItem = function(){
   var input,newItem;  
//1.get the field input data
 input = UICtrl.getInput();  
 
 if(input.description !=="" && !isNaN(input.value) && input.value >0 ){     
//2. Add the item to the budget controller
     newItem = bgtCtrl.addItem(input.type, input.description, input.value);   
      
     
//3. Add the item to the UI
  UICtrl.addListItem(newItem ,input.type);
     

//4. clear the fields 
  UICtrl.clearFields();
     
//5.calculate and update the budget   
  updateBudget();

//6.Calculate and update percentages
  updatePercentages();
     
    }
 };
    
 
 var ctrlDeleteItem = function(event){
     var itemID, splitID, type, ID;
     
   itemID =event.target.parentNode.parentNode.parentNode.parentNode.id;
     
    if(itemID){
        
    splitID = itemID.split('-');
    type = splitID[0];
    ID =parseInt(splitID[1]);  
        
    //1. Delete the item from the data structure
       bgtCtrl.deleteItem(type,ID);
        
    //2. Delete the item from the UI
       UICtrl.deleteListItem(itemID);
        
    //3. Update and show the new budget
        updateBudget();
        
    //4.Calculate and update percentages
        updatePercentages();
    } 

 };   
    
    
 return{
     init: function(){
         console.log('Application has started.');
         UICtrl.displayDate();
         UICtrl.displayBudget({
             budget:0,
             totalInc:0,
             totalExp:0,
             percentage:-1
         });
          setupEventListeners();
     }
 };   


})(budgetController, UIController);

mainController.init();