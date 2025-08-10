import { Model } from "./model.js";
import { View } from "./view.js";

const init = () => {
  // --- Player Choice Click Handlers ---
  document.querySelectorAll(".choice").forEach((btn) =>
    btn.addEventListener("click", () => {
      const userChoice = btn.dataset.choice;
      const computerChoice = Model.getComputerChoice();
      const result = Model.getResult(userChoice, computerChoice);

      Model.recordUserMove(userChoice);

      View.updateResult(
        userChoice,
        computerChoice,
        result,
        Model.wins,
        Model.losses
      );

      // --- Check for Game Over ---
      if (Model.wins >= Model.winningRounds) {
        View.showGameOver("Player");
        View.lockPlayerChoices();
      } else if (Model.losses >= Model.winningRounds) {
        View.showGameOver("Computer");
        View.lockPlayerChoices();
      }
    })
  );

  // --- Round Selection Buttons ---
  document.querySelectorAll(".round-select .mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all round buttons
      document
        .querySelectorAll(".round-select .mode-btn")
        .forEach((b) => b.classList.remove("active"));

      // Set clicked button active
      btn.classList.add("active");

      // Update Model rounds
      const rounds = parseInt(btn.textContent);
      Model.setWinningRounds(rounds);

      // Reset game state and view on rounds change
      Model.resetGame();
      View.resetView();
    });
  });

  // --- Mode Selection Buttons ---
  document.getElementById("standardMode").addEventListener("click", () => {
    Model.setMode("standard");
    View.setModeActive("standardMode");
  });
  document.getElementById("hardMode").addEventListener("click", () => {
    Model.setMode("hard");
    View.setModeActive("hardMode");
  });

  // --- New Game Button ---
  document.getElementById("newGame").addEventListener("click", () => {
    Model.resetGame();
    View.resetView();
    View.closeRulesPopup();
  });

  // --- Rules Popup Toggle Buttons ---
  document.querySelector(".rules-btn").addEventListener("click", () => {
    View.toggleRulesPopup();
  });
  document.querySelector(".close-rules-btn").addEventListener("click", () => {
    View.toggleRulesPopup();
  });

  // --- Click Outside Rules Popup to Close ---
  document.getElementById("rulesOverlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("rulesOverlay")) {
      View.toggleRulesPopup();
    }
  });

  // --- Start Game (Play Button) ---
  document.getElementById("playButton").addEventListener("click", () => {
    View.showGameScreen();
  });

  // --- New Game from Game Over Popup ---
  document.getElementById("newGamePopup").addEventListener("click", () => {
    View.hideGameOver();
    Model.resetGame();
    View.resetView();
    View.closeRulesPopup();
  });
};

init();
