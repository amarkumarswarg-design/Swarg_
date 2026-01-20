import React, { useState } from 'react';
import { Delete, Divide, X, Minus, Plus, Percent, Equal } from 'lucide-react';

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForNewValue) {
      setDisplay(String(digit));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const toggleSign = () => {
    const newValue = parseFloat(display) * -1;
    setDisplay(String(newValue));
  };

  const inputPercent = () => {
    const currentValue = parseFloat(display);
    const newValue = currentValue / 100;
    setDisplay(String(newValue));
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue || 0;
      let newValue = 0;

      switch (operator) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = currentValue / inputValue;
          break;
        default:
          return;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperator(nextOperator);
  };

  const calculate = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operator) {
      let newValue = 0;

      switch (operator) {
        case '+':
          newValue = previousValue + inputValue;
          break;
        case '-':
          newValue = previousValue - inputValue;
          break;
        case '×':
          newValue = previousValue * inputValue;
          break;
        case '÷':
          newValue = previousValue / inputValue;
          break;
        default:
          return;
      }

      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewValue(true);
    }
  };

  const Button = ({ children, onClick, className = '', variant = 'default' }) => {
    const baseClasses = 'flex items-center justify-center rounded-full text-2xl font-medium transition-all active:scale-95';
    
    const variants = {
      default: 'bg-gray-700 text-white hover:bg-gray-600',
      operator: 'bg-amber-500 text-white hover:bg-amber-600',
      top: 'bg-gray-500 text-black hover:bg-gray-400',
      zero: 'col-span-2 bg-gray-700 text-white hover:bg-gray-600',
    };

    return (
      <button
        className={`${baseClasses} ${variants[variant]} ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="h-full bg-black text-white">
      {/* Display */}
      <div className="h-1/3 flex flex-col justify-end p-6 pb-8">
        <div className="text-right overflow-hidden">
          <div className="text-gray-400 text-lg mb-2 h-6">
            {previousValue !== null ? `${previousValue} ${operator || ''}` : ''}
          </div>
          <div className="text-6xl font-light tracking-tight overflow-x-auto">
            {display.length > 9 ? parseFloat(display).toExponential(4) : display}
          </div>
        </div>
      </div>

      {/* Keypad */}
      <div className="h-2/3 p-4">
        <div className="grid grid-cols-4 gap-4 h-full">
          <Button onClick={clearDisplay} variant="top">AC</Button>
          <Button onClick={toggleSign} variant="top">±</Button>
          <Button onClick={inputPercent} variant="top">%</Button>
          <Button onClick={() => performOperation('÷')} variant="operator">
            <Divide size={24} />
          </Button>

          <Button onClick={() => inputDigit(7)}>7</Button>
          <Button onClick={() => inputDigit(8)}>8</Button>
          <Button onClick={() => inputDigit(9)}>9</Button>
          <Button onClick={() => performOperation('×')} variant="operator">
            <X size={24} />
          </Button>

          <Button onClick={() => inputDigit(4)}>4</Button>
          <Button onClick={() => inputDigit(5)}>5</Button>
          <Button onClick={() => inputDigit(6)}>6</Button>
          <Button onClick={() => performOperation('-')} variant="operator">
            <Minus size={24} />
          </Button>

          <Button onClick={() => inputDigit(1)}>1</Button>
          <Button onClick={() => inputDigit(2)}>2</Button>
          <Button onClick={() => inputDigit(3)}>3</Button>
          <Button onClick={() => performOperation('+')} variant="operator">
            <Plus size={24} />
          </Button>

          <Button onClick={() => inputDigit(0)} variant="zero">0</Button>
          <Button onClick={inputDecimal}>.</Button>
          <Button onClick={calculate} variant="operator">
            <Equal size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorApp;
