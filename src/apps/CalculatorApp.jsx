import React, { useState } from 'react';

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');

  const inputDigit = (digit) => {
    setDisplay(display === '0' ? String(digit) : display + digit);
  };

  const clearDisplay = () => {
    setDisplay('0');
  };

  const calculate = () => {
    try {
      setDisplay(eval(display).toString());
    } catch {
      setDisplay('Error');
    }
  };

  const Button = ({ children, onClick, className = '', variant = 'default' }) => {
    const variants = {
      default: 'bg-gray-700 text-white hover:bg-gray-600',
      operator: 'bg-amber-500 text-white hover:bg-amber-600',
      top: 'bg-gray-500 text-black hover:bg-gray-400',
      zero: 'col-span-2 bg-gray-700 text-white hover:bg-gray-600',
    };

    return (
      <button
        className={`flex items-center justify-center rounded-full text-2xl font-medium transition-all active:scale-95 h-16 ${variants[variant]} ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="h-full bg-black text-white">
      <div className="h-1/3 flex flex-col justify-end p-6 pb-8">
        <div className="text-right overflow-hidden">
          <div className="text-6xl font-light tracking-tight overflow-x-auto">
            {display}
          </div>
        </div>
      </div>

      <div className="h-2/3 p-4">
        <div className="grid grid-cols-4 gap-4 h-full">
          <Button onClick={clearDisplay} variant="top">AC</Button>
          <Button onClick={() => setDisplay(display.slice(0, -1))} variant="top">⌫</Button>
          <Button onClick={() => setDisplay(display + '/100')} variant="top">%</Button>
          <Button onClick={() => setDisplay(display + '/')} variant="operator">÷</Button>

          <Button onClick={() => inputDigit(7)}>7</Button>
          <Button onClick={() => inputDigit(8)}>8</Button>
          <Button onClick={() => inputDigit(9)}>9</Button>
          <Button onClick={() => setDisplay(display + '*')} variant="operator">×</Button>

          <Button onClick={() => inputDigit(4)}>4</Button>
          <Button onClick={() => inputDigit(5)}>5</Button>
          <Button onClick={() => inputDigit(6)}>6</Button>
          <Button onClick={() => setDisplay(display + '-')} variant="operator">-</Button>

          <Button onClick={() => inputDigit(1)}>1</Button>
          <Button onClick={() => inputDigit(2)}>2</Button>
          <Button onClick={() => inputDigit(3)}>3</Button>
          <Button onClick={() => setDisplay(display + '+')} variant="operator">+</Button>

          <Button onClick={() => inputDigit(0)} variant="zero">0</Button>
          <Button onClick={() => setDisplay(display + '.')}>.</Button>
          <Button onClick={calculate} variant="operator">=</Button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorApp;
