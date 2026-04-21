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
    // Wizualna podmiana operatorów na te "ładniejsze" dla użytkownika
    let displayValue = equation === '' ? '0' : equation;
    displayValue = displayValue
        .replace(/\*/g, ' × ')
        .replace(/\//g, ' ÷ ')
        .replace(/\+/g, ' + ')
        .replace(/\-/g, ' − ')
        .replace(/\./g, ',');
    
    mainScreen.textContent = displayValue;
    
    // Dynamiczne skalowanie czcionki dla dłuższych równań
    if (displayValue.length > 10) {
        mainScreen.style.fontSize = '2.5rem';
    } else if (displayValue.length > 6) {
        mainScreen.style.fontSize = '3.5rem';
    } else {
        mainScreen.style.fontSize = '5rem';
    }
};

const handleOperator = (op) => {
    if (isCalculated) isCalculated = false;
    if (equation === '') equation = '0';

    const lastChar = equation.slice(-1);
    // Dodane mnożenie (*) i dzielenie (/) do listy sprawdzanych operatorów
    const operators = ['+', '-', '*', '/'];

    if (operators.includes(lastChar)) {
        equation = equation.slice(0, -1) + op;
    } else {
        equation += op;
    }
    updateDisplay();
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
        if (!equation) return;

        // Dodane \* i \/ do dozwolonych znaków
        const sanitized = equation.replace(/[^0-9+\-*/.]/g, '');
        const result = new Function('return ' + sanitized)();

        // Zabezpieczenie przed dzieleniem przez zero (Infinity)
        if (!isFinite(result)) {
            equation = 'Błąd';
        } else {
            // Zaokrąglenie do 8 miejsc po przecinku (precyzja Apple)
            equation = String(Number(Math.round(result + 'e8') + 'e-8'));
        }
        
        isCalculated = true;
        updateDisplay();
    } catch (e) {
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
        // Sprawdzamy tylko OSTATNIĄ liczbę w równaniu po rozdzieleniu operatorami
        if (!equation.split(/[\+\-\*\/]/).pop().includes('.')) {
            equation += '.';
        }
    
        } else {
            appendNumber(value);
        }
    }

    // 2. Obsługa operatorów (TUTAJ PODPIĘTE SĄ NOWE FUNKCJE)
if (operator) {
        const opMap = { 'add': '+', 'subtract': '-', 'multiply': '*', 'divide': '/' };
        handleOperator(opMap[operator]);
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

