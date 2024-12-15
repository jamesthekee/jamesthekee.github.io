
const characters = [
    { char: '爱', meaning: 'Love' },
    { char: '水', meaning: 'Water' },
    { char: '火', meaning: 'Fire' },
    { char: '山', meaning: 'Mountain' },
    { char: '人', meaning: 'Person' },
    { char: '月', meaning: 'Moon' },
    { char: '日', meaning: 'Sun' },
    { char: '木', meaning: 'Tree' },
    { char: '口', meaning: 'Mouth' },
    { char: '心', meaning: 'Heart' }
];

let currentQuestion = 0;
let knownCount = 0;
let unknownCount = 0;

const characterDisplay = document.getElementById('character');
const meaningDisplay = document.getElementById('meaning');
const progressDisplay = document.getElementById('progress');

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function updateDisplay() {
    characterDisplay.textContent = characters[currentQuestion].char;
    meaningDisplay.textContent = '';
    progressDisplay.textContent = `Question ${currentQuestion + 1} of ${characters.length}`;
}

function showResults() {
    document.getElementById('known-count').textContent = `Characters known: ${knownCount}`;
    document.getElementById('unknown-count').textContent = `Characters unknown: ${unknownCount}`;
    document.getElementById('accuracy').textContent = 
        `Recognition rate: ${Math.round((knownCount / characters.length) * 100)}%`;
    showPage('results-page');
}

function resetQuiz() {
    currentQuestion = 0;
    knownCount = 0;
    unknownCount = 0;
    updateDisplay();
    showPage('quiz-page');
}

// Event Listeners
document.getElementById('start-quiz').addEventListener('click', () => {
    showPage('quiz-page');
});

document.getElementById('reveal').addEventListener('click', () => {
    meaningDisplay.textContent = characters[currentQuestion].meaning;
});

document.getElementById('know').addEventListener('click', () => {
    knownCount++;
    if (currentQuestion < characters.length - 1) {
        currentQuestion++;
        updateDisplay();
    } else {
        showResults();
    }
});

document.getElementById('dontKnow').addEventListener('click', () => {
    unknownCount++;
    if (currentQuestion < characters.length - 1) {
        currentQuestion++;
        updateDisplay();
    } else {
        showResults();
    }
});

document.getElementById('restart-quiz').addEventListener('click', resetQuiz);

// Initialize first question
updateDisplay();