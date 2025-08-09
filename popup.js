let display = document.getElementById('result');
let expressionDisplay = document.getElementById('expression');
let currentExpression = '';
let currentInput = '0';
let justCalculated = false;
let previousValue = null;
let currentOperator = null;

function updateDisplay() {
    display.value = currentInput;
    expressionDisplay.textContent = currentExpression;
}

function clearDisplay() {
    currentExpression = '';
    currentInput = '0';
    justCalculated = false;
    previousValue = null;
    currentOperator = null;
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

function deleteLast() {
    if (justCalculated) {
        clearDisplay();
        return;
    }
    
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function appendToDisplay(value) {
    // If we just calculated and user enters a number, start fresh
    if (justCalculated && !isNaN(value)) {
        currentExpression = '';
        currentInput = '0';
        justCalculated = false;
        previousValue = null;
        currentOperator = null;
    }
    
    // If we just calculated and user enters an operator, continue with the result
    if (justCalculated && ['+', '-', '*', '/'].includes(value)) {
        previousValue = parseFloat(currentInput);
        currentOperator = value;
        currentExpression = currentInput + ' ' + (value === '*' ? '×' : value) + ' ';
        currentInput = '0';
        justCalculated = false;
        updateDisplay();
        return;
    }
    
    // Handle operators
    if (['+', '-', '*', '/'].includes(value)) {
        // If there's already an operator and current input is not 0, calculate first
        if (currentOperator !== null && currentInput !== '0') {
            let result = performCalculation(previousValue, parseFloat(currentInput), currentOperator);
            if (result === 'Error') {
                currentInput = 'Error';
                currentExpression += currentInput;
                updateDisplay();
                return;
            }
            currentInput = result.toString();
            currentExpression += currentInput + ' ' + (value === '*' ? '×' : value) + ' ';
            previousValue = result;
        } else {
            // First operator
            previousValue = parseFloat(currentInput);
            currentExpression = currentInput + ' ' + (value === '*' ? '×' : value) + ' ';
        }
        
        currentOperator = value;
        currentInput = '0';
        justCalculated = false;
        updateDisplay();
        return;
    }
    
    // Handle decimal point
    if (value === '.') {
        if (!currentInput.includes('.')) {
            if (currentInput === '0') {
                currentInput = '0.';
            } else {
                currentInput += '.';
            }
        }
        updateDisplay();
        return;
    }
    
    // Handle numbers
    if (currentInput === '0') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    
    justCalculated = false;
    updateDisplay();
}

function performCalculation(prev, current, operator) {
    switch (operator) {
        case '+':
            return prev + current;
        case '-':
            return prev - current;
        case '*':
            return prev * current;
        case '/':
            if (current === 0) {
                return 'Error';
            }
            return prev / current;
        default:
            return current;
    }
}

function calculate() {
    if (currentOperator === null || previousValue === null) {
        return;
    }
    
    let result = performCalculation(previousValue, parseFloat(currentInput), currentOperator);
    
    if (result === 'Error') {
        currentInput = 'Error';
        currentExpression += currentInput + ' = Error';
        updateDisplay();
        currentOperator = null;
        previousValue = null;
        return;
    }
    
    // Format result to avoid floating point precision issues
    if (result % 1 === 0) {
        result = result.toString();
    } else {
        result = parseFloat(result.toFixed(10)).toString();
    }
    
    currentExpression += currentInput + ' = ' + result;
    currentInput = result;
    currentOperator = null;
    previousValue = null;
    justCalculated = true;
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (!isNaN(key) || key === '.') {
        appendToDisplay(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

// Initialize display
updateDisplay();

// Add event listeners for all button clicks
document.addEventListener('DOMContentLoaded', function() {
    // Add click listeners to all buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const action = this.dataset.action;
            const value = this.dataset.value;
            
            if (action) {
                switch (action) {
                    case 'clear':
                        clearDisplay();
                        break;
                    case 'clear-entry':
                        clearEntry();
                        break;
                    case 'backspace':
                        deleteLast();
                        break;
                    case 'calculate':
                        calculate();
                        break;
                }
            } else if (value) {
                appendToDisplay(value);
            }
        });
    });
    
    console.log('Calculator buttons initialized successfully');
});
