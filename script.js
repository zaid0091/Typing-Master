const inputArea = document.querySelector('#input-field');
const paragraphBox = document.querySelector("#paragraph-box");
const startBttn = document.querySelector('#start-bttn');
const wpm_container = document.querySelector('#wpm_con');
const time_container = document.querySelector('#time_con');
const accuracy_container = document.querySelector('#acc_con');

let timer = null;
let secondsPassed = 0;
let isTestActive = false;

const words = [
    "The quick brown fox jumps over the lazy dog while the sun sets over the digital horizon.",
    "Consistency is the key to mastering any skill. Practice every day and watch your progress grow.",
    "Design is not just what it looks like and feels like. Design is how it works for the user.",
    "Focus on being productive instead of busy. Time is the most valuable asset we have in this life.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts in the end.",
    "Your time is limited, so do not waste it living someone else's life or following their dreams.",
    "The only way to do great work is to love what you do. Keep looking and do not settle for less.",
    "In the middle of every difficulty lies opportunity. Embrace challenges and grow stronger with each one.",
    "The future belongs to those who believe in the beauty of their dreams. Keep dreaming and keep typing.",
    "Don't watch the clock; do what it does. Keep going and make every second count towards your goals.",
    "Typing is not just a skill, it's a gateway to endless possibilities. Master it and unlock your potential.",
    "The more you practice, the better you get. Keep typing and watch your speed and accuracy soar to new heights.",
    "A journey of a thousand miles begins with a single keystroke. Start typing and see where it takes you.",
    "The best way to predict the future is to create it. Type your way to success and shape your own destiny.",
    "Don't let the fear of making mistakes hold you back. Every error is a step towards improvement and mastery of typing.",
];

// Initialize the app
function init() {
    resetVal();
    paragraphBox.innerHTML = '';
    
    // Pick random sentence and create spans
    const randomSentence = words[Math.floor(Math.random() * words.length)];
    randomSentence.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        paragraphBox.appendChild(span);
    });

    // Highlight the first character cursor
    if (paragraphBox.firstChild) {
        paragraphBox.firstChild.classList.add('cursor-highlight');
    }

    inputArea.focus();
    isTestActive = true;
}

function resetVal() {
    clearInterval(timer);
    timer = null;
    secondsPassed = 0;
    inputArea.value = '';
    time_container.innerText = '0';
    wpm_container.innerText = '0';
    accuracy_container.innerText = '0%';
    paragraphBox.scrollLeft = 0;
    startBttn.innerText = 'Restart';
}

function startTimer() {
    if (!timer) {
        timer = setInterval(() => {
            secondsPassed++;
            time_container.innerText = secondsPassed;
        }, 1000);
    }
}

function check() {
    if (!isTestActive) return;

    const spanArray = paragraphBox.querySelectorAll('span');
    const inputChars = inputArea.value.split('');
    
    // Start timer on first character typed
    if (inputChars.length > 0) startTimer();

    spanArray.forEach((span, index) => {
        const typedChar = inputChars[index];

        // Reset classes
        span.classList.remove('correct', 'wrong', 'cursor-highlight');

        if (typedChar == null) {
            // Not typed yet
        } else if (typedChar === span.innerText) {
            span.classList.add('correct');
        } else {
            span.classList.add('wrong');
        }
    });

    // Update cursor position
    const nextIndex = inputChars.length;
    if (nextIndex < spanArray.length) {
        spanArray[nextIndex].classList.add('cursor-highlight');
        
        // Dynamic Scrolling: Center the cursor in the view
        const currentSpan = spanArray[nextIndex];
        paragraphBox.scrollLeft = currentSpan.offsetLeft - (paragraphBox.offsetWidth / 2);
    }

    // Check if finished
    if (inputChars.length === spanArray.length) {
        finishTest();
    }
}

function finishTest() {
    clearInterval(timer);
    isTestActive = false;
    
    const spanArray = paragraphBox.querySelectorAll('span');
    const correctChars = paragraphBox.querySelectorAll('.correct').length;
    const totalChars = spanArray.length;

    // Accuracy calculation
    const accuracy = Math.round((correctChars / totalChars) * 100);
    
    // WPM calculation: (Correct Chars / 5) / (minutes)
    const timeInMinutes = Math.max(secondsPassed, 1) / 60;
    const wpm = Math.round((correctChars / 5) / timeInMinutes);

    // Display Stats
    wpm_container.innerText = wpm;
    accuracy_container.innerText = accuracy + '%';
    
    startBttn.innerText = 'Try Again';
    startBttn.focus();
}

// Event Listeners
startBttn.addEventListener('click', init);

inputArea.addEventListener('input', check);

// Prevent Backspace from navigating away or doing weird scrolls
inputArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (!isTestActive) init();
    }
});

// Click paragraph box to focus input
paragraphBox.addEventListener('click', () => inputArea.focus());

// Initial State
paragraphBox.innerHTML = "Click 'Start' to test your speed!";