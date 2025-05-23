// Configuration
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL_HERE"; // Replace with your deployed Web App URL

// DOM Elements
const modal = document.getElementById("feedback-modal");
const npsScale = document.querySelector(".nps-scale");
const followupSection = document.getElementById("followup-section");
const followupQuestion = document.getElementById("followup-question");
const feedbackText = document.getElementById("feedback-text");

// State
let selectedScore = null;

// Initialize NPS scale buttons
function initNPSScale() {
  for (let i = 0; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.className = "nps-btn";
    btn.textContent = i;
    btn.onclick = () => selectScore(i);
    npsScale.appendChild(btn);
  }
}

// Select NPS score
function selectScore(score) {
  selectedScore = score;
  
  // Update UI
  document.querySelectorAll(".nps-btn").forEach(btn => {
    btn.classList.remove("selected");
    if (parseInt(btn.textContent) === score) {
      btn.classList.add("selected");
    }
  });
  
  // Show follow-up question
  followupSection.classList.remove("hidden");
  followupQuestion.textContent = score <= 6 
    ? "O que podemos fazer para melhorar sua experiência?" 
    : "O que você mais gostou em nossa plataforma?";
}

// Show modal
function showFeedback() {
  modal.style.display = "block";
  document.querySelector(".feedback-trigger").style.display = "none";
  resetForm();
}

// Close modal
function closeFeedback() {
  modal.style.display = "none";
  document.querySelector(".feedback-trigger").style.display = "block";
}

// Reset form
function resetForm() {
  selectedScore = null;
  feedbackText.value = "";
  followupSection.classList.add("hidden");
  document.querySelectorAll(".nps-btn").forEach(btn => {
    btn.classList.remove("selected");
  });
}

// Submit feedback to Google Sheets
async function submitFeedback() {
  if (selectedScore === null) {
    alert("Por favor, selecione uma nota antes de enviar.");
    return;
  }

  const feedback = feedbackText.value.trim();
  
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbwVcnN2nt46SWauIOAAk6caHOaMdQw30OqMbVSxzMFxctpMfVXWFu02gto3J84RidKoHA/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score: selectedScore,
        feedback: feedback,
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href
      }),
    });

    if (response.ok) {
      alert("Obrigado pelo seu feedback! Sua opinião é muito importante para nós.");
      closeFeedback();
    } else {
      throw new Error("Erro ao enviar feedback");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Ocorreu um erro ao enviar seu feedback. Por favor, tente novamente mais tarde.");
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initNPSScale();
  
  // Optional: Show feedback button after 30 seconds
  setTimeout(() => {
    document.querySelector(".feedback-trigger").style.display = "block";
  }, 30000);
});