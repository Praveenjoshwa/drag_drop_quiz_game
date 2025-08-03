const categorySelect = document.getElementById("category");
const startBtn = document.getElementById("start-btn");

const questionBox = document.getElementById("question-box");
const answersBox = document.getElementById("answers-box");
const dropZone = document.getElementById("drop-zone");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");

let correctAnswer = "";
let selectedCategory = "general_knowledge";

// Load question from API using selected category
async function loadQuestion() {
  feedback.textContent = "";
  dropZone.innerHTML = `<p>Drop your answer here ⬇️</p>`;
  answersBox.innerHTML = "";

  try {
    const res = await fetch(`https://the-trivia-api.com/api/questions?limit=1&categories=${selectedCategory}`);
    const data = await res.json();
    const questionData = data[0];

    const question = questionData.question;
    correctAnswer = questionData.correctAnswer;
    let options = [...questionData.incorrectAnswers, correctAnswer];
    options.sort(() => Math.random() - 0.5); // Shuffle

    questionBox.innerHTML = question;

    // Create draggable options
    options.forEach((option) => {
      const answer = document.createElement("div");
      answer.classList.add("answer");
      answer.textContent = option;
      answer.setAttribute("draggable", "true");

      answer.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", option);
      });

      answersBox.appendChild(answer);
    });

  } catch (err) {
    questionBox.innerHTML = "Failed to load question. Try again.";
    console.error(err);
  }
}

// Drop zone handling
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  const selected = e.dataTransfer.getData("text/plain");
  dropZone.innerHTML = `<p>You dropped: <strong>${selected}</strong></p>`;

  if (selected === correctAnswer) {
    feedback.textContent = "✅ Correct!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `❌ Wrong! Correct answer was: ${correctAnswer}`;
    feedback.style.color = "red";
  }
});

// Start quiz with selected category
startBtn.addEventListener("click", () => {
  selectedCategory = categorySelect.value;
  loadQuestion();
});

// Next question
nextBtn.addEventListener("click", loadQuestion);
