// ----- get the components -----
const calculator = document.querySelector('#calculator');
const display = document.querySelector('.display');
const clear = document.querySelector('.clear');

// ----- operation when any button clicked -----
calculator.addEventListener('click',function(e){
  if(e.target.matches('button')){
    const btn = e.target;
    console.log(btn);
    const displayedVal = display.value;
    const result = getResult(btn, displayedVal, calculator.dataset)
    display.value = result;
    updateStatus(btn, calculator, displayedVal, result);
  }
})

// ----- get button type -----
const getBtnType = (btn) => {
  const action = btn.dataset.action;
  if(!action) return 'number';
  if(action === 'divide' || action === 'multiply' || action === 'minus' || action === 'plus') return 'operator';
  return action;
}

// ----- get result to display -----
const getResult = (btn, displayedVal, status) => {
  const btnType = getBtnType(btn);
  const btnValue = btn.textContent;
  const previousBtn = status.previousBtn;
  const operator = status.operator;
  let firstValue = status.firstValue;
  let secondValue = displayedVal;

  if(btnType === 'number'){
    return displayedVal === '0' || previousBtn === 'operator' && previousBtn !== 'equal'
    ? btnValue
    : displayedVal + btnValue;
  }
  if(btnType === 'sign'){
    return displayedVal * -1;
  }
  if(btnType === 'percentage'){
    return displayedVal * 0.01;
  }
  if(btnType === 'decimal'){
    if(!displayedVal.includes('.')) return displayedVal + '.';
    if(previousBtn === 'operator' || previousBtn === 'equal') return '0.';
    return displayedVal;
  }
  if(btnType === 'operator'){
    console.log(firstValue, operator, secondValue);
    // ----- enable consecutive calculations -----
    return firstValue && operator && previousBtn !== 'operator' && previousBtn !== 'equal'
    ? calculate(firstValue, operator, secondValue)
    : displayedVal;
  }
  if(btnType === 'clear') return 0;
  if(btnType === 'equal'){
    if(firstValue){
      if(previousBtn === 'equal'){
        firstValue = displayedVal;
        secondValue = status.replacedVal;
      }
      return calculate(firstValue, operator, secondValue);
    } else {
      return displayedVal;
    }
  }
}

// ----- calculation -----
const calculate = (val1, op, val2) => {
  let firstVal = parseFloat(val1);
  let secondVal = parseFloat(val2);
  if(op === 'plus') return firstVal + secondVal;
  if(op === 'minus') return firstVal - secondVal;
  if(op === 'multiply') return firstVal * secondVal;
  if(op === 'divide') return firstVal / secondVal;
}

// ----- update status -----
const updateStatus = (btn, calculator, displayedVal, calcValue) => {
  const btnType = getBtnType(btn);
  const previousBtn = calculator.dataset.previousBtn;
  let firstValue = calculator.dataset.firstValue;
  const operator = calculator.dataset.operator;
  const opBtn = document.getElementsByClassName(operator);

  if(btnType === 'number'){
    calculator.dataset.previousBtn = btnType;
  }
  if(btnType === 'decimal'){
    calculator.dataset.previousBtn = btnType;
  }
  if(btnType === 'operator'){
    if(firstValue && operator && previousBtn !== 'operator' && previousBtn !== 'equal'){
      calculator.dataset.firstValue = calcValue;
    } else {
      calculator.dataset.firstValue = displayedVal;
    }
    calculator.dataset.previousBtn = btnType;
    calculator.dataset.operator = btn.dataset.action;
  }
  if(btnType === 'clear') {
    if(btn.textContent === 'AC'){
      calculator.dataset.firstValue = '';
      calculator.dataset.secondValue = '';
      calculator.dataset.replacedVal = '';
      calculator.dataset.operator = '';
      calculator.dataset.previousBtn = '';
      Array.from(opBtn).forEach(btn => btn.classList.remove('isPressed'));
    } else {
      clear.textContent = 'AC';
      calculator.dataset.secondValue = '';
      Array.from(opBtn).forEach(btn => btn.classList.add('isPressed'));
      if(previousBtn === 'equal'){
        Array.from(opBtn).forEach(btn => btn.classList.remove('isPressed'));
      }
    }
    calculator.dataset.previousBtn = btnType;
  }
  if(btnType !== 'clear'){
    clear.textContent = 'C';
    Array.from(opBtn).forEach(btn => btn.classList.remove('isPressed'));
  }
  if(btnType === 'equal'){
    let secondValue = displayedVal;
    if(firstValue){
      if(previousBtn === 'equal'){
        firstValue = displayedVal;
        secondValue = calculator.dataset.replacedVal;
      }
    }
    firstValue = displayedVal;
    calculator.dataset.replacedVal = secondValue;
    calculator.dataset.previousBtn = btnType;
  }
}

// ----- change font size -----
