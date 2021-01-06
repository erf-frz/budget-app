///////budget controller
Var budgetController = (function(){
    
  var Expense = function(id, description, value){
      this.id = id;
      this.description = description;
      this.value =value;
  };
  
   var Income = function(id, description, value){
      this.id = id;
      this.description = description;
      this.value =value;
  };
    
    var data ={
        
        allItems ={
            exp:[],
            inc:[]
            }
        
        totals ={
            exp:0,
            inc:0
        }
    };
    
    


return{
    
    addItem: function(type, des,val){
        var newItem,id;
        
        //create new id
        if(data.allItems[type].length>0){
          id = data.allItems[type][data.allItems[type].length -1] +1;   
        }else{
            id =0;
        }
       
        
        //create new item based on exp or inc
        if(type=='exp'){
         newItem = new Expense(id, des, val)   
        }else if(type==='inc'){
         newItem = new Income(id, des, val)   
        }
        // push it to thr data structure
        data.allItems[type].push(newItem);
    
      //return newItem
        return newItem;
    }
};
})();

//////////UI controller
Var UIController = (function(){
 
    var DOMstrings ={
      inputType:'.add_type',
      inputDescription:'.add_description',
      inputValue:'.add_value', 
      inputBtn:'.btn_add' 
      incomeContainer:'.income_list',
      expenseContainer:'.expenses_list'    
    };
    
    return{
        getInput:function(){
            
            return{
              type: document.querySelector(DOMstrings.inputType).value,
              description: document.querySelector(DOMstrings.inputDescription).value,
              value:parseFloat(document.querySelector(DOMstrings.inputValue).value)   
            };
        },
    
   
        addListItem: function(obj,type){
  var html,newHtml,element;
if(type==='inc'){
  element = DOMstrings.incomeContainer;  
html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';} else if(type==='exp'){
   element =DOMstrings.expenseContainer; 
html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
}
            
newHtml = html.replace('%id%', obj.id);
newHtml = newHtml.replace('%description%',obj.description);
newHtml= newHtml.replace('%value%', obj.value);
            
  document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);          
},
    
clearFields:function(){
   var fields,fieldsArr;
   fields = document.querySelectorAll(DOMstrings.inputDescription +',' +getDOMstrings.inputValue);
    fieldsArr = Array.prototype.slice.call(fields);
    
    fieldsArr.forEach(function(current , index, array){
     
        current.value = "";
    });    
    
  fieldsArr[0].focus();
},
     
        getDOMstrings: function(){
            return DOMstrings;
        }
    };
    
})();




////////////controller

Var controller = (function(budgetCtrl, UICtrl){
    
 var setupEventListeners = function(){
     
   var DOM = UICtrl.getDOMstrings();
   document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);   
 document.addEventListener('keypress', function(event){
     if(keypress.event===13){
        ctrlAddItem(); 
     }
 });     
 };
  Var updateBudget = function(){
//1.calculate the budget         
//2. Return the budget
//3.display the budget in the UI     
}; 

    
 Var ctrlAddItem = function (){
     var input, newItem;
//1.get the field input data
     input = UICtrl.getInput(); 
     
  if(input.description!=="" && !Nan(input.value) && input.value>0){
      
//2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description , input.value)
     
//3. Add the item to the UI
     UICtrl.addListItem(newItem, input.type);
     
//4.clear the fields
     UICtrl.clearFields();
     
//5. Calculate and update budget
   updateBudget();  
  }   

    
};
   
    
    
    
 
    
    
})(budgetController, UIController);
