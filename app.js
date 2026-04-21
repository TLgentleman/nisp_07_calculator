/**
 * Professional Calculator Logic - Wersja z jawnym "+" i "-"
 */

const mainScreen = document.getElementById('main-screen');
const keypad = document.querySelector('.calc-keypad');

// Nasz stan - trzymamy całe równanie jako tekst (string)
let equation = ''; 
let isCalculated = false;

// --- FUNKCJE POMOCNICZE I WYŚWIETLANIE ---

const updateDisplay = () => {
    mainScreen.textContent = equation === '' ? '0' : equation.replace(/\./g, ',');
    
    if (equation.length > 7) {
        mainScreen.style.fontSize = '3rem';
    } else {
        mainScreen.style.fontSize = '5rem';
    }
};

const appendNumber = (number) => {
    if (isCalculated) {
        equation = number;
        isCalculated = false;
    } else {
        equation += number;
    }
    updateDisplay();
};

// --- TWOJE ZMODYFIKOWANE FUNKCJE MATEMATYCZNE ---

const handleAddition = () => {
    if (isCalculated) isCalculated = false;
    if (equation === '') equation = '0';

    const lastChar = equation.slice(-1);
    
    if (lastChar === '+' || lastChar === '-') {
        equation = equation.slice(0, -1) + '+';
    } else {
        equation += '+';
    }
    updateDisplay();
};

const handleSubtraction = () => {
    if (isCalculated) isCalculated = false;
    if (equation === '') equation = '0';

    const lastChar = equation.slice(-1);
    
    if (lastChar === '+' || lastChar === '-') {
        equation = equation.slice(0, -1) + '-';
    } else {
        equation += '-';
    }
    updateDisplay();
};

const calculateResult = () => {
    try {
        const sanitizedEquation = equation.replace(/[^0-9+\-.]/g, '');
        if (!sanitizedEquation) return;

        const result = new Function('return ' + sanitizedEquation)();
        
        equation = String(result);
        isCalculated = true;
        updateDisplay();
    } catch (error) {
        equation = 'Błąd';
        isCalculated = true;
        updateDisplay();
    }
};

// --- GŁÓWNY KONTROLER ZDARZEŃ (EVENT DELEGATION) ---

keypad.addEventListener('click', (event) => {
    const target = event.target;
    if (!target.classList.contains('btn')) return;

    // Pobieramy atrybuty data-* przypisane do klikniętego przycisku w HTML
    const { value, operator, action } = target.dataset;

    // 1. Obsługa liczb i kropki
    if (value) {
        if (value === 'dot') {
            if (isCalculated) { equation = '0.'; isCalculated = false; }
            else { equation += '.'; }
            updateDisplay();
        } else {
            appendNumber(value);
        }
    }

    // 2. Obsługa operatorów (TUTAJ PODPIĘTE SĄ NOWE FUNKCJE)
    if (operator === 'add') {
        handleAddition();
    } 
    else if (operator === 'subtract') {
        handleSubtraction();
    }

    // 3. Obsługa akcji (= oraz AC)
    if (action === 'calculate') {
        calculateResult();
    }
    
    if (action === 'clear') {
        equation = '';
        isCalculated = false;
        updateDisplay();
    }
});

// Inicjalizacja ekranu po załadowaniu
updateDisplay();