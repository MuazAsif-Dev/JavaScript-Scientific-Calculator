import { variables } from "/constants.js";
import { calculate , addVariable, removeVariable} from "./calculate.js";


const buttons = document.querySelectorAll('.calculator__key')
const inputEl = document.querySelector('.calculator__input')
const output = document.querySelector('.calculator__output')

const STORAGE_NAME = 'historyStorage';

if (localStorage.getItem(STORAGE_NAME) == null) {
    localStorage.setItem(STORAGE_NAME, JSON.stringify([]))
}


const addHistoryRow = (item, index) => {
  let table = document.getElementById("history-table-body");

  let row = table.insertRow(0);
  
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);

  cell1.classList.add("history-table-cell")
  cell2.classList.add("history-table-cell")
  cell3.classList.add("history-table-cell")

  cell1.innerHTML = item["expression"];
  cell2.innerHTML = item["result"];

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    row.remove();

    const historyElements = JSON.parse(localStorage.getItem(STORAGE_NAME))

    if (index !== -1) {
      historyElements.splice(index, 1);

      localStorage.setItem(STORAGE_NAME, JSON.stringify(historyElements))  
    }
  });
  
  cell3.appendChild(deleteButton);
  
  cell1.addEventListener('click', () => {
    const historyElements = JSON.parse(localStorage.getItem(STORAGE_NAME))

    if (historyElements.length === 0) {
      return;
    }
  
    inputEl.value = historyElements[index]["expression"];
    output.innerHTML = historyElements[index]["result"];
  });

  cell2.addEventListener('click', () => {
    const historyElements = JSON.parse(localStorage.getItem(STORAGE_NAME))

    if (historyElements.length === 0) {
      return;
    }
  
    inputEl.value = historyElements[index]["expression"];
    output.innerHTML = historyElements[index]["result"];
  });
  
}

document.addEventListener("DOMContentLoaded", function() {

  const historyElements = JSON.parse(localStorage.getItem(STORAGE_NAME))

  for (const index in historyElements) {
    addHistoryRow(historyElements[index], index);
  }

});




function registrateChange() {

  try {  
    let expression = inputEl.value;
  
    let result = calculate(inputEl.value) || '';

    if (result == 0) {
      result = '0';
    }

    output.innerHTML = result
    inputEl.value = result
  
    const historyElements = JSON.parse(localStorage.getItem(STORAGE_NAME))

    const item = {
      "expression": expression,
      "result": result
    }


    historyElements.push( item );

    localStorage.setItem(STORAGE_NAME, JSON.stringify(historyElements))
    
    addHistoryRow(item, historyElements.length - 1)

    
  } catch (error) {
    output.innerHTML = error
  }

}

for (let button of buttons) {
  const symbol = button.innerHTML

  button.addEventListener('pointerdown', () => {

    if (symbol == '=') {
        registrateChange()
    }
    else if (symbol == 'CE') {
        inputEl.value = inputEl.value.slice(0, inputEl.value.length - 1)
    } else if (symbol == 'AC') {
        inputEl.value = '';
        output.innerHTML = '0';
    } else {
        inputEl.value += symbol;
    }
  })
}

inputEl.addEventListener("keypress", function(event) {
  
  if (event.key === "Enter") {
    
    event.preventDefault();
    
    registrateChange();
  }
});



const variable_button = document.querySelector('#variable-submit');
const variable_name = document.querySelector('.variable-add-name');
const variable_value = document.querySelector('.variable-add-value');

const addVariableRow = (variable) => {

  let table = document.getElementById("variable-table-body");

  
  let row = table.insertRow(0);
  
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);

  cell1.classList.add("variable-table-cell")
  cell2.classList.add("variable-table-cell")
  cell3.classList.add("variable-table-cell")
  
  cell1.innerHTML = variable;
  cell2.innerHTML = variables[variable];

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    removeVariable(variable);
    delete variables[variable];
    row.remove();
  });
  
  cell3.appendChild(deleteButton);
}

variable_button.addEventListener('click', () => {
  
  if (variables[variable_name.value] !== undefined) {
    alert('Variable already exists');
    return
  }

  if (!isNaN(Number(variable_name.value))){
    alert('Variable name must not be a number');
    return
  }


  if (isNaN(Number(variable_value.value))){
    alert('Variable value must be a number');
    return
  }
  
  
  addVariable(variable_name.value, variable_value.value);
  addVariableRow(variable_name.value);
  
  variables[variable_name.value] = variable_value.value;

});

document.addEventListener("DOMContentLoaded", function() {

  for (const variable of Object.keys(variables)) {
    addVariableRow(variable);
  }

});

