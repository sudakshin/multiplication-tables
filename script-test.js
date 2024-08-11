let num1, num2, correctAnswer;
let minRange = 2;
let maxRange = 30;
let specificTable = null;
let questionCounts = {};  // To track the number of correct answers for each question
let correctAnswerCounts = {};  // To track the number of correct answers overall
let totalQuestions = 0;
let questionsAnswered = 0;
let startTime = null;
let retryQuestions = [];
let currentQuestion = null;

function setRange(min, max) {
    minRange = min;
    maxRange = max;
    specificTable = null;  // Reset specific table selection
    resetCounts();
    totalQuestions = 0;
    questionsAnswered = 0;
    retryQuestions = [];
    startTime = new Date();
    generateQuestion();
}

function setSpecificTable(table) {
    specificTable = table;
    resetCounts();
    totalQuestions = 0;
    questionsAnswered = 0;
    retryQuestions = [];
    startTime = new Date();
    generateQuestion();
}

function resetCounts() {
    questionCounts = {};
    correctAnswerCounts = {};
}

function generateQuestion() {
    if (specificTable !== null) {
        num1 = specificTable;
    } else {
        num1 = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
    }
    do {
        num2 = Math.floor(Math.random() * 10) + 1; // 1 to 10
    } while (correctAnswerCounts[`${num1}x${num2}`] >= 3);
    
    correctAnswer = num1 * num2;
    currentQuestion = `${num1}x${num2}`;
    document.getElementById('question').textContent = `${num1} x ${num2} = ?`;
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();
    document.getElementById('feedback').textContent = '';
    document.body.style.backgroundColor = '#f0f0f0';  // Reset background color
    
    if (!startTime) {
        startTime = new Date();
    }
    
    setTimeout(() => {
        if (document.getElementById('answer').value === '') {
            handleRetry();
        }
    }, 3000);  // Check if the question is answered within 3 seconds
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('answer').value);
    const feedbackElement = document.getElementById('feedback');
    
    if (userAnswer === correctAnswer) {
        document.body.style.backgroundColor = 'green';  // Flash green
        incrementQuestionCount();
        questionsAnswered++;
        updateProgress();
        setTimeout(generateQuestionOrFinish, 200);  // Short delay before moving to the next question
    }
}

function handleRetry() {
    if (retryQuestions.length < 2) {
        retryQuestions.push(currentQuestion);
        document.getElementById('feedback').textContent = `Time's up! Try again.`;
        document.getElementById('feedback').style.color = 'orange';
        setTimeout(() => {
            generateRetryQuestion();
        }, 2000);  // Short delay before retrying
    } else {
        setTimeout(generateQuestionOrFinish, 1000);  // Move to the next question
    }
}

function generateRetryQuestion() {
    let retryQuestion;
    do {
        retryQuestion = retryQuestions[Math.floor(Math.random() * retryQuestions.length)];
    } while (retryQuestion === currentQuestion);  // Ensure the same question is not repeated

    num1 = parseInt(retryQuestion.split('x')[0]);
    num2 = parseInt(retryQuestion.split('x')[1]);
    correctAnswer = num1 * num2;
    document.getElementById('question').textContent = `${num1} x ${num2} = ?`;
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();
    document.getElementById('feedback').textContent = '';
    document.body.style.backgroundColor = '#f0f0f0';  // Reset background color
}

function incrementQuestionCount() {
    const key = `${num1}x${num2}`;
    if (!correctAnswerCounts[key]) {
        correctAnswerCounts[key] = 0;
    }
    correctAnswerCounts[key]++;
}

function generateQuestionOrFinish() {
    const allQuestionsAnswered = Object.keys(correctAnswerCounts).every(key => correctAnswerCounts[key] >= 3);
    
    if (allQuestionsAnswered) {
        const endTime = new Date();
        const totalTime = Math.floor((endTime - startTime) / 1000); // Time in seconds
        document.getElementById('question').textContent = `Congrats! You have practiced that table. Total time: ${totalTime} seconds.`;
        document.getElementById('feedback').textContent = '';
    } else {
        generateQuestion();
    }
}

function updateProgress() {
    const progressElement = document.getElementById('progress');
    progressElement.textContent = `Questions answered: ${questionsAnswered} / ${totalQuestions}`;
}

function createTableButtons() {
    const tableButtonsContainer = document.getElementById('table-buttons');
    for (let i = 2; i <= 30; i++) {
        const button = document.createElement('button');
        button.textContent = `Table ${i}`;
        button.addEventListener('click', () => setSpecificTable(i));
        button.addEventListener('mouseover', () => showTooltip(i));
        button.addEventListener('mouseout', hideTooltip);
        tableButtonsContainer.appendChild(button);
    }
}

function showTooltip(table) {
    const tooltip = document.getElementById('tooltip');
    let tableContent = '';
    for (let i = 1; i <= 10; i++) {
        tableContent += `${table} x ${i} = ${table * i}<br>`;
    }
    tooltip.innerHTML = tableContent;
    tooltip.style.display = 'block';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}

// Listen for input changes and automatically check the answer when the user types
document.getElementById('answer').addEventListener('input', checkAnswer);

document.getElementById('range-2-20').addEventListener('click', () => setRange(2, 20));
document.getElementById('range-21-30').addEventListener('click', () => setRange(21, 30));
document.getElementById('range-2-30').addEventListener('click', () => setRange(2, 30));

createTableButtons();
generateQuestion();
