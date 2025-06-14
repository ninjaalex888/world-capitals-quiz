const questions = [
    { country: "France", capital: "Paris" },
    { country: "Japan", capital: "Tokyo" },
    { country: "Brazil", capital: "Brasilia" },
    { country: "Canada", capital: "Ottawa" },
    { country: "Australia", capital: "Canberra" },
    { country: "Ghana", capital: "Accra" },
    { country: "Norway", capital: "Oslo" },
    { country: "South Africa", capital: "Pretoria" },
    { country: "Thailand", capital: "Bangkok" },
    { country: "Argentina", capital: "Buenos Aires" }
];

let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;
let selectedQuestions = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)];
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    const dropdownValue = parseInt(document.getElementById("questionCount").value);
    const customValue = parseInt(document.getElementById("customCount").value);
    totalQuestions = customValue || dropdownValue;

    selectedQuestions = shuffle([...questions]);
    if (totalQuestions > 0 && totalQuestions <= selectedQuestions.length) {
        selectedQuestions = selectedQuestions.slice(0, totalQuestions);
    }

    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("quizArea").style.display = "block";
    document.getElementById("resultText").textContent = "";
    showQuestion();
}

function showQuestion() {
    const question = selectedQuestions[currentQuestionIndex];
    document.getElementById("questionText").textContent = 
        \`What is the capital of \${question.country}?\`;
    document.getElementById("answerInput").value = "";
    document.getElementById("answerInput").focus();
}

function submitAnswer() {
    const userAnswer = document.getElementById("answerInput").value.trim().toLowerCase();
    const correctAnswer = selectedQuestions[currentQuestionIndex].capital.toLowerCase();

    if (userAnswer === correctAnswer) {
        score++;
        document.getElementById("resultText").textContent = "Correct!";
    } else {
        document.getElementById("resultText").textContent = 
            \`Incorrect. The correct answer is \${selectedQuestions[currentQuestionIndex].capital}.\`;
    }

    currentQuestionIndex++;

    setTimeout(() => {
        document.getElementById("resultText").textContent = "";
        if (currentQuestionIndex < selectedQuestions.length || totalQuestions === 0) {
            if (currentQuestionIndex >= selectedQuestions.length && totalQuestions === 0) {
                selectedQuestions = shuffle([...questions]);
                currentQuestionIndex = 0;
            }
            showQuestion();
        } else {
            document.getElementById("quizArea").style.display = "none";
            alert(\`Quiz finished! Your score: \${score}/\${selectedQuestions.length}\`);
        }
    }, 1500);
}

function handleEnter(event) {
    if (event.key === "Enter") {
        submitAnswer();
    }
}
