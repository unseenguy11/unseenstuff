// Configuration
const CONFIG = {
    paymentUrl: "https://example.com/checkout", // Placeholder
    resultsPage: "results.html",
    timeLimitSeconds: 300 // 5 minutes
};

// IQ Logic Questions
const questions = [
    { id: 1, text: "Which number completes the sequence: 2, 4, 8, 16, ...", options: ["30", "32", "24", "64"], correct: 1, category: "pattern" },
    { id: 2, text: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?", options: ["Yes", "No", "Impossible to tell", "Only on Tuesdays"], correct: 0, category: "logic" },
    { id: 3, text: "Select the odd one out.", options: ["Triangle", "Square", "Circle", "Cube"], correct: 3, category: "spatial" },
    { id: 4, text: "1, 1, 2, 3, 5, 8, ...", options: ["11", "12", "13", "15"], correct: 2, category: "pattern" },
    { id: 5, text: "Finger is to Hand as Leaf is to ...", options: ["Tree", "Branch", "Blossom", "Bark"], correct: 1, category: "logic" },
    { id: 6, text: "Which shape comes next in the pattern? □, ▧, ■, ...", options: ["□", "▧", "■", "▣"], correct: 3, category: "spatial" },
    { id: 7, text: "If you rearrange the letters 'CIFAIPC', you would have the name of a(n):", options: ["City", "Animal", "Ocean", "Country"], correct: 2, category: "logic" },
    { id: 8, text: "Which number is the odd one out? 3, 5, 7, 9, 11", options: ["3", "5", "9", "11"], correct: 2, category: "pattern" },
    { id: 9, text: "Book is to Reading as Fork is to:", options: ["Drawing", "Writing", "Eating", "Stirring"], correct: 2, category: "logic" },
    { id: 10, text: "What comes next? 100, 99, 97, 94, 90, ...", options: ["88", "87", "86", "85"], correct: 3, category: "pattern" },
    { id: 11, text: "Choose the word that is most similar to 'Trustworthy'", options: ["Resolute", "Tenacious", "Reliable", "Insolent"], correct: 2, category: "logic" },
    { id: 12, text: "If a circle is 360, a triangle is 180, what is a square?", options: ["90", "180", "360", "720"], correct: 2, category: "spatial" },
    { id: 13, text: "Complete the analogy: Light : Dark :: Noise : ?", options: ["Sound", "Silence", "Music", "Loud"], correct: 1, category: "logic" },
    { id: 14, text: "Which number is missing? 4, 9, 16, 25, ?", options: ["30", "36", "40", "49"], correct: 1, category: "pattern" },
    { id: 15, text: "A is the father of B. But B is not the son of A. How is that possible?", options: ["B is the daughter", "A is the mother", "B is the uncle", "Impossible"], correct: 0, category: "logic" },
    { id: 16, text: "Which word is the opposite of 'Benevolent'?", options: ["Kind", "Malevolent", "Generous", "Helpful"], correct: 1, category: "verbal" },
    { id: 17, text: "What is 15% of 200?", options: ["20", "25", "30", "35"], correct: 2, category: "numerical" },
    { id: 18, text: "Which shape is the odd one out?", options: ["Triangle", "Square", "Rectangle", "Circle"], correct: 3, category: "abstract" },
    { id: 19, text: "If it rains, the ground is wet. The ground is wet. Therefore:", options: ["It rained", "Someone spilled water", "It might have rained", "It is sunny"], correct: 2, category: "critical" },
    { id: 20, text: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", options: ["Echo", "Ghost", "Cloud", "Shadow"], correct: 0, category: "problem" }
];

// State
let currentQuestionIndex = 0;
let answers = {};
let timerInterval;
let timeRemaining = CONFIG.timeLimitSeconds;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const intakeScreen = document.getElementById('intake-screen'); // New
const quizScreen = document.getElementById('quiz-screen');
const processingScreen = document.getElementById('processing-screen');
const teaserScreen = document.getElementById('teaser-screen');
const startBtn = document.getElementById('start-btn');
const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const checkoutBtn = document.getElementById('checkout-btn');
const bypassBtn = document.getElementById('bypass-btn');
const timerDisplay = document.getElementById('timer');
const qCurrent = document.getElementById('q-current');
const qTotal = document.getElementById('q-total');
const terminalLog = document.getElementById('terminal-log');
const offerCountdown = document.getElementById('offer-countdown');
const processingText = document.getElementById('processing-text');
const processingSub = document.getElementById('processing-sub');

let selectedGender = null;
let selectedAge = null;

// Event Listeners
if (startBtn) {
    startBtn.addEventListener('click', startIntake); // Changed to startIntake
}

// Intake Logic
document.querySelectorAll('.intake-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const type = e.target.dataset.type;
        const value = e.target.dataset.value;

        // Visual selection state
        e.target.parentElement.querySelectorAll('.intake-btn').forEach(b => {
            b.style.backgroundColor = 'white';
            b.style.color = 'black';
        });
        e.target.style.backgroundColor = 'black';
        e.target.style.color = 'white';

        // Simple flow: if gender selected, wait. If age selected, start quiz.
        // In a real app, we'd validate both. Here we assume sequential or just proceed on age.
        if (type === 'gender') {
            selectedGender = value;
        } else if (type === 'age') {
            selectedAge = value;
        }

        // Only start if both are selected
        if (selectedGender && selectedAge) {
            setTimeout(startQuiz, 300);
        }
    });
});

// Certificate generation (assuming this is for a results page or similar)
// This code block is added based on the user's instruction.
// It assumes the existence of a canvas element with id 'certificateCanvas'
// and a global 'userData' object available in the scope where this function is called.
const canvas = document.getElementById('certificateCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const img = new Image();

function drawCertificate(name) {
    if (!ctx || !img.complete) return; // Ensure canvas context and image are ready

    // Clear canvas and draw background image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // Centered text configuration
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    const centerX = canvas.width / 2;

    // Draw Name (centered, positioned at 60% height)
    ctx.font = 'bold 60px "Inter", sans-serif';
    ctx.fillText(name.toUpperCase(), centerX, canvas.height * 0.6);

    // Draw Score (centered, positioned near bottom of the orange box)
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px "JetBrains Mono", monospace';
    // Assuming userData is available in the scope where drawCertificate is called
    // For this example, we'll use a placeholder or retrieve from sessionStorage if possible
    const stored = JSON.parse(sessionStorage.getItem('iq_user_data') || '{}');
    const scoreToDisplay = stored.score !== undefined ? stored.score : 'N/A';
    ctx.fillText(scoreToDisplay, centerX, canvas.height * 0.85);

    // Draw Date (centered, positioned above the ID)
    ctx.fillStyle = 'black';
    ctx.font = '30px "JetBrains Mono", monospace';
    const dateStr = new Date().toLocaleDateString();
    ctx.fillText(dateStr, centerX, canvas.height * 0.78);

    // Draw Certificate ID (centered, near bottom)
    const certId = 'IQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    ctx.fillText(certId, centerX, canvas.height * 0.93);
}

img.src = 'certificate_template_backup.png';
img.onload = () => {
    if (canvas) {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        // Initial render, assuming a name might be passed or retrieved
        // For this context, 'YOUR NAME' is a placeholder.
        // In a real app, you'd get the user's name from input or session.
        drawCertificate('YOUR NAME');
    }
};
// End of certificate generation block

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Retrieve the latest calculated score from sessionStorage
        const stored = JSON.parse(sessionStorage.getItem('iq_user_data') || '{}');

        // If score is missing (shouldn't happen if quiz finished), default to 60
        if (stored.score === undefined) {
            stored.score = 60;
        }

        const userData = {
            score: stored.score,
            gender: selectedGender || 'unknown',
            age: selectedAge || 'unknown',
            date: new Date().toISOString(),
            certificateImage: 'certificate_template_backup.png',
            categories: stored.categories || {}
        };
        sessionStorage.setItem('iq_user_data', JSON.stringify(userData));

        // Redirect
        // In a real app, you'd pass the ID to the payment provider to verify later
        // For this static site, we just go to the payment URL
        // We append a return URL if the provider supports it
        const returnUrl = encodeURIComponent(window.location.origin + '/' + CONFIG.resultsPage + '?access=paid');
        window.location.href = `${CONFIG.paymentUrl}?return_url=${returnUrl}`;
    });
}

if (bypassBtn) {
    bypassBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Retrieve the latest calculated score from sessionStorage
        const stored = JSON.parse(sessionStorage.getItem('iq_user_data') || '{}');

        // If score is missing (e.g. dev testing without taking quiz), generate mock data
        if (stored.score === undefined) {
            stored.score = 135; // Mock high score
            stored.categories = {
                pattern: Math.floor(Math.random() * 40) + 60,
                logic: Math.floor(Math.random() * 40) + 60,
                spatial: Math.floor(Math.random() * 40) + 60,
                verbal: Math.floor(Math.random() * 40) + 60,
                numerical: Math.floor(Math.random() * 40) + 60,
                abstract: Math.floor(Math.random() * 40) + 60,
                critical: Math.floor(Math.random() * 40) + 60,
                problem: Math.floor(Math.random() * 40) + 60
            };
        }

        const userData = {
            score: stored.score,
            gender: selectedGender || 'unknown',
            age: selectedAge || 'unknown',
            date: new Date().toISOString(),
            certificateImage: 'certificate_template_backup.png',
            categories: stored.categories || {}
        };
        sessionStorage.setItem('iq_user_data', JSON.stringify(userData));

        // Direct redirect to results
        window.location.href = CONFIG.resultsPage + '?access=paid';
    });
}

// Functions
function startIntake() {
    switchScreen(startScreen, intakeScreen);
}

function startQuiz() {
    switchScreen(intakeScreen, quizScreen);
    progressContainer.style.display = 'block';
    timerDisplay.classList.remove('hidden');

    if (qTotal) qTotal.textContent = questions.length;

    startTimer();
    showQuestion();
}

function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            finishQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (timeRemaining < 60) {
        timerDisplay.style.backgroundColor = '#FF4400';
        timerDisplay.style.color = 'white';
    }
}

function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.text;
    optionsContainer.innerHTML = '';

    if (qCurrent) qCurrent.textContent = currentQuestionIndex + 1;

    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.textContent = option;
        btn.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(btn);
    });

    updateProgress();
}

function selectOption(optionIndex) {
    answers[currentQuestionIndex] = optionIndex;
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function finishQuiz() {
    clearInterval(timerInterval);
    progressBar.style.width = '100%';
    timerDisplay.classList.add('hidden');

    // Calculate dynamic score: Range 60-140
    let correctCount = 0;

    // Category counters
    let catScores = { pattern: 0, logic: 0, spatial: 0, verbal: 0, numerical: 0, abstract: 0, critical: 0, problem: 0 };
    let catTotals = { pattern: 0, logic: 0, spatial: 0, verbal: 0, numerical: 0, abstract: 0, critical: 0, problem: 0 };

    questions.forEach((q, index) => {
        catTotals[q.category]++;
        if (answers[index] === q.correct) {
            correctCount++;
            catScores[q.category]++;
        }
    });

    // Base 60, max 140. (140-60)/20 = 4 points per question
    const calculatedScore = Math.round(60 + (correctCount * (80 / questions.length)));

    // Calculate category percentages
    const categories = {
        pattern: Math.round((catScores.pattern / catTotals.pattern) * 100) || 0,
        logic: Math.round((catScores.logic / catTotals.logic) * 100) || 0,
        spatial: Math.round((catScores.spatial / catTotals.spatial) * 100) || 0,
        verbal: Math.round((catScores.verbal / catTotals.verbal) * 100) || 0,
        numerical: Math.round((catScores.numerical / catTotals.numerical) * 100) || 0,
        abstract: Math.round((catScores.abstract / catTotals.abstract) * 100) || 0,
        critical: Math.round((catScores.critical / catTotals.critical) * 100) || 0,
        problem: Math.round((catScores.problem / catTotals.problem) * 100) || 0
    };

    // Store score in sessionStorage for later use (results page and certificate)
    const existingData = JSON.parse(sessionStorage.getItem('iq_user_data') || '{}');
    existingData.score = calculatedScore;
    existingData.categories = categories;
    sessionStorage.setItem('iq_user_data', JSON.stringify(existingData));

    setTimeout(() => {
        progressContainer.style.display = 'none';
        switchScreen(quizScreen, processingScreen);
        startProcessing();
    }, 500);
}

function startProcessing() {
    const steps = [
        { text: "PROCESSING DATA", sub: "CALIBRATING..." },
        { text: "ANALYZING PATTERNS", sub: "DETECTING ANOMALIES..." },
        { text: "COMPARING DATASET", sub: "GLOBAL RANKING..." },
        { text: "FINALIZING", sub: "GENERATING REPORT..." }
    ];

    let step = 0;
    const interval = setInterval(() => {
        if (step < steps.length) {
            processingText.textContent = steps[step].text;
            processingSub.textContent = steps[step].sub;
            step++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                switchScreen(processingScreen, teaserScreen);
            }, 1000);
        }
    }, 1000);
}

function switchScreen(from, to) {
    from.classList.remove('active');
    from.classList.add('hidden');

    setTimeout(() => {
        from.style.display = 'none';
        to.style.display = 'block';
        void to.offsetWidth;
        to.classList.remove('hidden');
        to.classList.add('active');
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    if (startScreen) {
        startScreen.style.display = 'block';
        quizScreen.style.display = 'none';
        processingScreen.style.display = 'none';
        teaserScreen.style.display = 'none';
    }
});
