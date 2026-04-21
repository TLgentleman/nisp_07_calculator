/**
 * Professional Calculator Logic
 * @author Twoje Imię (pod okiem Profesora)
 * @version 1.0.0
 */

// Pobieramy referencje do kluczowych elementów interfejsu
const mainScreen = document.getElementById('main-screen');
const keypad = document.querySelector('.calc-keypad');

// Stan aplikacji (enkapsulacja podstawowych danych)
let currentInput = '0';
let shouldResetScreen = false;

/**
 * Funkcja aktualizująca warstwę prezentacji (UI)
 */
const updateDisplay = () => {
    // Formatowanie liczb dla lepszego UX (np. dodawanie odstępów tysięcznych w przyszłości)
    mainScreen.textContent = currentInput.replace('.', ',');
    
    // Dynamiczne skalowanie czcionki, jeśli liczba jest za długa
    if (currentInput.length > 7) {
        mainScreen.style.fontSize = '3rem';
    } else {
        mainScreen.style.fontSize = '5rem';
    }
};

/**
 * Obsługa wprowadzania cyfr
 * @param {string} number - Cyfra przekazana z atrybutu data-value
 */
const appendNumber = (number) => {
    // Jeśli na ekranie jest '0' lub musimy zresetować ekran po operacji
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = number;
        shouldResetScreen = false;
    } else {
        // Ograniczenie do 9 cyfr (standard w iPhone)
        if (currentInput.length < 9) {
            currentInput += number;
        }
    }
    updateDisplay();
};

/**
 * Obsługa kropki/przecinka dziesiętnego
 */
const appendDecimal = () => {
    if (shouldResetScreen) {
        currentInput = '0.';
        shouldResetScreen = false;
        updateDisplay();
        return;
    }
    // Zapobiegamy dodaniu więcej niż jednej kropki
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
};

/**
 * Główny kontroler zdarzeń (Event Delegation)
 */
keypad.addEventListener('click', (event) => {
    const target = event.target;

    // Sprawdzamy, czy kliknięty element to na pewno przycisk
    if (!target.classList.contains('btn')) return;

    // Wyciągamy dane z atrybutów data-* które przygotowaliśmy w HTML
    const { value, action } = target.dataset;

    // Logika wyboru akcji
    if (value) {
        if (value === 'dot') {
            appendDecimal();
        } else {
            appendNumber(value);
        }
    }

    if (action === 'clear') {
        currentInput = '0';
        updateDisplay();
    }

    // Tutaj w przyszłości dodamy obsługę 'negate', 'percent' oraz 'calculate'
});

// Inicjalizacja wyświetlacza
updateDisplay();